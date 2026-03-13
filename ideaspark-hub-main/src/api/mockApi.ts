// Mock API layer — returns mock data instead of calling backend
import {
  mockDashboard,
  mockActivity,
  mockGeneratedIdeas,
  mockRoadmap,
  mockNotes,
  mockCourses,
  mockBooks,
  mockPosts,
  mockIdeas,
} from '@/data/mockData';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// Helper to check if demo mode
export const isDemoMode = () => localStorage.getItem('demoMode') === 'true';

// Auth
export const mockSignupApi = async (data: { name: string; email: string; username: string; password: string }) => {
  await delay(800);
  const user = { name: data.name, email: data.email, username: data.username };
  const accessToken = 'mock-access-token-' + Date.now();
  const refreshToken = 'mock-refresh-token-' + Date.now();
  // Store registered users list in localStorage
  const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
  const exists = users.find((u: any) => u.username === data.username || u.email === data.email);
  if (exists) throw { response: { data: { message: 'Username or email already exists' } } };
  users.push({ ...data });
  localStorage.setItem('mockUsers', JSON.stringify(users));
  // Mark app as running in demo/offline mode so all pages use mock APIs
  localStorage.setItem('demoMode', 'true');
  return { data: { user, accessToken, refreshToken } };
};

export const mockSigninApi = async (data: { username: string; password: string }) => {
  await delay(600);
  const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
  const found = users.find((u: any) => u.username === data.username && u.password === data.password);
  if (!found) throw { response: { data: { message: 'Invalid username or password' } } };
  const user = { name: found.name, email: found.email, username: found.username };
  const accessToken = 'mock-access-token-' + Date.now();
  const refreshToken = 'mock-refresh-token-' + Date.now();
  // Mark app as running in demo/offline mode so all pages use mock APIs
  localStorage.setItem('demoMode', 'true');
  return { data: { user, accessToken, refreshToken } };
};

// Dashboard
export const mockGetDashboardApi = async () => {
  await delay(500);
  return { data: mockDashboard };
};

export const mockGetActivityApi = async () => {
  await delay(300);
  return { data: mockActivity };
};

// Ideas
export const mockGenerateIdeasApi = async () => {
  await delay(3000);
  return { data: { ideas: mockGeneratedIdeas } };
};

export const mockAcceptIdeaApi = async (data: any) => {
  await delay(500);
  const newIdea = { _id: 'idea-' + Date.now(), ...data, progress: 0, createdAt: new Date().toISOString() };
  return { data: { idea: newIdea } };
};

export const mockGetMyIdeasApi = async () => {
  await delay(300);
  return { data: { ideas: mockIdeas } };
};

export const mockDeleteIdeaApi = async () => {
  await delay(300);
  return { data: { success: true } };
};

// Roadmap
export const mockGenerateRoadmapApi = async () => {
  await delay(4000);
  return { data: { roadmap: mockRoadmap } };
};

export const mockGetRoadmapApi = async () => {
  await delay(300);
  return { data: mockRoadmap };
};

export const mockCompleteSubtaskApi = async () => {
  await delay(300);
  return { data: { success: true } };
};

export const mockSaveSubtaskNoteApi = async () => {
  await delay(300);
  return { data: { success: true } };
};

// Notes
export const mockGetNotesApi = async () => {
  await delay(300);
  return { data: { sections: mockNotes } };
};

export const mockUpdateNoteApi = async () => {
  await delay(300);
  return { data: { success: true } };
};

export const mockAddSectionApi = async (title: string) => {
  await delay(300);
  return { data: { section: { _id: 'note-' + Date.now(), title, sectionTitle: title, content: '' } } };
};

// Learning
export const mockGetCoursesApi = async () => {
  await delay(300);
  return { data: { courses: mockCourses } };
};

export const mockGetBooksApi = async () => {
  await delay(300);
  return { data: { books: mockBooks } };
};

export const mockGetCourseDetailApi = async (id: string) => {
  await delay(300);
  const course = mockCourses.find(c => c._id === id) || mockCourses[0];
  return { data: course };
};

export const mockGetBookDetailApi = async (id: string) => {
  await delay(300);
  const book = mockBooks.find(b => b._id === id) || mockBooks[0];
  return { data: book };
};

// Posts
export const mockGetPostsApi = async () => {
  await delay(300);
  return { data: { posts: mockPosts } };
};

export const mockAddPostApi = async (_fd: FormData) => {
  await delay(500);
  return { data: { post: { _id: 'post-' + Date.now(), title: 'New Post', description: 'Just created', image: '', createdAt: new Date().toISOString() } } };
};
