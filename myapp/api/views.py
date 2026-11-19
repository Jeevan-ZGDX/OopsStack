import json
import math
import random
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.db.models import Avg, Count, Sum, Max, Min, Q

from myapp.models import (
    User, School, StudentClass, Exam, Question, Choice,
    ExamQuestion, ExamAttempt, StudentAnswer, ExamAssignmentDate,
    generate_username
)

def error_response(message, status=400):
    return JsonResponse({'error': message}, status=status)

def success_response(data=None, status=200):
    payload = {'success': True}
    if data is not None:
        payload.update(data)
    return JsonResponse(payload, status=status)

# ============================================================================
# AUTHENTICATION APIS
# ============================================================================

@csrf_exempt
@require_http_methods(["POST"])
def api_login(request):
    try:
        data = json.loads(request.body)
    except Exception:
        data = request.POST

    username = (data.get('username') or data.get('login') or '').strip().lower()
    password = data.get('password') or ''

    if not username or not password:
        return error_response('Username and password are required.')

    user = authenticate(request, username=username, password=password)
    if user is None:
        return error_response('Invalid username or password.', status=401)

    if not user.is_active:
        return error_response('This account has been deactivated. Please contact your administrator.', status=403)

    login(request, user)

    school_data = None
    if user.school:
        school_data = {
            'id': user.school.id,
            'name': user.school.name,
            'slug': user.school.slug,
            'logo_url': user.school.logo.url if user.school.logo else None
        }

    return success_response({
        'user': {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'role': user.role,
            'batch': user.batch,
            'is_superuser': user.is_superuser,
            'school': school_data
        }
    })

@csrf_exempt
@require_http_methods(["POST"])
def api_logout(request):
    logout(request)
    return success_response({'message': 'Logged out successfully.'})

@require_http_methods(["GET"])
def api_me(request):
    if not request.user.is_authenticated:
        return JsonResponse({'user': None})

    user = request.user
    school_data = None
    if user.school:
        school_data = {
            'id': user.school.id,
            'name': user.school.name,
            'slug': user.school.slug,
            'logo_url': user.school.logo.url if user.school.logo else None
        }

    return JsonResponse({
        'user': {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'role': user.role,
            'batch': user.batch,
            'is_superuser': user.is_superuser,
            'school': school_data
        }
    })

# ============================================================================
# SCHOOL ADMIN APIS
# ============================================================================

def check_school_admin(request):
    if not request.user.is_authenticated:
        return error_response('Authentication required.', status=401)
    if not (request.user.is_school_admin or request.user.is_superuser):
        return error_response('School Admin permissions required.', status=403)
    return None

@require_http_methods(["GET"])
def api_admin_overview(request):
    err = check_school_admin(request)
    if err: return err

    school = request.user.school
    teachers = User.objects.filter(school=school, role='teacher')
    students = User.objects.filter(school=school, role='student')
    classes = StudentClass.objects.filter(school=school)
    exams = Exam.objects.filter(school=school)

    classes_data = [{
        'id': c.id,
        'name': c.name,
        'department': c.department,
        'batch': c.batch,
        'student_count': c.students.count(),
        'created_by': c.created_by.get_full_name()
    } for c in classes[:6]]

    return JsonResponse({
        'school': {
            'id': school.id if school else None,
            'name': school.name if school else 'Platform Superadmin',
        },
        'metrics': {
            'teachers_count': teachers.count(),
            'students_count': students.count(),
            'classes_count': classes.count(),
            'exams_count': exams.count(),
        },
        'recent_classes': classes_data
    })

