import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="text-center">
        <h1 className="font-heading text-6xl font-bold text-brand mb-2">404</h1>
        <p className="font-heading text-xl font-semibold text-[#1E1B4B] mb-2">Page Not Found</p>
        <p className="text-[#6B7280] font-body text-sm mb-6">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gradient-to-r from-brand to-accent text-white rounded-lg px-6 py-2.5 font-body font-semibold hover:shadow-button transition-shadow inline-flex items-center gap-2"
        >
          <Home size={16} /> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
