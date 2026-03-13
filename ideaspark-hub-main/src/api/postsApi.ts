import axiosInstance from './axiosInstance';
import { isDemoMode, mockGetPostsApi, mockAddPostApi } from './mockApi';

export const getPostsApi = () =>
  isDemoMode() ? mockGetPostsApi() : axiosInstance.get('/posts');

export const addPostApi = (formData: FormData, adminPassword: string) =>
  isDemoMode() ? mockAddPostApi(formData) : axiosInstance.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data', 'x-admin-password': adminPassword },
  });
