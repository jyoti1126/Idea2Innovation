import axiosInstance from './axiosInstance';

export const getPostsApi = () => axiosInstance.get('/posts');

export const addPostApi = (formData: FormData, adminPassword: string) =>
  axiosInstance.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data', 'x-admin-password': adminPassword },
  });
