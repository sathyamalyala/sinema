import React from 'react';
import { Film, User, LogOut, Sparkles, Search } from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, currentView, onChangeView, onLogout }) => {
  const navItemClass = (view: AppView) => 
    `flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-medium ${
      currentView === view 
        ? 'bg-white text-black' 
        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => user && onChangeView(AppView.HOME)} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg">
            <Film size={18} strokeWidth={3} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:opacity-80 transition-opacity">
            sinema
          </span>
        </div>

        {/* Nav Links - Only if logged in */}
        {user && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onChangeView(AppView.HOME)}
              className={navItemClass(AppView.HOME)}
            >
              <Search size={16} />
              <span className="hidden sm:inline">Discover</span>
            </button>

            <button 
              onClick={() => onChangeView(AppView.RECOMMENDATIONS)}
              className={navItemClass(AppView.RECOMMENDATIONS)}
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">For You</span>
            </button>

            <button 
              onClick={() => onChangeView(AppView.PROFILE)}
              className={navItemClass(AppView.PROFILE)}
            >
              <User size={16} />
              <span className="hidden sm:inline">Profile</span>
            </button>
            
            <div className="w-px h-6 bg-zinc-800 mx-2"></div>

            <button 
              onClick={onLogout}
              className="text-zinc-500 hover:text-red-400 p-2 rounded-full hover:bg-zinc-900 transition-colors"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}

        {!user && (
          <div className="text-sm text-zinc-500 font-medium">
            Welcome
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;