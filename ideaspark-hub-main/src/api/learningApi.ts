import axiosInstance from './axiosInstance';
import { isDemoMode, mockGetCoursesApi, mockGetCourseDetailApi, mockGetBooksApi, mockGetBookDetailApi } from './mockApi';

export const getCoursesApi = () =>
  isDemoMode() ? mockGetCoursesApi() : axiosInstance.get('/courses');

export const getCourseDetailApi = (id: string) =>
  isDemoMode() ? mockGetCourseDetailApi(id) : axiosInstance.get(`/courses/${id}`);

export const addCourseApi = (formData: FormData, adminPassword: string) =>
  axiosInstance.post('/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data', 'x-admin-password': adminPassword },
  });

export const addLessonApi = (courseId: string, formData: FormData, adminPassword: string) =>
  axiosInstance.post(`/courses/${courseId}/lessons`, formData, {
    headers: { 'Content-Type': 'multipart/form-data', 'x-admin-password': adminPassword },
  });

export const getBooksApi = () =>
  isDemoMode() ? mockGetBooksApi() : axiosInstance.get('/books');

export const getBookDetailApi = (id: string) =>
  isDemoMode() ? mockGetBookDetailApi(id) : axiosInstance.get(`/books/${id}`);

export const addBookApi = (formData: FormData, adminPassword: string) =>
  axiosInstance.post('/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data', 'x-admin-password': adminPassword },
  });
