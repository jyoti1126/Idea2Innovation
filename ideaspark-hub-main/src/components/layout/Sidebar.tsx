import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Lightbulb, Map, NotebookPen, BookOpen, Newspaper, X } from 'lucide-react';

interface Props {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { label: 'My Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Idea Generator', icon: Lightbulb, path: '/idea-generator' },
  { label: 'Roadmap Generator', icon: Map, path: '/roadmap-generator' },
  { label: 'My Notes', icon: NotebookPen, path: '/notes' },
  { label: 'Learning Hub', icon: BookOpen, path: '/learning-hub' },
  { label: 'Posts', icon: Newspaper, path: '/posts' },
];

const Sidebar = ({ mobileOpen, onMobileClose }: Props) => {
  const sidebarContent = (
    <nav className="flex flex-col h-full">
      <div className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${
                isActive
                  ? 'bg-brand-subtle text-brand font-semibold border-l-4 border-brand pl-2'
                  : 'text-[#6B7280] hover:bg-brand-subtle'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="border-t border-[#EDE9FE] p-3">
        <p className="text-[11px] text-[#6B7280] text-center font-body">v1.0 · IDEA2EXECUTION</p>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block fixed left-0 top-16 w-60 h-[calc(100vh-64px)] bg-card border-r border-[#EDE9FE] z-40">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 w-[280px] h-full bg-card shadow-cardHover slide-in-right">
            <div className="flex items-center justify-between px-4 h-16 border-b border-[#EDE9FE]">
              <span className="font-heading font-bold text-brand">IDEA<span className="text-accent">2</span>EXECUTION</span>
              <button onClick={onMobileClose} className="text-[#6B7280]"><X size={20} /></button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
