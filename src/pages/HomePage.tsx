import React from 'react';
import {
  Clock,
  CheckCircle2,
  Flame,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Lightbulb,
  FileCheck2,
  Mic,
  Headphones,
  BookOpen,
  Calendar
} from 'lucide-react';
import { PageId, UserProfile, UserState } from '../types';
import { CURRENT_AFFAIRS_DATA } from '../data/studyData';
import { ProfileBadgesInlineCard } from '../components/UserProfileModal';

interface HomePageProps {
  user: UserProfile;
  userState: UserState;
  totalTopicsCount: number;
  completedCount: number;
  onNavigate: (page: PageId) => void;
  onOpenProfile?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  userState,
  totalTopicsCount,
  completedCount,
  onNavigate,
  onOpenProfile = () => {}
}) => {
  const progressPercent = totalTopicsCount > 0 ? Math.round((completedCount / totalTopicsCount) * 100) : 0;
  const latestGK = CURRENT_AFFAIRS_DATA[0];
  const dueRevisions = userState.revisionQueue.filter((item) => {
    const today = new Date().toISOString().split('T')[0];
    return item.nextReviewDate <= today;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-2xl">
          <div className="text-xs uppercase tracking-wider text-indigo-200 font-semibold mb-1">
            সরকারি চাকরি প্রস্তুতি স্টাডি রুম
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            স্বাগতম, {user.name}! 👋
          </h2>
          <p className="mt-2 text-sm sm:text-base text-indigo-100 leading-relaxed">
            টার্গেট: <strong className="text-white">{user.targetExam}</strong>। নিয়মিত অধ্যবসায়, সাইন্টিফিক রিভিশন এবং স্পষ্ট কনসেপ্টই আপনাকে পৌঁছে দেবে স্বপ্নের ক্যাডারে।
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('conceptExplainer')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs sm:text-sm shadow-sm transition-colors"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>আজকের কনসেপ্ট ক্লিয়ার করুন</span>
            </button>
            <button
              onClick={() => onNavigate('calendar')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/40 hover:bg-indigo-500/60 border border-white/20 text-white font-medium text-xs sm:text-sm transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>স্টাডি ক্যালেন্ডার ও প্ল্যানার</span>
            </button>
            <button
              onClick={() => onNavigate('pomodoro')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 border border-white/10 text-white font-medium text-xs sm:text-sm transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>পমোডোরো</span>
            </button>
          </div>
        </div>

        {/* Subtle geometric circles */}
        <div className="absolute right-0 -bottom-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none blur-xl"></div>
      </div>

      {/* User Profile Badges Showcase Card */}
      <ProfileBadgesInlineCard user={user} userState={userState} onOpenProfile={onOpenProfile} />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Study Time */}
        <div
          onClick={() => onNavigate('calendar')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              অধ্যয়ন সময় ও ক্যালেন্ডার
            </span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {userState.studyMinutes}
            <span className="text-xs font-normal text-slate-500 ml-1">মিনিট</span>
          </div>
          <div className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
            <span>মাসিক ক্যালেন্ডার ভিউ ➔</span>
          </div>
        </div>

        {/* Completed Topics */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">সিলেবাস অগ্রগতি</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {completedCount}
            <span className="text-xs font-normal text-slate-500 ml-1">/ {totalTopicsCount}</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Daily Challenge Points */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">চ্যালেঞ্জ স্কোর</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {userState.challengeScore}
            <span className="text-xs font-normal text-slate-500 ml-1">পয়েন্ট</span>
          </div>
          <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
            <span>{userState.challengeStreak} দিনের সক্রিয় স্ট্রিক</span>
          </div>
        </div>

        {/* Revision Queue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">রিভিশন বাকি</span>
            <RotateCcw className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {dueRevisions.length}
            <span className="text-xs font-normal text-slate-500 ml-1">টপিক</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">স্পেসড রিপিটেশন ফ্রেমওয়ার্ক</div>
        </div>
      </div>

      {/* Live GK Flash Alert */}
      {latestGK && (
        <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                আজকের শীর্ষ লাইভ সাধারণ জ্ঞান আপডেট ({latestGK.date})
              </span>
            </div>
            <button
              onClick={() => onNavigate('current')}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>সকল তথ্য ও কুইজ দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {latestGK.title}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {latestGK.summary}
          </p>
        </div>
      )}

      {/* Quick Feature Action Suite */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            প্রস্তুতির মূল ফিচারসমূহ
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigate('conceptExplainer')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Daily Topic Concept Clarifier
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              কারক, সমাস, শতকরা বা প্রিপজিশন—টপিকের নাম লিখুন, এআই পয়েন্ট আকারে মূল সূত্র, শর্টকাট ও উদাহরণ বুঝিয়ে দেবে।
            </p>
          </div>

          <div
            onClick={() => onNavigate('syllabus')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Syllabus & Video Lessons
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              বাংলা, ইংরেজি, গণিত ও বিজ্ঞানের পূর্ণাঙ্গ সিলেবাস। প্রতিটি টপিকের সাথে সরাসরি ইউটিউব ভিডিও লেসন সংযুক্ত।
            </p>
          </div>

          <div
            onClick={() => onNavigate('exams')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Mock Tests & Interactive OMR
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              টাইমার ও নেগেটিভ মার্কিং সহ বাস্তব মডেল টেস্ট দিন। পরীক্ষা শেষে ব্যাখ্যা সহ ওএমআর উত্তরপত্র যাচাই করুন।
            </p>
          </div>

          <div
            onClick={() => onNavigate('viva')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              AI Viva & Interview Simulator
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              বিসিএস প্রশাসন, পুলিশ, ব্যাংক ও প্রাথমিক শিক্ষক ভাইভা বোর্ডের সম্মুখীন হোন এবং তাৎক্ষণিক স্কোরের ফিডব্যাক নিন।
            </p>
          </div>

          <div
            onClick={() => onNavigate('podcast')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
              <Headphones className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Study Audio Podcast Mode
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              বাসে চলাচলের সময় বা বিশ্রামে অডিও শুনে সংবিধান, মুক্তিযুদ্ধ ও ব্যাকরণের মূল পয়েন্টগুলো রিভিশন করুন।
            </p>
          </div>

          <div
            onClick={() => onNavigate('challenge')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer transition-all hover:shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Daily Challenge Arena
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              আজকের দৈনিক কুইজ সমাধান করে স্ট্রিক বজায় রাখুন। ভুল প্রশ্নগুলো স্বয়ংক্রিয়ভাবে আপনার ভুল খাতায় যুক্ত হবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
