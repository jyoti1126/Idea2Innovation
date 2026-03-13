import axiosInstance from './axiosInstance';

export const signupApi = (data: { name: string; email: string; username: string; password: string }) =>
  axiosInstance.post('/auth/signup', data);

export const signinApi = (data: { username: string; password: string }) =>
  axiosInstance.post('/auth/signin', data);

export const refreshTokenApi = (refreshToken: string) =>
  axiosInstance.post('/auth/refresh', { refreshToken });

export const getMeApi = () => axiosInstance.get('/auth/me');
