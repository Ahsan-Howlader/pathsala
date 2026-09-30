import React, { useState } from 'react';
import {
  X,
  Sunrise,
  Moon,
  Crown,
  Flame,
  Zap,
  Award,
  Clock,
  BookCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { UserProfile, UserState } from '../types';
import { evaluateUserBadges, StudyBadge } from '../services/badgeService';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  userState: UserState;
  completedCount: number;
  totalTopicsCount: number;
}

const BADGE_ICONS: Record<StudyBadge['iconName'], React.ComponentType<{ className?: string }>> = {
  Sunrise,
  Moon,
  Crown,
  Flame,
  Zap,
  Award,
  Sparkles,
  BookCheck
};

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  userState,
  completedCount,
  totalTopicsCount
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  if (!isOpen) return null;

  const badges = evaluateUserBadges(userState);
  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked') return b.isUnlocked;
    if (filter === 'locked') return !b.isUnlocked;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Cover Banner */}
        <div className="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 p-6 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
              {user.name.charAt(0) || 'প'}
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {user.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ভেরিফায়েড শিক্ষার্থী</span>
                </span>
              </div>

              <p className="text-xs text-indigo-200 font-mono">{user.email}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                  <span>টার্গেট: {user.targetExam}</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-amber-300 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>{unlockedCount}/{badges.length}টি ব্যাজ অর্জিত</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">মোট অধ্যয়ন</div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {userState.studyMinutes}m
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">স্টাডি স্ট্রিক</div>
            <div className="text-base font-bold font-mono text-amber-500 mt-0.5">
              {userState.challengeStreak} দিন
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">টপিক সম্পন্ন</div>
            <div className="text-base font-bold font-mono text-emerald-500 mt-0.5">
              {completedCount}/{totalTopicsCount}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">কুইজ পয়েন্ট</div>
            <div className="text-base font-bold font-mono text-indigo-500 mt-0.5">
              {userState.challengeScore} pts
            </div>
          </div>
        </div>

        {/* Badges Filter & List Section */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>অধ্যয়ন ব্যাজ ও সম্মাননা (Study Badges)</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                দৈনিক অধ্যয়ন লগ ও ধারাবাহিকতার ওপর ভিত্তি করে অর্জিত বিশেষ ব্যাজসমূহ
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                সবগুলো ({badges.length})
              </button>
              <button
                onClick={() => setFilter('unlocked')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filter === 'unlocked'
                    ? 'bg-white dark:bg-slate-900 font-bold text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                অর্জিত ({unlockedCount})
              </button>
              <button
                onClick={() => setFilter('locked')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filter === 'locked'
                    ? 'bg-white dark:bg-slate-900 font-bold text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                চলমান ({badges.length - unlockedCount})
              </button>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredBadges.map((badge) => {
              const Icon = BADGE_ICONS[badge.iconName] || Award;

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                    badge.isUnlocked
                      ? `${badge.colorScheme.bg} ${badge.colorScheme.border} shadow-sm ring-1 ring-white/10`
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-85'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Badge Icon Emblem */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform ${
                        badge.isUnlocked
                          ? `bg-gradient-to-tr ${badge.colorScheme.gradient} text-white shadow-md scale-100`
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {badge.name}
                        </h5>

                        {badge.isUnlocked ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>অর্জিত</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1 shrink-0">
                            <Lock className="w-3 h-3" />
                            <span>{badge.progressPercent}%</span>
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {badge.nameBn}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed line-clamp-2">
                        {badge.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mt-2.5 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>
                            {badge.currentValue} / {badge.targetValue} {badge.unit}
                          </span>
                          <span>{badge.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700/80 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              badge.isUnlocked
                                ? `bg-gradient-to-r ${badge.colorScheme.gradient}`
                                : 'bg-slate-400 dark:bg-slate-500'
                            }`}
                            style={{ width: `${Math.max(4, badge.progressPercent)}%` }}
                          ></div>
                        </div>
                      </div>

                      {badge.isUnlocked && (
                        <div className="mt-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{badge.unlockedHint}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            প্রতিদিন অধ্যয়ন চালিয়ে যান এবং সবগুলো ব্যাজ আনলক করুন!
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs transition-colors hover:opacity-90"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProfileBadgesInlineCard: React.FC<{
  user: UserProfile;
  userState: UserState;
  onOpenProfile: () => void;
}> = ({ user, userState, onOpenProfile }) => {
  const badges = evaluateUserBadges(userState);
  const unlockedBadges = badges.filter((b) => b.isUnlocked);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
            {user.name.charAt(0) || 'প'}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{user.name}-এর স্টাডি প্রোফাইল ও ব্যাজ</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                {unlockedBadges.length}/{badges.length} অর্জিত
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              টার্গেট: <strong className="text-slate-700 dark:text-slate-300 font-medium">{user.targetExam}</strong> · অধ্যয়ন মিনিট ও ধারাবাহিকতার ভিত্তিতে অর্জিত কৃতিত্ব
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenProfile}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5" />
          <span>সকল ব্যাজ দেখুন</span>
        </button>
      </div>

      {/* Featured Badges Horizontal Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {badges.map((badge) => {
          const Icon = BADGE_ICONS[badge.iconName] || Award;

          return (
            <div
              key={badge.id}
              onClick={onOpenProfile}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer hover:scale-[1.02] ${
                badge.isUnlocked
                  ? `${badge.colorScheme.bg} ${badge.colorScheme.border} shadow-xs`
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div
                className={`w-9 h-9 mx-auto rounded-xl flex items-center justify-center shadow-xs mb-2 ${
                  badge.isUnlocked
                    ? `bg-gradient-to-tr ${badge.colorScheme.gradient} text-white`
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {badge.name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {badge.nameBn}
              </div>

              <div className="mt-1.5">
                {badge.isUnlocked ? (
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                    ✓ অর্জিত
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-slate-400">
                    {badge.progressPercent}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