@require_http_methods(["GET", "POST"])
@csrf_exempt
def api_admin_teachers(request):
    err = check_school_admin(request)
    if err: return err

    school = request.user.school
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST

        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        email = data.get('email', '').strip() or None
        password = data.get('password', '').strip()

        if not first_name or not last_name or not password:
            return error_response('First name, last name, and password are required.')

        seq = school.get_next_teacher_number()
        candidate = generate_username('tch', seq)
        counter = 1
        base = candidate
        while User.objects.filter(username=candidate).exists():
            candidate = f"{base}_{counter}"
            counter += 1

        teacher = User.objects.create(
            username=candidate,
            first_name=first_name,
            last_name=last_name,
            email=email,
            role='teacher',
            school=school
        )
        teacher.set_password(password)
        teacher.save()

        return success_response({
            'teacher': {
                'id': teacher.id,
                'username': teacher.username,
                'first_name': teacher.first_name,
                'last_name': teacher.last_name,
                'email': teacher.email,
                'is_active': teacher.is_active
            }
        }, status=201)

    teachers = User.objects.filter(school=school, role='teacher').order_by('-date_joined')
    teachers_list = [{
        'id': t.id,
        'username': t.username,
        'first_name': t.first_name,
        'last_name': t.last_name,
        'email': t.email,
        'is_active': t.is_active,
        'classes_count': t.created_classes.count(),
        'exams_count': t.created_exams.count(),
        'date_joined': t.date_joined.strftime('%Y-%m-%d')
    } for t in teachers]

    return JsonResponse({'teachers': teachers_list})

@csrf_exempt
@require_http_methods(["POST"])
def api_admin_toggle_teacher(request, teacher_id):
    err = check_school_admin(request)
    if err: return err

    school = request.user.school
    teacher = User.objects.filter(id=teacher_id, school=school, role='teacher').first()
    if not teacher:
        return error_response('Teacher not found.', status=404)

    teacher.is_active = not teacher.is_active
    teacher.save(update_fields=['is_active'])
    return success_response({'is_active': teacher.is_active})

@require_http_methods(["GET", "POST"])
@csrf_exempt
def api_admin_students(request):
    err = check_school_admin(request)
    if err: return err

    school = request.user.school
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST

        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        identifier = data.get('identifier', '').strip()
        batch = data.get('batch', '').strip() or '2024-2028'
        password = data.get('password', '').strip()

        if not first_name or not last_name or not identifier or not password:
            return error_response('First name, last name, roll identifier, and password are required.')

        username = generate_username('stu', identifier)
        if User.objects.filter(username=username).exists():
            return error_response(f'Student username {username} already exists.')

        student = User.objects.create(
            username=username,
            first_name=first_name,
            last_name=last_name,
            role='student',
            batch=batch,
            school=school
        )
        student.set_password(password)
        student.save()

        return success_response({
            'student': {
                'id': student.id,
                'username': student.username,
                'first_name': student.first_name,
                'last_name': student.last_name,
                'batch': student.batch,
                'is_active': student.is_active
            }
        }, status=201)

    batch_filter = request.GET.get('batch')
    students = User.objects.filter(school=school, role='student')
    if batch_filter:
        students = students.filter(batch=batch_filter)

    students = students.order_by('-date_joined')
    students_list = [{
        'id': s.id,
        'username': s.username,
        'first_name': s.first_name,
        'last_name': s.last_name,
        'batch': s.batch,
        'is_active': s.is_active,
        'date_joined': s.date_joined.strftime('%Y-%m-%d')
    } for s in students]

    batches = list(User.objects.filter(school=school, role='student').exclude(batch__isnull=True).exclude(batch='').values_list('batch', flat=True).distinct())

    return JsonResponse({'students': students_list, 'batches': batches})

@csrf_exempt
@require_http_methods(["POST"])
def api_admin_toggle_student(request, student_id):
    err = check_school_admin(request)
    if err: return err

    school = request.user.school
    student = User.objects.filter(id=student_id, school=school, role='student').first()
    if not student:
        return error_response('Student not found.', status=404)

    student.is_active = not student.is_active
    student.save(update_fields=['is_active'])
    return success_response({'is_active': student.is_active})

