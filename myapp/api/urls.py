from django.urls import re_path
from . import views

urlpatterns = [
    # Auth
    re_path(r'^auth/login/?$', views.api_login, name='api_login'),
    re_path(r'^auth/logout/?$', views.api_logout, name='api_logout'),
    re_path(r'^auth/me/?$', views.api_me, name='api_me'),

    # Admin
    re_path(r'^admin/overview/?$', views.api_admin_overview, name='api_admin_overview'),
    re_path(r'^admin/teachers/?$', views.api_admin_teachers, name='api_admin_teachers'),
    re_path(r'^admin/teachers/(?P<teacher_id>\d+)/toggle/?$', views.api_admin_toggle_teacher, name='api_admin_toggle_teacher'),
    re_path(r'^admin/students/?$', views.api_admin_students, name='api_admin_students'),
    re_path(r'^admin/students/(?P<student_id>\d+)/toggle/?$', views.api_admin_toggle_student, name='api_admin_toggle_student'),
    re_path(r'^admin/classes/?$', views.api_admin_classes, name='api_admin_classes'),

    # Teacher
    re_path(r'^teacher/dashboard/?$', views.api_teacher_dashboard, name='api_teacher_dashboard'),
    re_path(r'^teacher/classes/?$', views.api_teacher_classes, name='api_teacher_classes'),
    re_path(r'^teacher/classes/(?P<class_pk>\d+)/?$', views.api_teacher_class_detail, name='api_teacher_class_detail'),
    re_path(r'^teacher/classes/(?P<class_pk>\d+)/toggle-enrollment/?$', views.api_teacher_class_toggle_enrollment, name='api_teacher_class_toggle_enrollment'),
    re_path(r'^teacher/classes/(?P<class_pk>\d+)/regenerate-code/?$', views.api_teacher_class_regenerate_code, name='api_teacher_class_regenerate_code'),
    re_path(r'^teacher/exams/?$', views.api_teacher_exams, name='api_teacher_exams'),
    re_path(r'^teacher/exams/(?P<exam_pk>\d+)/?$', views.api_teacher_exam_detail, name='api_teacher_exam_detail'),
    re_path(r'^teacher/exam-bank/?$', views.api_exam_bank, name='api_exam_bank'),
    re_path(r'^teacher/responses/?$', views.api_teacher_responses, name='api_teacher_responses'),

    # Student
    re_path(r'^student/dashboard/?$', views.api_student_dashboard, name='api_student_dashboard'),
    re_path(r'^student/exams/?$', views.api_student_exams, name='api_student_exams'),
    re_path(r'^student/exams/(?P<exam_pk>\d+)/take/?$', views.api_student_exam_take, name='api_student_exam_take'),
    re_path(r'^student/attempts/(?P<attempt_pk>\d+)/save-answer/?$', views.api_student_save_answer, name='api_student_save_answer'),
    re_path(r'^student/attempts/(?P<attempt_pk>\d+)/violation/?$', views.api_student_log_violation, name='api_student_log_violation'),
    re_path(r'^student/attempts/(?P<attempt_pk>\d+)/submit/?$', views.api_student_submit_exam, name='api_student_submit_exam'),
    re_path(r'^student/attempts/(?P<attempt_pk>\d+)/results/?$', views.api_student_exam_results, name='api_student_exam_results'),
    re_path(r'^student/history/?$', views.api_student_history, name='api_student_history'),
    re_path(r'^student/enroll/?$', views.api_student_enroll, name='api_student_enroll'),

    # Leaderboard
    re_path(r'^leaderboard/class/(?P<class_pk>\d+)/?$', views.api_class_leaderboard, name='api_class_leaderboard'),
]
