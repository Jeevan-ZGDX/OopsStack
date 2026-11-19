// API Client for CognIQ Django Backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Include Django session cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (username, password) => fetchApi('/auth/login/', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => fetchApi('/auth/logout/', { method: 'POST' }),
  me: () => fetchApi('/auth/me/'),

  // School Admin
  adminOverview: () => fetchApi('/admin/overview/'),
  adminTeachers: () => fetchApi('/admin/teachers/'),
  adminCreateTeacher: (data) => fetchApi('/admin/teachers/', { method: 'POST', body: JSON.stringify(data) }),
  adminToggleTeacher: (id) => fetchApi(`/admin/teachers/${id}/toggle/`, { method: 'POST' }),
  adminStudents: (batch) => fetchApi(`/admin/students/${batch ? `?batch=${encodeURIComponent(batch)}` : ''}`),
  adminCreateStudent: (data) => fetchApi('/admin/students/', { method: 'POST', body: JSON.stringify(data) }),
  adminToggleStudent: (id) => fetchApi(`/admin/students/${id}/toggle/`, { method: 'POST' }),
  adminClasses: () => fetchApi('/admin/classes/'),

  // Teacher
  teacherDashboard: () => fetchApi('/teacher/dashboard/'),
  teacherClasses: () => fetchApi('/teacher/classes/'),
  teacherCreateClass: (data) => fetchApi('/teacher/classes/', { method: 'POST', body: JSON.stringify(data) }),
  teacherClassDetail: (id) => fetchApi(`/teacher/classes/${id}/`),
  teacherToggleEnrollment: (id) => fetchApi(`/teacher/classes/${id}/toggle-enrollment/`, { method: 'POST' }),
  teacherRegenerateCode: (id) => fetchApi(`/teacher/classes/${id}/regenerate-code/`, { method: 'POST' }),
  teacherExams: () => fetchApi('/teacher/exams/'),
  teacherCreateExam: (data) => fetchApi('/teacher/exams/', { method: 'POST', body: JSON.stringify(data) }),
  teacherExamDetail: (id) => fetchApi(`/teacher/exams/${id}/`),
  examBank: (params) => {
    const qs = new URLSearchParams(params || {}).toString();
    return fetchApi(`/teacher/exam-bank/${qs ? `?${qs}` : ''}`);
  },
  teacherResponses: () => fetchApi('/teacher/responses/'),

  // Student
  studentDashboard: () => fetchApi('/student/dashboard/'),
  studentExams: (subject) => fetchApi(`/student/exams/${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`),
  studentExamTake: (id, mode) => fetchApi(`/student/exams/${id}/take/${mode ? `?mode=${mode}` : ''}`),
  studentSaveAnswer: (attemptId, questionId, choiceId) => fetchApi(`/student/attempts/${attemptId}/save-answer/`, {
    method: 'POST',
    body: JSON.stringify({ question_id: questionId, choice_id: choiceId }),
  }),
  studentLogViolation: (attemptId, reason) => fetchApi(`/student/attempts/${attemptId}/violation/`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),
  studentSubmitExam: (attemptId) => fetchApi(`/student/attempts/${attemptId}/submit/`, { method: 'POST' }),
  studentExamResults: (attemptId) => fetchApi(`/student/attempts/${attemptId}/results/`),
  studentHistory: () => fetchApi('/student/history/'),
  studentEnroll: (code) => fetchApi('/student/enroll/', { method: 'POST', body: JSON.stringify({ code }) }),

  // Leaderboard
  classLeaderboard: (classId) => fetchApi(`/leaderboard/class/${classId}/`),
};