@require_http_methods(["GET"])
def api_admin_classes(request):
    err = check_school_admin(request)
    if err: return err

    school = request.user.school
    classes = StudentClass.objects.filter(school=school).select_related('created_by')
    classes_list = [{
        'id': c.id,
        'name': c.name,
        'batch': c.batch,
        'department': c.department,
        'student_count': c.students.count(),
        'assigned_exams_count': c.assigned_exams.count(),
        'created_by': c.created_by.get_full_name(),
        'enrollment_code': c.enrollment_code,
        'allow_self_enrollment': c.allow_self_enrollment
    } for c in classes]

    return JsonResponse({'classes': classes_list})

# ============================================================================
# TEACHER APIS
# ============================================================================

def check_teacher(request):
    if not request.user.is_authenticated:
        return error_response('Authentication required.', status=401)
    if not (request.user.is_teacher or request.user.is_superuser):
        return error_response('Teacher permissions required.', status=403)
    return None

@require_http_methods(["GET"])
def api_teacher_dashboard(request):
    err = check_teacher(request)
    if err: return err

    teacher_exams = Exam.objects.filter(created_by=request.user)
    assigned_exams = teacher_exams.filter(assigned_classes__isnull=False).distinct().count()
    unassigned_exams = teacher_exams.filter(assigned_classes__isnull=True).count()
    classes = StudentClass.objects.filter(created_by=request.user)

    recent_exams = [{
        'id': e.id,
        'title': e.title,
        'subject': e.subject,
        'department': e.department,
        'exam_type': e.exam_type,
        'questions_count': e.questions.count(),
        'total_marks': e.total_marks,
        'duration_minutes': e.duration_minutes
    } for e in teacher_exams.order_by('-created_at')[:4]]

    return JsonResponse({
        'metrics': {
            'assigned_exams': assigned_exams,
            'unassigned_exams': unassigned_exams,
            'classes_count': classes.count(),
            'total_exams': teacher_exams.count()
        },
        'recent_exams': recent_exams
    })

@require_http_methods(["GET", "POST"])
@csrf_exempt
def api_teacher_classes(request):
    err = check_teacher(request)
    if err: return err

    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST

        name = data.get('name', '').strip()
        department = data.get('department', '').strip()
        batch = data.get('batch', '').strip() or '2024-2028'
        description = data.get('description', '').strip()

        if not name or not department:
            return error_response('Class name and department are required.')

        new_class = StudentClass.objects.create(
            name=name,
            department=department,
            batch=batch,
            description=description,
            created_by=request.user,
            school=request.user.school
        )
        new_class.generate_enrollment_code()

        return success_response({
            'class': {
                'id': new_class.id,
                'name': new_class.name,
                'department': new_class.department,
                'batch': new_class.batch,
                'enrollment_code': new_class.enrollment_code
            }
        }, status=201)

    classes = StudentClass.objects.filter(created_by=request.user).order_by('-created_at')
    classes_list = [{
        'id': c.id,
        'name': c.name,
        'department': c.department,
        'batch': c.batch,
        'student_count': c.students.count(),
        'assigned_exams_count': c.assigned_exams.count(),
        'enrollment_code': c.enrollment_code,
        'allow_self_enrollment': c.allow_self_enrollment
    } for c in classes]

    return JsonResponse({'classes': classes_list})

@require_http_methods(["GET"])
def api_teacher_class_detail(request, class_pk):
    err = check_teacher(request)
    if err: return err

    c = StudentClass.objects.filter(id=class_pk, school=request.user.school).first()
    if not c:
        return error_response('Class not found.', status=404)

    students = [{
        'id': s.id,
        'username': s.username,
        'name': s.get_full_name(),
        'batch': s.batch,
        'is_active': s.is_active
    } for s in c.students.all().order_by('first_name', 'last_name')]

    assigned_exams = [{
        'id': e.id,
        'title': e.title,
        'subject': e.subject,
        'duration_minutes': e.duration_minutes,
        'total_marks': e.total_marks
    } for e in c.assigned_exams.all()]

    return JsonResponse({
        'class': {
            'id': c.id,
            'name': c.name,
            'department': c.department,
            'batch': c.batch,
            'description': c.description,
            'enrollment_code': c.enrollment_code,
            'allow_self_enrollment': c.allow_self_enrollment,
            'created_by': c.created_by.get_full_name(),
            'students': students,
            'assigned_exams': assigned_exams
        }
    })

