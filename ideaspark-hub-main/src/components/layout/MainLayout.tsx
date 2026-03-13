import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <Header onMobileToggle={() => setMobileOpen(true)} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <main className="pt-16 md:ml-60 p-4 md:p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
