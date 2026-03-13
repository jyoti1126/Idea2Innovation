import axiosInstance from './axiosInstance';

export const generateRoadmapApi = (data: {
  ideaId?: string;
  ideaTitle: string;
  targetAudience: string;
  problem: string;
  description: string;
}) => axiosInstance.post('/roadmaps/generate', data);

export const getRoadmapApi = (ideaId: string) => axiosInstance.get(`/roadmaps/${ideaId}`);

export const completeSubtaskApi = (roadmapId: string, subtaskId: string, isCompleted: boolean) =>
  axiosInstance.patch(`/roadmaps/${roadmapId}/subtask/${subtaskId}/complete`, { isCompleted });

export const saveSubtaskNoteApi = (roadmapId: string, subtaskId: string, note: string) =>
  axiosInstance.patch(`/roadmaps/${roadmapId}/subtask/${subtaskId}/note`, { note });