@csrf_exempt
@require_http_methods(["POST"])
def api_teacher_class_toggle_enrollment(request, class_pk):
    err = check_teacher(request)
    if err: return err

    c = StudentClass.objects.filter(id=class_pk, created_by=request.user).first()
    if not c:
        return error_response('Class not found.', status=404)

    if not c.enrollment_code:
        c.generate_enrollment_code()

    c.allow_self_enrollment = not c.allow_self_enrollment
    c.save(update_fields=['allow_self_enrollment'])

    return success_response({
        'allow_self_enrollment': c.allow_self_enrollment,
        'enrollment_code': c.enrollment_code
    })

@csrf_exempt
@require_http_methods(["POST"])
def api_teacher_class_regenerate_code(request, class_pk):
    err = check_teacher(request)
    if err: return err

    c = StudentClass.objects.filter(id=class_pk, created_by=request.user).first()
    if not c:
        return error_response('Class not found.', status=404)

    code = c.generate_enrollment_code()
    return success_response({'enrollment_code': code})

@require_http_methods(["GET", "POST"])
@csrf_exempt
def api_teacher_exams(request):
    err = check_teacher(request)
    if err: return err

    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST

        title = data.get('title', '').strip()
        subject = data.get('subject', '').strip()
        department = data.get('department', '').strip()
        chapter = data.get('chapter', '').strip()
        exam_type = data.get('exam_type', 'practice_test')
        duration_minutes = int(data.get('duration_minutes', 15))
        pass_percentage = int(data.get('pass_percentage', 50))
        description = data.get('description', '').strip()

        if not title or not subject or not chapter:
            return error_response('Title, subject, and chapter are required.')

        exam = Exam.objects.create(
            title=title,
            subject=subject,
            department=department,
            chapter=chapter,
            exam_type=exam_type,
            duration_minutes=duration_minutes,
            pass_percentage=pass_percentage,
            description=description,
            created_by=request.user,
            school=request.user.school
        )

        return success_response({'exam_id': exam.id}, status=201)

    exams = Exam.objects.filter(created_by=request.user).order_by('-created_at')
    exams_list = [{
        'id': e.id,
        'title': e.title,
        'subject': e.subject,
        'department': e.department,
        'chapter': e.chapter,
        'exam_type': e.exam_type,
        'duration_minutes': e.duration_minutes,
        'total_marks': e.total_marks,
        'question_count': e.questions.count(),
        'assigned_classes_count': e.assigned_classes.count(),
        'created_at': e.created_at.strftime('%Y-%m-%d')
    } for e in exams]

    return JsonResponse({'exams': exams_list})

@require_http_methods(["GET"])
def api_teacher_exam_detail(request, exam_pk):
    err = check_teacher(request)
    if err: return err

    e = Exam.objects.filter(id=exam_pk, school=request.user.school).first()
    if not e:
        return error_response('Exam not found.', status=404)

    questions = []
    for eq in ExamQuestion.objects.filter(exam=e).select_related('question').order_by('order'):
        q = eq.question
        choices = [{
            'id': c.id,
            'text': c.choice_text,
            'is_correct': c.is_correct
        } for c in q.choices.all().order_by('order')]

        questions.append({
            'id': q.id,
            'order': eq.order,
            'text': q.question_text,
            'marks': q.marks,
            'explanation': q.explanation,
            'choices': choices
        })

    assigned_classes = [{
        'id': c.id,
        'name': c.name,
        'batch': c.batch
    } for c in e.assigned_classes.all()]

    return JsonResponse({
        'exam': {
            'id': e.id,
            'title': e.title,
            'subject': e.subject,
            'department': e.department,
            'chapter': e.chapter,
            'exam_type': e.exam_type,
            'duration_minutes': e.duration_minutes,
            'pass_percentage': e.pass_percentage,
            'total_marks': e.total_marks,
            'description': e.description,
            'created_by': e.created_by.get_full_name(),
            'assigned_classes': assigned_classes,
            'questions': questions
        }
    })

