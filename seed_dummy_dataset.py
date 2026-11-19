import os
import sys
import django
import random
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CognIQ.settings')
django.setup()

from django.utils import timezone
from myapp.models import (
    School, User, StudentClass, Exam, Question, Choice,
    ExamQuestion, ExamAttempt, StudentAnswer, ExamAssignmentDate
)

def seed():
    print("🚀 Seeding 10 Dummy Datasets for Admin, Teacher, and Student roles...")

    # Ensure school exists
    school, created = School.objects.get_or_create(
        slug='cit',
        defaults={
            'name': 'Coimbatore Institute of Technology',
            'address': 'Civil Aerodrome Post, Coimbatore, Tamil Nadu 641014',
            'phone': '+91 422 2574071',
            'email': 'principal@cit.edu.in',
            'is_active': True,
        }
    )
    print(f"🏫 School: {school.name} (ID: {school.id})")

    # =========================================================================
    # 1. SEED 10 ADMIN USERS
    # =========================================================================
    admin_data = [
        ("admin_cit_01", "Dr. Rajesh", "Natarajan", "dean.academic@cit.edu", "+91 98401 11001", "Dean of Academic Affairs"),
        ("admin_cit_02", "Dr. Meenakshi", "Sundaram", "coe@cit.edu", "+91 98401 11002", "Controller of Examinations"),
        ("admin_cit_03", "Dr. K. Senthil", "Kumar", "registrar@cit.edu", "+91 98401 11003", "Academic Registrar"),
        ("admin_cit_04", "Dr. Preetha", "Chandran", "eval.director@cit.edu", "+91 98401 11004", "Director of Student Evaluation"),
        ("admin_cit_05", "Dr. Anandha", "Krishnan", "assessment@cit.edu", "+91 98401 11005", "Chief Assessment Officer"),
        ("admin_cit_06", "Dr. Subhashini", "Rao", "iqac@cit.edu", "+91 98401 11006", "Quality Assurance Director"),
        ("admin_cit_07", "Dr. Venkatesh", "Raman", "accreditation@cit.edu", "+91 98401 11007", "Accreditation Lead"),
        ("admin_cit_08", "Dr. Kavitha", "Selvam", "curriculum@cit.edu", "+91 98401 11008", "Curriculum Development Head"),
        ("admin_cit_09", "Dr. Balaji", "Murugan", "dean.admin@cit.edu", "+91 98401 11009", "Administrative Dean"),
        ("admin_cit_10", "Dr. Shalini", "Parthasarathy", "research.eval@cit.edu", "+91 98401 11010", "Institutional Research Lead"),
    ]

    print("\n--- [1/3] Creating 10 Admin Users ---")
    created_admins = []
    for username, first, last, email, phone, title in admin_data:
        admin_user, was_created = User.objects.get_or_create(
            username=username,
            defaults={
                'first_name': first,
                'last_name': last,
                'email': email,
                'phone_number': phone,
                'role': 'admin',
                'school': school,
                'is_staff': True,
                'is_active': True,
            }
        )
        admin_user.set_password('adminpassword123')
        admin_user.school = school
        admin_user.role = 'admin'
        admin_user.is_staff = True
        admin_user.save()
        created_admins.append(admin_user)
        print(f"  ✓ Admin: {admin_user.username} ({first} {last}) - {title}")

    # =========================================================================
    # 2. SEED 10 TEACHER USERS WITH CLASSES, EXAMS & QUESTIONS
    # =========================================================================
    teacher_specs = [
        {
            "username": "tch_003",
            "first_name": "Dr. Vikram",
            "last_name": "Seth",
            "email": "vikram.seth@cit.edu",
            "department": "Computer Science Engineering",
            "class_name": "CSE - Operating Systems & Concurrency",
            "class_code": "CSEOS024",
            "exam_title": "OS Kernels, Threads & Synchronization",
            "subject": "GATE",
            "chapter": "Operating Systems",
            "questions": [
                {
                    "text": "Which synchronization primitive avoids priority inversion in real-time operating systems?",
                    "marks": 2,
                    "explanation": "Priority ceiling and priority inheritance protocols temporarily elevate the lock holder's priority to prevent medium priority tasks from preempting high priority tasks.",
                    "choices": [
                        ("Priority Inheritance Mutex", True),
                        ("Counting Semaphore", False),
                        ("Spinlock without timeout", False),
                        ("Peterson's algorithm", False)
                    ]
                },
                {
                    "text": "What is the Belady's Anomaly associated with in virtual memory management?",
                    "marks": 2,
                    "explanation": "Belady's anomaly occurs under FIFO page replacement where allocating more page frames increases the number of page faults.",
                    "choices": [
                        ("FIFO page replacement algorithm", True),
                        ("LRU page replacement algorithm", False),
                        ("Optimal page replacement algorithm", False),
                        ("Clock algorithm", False)
                    ]
                },
                {
                    "text": "In Unix/Linux, what state does a terminated process enter before its parent calls wait()?",
                    "marks": 2,
                    "explanation": "A process whose execution is complete but whose entry remains in the process table until collected is a Zombie process.",
                    "choices": [
                        ("Zombie State (defunct)", True),
                        ("Orphan State", False),
                        ("Blocked State", False),
                        ("Suspended Ready", False)
                    ]
                }
            ]
        },
        {
            "username": "tch_004",
            "first_name": "Prof. Sunita",
            "last_name": "Menon",
            "email": "sunita.menon@cit.edu",
            "department": "Artificial Intelligence & Data Science",
            "class_name": "AIDS - Deep Learning & Neural Architectures",
            "class_code": "AIDS24DL",
            "exam_title": "Deep Learning: Backprop & Transformers",
            "subject": "GATE",
            "chapter": "Machine Learning",
            "questions": [
                {
                    "text": "What is the computational complexity of the standard Scaled Dot-Product Attention with respect to sequence length N?",
                    "marks": 2,
                    "explanation": "Standard self-attention computes an N x N affinity matrix, resulting in O(N^2 * d) time complexity.",
                    "choices": [
                        ("O(N^2 * d)", True),
                        ("O(N * d^2)", False),
                        ("O(N log N)", False),
                        ("O(d^3)", False)
                    ]
                },
                {
                    "text": "Which activation function helps effectively mitigate the vanishing gradient problem in deep networks?",
                    "marks": 2,
                    "explanation": "ReLU has a constant derivative of 1 for positive inputs, avoiding gradient saturation.",
                    "choices": [
                        ("Rectified Linear Unit (ReLU)", True),
                        ("Sigmoid", False),
                        ("Standard Hyperbolic Tangent (Tanh)", False),
                        ("Softmax", False)
                    ]
                },
                {
                    "text": "What purpose does Residual Connection (Skip Connection) serve in ResNet architectures?",
                    "marks": 2,
                    "explanation": "Residual connections allow gradients to flow directly through skip paths, avoiding degradation in deep architectures.",
                    "choices": [
                        ("Allows gradients to bypass non-linear layers directly", True),
                        ("Reduces total model parameters to zero", False),
                        ("Replaces the loss function with L1 norm", False),
                        ("Disables batch normalization layers", False)
                    ]
                }
            ]
        },
        {
            "username": "tch_005",
            "first_name": "Dr. Arjun",
            "last_name": "Raghavan",
            "email": "arjun.raghavan@cit.edu",
            "department": "Information Technology",
            "class_name": "IT - Distributed Systems & Cloud Platforms",
            "class_code": "ITDIST24",
            "exam_title": "Distributed Consensus & CAP Theorem",
            "subject": "GATE",
            "chapter": "Distributed Systems",
            "questions": [
                {
                    "text": "According to Brewer's CAP Theorem, what can a distributed system guarantee during a network partition?",
                    "marks": 2,
                    "explanation": "When a network partition (P) occurs, the system must choose between Consistency (C) and Availability (A).",
                    "choices": [
                        ("Either Consistency or Availability, but not both", True),
                        ("Both Consistency and Availability simultaneously", False),
                        ("Neither Consistency nor Availability", False),
                        ("Infinite ACID atomicity", False)
                    ]
                },
                {
                    "text": "Which consensus protocol is widely used in Apache Kafka, etcd, and Kubernetes clusters?",
                    "marks": 2,
                    "explanation": "Raft is an understandable consensus algorithm implemented by etcd for reliable state replication.",
                    "choices": [
                        ("Raft Consensus Algorithm", True),
                        ("Dijkstra's Shortest Path", False),
                        ("Prim's Algorithm", False),
                        ("Bellman-Ford Algorithm", False)
                    ]
                }
            ]
        },
        {
            "username": "tch_006",
            "first_name": "Prof. Deepa",
            "last_name": "Narayanan",
            "email": "deepa.narayanan@cit.edu",
            "department": "Electronics & Communication Engineering",
            "class_name": "ECE - Digital Signal Processing & VLSI",
            "class_code": "ECEDSP24",
            "exam_title": "DSP: Fourier Transforms & Z-Transforms",
            "subject": "GATE",
            "chapter": "Signal Processing",
            "questions": [
                {
                    "text": "What is the minimum sampling rate required to avoid aliasing for a signal with maximum frequency component fm = 12 kHz?",
                    "marks": 2,
                    "explanation": "Nyquist-Shannon sampling theorem requires fs >= 2 * fm = 2 * 12 kHz = 24 kHz.",
                    "choices": [
                        ("24 kHz", True),
                        ("12 kHz", False),
                        ("48 kHz", False),
                        ("6 kHz", False)
                    ]
                },
                {
                    "text": "For an LTI system to be stable and causal, where must all poles of its H(z) transfer function lie?",
                    "marks": 2,
                    "explanation": "For causality and BIBO stability, all poles must lie strictly inside the unit circle |z| < 1.",
                    "choices": [
                        ("Strictly inside the unit circle |z| < 1", True),
                        ("Strictly on the unit circle |z| = 1", False),
                        ("Outside the unit circle |z| > 1", False),
                        ("Only on the real axis", False)
                    ]
                }
            ]
        },
        {
            "username": "tch_007",
            "first_name": "Dr. Karthik",
            "last_name": "Iyer",
            "email": "karthik.iyer@cit.edu",
            "department": "Mechanical Engineering",
            "class_name": "Mech - Applied Thermodynamics & FEA",
            "class_code": "MECHFE24",
            "exam_title": "Thermodynamics & Heat Transfer Fundamentals",
            "subject": "GATE",
            "chapter": "Thermodynamics",
            "questions": [
                {
                    "text": "Which ideal cycle serves as the upper theoretical limit of thermal efficiency for heat engines operating between two temperatures?",
                    "marks": 2,
                    "explanation": "The Carnot cycle has maximum theoretical efficiency eta = 1 - (TL/TH).",
                    "choices": [
                        ("Carnot Cycle", True),
                        ("Otto Cycle", False),
                        ("Rankine Cycle", False),
                        ("Brayton Cycle", False)
                    ]
                },
                {
                    "text": "What dimensionless number signifies the ratio of inertial forces to viscous forces in fluid mechanics?",
                    "marks": 2,
                    "explanation": "Reynolds number (Re) characterizes fluid flow regime based on inertia vs viscosity.",
                    "choices": [
                        ("Reynolds Number", True),
                        ("Prandtl Number", False),
                        ("Nusselt Number", False),
                        ("Mach Number", False)
                    ]
                }
            ]
        },
        {
            "username": "tch_008",
            "first_name": "Prof. Ananya",
            "last_name": "Joshi",
            "email": "ananya.joshi@cit.edu",
            "department": "Electrical & Electronics Engineering",
            "class_name": "EEE - Smart Grids & Power Electronics",
            "class_code": "EEESMG24",
            "exam_title": "Power Converters & Inverter Control",
            "subject": "GATE",
            "chapter": "Power Systems",
            "questions": [
                {
                    "text": "Which switching device is preferred for high-voltage, high-power industrial applications with moderate switching frequencies?",
                    "marks": 2,
                    "explanation": "IGBT combines the simple gate-drive characteristics of MOSFETs with the high-current and low-saturation-voltage capability of bipolar transistors.",
                    "choices": [
                        ("Insulated Gate Bipolar Transistor (IGBT)", True),
                        ("Standard Diode", False),
                        ("Tunnel Diode", False),
                        ("Unijunction Transistor (UJT)", False)
                    ]
                }
            ]
        },
        {
            "username": "tch_009",
            "first_name": "Dr. Rakesh",
            "last_name": "Varma",
            "email": "rakesh.varma@cit.edu",
            "department": "CSE (Cyber Security)",
            "class_name": "CyberSec - Applied Cryptography & Defense",
            "class_code": "CYBERD24",
            "exam_title": "Public Key Cryptography & PKI",
            "subject": "GATE",
            "chapter": "Cybersecurity",
            "questions": [
                {
                    "text": "What mathematical problem provides the hardness guarantee for the classic RSA cryptosystem?",
                    "marks": 2,
                    "explanation": "RSA relies on the computational difficulty of factoring the product of two large prime numbers.",
                    "choices": [
                        ("Prime Factorization of large composite numbers", True),
                        ("Travelling Salesperson Problem", False),
                        ("Discrete Logarithm on elliptic curves only", False),
                        ("Graph Coloring Problem", False)
                    ]
                },
                {
                    "text": "Which hashing algorithm is currently considered cryptographically secure for digital signatures?",
                    "marks": 2,
                    "explanation": "SHA-256 (part of SHA-2 family) remains resistant to collision and pre-image attacks.",
                    "choices": [
                        ("SHA-256", True),
                        ("MD5", False),
                        ("SHA-1", False),
                        ("CRC32", False)
                    ]
                }
            ]
        },
        {
            "username": "tch_010",
            "first_name": "Prof. Lavanya",
            "last_name": "Swaminathan",
            "email": "lavanya.s@cit.edu",
            "department": "CSE (AI and Machine Learning)",
            "class_name": "AIML - Natural Language Processing & LLMs",
            "class_code": "AIMLLM24",
            "exam_title": "NLP: Tokenization, Embeddings & Attention",
            "subject": "GATE",
            "chapter": "Natural Language Processing",
            "questions": [
                {
                    "text": "What subword tokenization algorithm is widely utilized in modern LLMs such as GPT and RoBERTa?",
                    "marks": 2,
                    "explanation": "Byte-Pair Encoding (BPE) dynamically merges the most frequent pairs of bytes/characters.",
                    "choices": [
                        ("Byte-Pair Encoding (BPE)", True),
                        ("Levenshtein Distance Tokenizer", False),
                        ("N-gram Markovian Slicer", False),
                        ("Stopword Elimination Vectorizer", False)
                    ]
                }
            ]
        },
        {
            "username": "tch_011",
            "first_name": "Dr. Harish",
            "last_name": "Chandra",
            "email": "harish.chandra@cit.edu",
            "department": "Biomedical Engineering",
            "class_name": "BME - Physiological Instrumentation",
            "class_code": "BMEPHY24",
            "exam_title": "Biopotential Amplifiers & Electrodes",
            "subject": "GATE",
            "chapter": "Biomedical Engineering",
            "questions": [
                {
                    "text": "Why are instrumentation amplifiers with high Common-Mode Rejection Ratio (CMRR) crucial for ECG signal acquisition?",
                    "marks": 2,
                    "explanation": "ECG signals have low amplitude (~1 mV) and are masked by 50/60 Hz power-line noise common to both leads.",
                    "choices": [
                        ("To reject 50/60 Hz power-line interference noise common to both electrodes", True),
                        ("To amplify noise while dampening the cardiac signal", False),
                        ("To convert analog signals directly to optical waves", False),
                        ("To bypass patient grounding requirements", False)
                    ]
                }
            ]
        },
        {
            "username": "tch_012",
            "first_name": "Prof. Nithya",
            "last_name": "Kalyani",
            "email": "nithya.kalyani@cit.edu",
            "department": "Civil Engineering",
            "class_name": "Civil - Structural Analysis & Geotech",
            "class_code": "CIVILS24",
            "exam_title": "Structural Mechanics & Concrete Technology",
            "subject": "GATE",
            "chapter": "Structural Engineering",
            "questions": [
                {
                    "text": "In limit state design of reinforced concrete beams, what is the maximum compressive strain in concrete under axial compression?",
                    "marks": 2,
                    "explanation": "According to standard codes (such as IS 456), the maximum compressive strain in concrete in axial compression is taken as 0.002.",
                    "choices": [
                        ("0.002", True),
                        ("0.0035", False),
                        ("0.05", False),
                        ("0.0001", False)
                    ]
                }
            ]
        }
    ]

    print("\n--- [2/3] Creating 10 Teacher Users with Classes, Exams & Questions ---")
    created_teachers = []
    created_classes = []
    created_exams = []

    for spec in teacher_specs:
        teacher, _ = User.objects.get_or_create(
            username=spec['username'],
            defaults={
                'first_name': spec['first_name'],
                'last_name': spec['last_name'],
                'email': spec['email'],
                'role': 'teacher',
                'school': school,
                'is_active': True,
            }
        )
        teacher.set_password('teachpass123')
        teacher.school = school
        teacher.role = 'teacher'
        teacher.save()
        created_teachers.append(teacher)

        # Create Class for this Teacher
        st_class, _ = StudentClass.objects.get_or_create(
            name=spec['class_name'],
            batch='2024-2028',
            created_by=teacher,
            school=school,
            defaults={
                'department': spec['department'],
                'description': f"Official cohort for {spec['class_name']}",
                'enrollment_code': spec['class_code'],
                'allow_self_enrollment': True,
                'is_active': True,
            }
        )
        st_class.allow_self_enrollment = True
        st_class.enrollment_code = spec['class_code']
        st_class.save()
        created_classes.append(st_class)

        # Create Exam for this Teacher & Class
        exam, _ = Exam.objects.get_or_create(
            title=spec['exam_title'],
            created_by=teacher,
            school=school,
            defaults={
                'subject': spec['subject'],
                'department': spec['department'],
                'chapter': spec['chapter'],
                'exam_type': 'practice_test',
                'duration_minutes': 20,
                'pass_percentage': 50,
            }
        )
        exam.assigned_classes.add(st_class)
        created_exams.append((exam, st_class))

        # Assign Date
        ExamAssignmentDate.objects.get_or_create(
            exam=exam,
            student_class=st_class
        )

        # Add Questions & Choices
        order = 1
        for q_data in spec['questions']:
            q, _ = Question.objects.get_or_create(
                school=school,
                created_by=teacher,
                question_text=q_data['text'],
                defaults={
                    'subject': spec['subject'],
                    'department': spec['department'],
                    'chapter': spec['chapter'],
                    'marks': q_data['marks'],
                    'explanation': q_data['explanation']
                }
            )

            # Link question to exam
            ExamQuestion.objects.get_or_create(
                exam=exam,
                question=q,
                defaults={'order': order}
            )
            order += 1

            # Choices
            c_order = 1
            for choice_text, is_corr in q_data['choices']:
                Choice.objects.get_or_create(
                    question=q,
                    choice_text=choice_text,
                    defaults={
                        'is_correct': is_corr,
                        'order': c_order
                    }
                )
                c_order += 1

        exam.update_total_marks()
        print(f"  ✓ Teacher: {teacher.username} ({teacher.get_full_name()}) | Class: {st_class.name} (Code: {st_class.enrollment_code}) | Exam: {exam.title} ({exam.total_marks} marks)")

    # =========================================================================
    # 3. SEED 10 STUDENT USERS WITH ENROLLMENTS & ATTEMPTS
    # =========================================================================
    student_data = [
        ("stu_001", "Aarav", "Patel", "aarav.patel@cit.edu", "+91 98765 43201"),
        ("stu_002", "Diya", "Sharma", "diya.sharma@cit.edu", "+91 98765 43202"),
        ("stu_003", "Rohan", "Varma", "rohan.varma@cit.edu", "+91 98765 43203"),
        ("stu_004", "Ananya", "Reddy", "ananya.reddy@cit.edu", "+91 98765 43204"),
        ("stu_005", "Siddharth", "Nair", "siddharth.nair@cit.edu", "+91 98765 43205"),
        ("stu_006", "Pooja", "Hegde", "pooja.hegde@cit.edu", "+91 98765 43206"),
        ("stu_007", "Vivek", "Subramanian", "vivek.s@cit.edu", "+91 98765 43207"),
        ("stu_008", "Sneha", "Kulkarni", "sneha.k@cit.edu", "+91 98765 43208"),
        ("stu_009", "Rahul", "Mukherjee", "rahul.m@cit.edu", "+91 98765 43209"),
        ("stu_010", "Tanya", "Deshmukh", "tanya.d@cit.edu", "+91 98765 43210"),
    ]

    print("\n--- [3/3] Creating 10 Student Users with Class Enrollments & Completed Exam Attempts ---")
    created_students = []
    now = timezone.now()

    for idx, (username, first, last, email, phone) in enumerate(student_data):
        student, _ = User.objects.get_or_create(
            username=username,
            defaults={
                'first_name': first,
                'last_name': last,
                'email': email,
                'phone_number': phone,
                'role': 'student',
                'batch': '2024-2028',
                'school': school,
                'is_active': True,
            }
        )
        student.set_password('studentpass123')
        student.school = school
        student.role = 'student'
        student.batch = '2024-2028'
        student.save()
        created_students.append(student)

        # Enroll student in classes (every student enrolled in at least 3 classes)
        # We rotate classes so each class gets multiple students
        assigned_cls = [created_classes[idx % len(created_classes)],
                        created_classes[(idx + 1) % len(created_classes)],
                        created_classes[(idx + 2) % len(created_classes)]]
        for c in assigned_cls:
            c.students.add(student)

        # Create attempts for exams in their enrolled classes
        attempts_count = 0
        for exam, st_class in created_exams:
            if st_class in assigned_cls:
                # Check if attempt already exists
                attempt, att_created = ExamAttempt.objects.get_or_create(
                    student=student,
                    exam=exam,
                    student_class=st_class,
                    attempt_mode='test',
                    defaults={
                        'started_at': now - timedelta(hours=random.randint(1, 48)),
                        'is_completed': True,
                        'total_marks': exam.total_marks,
                    }
                )

                if att_created or not attempt.answers.exists():
                    attempt.submitted_at = attempt.started_at + timedelta(minutes=random.randint(8, 18))
                    attempt.is_completed = True
                    attempt.total_marks = exam.total_marks
                    attempt.save()

                    # Answer questions
                    questions = list(exam.questions.all())
                    # Student skill level variance: higher index students do slightly differently
                    should_answer_correct = (idx % 3 != 0)

                    for q in questions:
                        choices = list(q.choices.all())
                        correct_choice = next((c for c in choices if c.is_correct), choices[0])
                        wrong_choices = [c for c in choices if not c.is_correct]

                        if should_answer_correct or not wrong_choices:
                            chosen = correct_choice
                        else:
                            chosen = random.choice(wrong_choices)

                        StudentAnswer.objects.update_or_create(
                            attempt=attempt,
                            question=q,
                            defaults={
                                'selected_choice': chosen,
                                'is_correct': chosen.is_correct
                            }
                        )

                    attempt.calculate_score()
                    attempts_count += 1

        print(f"  ✓ Student: {student.username} ({first} {last}) | Enrolled in {len(assigned_cls)} classes | Completed {attempts_count} exam attempts")

    # Final summary check
    print("\n=======================================================")
    print("✨ DUMMY DATASET SEEDING COMPLETED SUCCESSFULLY!")
    print("=======================================================")
    print(f"Total Users: {User.objects.count()} (Admins: {User.objects.filter(role='admin').count()}, Teachers: {User.objects.filter(role='teacher').count()}, Students: {User.objects.filter(role='student').count()})")
    print(f"Total Classes: {StudentClass.objects.count()}")
    print(f"Total Exams: {Exam.objects.count()}")
    print(f"Total Questions: {Question.objects.count()}")
    print(f"Total Exam Attempts: {ExamAttempt.objects.count()}")
    print("=======================================================")

if __name__ == '__main__':
    seed()
