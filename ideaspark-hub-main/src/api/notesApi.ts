import axiosInstance from './axiosInstance';

export const getNotesApi = () => axiosInstance.get('/notes');

export const updateNoteApi = (sectionId: string, content: string) =>
  axiosInstance.patch(`/notes/${sectionId}`, { content });

export const addSectionApi = (sectionTitle: string) =>
  axiosInstance.post('/notes/section', { sectionTitle });