@require_http_methods(["GET"])
def api_exam_bank(request):
    err = check_teacher(request)
    if err: return err

    school = request.user.school
    exams = Exam.objects.filter(school=school, is_cloned=False).exclude(created_by=request.user).select_related('created_by')

    dept = request.GET.get('department')
    if dept:
        exams = exams.filter(department=dept)

    subj = request.GET.get('subject')
    if subj:
        exams = exams.filter(subject=subj)

    search = request.GET.get('search')
    if search:
        exams = exams.filter(title__icontains=search)

    exams_list = [{
        'id': e.id,
        'title': e.title,
        'subject': e.subject,
        'department': e.department,
        'chapter': e.chapter,
        'exam_type': e.exam_type,
        'duration_minutes': e.duration_minutes,
        'total_marks': e.total_marks,
        'question_count': e.questions.count(),
        'created_by': e.created_by.get_full_name()
    } for e in exams.order_by('-created_at')]

    all_school_exams = Exam.objects.filter(school=school, is_cloned=False)
    departments = sorted(list(set(all_school_exams.exclude(department='').values_list('department', flat=True))))
    subjects = sorted(list(set(all_school_exams.exclude(subject='').values_list('subject', flat=True))))

    return JsonResponse({
        'exams': exams_list,
        'departments': departments,
        'subjects': subjects
    })

@require_http_methods(["GET"])
def api_teacher_responses(request):
    err = check_teacher(request)
    if err: return err

    attempts = ExamAttempt.objects.filter(
        exam__school=request.user.school,
        is_completed=True
    ).select_related('student', 'exam', 'student_class').order_by('-submitted_at')

    attempts_list = [{
        'id': a.id,
        'student_name': a.student.get_full_name(),
        'student_username': a.student.username,
        'exam_title': a.exam.title,
        'exam_id': a.exam.id,
        'class_name': a.student_class.name if a.student_class else "No Class",
        'score': float(a.score),
        'total_marks': a.total_marks,
        'percentage': a.percentage,
        'passed': a.passed,
        'attempt_mode': a.attempt_mode,
        'has_violation': a.has_violation,
        'violation_reason': a.violation_reason,
        'time_taken_mins': a.time_taken,
        'submitted_at': a.submitted_at.strftime('%Y-%m-%d %H:%M') if a.submitted_at else ""
    } for a in attempts[:50]]

    return JsonResponse({'responses': attempts_list})

# ============================================================================
# STUDENT APIS
# ============================================================================

def check_student(request):
    if not request.user.is_authenticated:
        return error_response('Authentication required.', status=401)
    if not (request.user.is_student or request.user.is_superuser):
        return error_response('Student permissions required.', status=403)
    return None

@require_http_methods(["GET"])
def api_student_dashboard(request):
    err = check_student(request)
    if err: return err

    user = request.user
    completed_attempts = ExamAttempt.objects.filter(student=user, is_completed=True)
    exams_taken = completed_attempts.values('exam').distinct().count()

    enrolled_classes = StudentClass.objects.filter(students=user, is_active=True)
    available_exams = Exam.objects.filter(assigned_classes__in=enrolled_classes).distinct()

    # Calculate average score
    avg_score = completed_attempts.aggregate(Avg('score'))['score__avg'] or 0

    classes_list = [{
        'id': c.id,
        'name': c.name,
        'batch': c.batch,
        'department': c.department,
        'teacher': c.created_by.get_full_name()
    } for c in enrolled_classes]

    return JsonResponse({
        'metrics': {
            'exams_taken': exams_taken,
            'available_exams': available_exams.count(),
            'classes_count': enrolled_classes.count(),
            'avg_score': round(float(avg_score), 1)
        },
        'enrolled_classes': classes_list
    })

