import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import IdeaGeneratorPage from './pages/IdeaGeneratorPage';
import RoadmapGeneratorPage from './pages/RoadmapGeneratorPage';
import MyNotesPage from './pages/MyNotesPage';
import LearningHubPage from './pages/LearningHubPage';
import CourseDetailPage from './pages/CourseDetailPage';
import BookReaderPage from './pages/BookReaderPage';
import PostsPage from './pages/PostsPage';
import NotFound from './pages/NotFound';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          success: {
            duration: 3000,
            style: { background: '#059669', color: '#fff', fontFamily: "'DM Sans', sans-serif", borderRadius: '12px' },
          },
          error: {
            duration: 4000,
            style: { background: '#DC2626', color: '#fff', fontFamily: "'DM Sans', sans-serif", borderRadius: '12px' },
          },
          style: {
            fontFamily: "'DM Sans', sans-serif",
            borderRadius: '12px',
            padding: '12px 16px',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/idea-generator" element={<IdeaGeneratorPage />} />
            <Route path="/roadmap-generator" element={<RoadmapGeneratorPage />} />
            <Route path="/notes" element={<MyNotesPage />} />
            <Route path="/learning-hub" element={<LearningHubPage />} />
            <Route path="/learning-hub/course/:id" element={<CourseDetailPage />} />
            <Route path="/learning-hub/book/:id" element={<BookReaderPage />} />
            <Route path="/posts" element={<PostsPage />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
