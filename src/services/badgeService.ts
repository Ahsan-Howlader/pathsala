import { UserState } from '../types';

export interface StudyBadge {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  category: 'timing' | 'consistency' | 'milestone' | 'retention';
  iconName: 'Sunrise' | 'Moon' | 'Crown' | 'Flame' | 'Zap' | 'Award' | 'Sparkles' | 'BookCheck';
  isUnlocked: boolean;
  progressPercent: number;
  currentValue: number;
  targetValue: number;
  unit: string;
  unlockedHint: string;
  colorScheme: {
    gradient: string;
    border: string;
    text: string;
    glow: string;
    bg: string;
  };
}

export function evaluateUserBadges(userState: UserState): StudyBadge[] {
  const dailyLog = userState.dailyStudyLog || {};
  const activeDaysCount = Object.values(dailyLog).filter((m) => m > 0).length;
  const maxDayMinutes = Math.max(0, ...Object.values(dailyLog));

  const morningMinutes = userState.timeSlotMinutes?.morning || 0;
  const nightMinutes = userState.timeSlotMinutes?.night || 0;
  const streakDays = userState.challengeStreak || 0;
  const totalMinutes = userState.studyMinutes || 0;
  const score = userState.challengeScore || 0;

  // 1. Early Bird Badge
  const earlyBirdTarget = 60;
  const earlyBirdUnlocked = morningMinutes >= earlyBirdTarget;
  const earlyBirdProgress = Math.min(100, Math.round((morningMinutes / earlyBirdTarget) * 100));

  // 2. Night Owl Badge
  const nightOwlTarget = 60;
  const nightOwlUnlocked = nightMinutes >= nightOwlTarget;
  const nightOwlProgress = Math.min(100, Math.round((nightMinutes / nightOwlTarget) * 100));

  // 3. Consistency King Badge
  const consistencyTarget = 5;
  const consistencyScore = Math.max(activeDaysCount, streakDays);
  const consistencyUnlocked = consistencyScore >= consistencyTarget;
  const consistencyProgress = Math.min(100, Math.round((consistencyScore / consistencyTarget) * 100));

  // 4. Study Marathoner (90+ min in a single day)
  const marathonTarget = 90;
  const marathonUnlocked = maxDayMinutes >= marathonTarget;
  const marathonProgress = Math.min(100, Math.round((maxDayMinutes / marathonTarget) * 100));

  // 5. Centurion (300+ total minutes studied)
  const centurionTarget = 300;
  const centurionUnlocked = totalMinutes >= centurionTarget;
  const centurionProgress = Math.min(100, Math.round((totalMinutes / centurionTarget) * 100));

  // 6. Quiz Gladiator (100+ challenge points)
  const quizTarget = 100;
  const quizUnlocked = score >= quizTarget;
  const quizProgress = Math.min(100, Math.round((score / quizTarget) * 100));

  return [
    {
      id: 'early-bird',
      name: 'Early Bird',
      nameBn: 'ভোরের পাখি',
      description: 'ভোর বা সকালের নির্মল সময়ে অন্তত ৬০ মিনিট একাগ্রভাবে পড়ার কৃতিত্ব।',
      category: 'timing',
      iconName: 'Sunrise',
      isUnlocked: earlyBirdUnlocked,
      progressPercent: earlyBirdProgress,
      currentValue: morningMinutes,
      targetValue: earlyBirdTarget,
      unit: 'মিনিট',
      unlockedHint: 'সকালে সর্বোচ্চ মনোযোগ ধরে রেখেছেন!',
      colorScheme: {
        gradient: 'from-amber-500 to-orange-500',
        border: 'border-amber-400 dark:border-amber-600',
        text: 'text-amber-600 dark:text-amber-400',
        glow: 'shadow-amber-500/20',
        bg: 'bg-amber-50 dark:bg-amber-950/40'
      }
    },
    {
      id: 'night-owl',
      name: 'Night Owl',
      nameBn: 'রাতের পেঁচা',
      description: 'গভীর রাতে নিস্তব্ধ পরিবেশে একাগ্র হয়ে অন্তত ৬০ মিনিট পড়ার কৃতিত্ব।',
      category: 'timing',
      iconName: 'Moon',
      isUnlocked: nightOwlUnlocked,
      progressPercent: nightOwlProgress,
      currentValue: nightMinutes,
      targetValue: nightOwlTarget,
      unit: 'মিনিট',
      unlockedHint: 'নিস্তব্ধ রাতের গভীর ফোকাস অর্জন করেছেন!',
      colorScheme: {
        gradient: 'from-indigo-600 to-violet-700',
        border: 'border-indigo-400 dark:border-indigo-600',
        text: 'text-indigo-600 dark:text-indigo-400',
        glow: 'shadow-indigo-500/20',
        bg: 'bg-indigo-50 dark:bg-indigo-950/40'
      }
    },
    {
      id: 'consistency-king',
      name: 'Consistency King',
      nameBn: 'ধারাবাহিকতার রাজা',
      description: 'টানা ৫ দিন বা তার বেশি নিয়মিত অধ্যয়ন করে অটুট শৃঙ্খলা রক্ষা করার কৃতিত্ব।',
      category: 'consistency',
      iconName: 'Crown',
      isUnlocked: consistencyUnlocked,
      progressPercent: consistencyProgress,
      currentValue: consistencyScore,
      targetValue: consistencyTarget,
      unit: 'দিন',
      unlockedHint: 'নিয়মানুবর্তিতার শীর্ষস্থান অধিকার করেছেন!',
      colorScheme: {
        gradient: 'from-emerald-500 to-teal-600',
        border: 'border-emerald-400 dark:border-emerald-600',
        text: 'text-emerald-600 dark:text-emerald-400',
        glow: 'shadow-emerald-500/20',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40'
      }
    },
    {
      id: 'study-marathoner',
      name: 'Study Marathoner',
      nameBn: 'স্টাডি ম্যারাথনার',
      description: 'একদিনে অন্তত ৯০ মিনিট অধ্যয়ন করে দীর্ঘস্থায়ী ফোকাস প্রদর্শনের কৃতিত্ব।',
      category: 'milestone',
      iconName: 'Zap',
      isUnlocked: marathonUnlocked,
      progressPercent: marathonProgress,
      currentValue: maxDayMinutes,
      targetValue: marathonTarget,
      unit: 'মিনিট',
      unlockedHint: 'এক সেশনেই উচ্চ ধৈর্য্যের প্রমাণ দিয়েছেন!',
      colorScheme: {
        gradient: 'from-rose-500 to-red-600',
        border: 'border-rose-400 dark:border-rose-600',
        text: 'text-rose-600 dark:text-rose-400',
        glow: 'shadow-rose-500/20',
        bg: 'bg-rose-50 dark:bg-rose-950/40'
      }
    },
    {
      id: 'centurion',
      name: 'Centurion Scholar',
      nameBn: 'সেঞ্চুরিয়ান স্কলার',
      description: 'পাঠশালায় মোট ৩০০ মিনিটের বেশি একাগ্র অধ্যয়ন সমাপ্ত করার কৃতিত্ব।',
      category: 'milestone',
      iconName: 'Flame',
      isUnlocked: centurionUnlocked,
      progressPercent: centurionProgress,
      currentValue: totalMinutes,
      targetValue: centurionTarget,
      unit: 'মিনিট',
      unlockedHint: '৩০০+ মিনিট জ্ঞান অর্জনের মাইলফলক!',
      colorScheme: {
        gradient: 'from-amber-600 to-yellow-500',
        border: 'border-yellow-400 dark:border-yellow-600',
        text: 'text-yellow-700 dark:text-yellow-400',
        glow: 'shadow-yellow-500/20',
        bg: 'bg-yellow-50 dark:bg-yellow-950/40'
      }
    },
    {
      id: 'quiz-gladiator',
      name: 'Quiz Gladiator',
      nameBn: 'কুইজ গ্ল্যাডিয়েটর',
      description: 'ডেইলি চ্যালেঞ্জ ও মক টেস্টে ১০০+ পয়েন্ট অর্জন করে মেধার শ্রেষ্ঠত্ব প্রমাণ।',
      category: 'retention',
      iconName: 'Award',
      isUnlocked: quizUnlocked,
      progressPercent: quizProgress,
      currentValue: score,
      targetValue: quizTarget,
      unit: 'পয়েন্ট',
      unlockedHint: 'কুইজ ও চ্যালেঞ্জে ১০০+ পয়েন্ট বিজয়ী!',
      colorScheme: {
        gradient: 'from-purple-600 to-fuchsia-600',
        border: 'border-purple-400 dark:border-purple-600',
        text: 'text-purple-600 dark:text-purple-400',
        glow: 'shadow-purple-500/20',
        bg: 'bg-purple-50 dark:bg-purple-950/40'
      }
    }
  ];
}