@require_http_methods(["GET"])
def api_student_exams(request):
    err = check_student(request)
    if err: return err

    user = request.user
    enrolled_classes = StudentClass.objects.filter(students=user, is_active=True)
    exams = Exam.objects.filter(assigned_classes__in=enrolled_classes).distinct().order_by('-created_at')

    subj = request.GET.get('subject')
    if subj:
        exams = exams.filter(subject=subj)

    exams_list = []
    for e in exams:
        attempts = ExamAttempt.objects.filter(student=user, exam=e, is_completed=True)
        has_test_attempt = attempts.filter(attempt_mode='test').exists()
        practice_count = attempts.filter(attempt_mode='practice').count()
        best_score = attempts.aggregate(Max('score'))['score__max'] or 0
        best_pct = round((best_score / e.total_marks * 100), 1) if e.total_marks > 0 else 0

        exams_list.append({
            'id': e.id,
            'title': e.title,
            'subject': e.subject,
            'chapter': e.chapter,
            'department': e.department,
            'exam_type': e.exam_type,
            'duration_minutes': e.duration_minutes,
            'total_marks': e.total_marks,
            'pass_percentage': e.pass_percentage,
            'question_count': e.questions.count(),
            'description': e.description,
            'has_attempted': attempts.exists(),
            'has_test_attempt': has_test_attempt,
            'practice_attempts_count': practice_count,
            'best_percentage': best_pct
        })

    return JsonResponse({'exams': exams_list})

@require_http_methods(["GET"])
def api_student_exam_take(request, exam_pk):
    err = check_student(request)
    if err: return err

    user = request.user
    exam = Exam.objects.filter(id=exam_pk, school=user.school).first()
    if not exam:
        return error_response('Exam not found.', status=404)

    mode = request.GET.get('mode', 'test')
    if exam.exam_type == 'test' and mode != 'test':
        mode = 'test'

    # Check student class
    student_class = StudentClass.objects.filter(students=user, assigned_exams=exam).first()

    # Find active incomplete attempt or create new
    attempt = ExamAttempt.objects.filter(
        student=user, exam=exam, is_completed=False, attempt_mode=mode
    ).first()

    if not attempt:
        # Check if single attempt test already completed
        if mode == 'test' and ExamAttempt.objects.filter(student=user, exam=exam, is_completed=True, attempt_mode='test').exists():
            return error_response('You have already completed your official test attempt for this exam.', status=403)

        # Create attempt with randomized question order
        q_ids = list(exam.questions.values_list('id', flat=True))
        random.shuffle(q_ids)

        attempt = ExamAttempt.objects.create(
            student=user,
            exam=exam,
            student_class=student_class,
            attempt_mode=mode,
            question_order=q_ids,
            total_marks=exam.total_marks
        )
    else:
        q_ids = attempt.question_order or list(exam.questions.values_list('id', flat=True))

    # Fetch questions according to stored question_order
    questions_map = {q.id: q for q in exam.questions.filter(id__in=q_ids)}
    ordered_questions = []

    saved_answers = {sa.question_id: sa.selected_choice_id for sa in attempt.answers.all()}

    for q_id in q_ids:
        q = questions_map.get(q_id)
        if not q: continue

        choices = list(q.choices.all())
        random.shuffle(choices)

        choices_data = [{
            'id': c.id,
            'text': c.choice_text
        } for c in choices]

        ordered_questions.append({
            'id': q.id,
            'text': q.question_text,
            'marks': q.marks,
            'choices': choices_data,
            'selected_choice_id': saved_answers.get(q.id)
        })

    return JsonResponse({
        'attempt': {
            'id': attempt.id,
            'mode': attempt.attempt_mode,
            'started_at': attempt.started_at.isoformat(),
            'duration_minutes': exam.duration_minutes
        },
        'exam': {
            'id': exam.id,
            'title': exam.title,
            'subject': exam.subject,
            'pass_percentage': exam.pass_percentage,
            'total_marks': exam.total_marks
        },
        'questions': ordered_questions
    })

