import axiosInstance from './axiosInstance';
import { isDemoMode, mockGetDashboardApi, mockGetActivityApi } from './mockApi';

export const getDashboardApi = () =>
  isDemoMode() ? mockGetDashboardApi() : axiosInstance.get('/dashboard');

export const getActivityApi = (ideaId: string) =>
  isDemoMode() ? mockGetActivityApi() : axiosInstance.get(`/dashboard/activity/${ideaId}`);
