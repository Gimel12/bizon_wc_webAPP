import { Monitor, LogOut, User } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Header() {
  const { currentUser, logout } = useStore();

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Monitor className="text-cyan-400" size={28} />
        <div>
          <h1 className="text-lg font-bold text-white leading-none">Bizon Watercooling HUB</h1>
          <p className="text-xs text-slate-500">Interactive Workstation Configuration & Management</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-slate-400">PSU 1</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-400">PSU 2</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-400">PSU 3</span>
          </div>
        </div>

        {currentUser && (
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">{currentUser.name}</p>
                <p className="text-xs text-slate-400">{currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