@csrf_exempt
@require_http_methods(["POST"])
def api_student_save_answer(request, attempt_pk):
    err = check_student(request)
    if err: return err

    attempt = ExamAttempt.objects.filter(id=attempt_pk, student=request.user, is_completed=False).first()
    if not attempt:
        return error_response('Active exam session not found.', status=404)

    try:
        data = json.loads(request.body)
    except Exception:
        data = request.POST

    question_id = data.get('question_id')
    choice_id = data.get('choice_id')

    if not question_id or not choice_id:
        return error_response('question_id and choice_id are required.')

    question = Question.objects.filter(id=question_id, exams=attempt.exam).first()
    choice = Choice.objects.filter(id=choice_id, question=question).first()

    if not question or not choice:
        return error_response('Invalid question or choice.', status=400)

    StudentAnswer.objects.update_or_create(
        attempt=attempt,
        question=question,
        defaults={'selected_choice': choice, 'is_correct': choice.is_correct}
    )

    return success_response({'saved': True, 'question_id': question_id, 'choice_id': choice_id})

@csrf_exempt
@require_http_methods(["POST"])
def api_student_log_violation(request, attempt_pk):
    err = check_student(request)
    if err: return err

    attempt = ExamAttempt.objects.filter(id=attempt_pk, student=request.user, is_completed=False).first()
    if not attempt:
        return error_response('Attempt not found.', status=404)

    try:
        data = json.loads(request.body)
    except Exception:
        data = request.POST

    reason = data.get('reason', 'Browser tab switch or window focus lost.')
    attempt.has_violation = True
    attempt.violation_reason = reason
    attempt.save(update_fields=['has_violation', 'violation_reason'])

    return success_response({'violation_recorded': True})

@csrf_exempt
@require_http_methods(["POST"])
def api_student_submit_exam(request, attempt_pk):
    err = check_student(request)
    if err: return err

    attempt = ExamAttempt.objects.filter(id=attempt_pk, student=request.user).first()
    if not attempt:
        return error_response('Attempt not found.', status=404)

    if not attempt.is_completed:
        attempt.submitted_at = timezone.now()
        attempt.is_completed = True
        attempt.calculate_score()
        attempt.save()

    return success_response({
        'attempt_id': attempt.id,
        'score': float(attempt.score),
        'total_marks': attempt.total_marks,
        'percentage': attempt.percentage,
        'passed': attempt.passed
    })

@require_http_methods(["GET"])
def api_student_exam_results(request, attempt_pk):
    if not request.user.is_authenticated:
        return error_response('Authentication required.', status=401)

    attempt = ExamAttempt.objects.filter(id=attempt_pk).select_related('exam', 'student', 'student_class').first()
    if not attempt:
        return error_response('Attempt not found.', status=404)

    # Permission check: student who took it, or teacher/admin of the school
    if request.user.is_student and attempt.student != request.user:
        return error_response('Access denied.', status=403)

    answers = {sa.question_id: sa for sa in attempt.answers.select_related('selected_choice')}

    review_questions = []
    for eq in ExamQuestion.objects.filter(exam=attempt.exam).select_related('question').order_by('order'):
        q = eq.question
        sa = answers.get(q.id)

        choices = [{
            'id': c.id,
            'text': c.choice_text,
            'is_correct': c.is_correct,
            'is_selected': bool(sa and sa.selected_choice_id == c.id)
        } for c in q.choices.all().order_by('order')]

        review_questions.append({
            'id': q.id,
            'order': eq.order,
            'text': q.question_text,
            'marks': q.marks,
            'explanation': q.explanation,
            'is_correct': bool(sa and sa.is_correct),
            'choices': choices
        })

    return JsonResponse({
        'results': {
            'attempt_id': attempt.id,
            'exam_id': attempt.exam.id,
            'exam_title': attempt.exam.title,
            'student_name': attempt.student.get_full_name(),
            'score': float(attempt.score),
            'total_marks': attempt.total_marks,
            'percentage': attempt.percentage,
            'passed': attempt.passed,
            'attempt_mode': attempt.attempt_mode,
            'time_taken_mins': attempt.time_taken,
            'has_violation': attempt.has_violation,
            'violation_reason': attempt.violation_reason,
            'submitted_at': attempt.submitted_at.strftime('%Y-%m-%d %H:%M') if attempt.submitted_at else "",
            'questions': review_questions
        }
    })

