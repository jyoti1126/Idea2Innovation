import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuthWithNavigate } from '@/context/AuthContext';
import { getInitials } from '@/utils/helpers';

interface Props {
  onMobileToggle: () => void;
}

const Header = ({ onMobileToggle }: Props) => {
  const { user, logoutAndRedirect } = useAuthWithNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-[#EDE9FE] z-50 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMobileToggle} className="md:hidden text-[#6B7280] hover:text-[#1E1B4B]">
          <Menu size={24} />
        </button>
        <div className="flex items-center">
          <span className="text-lg mr-1">🚀</span>
          <span className="font-heading font-bold text-xl text-brand">IDEA</span>
          <span className="font-heading font-bold text-xl text-accent">2</span>
          <span className="font-heading font-bold text-xl text-brand">IMPACT</span>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-heading font-bold text-sm hover:shadow-button transition-shadow"
        >
          {user ? getInitials(user.name) : '?'}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-12 w-[180px] bg-card rounded-xl shadow-cardHover border border-[#EDE9FE] z-50 overflow-hidden">
            <div className="p-3 border-b border-[#EDE9FE]">
              <p className="font-body font-semibold text-sm text-[#1E1B4B]">{user?.name}</p>
              <p className="font-body text-xs text-[#6B7280]">@{user?.username}</p>
            </div>
            <button
              onClick={logoutAndRedirect}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-body text-[#6B7280] hover:text-danger hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
