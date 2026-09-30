import React from 'react';
import {
  Home,
  Lightbulb,
  Clock,
  Bot,
  BookOpen,
  Sparkles,
  Mic,
  Headphones,
  Users,
  Zap,
  Target,
  FileCheck2,
  RotateCcw,
  AlertTriangle,
  Settings,
  LogOut,
  Moon,
  Sun,
  X
} from 'lucide-react';
import { PageId, UserProfile } from '../types';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  user: UserProfile;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: { id: PageId; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'home', label: 'Home / ড্যাশবোর্ড', icon: Home },
  { id: 'conceptExplainer', label: 'AI Concept Clarifier', icon: Lightbulb },
  { id: 'pomodoro', label: 'Pomodoro Study Timer', icon: Clock },
  { id: 'tutor', label: 'AI Tutor & Assistant', icon: Bot },
  { id: 'syllabus', label: 'Syllabus & Video Lessons', icon: BookOpen },
  { id: 'current', label: 'AI Live GK & Affairs', icon: Sparkles },
  { id: 'viva', label: 'AI Viva Simulator', icon: Mic },
  { id: 'podcast', label: 'Audio Podcast Mode', icon: Headphones },
  { id: 'focusRoom', label: 'Focus World (Live Study)', icon: Users },
  { id: 'challenge', label: 'Daily Challenge Arena', icon: Zap },
  { id: 'eligibility', label: 'Job Eligibility Checker', icon: Target },
  { id: 'exams', label: 'Mock Tests & OMR', icon: FileCheck2 },
  { id: 'revision', label: 'Spaced Revision Queue', icon: RotateCcw },
  { id: 'errors', label: 'Error Log (ভুল খাতা)', icon: AlertTriangle },
  { id: 'settings', label: 'Cloud Sync & Settings', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  user,
  onLogout,
  isDarkMode,
  onToggleDarkMode,
  isOpenMobile,
  onCloseMobile
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              প
            </div>
            <div>
              <div className="font-bold text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <span>পাঠশালা</span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  AI Hub
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                {user.name}
              </div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectPage(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom profile and controls */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <button
            onClick={onToggleDarkMode}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
              <span>{isDarkMode ? 'লাইট মোড (Light)' : 'ডার্ক মোড (Dark)'}</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-mono">{isDarkMode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>প্রোফাইল পরিবর্তন / লগআউট</span>
          </button>
        </div>
      </aside>
    </>
  );
};
