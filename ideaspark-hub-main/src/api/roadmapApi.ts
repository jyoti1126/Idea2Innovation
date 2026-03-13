import axiosInstance from './axiosInstance';
import { isDemoMode, mockGenerateRoadmapApi, mockGetRoadmapApi, mockCompleteSubtaskApi, mockSaveSubtaskNoteApi } from './mockApi';

export const generateRoadmapApi = (data: {
  ideaId?: string;
  ideaTitle: string;
  targetAudience: string;
  problem: string;
  description: string;
}) => isDemoMode() ? mockGenerateRoadmapApi() : axiosInstance.post('/roadmaps/generate', data);

export const getRoadmapApi = (ideaId: string) =>
  isDemoMode() ? mockGetRoadmapApi() : axiosInstance.get(`/roadmaps/${ideaId}`);

export const completeSubtaskApi = (roadmapId: string, subtaskId: string, isCompleted: boolean) =>
  isDemoMode() ? mockCompleteSubtaskApi() : axiosInstance.patch(`/roadmaps/${roadmapId}/subtask/${subtaskId}/complete`, { isCompleted });

export const saveSubtaskNoteApi = (roadmapId: string, subtaskId: string, note: string) =>
  isDemoMode() ? mockSaveSubtaskNoteApi() : axiosInstance.patch(`/roadmaps/${roadmapId}/subtask/${subtaskId}/note`, { note });