@require_http_methods(["GET"])
def api_student_history(request):
    err = check_student(request)
    if err: return err

    attempts = ExamAttempt.objects.filter(student=request.user, is_completed=True).select_related('exam').order_by('-submitted_at')
    history = [{
        'id': a.id,
        'exam_id': a.exam.id,
        'exam_title': a.exam.title,
        'subject': a.exam.subject,
        'score': float(a.score),
        'total_marks': a.total_marks,
        'percentage': a.percentage,
        'passed': a.passed,
        'attempt_mode': a.attempt_mode,
        'submitted_at': a.submitted_at.strftime('%Y-%m-%d %H:%M') if a.submitted_at else ""
    } for a in attempts]

    return JsonResponse({'history': history})

@csrf_exempt
@require_http_methods(["POST"])
def api_student_enroll(request):
    err = check_student(request)
    if err: return err

    try:
        data = json.loads(request.body)
    except Exception:
        data = request.POST

    code = (data.get('code') or '').strip().upper()
    if not code:
        return error_response('Enrollment code is required.')

    c = StudentClass.objects.filter(enrollment_code=code, school=request.user.school).first()
    if not c:
        return error_response('Invalid enrollment code. Please check with your instructor.', status=404)

    if not c.allow_self_enrollment:
        return error_response('Self-enrollment is currently disabled for this class.', status=403)

    if c.students.filter(id=request.user.id).exists():
        return error_response('You are already enrolled in this class.')

    c.students.add(request.user)
    return success_response({'enrolled': True, 'class_name': c.name})

# ============================================================================
# LEADERBOARD API
# ============================================================================

@require_http_methods(["GET"])
def api_class_leaderboard(request, class_pk):
    if not request.user.is_authenticated:
        return error_response('Authentication required.', status=401)

    c = StudentClass.objects.filter(id=class_pk, school=request.user.school).first()
    if not c:
        return error_response('Class not found.', status=404)

    # Compute leaderboard for class
    students = c.students.all()
    leaderboard = []

    for s in students:
        attempts = ExamAttempt.objects.filter(student=s, student_class=c, is_completed=True)
        total_tests = attempts.count()
        if total_tests == 0:
            avg_pct = 0
            total_points = 0
        else:
            avg_pct = round(attempts.aggregate(Avg('score'))['score__avg'] or 0, 1)
            total_points = sum(a.score for a in attempts)

        leaderboard.append({
            'student_id': s.id,
            'name': s.get_full_name(),
            'username': s.username,
            'batch': s.batch,
            'tests_completed': total_tests,
            'avg_percentage': avg_pct,
            'total_score': float(total_points)
        })

    # Sort descending by total_score, then avg_percentage
    leaderboard.sort(key=lambda x: (x['total_score'], x['avg_percentage']), reverse=True)

    # Assign ranks
    for rank, entry in enumerate(leaderboard, 1):
        entry['rank'] = rank

    return JsonResponse({
        'class': {
            'id': c.id,
            'name': c.name,
            'batch': c.batch,
            'department': c.department
        },
        'leaderboard': leaderboard
    })
