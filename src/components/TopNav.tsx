import React from 'react';
import { Menu, Lightbulb, Flame, Clock, BookCheck } from 'lucide-react';
import { PageId, UserProfile, UserState } from '../types';

interface TopNavProps {
  currentPage: PageId;
  onOpenMobileMenu: () => void;
  onNavigate: (page: PageId) => void;
  user: UserProfile;
  userState: UserState;
  totalTopicsCount: number;
  completedCount: number;
}

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  home: { title: 'ড্যাশবোর্ড ও স্টাডি স্পেস', subtitle: 'আপনার সরকারি চাকরি প্রস্তুতি হাব' },
  conceptExplainer: { title: 'AI Concept Clarifier', subtitle: 'যেকোনো কঠিন টপিকের স্পষ্ট ব্যাখ্যা ও শর্টকাট' },
  pomodoro: { title: 'Pomodoro Study Timer', subtitle: 'ফোকাসড স্টাডি সেশন ও অ্যাম্বিয়েন্ট ব্যাকগ্রাউন্ড' },
  tutor: { title: 'AI Private Tutor', subtitle: 'বিসিএস ও ব্যাংক পরীক্ষার ২৪/৭ স্টাডি পার্টনার' },
  syllabus: { title: 'Syllabus & Video Lessons', subtitle: 'টপিকভিত্তিক সিলেবাস ও ইউটিউব ক্লাস' },
  current: { title: 'AI Live GK & Affairs', subtitle: 'সাম্প্রতিক তথ্য ও বাংলাদেশ-আন্তর্জাতিক সাধারণ জ্ঞান' },
  viva: { title: 'AI Viva Simulator', subtitle: 'ক্যাডারভিত্তিক মৌখিক পরীক্ষা ও তাৎক্ষণিক মূল্যায়ন' },
  podcast: { title: 'Audio Podcast Mode', subtitle: 'হাতে সময় কম থাকলে শুনে শুনে প্রস্তুতি নিন' },
  focusRoom: { title: 'Focus World (Live Study)', subtitle: 'অনলাইনে সক্রিয় সহযোদ্ধাদের সাথে প্রস্তুতি' },
  challenge: { title: 'Daily Challenge Arena', subtitle: 'আজকের এমসিকিউ কুইজ ও নেগেটিভ মার্কিং টেস্ট' },
  eligibility: { title: 'Job Eligibility Checker', subtitle: 'বয়স ও যোগ্যতা অনুযায়ী চাকরির সুযোগ যাচাই' },
  exams: { title: 'Mock Tests & OMR', subtitle: 'পূর্ণাঙ্গ মডেল টেস্ট ও ওএমআর শিট সমাধান' },
  revision: { title: 'Spaced Revision Queue', subtitle: 'ভুলে যাওয়ার প্রবণতা ঠেকাতে সাইন্টিফিক রিভিশন' },
  errors: { title: 'Error Log (ভুল খাতা)', subtitle: 'ভুল হওয়া প্রশ্নসমূহ একনজরে রিভিশন দিন' },
  settings: { title: 'Cloud Sync & Settings', subtitle: 'গুগল শিট ব্যাকআপ ও কনফিগারেশন' }
};

export const TopNav: React.FC<TopNavProps> = ({
  currentPage,
  onOpenMobileMenu,
  onNavigate,
  user,
  userState,
  totalTopicsCount,
  completedCount
}) => {
  const currentInfo = PAGE_TITLES[currentPage] || { title: 'পাঠশালা', subtitle: 'স্টাডি পোর্টাল' };
  const dueRevisions = userState.revisionQueue.filter((item) => {
    const today = new Date().toISOString().split('T')[0];
    return item.nextReviewDate <= today;
  }).length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left Brand / Current Page Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 lg:hidden"
            aria-label="মেনু খুলুন"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {currentInfo.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Center: Unboxed metadata metrics */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300 font-semibold">{userState.studyMinutes}m</span>
            <span>অধ্যয়ন</span>
          </div>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <BookCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300 font-semibold">{completedCount}/{totalTopicsCount}</span>
            <span>টপিক সম্পন্ন</span>
          </div>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300 font-semibold">{userState.challengeStreak}</span>
            <span>দিন স্ট্রিক</span>
          </div>
          {dueRevisions > 0 && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <button
                onClick={() => onNavigate('revision')}
                className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
              >
                {dueRevisions}টি রিভিশন বাকি
              </button>
            </>
          )}
        </div>

        {/* Right Zone: Primary Action */}
        <div className="flex items-center gap-2">
          {currentPage !== 'conceptExplainer' && (
            <button
              onClick={() => onNavigate('conceptExplainer')}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>আজকের পড়া ক্লিয়ার করুন</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
