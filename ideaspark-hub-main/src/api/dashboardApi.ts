import axiosInstance from './axiosInstance';

export const getDashboardApi = () => axiosInstance.get('/dashboard');

export const getActivityApi = (ideaId: string) => axiosInstance.get(`/dashboard/activity/${ideaId}`);
