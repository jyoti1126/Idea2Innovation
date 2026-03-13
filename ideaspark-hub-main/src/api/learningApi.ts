import axiosInstance from './axiosInstance';

export const getCoursesApi = () => axiosInstance.get('/courses');

export const getCourseDetailApi = (id: string) => axiosInstance.get(`/courses/${id}`);

export const addCourseApi = (formData: FormData, adminPassword: string) =>
  axiosInstance.post('/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data', 'x-admin-password': adminPassword },
  });

export const addLessonApi = (courseId: string, formData: FormData, adminPassword: string) =>
  axiosInstance.post(`/courses/${courseId}/lessons`, formData, {
    headers: { 'Content-Type': 'multipart/form-data', 'x-admin-password': adminPassword },
  });

export const getBooksApi = () => axiosInstance.get('/books');

export const getBookDetailApi = (id: string) => axiosInstance.get(`/books/${id}`);

export const addBookApi = (formData: FormData, adminPassword: string) =>
  axiosInstance.post('/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data', 'x-admin-password': adminPassword },
  });
