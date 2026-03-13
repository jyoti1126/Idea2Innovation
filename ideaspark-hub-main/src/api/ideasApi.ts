import axiosInstance from './axiosInstance';
import { isDemoMode, mockGenerateIdeasApi, mockAcceptIdeaApi, mockGetMyIdeasApi, mockDeleteIdeaApi } from './mockApi';

export const generateIdeasApi = (data: {
  skill: string;
  targetAudience: string;
  problem: string;
  budget: string;
  timeCommitment: string;
}) => isDemoMode() ? mockGenerateIdeasApi() : axiosInstance.post('/ideas/generate', data);

export const acceptIdeaApi = (data: {
  title: string;
  description: string;
  targetAudience: string;
  problem: string;
  feasibilityScore: number;
  marketPotential: string;
  competitionLevel: string;
}) => isDemoMode() ? mockAcceptIdeaApi(data) : axiosInstance.post('/ideas/accept', data);

export const getMyIdeasApi = () =>
  isDemoMode() ? mockGetMyIdeasApi() : axiosInstance.get('/ideas');

export const deleteIdeaApi = (id: string) =>
  isDemoMode() ? mockDeleteIdeaApi() : axiosInstance.delete(`/ideas/${id}`);
