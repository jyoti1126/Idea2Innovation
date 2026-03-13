import axiosInstance from './axiosInstance';

export const generateIdeasApi = (data: {
  skill: string;
  targetAudience: string;
  problem: string;
  budget: string;
  timeCommitment: string;
}) => axiosInstance.post('/ideas/generate', data);

export const acceptIdeaApi = (data: {
  title: string;
  description: string;
  targetAudience: string;
  problem: string;
  feasibilityScore: number;
  marketPotential: string;
  competitionLevel: string;
}) => axiosInstance.post('/ideas/accept', data);

export const getMyIdeasApi = () => axiosInstance.get('/ideas');

export const deleteIdeaApi = (id: string) => axiosInstance.delete(`/ideas/${id}`);
