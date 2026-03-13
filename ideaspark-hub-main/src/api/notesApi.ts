import axiosInstance from './axiosInstance';
import { isDemoMode, mockGetNotesApi, mockUpdateNoteApi, mockAddSectionApi } from './mockApi';

export const getNotesApi = () =>
  isDemoMode() ? mockGetNotesApi() : axiosInstance.get('/notes');

export const updateNoteApi = (sectionId: string, content: string) =>
  isDemoMode() ? mockUpdateNoteApi() : axiosInstance.patch(`/notes/${sectionId}`, { content });

export const addSectionApi = (sectionTitle: string) =>
  isDemoMode() ? mockAddSectionApi(sectionTitle) : axiosInstance.post('/notes/section', { sectionTitle });
