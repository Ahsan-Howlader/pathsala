import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  CheckCircle2,
  Plus,
  Flame,
  Lightbulb,
  BookOpen,
  CalendarDays,
  Sparkles,
  Target,
  BarChart3,
  Edit3,
  Check,
  Sunrise,
  SunMedium,
  Sunset,
  Moon,
  TrendingUp,
  Zap,
  Award,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  X,
  CalendarCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from 'recharts';
import { UserState, RevisionItem, UserProfile } from '../types';
import { ALL_SYLLABUS_TOPICS } from '../data/syllabusData';
import { soundEffects } from '../services/soundEffects';

interface StudyCalendarPageProps {
  userState: UserState;
  onAdvanceRevision: (item: RevisionItem) => void;
  onAddStudyMinutes: (mins: number, dateStr?: string) => void;
  onScheduleRevision: (subject: string, topic: string, dateStr: string) => void;
  onClarifyConcept: (subject: string, topic: string) => void;
  user?: UserProfile;
}

const MONTH_NAMES_BN = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
];

const WEEKDAYS_BN = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

export const StudyCalendarPage: React.FC<StudyCalendarPageProps> = ({
  userState,
  onAdvanceRevision,
  onAddStudyMinutes,
  onScheduleRevision,
  onClarifyConcept,
  user
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const todayStr = today.toISOString().split('T')[0];
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  // Manual logging modal / inline form state
  const [isAddingTime, setIsAddingTime] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(30);
  const [isSchedulingTask, setIsSchedulingTask] = useState(false);
  const [selectedScheduleTopic, setSelectedScheduleTopic] = useState(ALL_SYLLABUS_TOPICS[0].topicName);

  // Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportScope, setExportScope] = useState<'month' | 'all'>('month');

  // Monthly Study Goal in minutes (persisted in localStorage)
  const [monthlyGoalMinutes, setMonthlyGoalMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('pathsala_monthly_goal_minutes');
    if (saved) return Math.max(60, parseInt(saved, 10));
    const oldHours = localStorage.getItem('pathsala_monthly_goal_hours');
    if (oldHours) return Math.max(1, parseInt(oldHours, 10)) * 60;
    return 1500; // default 1500 mins (25 hours)
  });

  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [customGoalInput, setCustomGoalInput] = useState<number>(monthlyGoalMinutes);

  const handleUpdateGoalMinutes = (newMinutes: number) => {
    const valid = Math.max(60, newMinutes);
    setMonthlyGoalMinutes(valid);
    setCustomGoalInput(valid);
    localStorage.setItem('pathsala_monthly_goal_minutes', String(valid));
    setIsEditingGoal(false);
    soundEffects.playBeep(650, 0.08);
  };

  // Derive daily logs mapping
  // If dailyStudyLog is missing or sparse, guarantee today's studyMinutes are mapped to todayStr
  const dailyLog: Record<string, number> = { ...(userState.dailyStudyLog || {}) };
  if (!dailyLog[todayStr] && userState.todayMinutes > 0) {
    dailyLog[todayStr] = userState.todayMinutes;
  } else if (!dailyLog[todayStr] && userState.studyMinutes > 0) {
    dailyLog[todayStr] = userState.studyMinutes;
  }

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDateStr(todayStr);
  };

  // Calendar math
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 for Sunday
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Calendar days grid array
  const calendarCells: {
    dayNumber: number;
    dateStr: string;
    isCurrentMonth: boolean;
    isToday: boolean;
  }[] = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({
      dayNumber: day,
      dateStr: dStr,
      isCurrentMonth: false,
      isToday: dStr === todayStr
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({
      dayNumber: day,
      dateStr: dStr,
      isCurrentMonth: true,
      isToday: dStr === todayStr
    });
  }

  // Next month leading days to complete 35 or 42 grid
  const remainingCells = 42 - calendarCells.length;
  if (remainingCells > 0 && remainingCells < 7) {
    for (let day = 1; day <= remainingCells; day++) {
      const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      calendarCells.push({
        dayNumber: day,
        dateStr: dStr,
        isCurrentMonth: false,
        isToday: dStr === todayStr
      });
    }
  }

  // Month Statistics Calculation directly from userState.dailyStudyLog
  const monthKeyPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  let monthStudyMinutes = 0;
  let activeStudyDaysCount = 0;
  let monthRevisionTasksCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${monthKeyPrefix}-${String(day).padStart(2, '0')}`;
    const mins = dailyLog[dStr] || 0;
    if (mins > 0) {
      monthStudyMinutes += mins;
      activeStudyDaysCount++;
    }
    const tasksForDay = userState.revisionQueue.filter((r) => r.nextReviewDate === dStr);
    monthRevisionTasksCount += tasksForDay.length;
  }

  const monthTotalStudyHours = Number((monthStudyMinutes / 60).toFixed(1));
  const monthlyGoalHours = Number((monthlyGoalMinutes / 60).toFixed(1));
  const goalPercent = Math.min(100, Math.round((monthStudyMinutes / monthlyGoalMinutes) * 100));
  const remainingGoalMinutes = Math.max(0, monthlyGoalMinutes - monthStudyMinutes);
  const remainingGoalHours = Number((remainingGoalMinutes / 60).toFixed(1));
  const avgMinutesPerActiveDay = activeStudyDaysCount > 0 ? Math.round(monthStudyMinutes / activeStudyDaysCount) : 0;

  // Days remaining in month
  const isCurrentViewingMonth = currentYear === today.getFullYear() && currentMonth === today.getMonth();
  const currentDayOfMonth = today.getDate();
  const daysLeftInMonth = isCurrentViewingMonth ? Math.max(1, daysInMonth - currentDayOfMonth) : daysInMonth;
  const dailyNeededMinutes = remainingGoalMinutes > 0 ? Math.round(remainingGoalMinutes / daysLeftInMonth) : 0;

  // Radial Gauge Data for Recharts
  const radialGaugeData = [
    {
      name: 'অধ্যয়ন প্রগ্রেস',
      value: Math.min(monthlyGoalMinutes, monthStudyMinutes),
      fill: goalPercent >= 100 ? '#10b981' : goalPercent >= 60 ? '#6366f1' : '#0284c7'
    }
  ];

  // Selected Date breakdown
  const selectedDayMinutes = dailyLog[selectedDateStr] || 0;
  const selectedDayRevisions = userState.revisionQueue.filter((r) => r.nextReviewDate === selectedDateStr);

  // Last 7 Days study data for Recharts Bar Chart
  const last7DaysData: {
    dateStr: string;
    dayLabel: string;
    dateLabel: string;
    minutes: number;
    hours: number;
    isToday: boolean;
  }[] = [];

  let last7DaysTotalMinutes = 0;
  let last7DaysActiveDays = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    const dayOfWeek = WEEKDAYS_BN[d.getDay()];
    const mins = dailyLog[dStr] || 0;
    last7DaysTotalMinutes += mins;
    if (mins > 0) last7DaysActiveDays++;

    const isTodayItem = dStr === todayStr;
    const formattedShortDate = `${d.getDate()} ${MONTH_NAMES_BN[d.getMonth()].slice(0, 3)}`;

    last7DaysData.push({
      dateStr: dStr,
      dayLabel: isTodayItem ? 'আজ' : dayOfWeek,
      dateLabel: formattedShortDate,
      minutes: mins,
      hours: Number((mins / 60).toFixed(1)),
      isToday: isTodayItem
    });
  }

  const last7DaysTotalHours = Number((last7DaysTotalMinutes / 60).toFixed(1));
  const last7DaysAvgMinutes = Math.round(last7DaysTotalMinutes / 7);

  // Study Insights: Time of Day Productivity Analysis
  const rawSlots = userState.timeSlotMinutes || {
    morning: 160,
    afternoon: 40,
    evening: 120,
    night: 60
  };

  const totalSlotMinutes =
    (rawSlots.morning || 0) +
    (rawSlots.afternoon || 0) +
    (rawSlots.evening || 0) +
    (rawSlots.night || 0) || 1;

  const timeSlotsAnalysis = [
    {
      id: 'morning',
      title: 'ভোর ও সকাল',
      timeRange: '০৫:০০ - ১১:৫৯',
      minutes: rawSlots.morning || 0,
      hours: Number(((rawSlots.morning || 0) / 60).toFixed(1)),
      percentage: Math.round(((rawSlots.morning || 0) / totalSlotMinutes) * 100),
      icon: Sunrise,
      color: 'amber',
      accentColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
      barColor: 'bg-amber-500',
      tag: 'সর্বোচ্চ মনোযোগ',
      recommendedFor: 'বাংলা ব্যাকরণ, সাধারণ জ্ঞান, কঠিন পরিভাষা ও ইংরেজি ভোকাবুলারি'
    },
    {
      id: 'afternoon',
      title: 'দুপুর ও বিকাল',
      timeRange: '১২:০০ - ১৬:৫৯',
      minutes: rawSlots.afternoon || 0,
      hours: Number(((rawSlots.afternoon || 0) / 60).toFixed(1)),
      percentage: Math.round(((rawSlots.afternoon || 0) / totalSlotMinutes) * 100),
      icon: SunMedium,
      color: 'sky',
      accentColor: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60',
      barColor: 'bg-sky-500',
      tag: 'অ্যাক্টিভ প্র্যাকটিস',
      recommendedFor: 'গাণিতিক যুক্তি, মানসিক দক্ষতা ও শর্ট পমোডোরো সেশন'
    },
    {
      id: 'evening',
      title: 'সন্ধ্যা ও প্রথম রাত',
      timeRange: '১৭:০০ - ২১:৫৯',
      minutes: rawSlots.evening || 0,
      hours: Number(((rawSlots.evening || 0) / 60).toFixed(1)),
      percentage: Math.round(((rawSlots.evening || 0) / totalSlotMinutes) * 100),
      icon: Sunset,
      color: 'indigo',
      accentColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60',
      barColor: 'bg-indigo-600',
      tag: 'অ্যাক্টিভ রিকল',
      recommendedFor: 'স্পেসড রিভিশন কিউ, এমসিকিউ কুইজ ও ভুল খাতা পর্যবেক্ষণ'
    },
    {
      id: 'night',
      title: 'গভীর রাত',
      timeRange: '২২:০০ - ০৪:৫৯',
      minutes: rawSlots.night || 0,
      hours: Number(((rawSlots.night || 0) / 60).toFixed(1)),
      percentage: Math.round(((rawSlots.night || 0) / totalSlotMinutes) * 100),
      icon: Moon,
      color: 'violet',
      accentColor: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800/60',
      barColor: 'bg-violet-600',
      tag: 'ডিপ ফোকাস',
      recommendedFor: 'AI Concept Clarifier, জটিল সূত্র বিশ্লেষণ ও সামারি রিভিশন'
    }
  ];

  // Identify peak slot (slot with highest minutes)
  const peakSlot = [...timeSlotsAnalysis].sort((a, b) => b.minutes - a.minutes)[0];

  // Identify Most Productive Day of the week from dailyLog
  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
  const FULL_WEEKDAYS_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

  Object.entries(dailyLog).forEach(([dateStr, mins]) => {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime()) && mins > 0) {
      const dayIdx = d.getDay();
      weekdayTotals[dayIdx] += mins;
      weekdayCounts[dayIdx]++;
    }
  });

  let bestDayIndex = 6; // default Saturday
  let maxWeekdayMinutes = 0;
  weekdayTotals.forEach((tot, idx) => {
    if (tot > maxWeekdayMinutes) {
      maxWeekdayMinutes = tot;
      bestDayIndex = idx;
    }
  });
  const bestDayName = FULL_WEEKDAYS_BN[bestDayIndex];

  // Export Daily Study Log as CSV
  const handleExportCSV = (scope: 'month' | 'all' = exportScope) => {
    const rows: Array<{
      dateStr: string;
      dayBn: string;
      minutes: number;
      hours: string;
      tasksCount: number;
      status: string;
    }> = [];

    if (scope === 'month') {
      for (let day = 1; day <= daysInMonth; day++) {
        const dStr = `${monthKeyPrefix}-${String(day).padStart(2, '0')}`;
        const d = new Date(currentYear, currentMonth, day);
        const dayBn = FULL_WEEKDAYS_BN[d.getDay()];
        const mins = dailyLog[dStr] || 0;
        const tasksCount = userState.revisionQueue.filter((r) => r.nextReviewDate === dStr).length;
        rows.push({
          dateStr: dStr,
          dayBn,
          minutes: mins,
          hours: (mins / 60).toFixed(1),
          tasksCount,
          status: mins > 0 ? 'অধ্যয়ন সম্পন্ন' : 'বিরতি'
        });
      }
    } else {
      const allDates = Array.from(
        new Set([
          ...Object.keys(dailyLog),
          ...userState.revisionQueue.map((r) => r.nextReviewDate)
        ])
      ).sort();

      allDates.forEach((dStr) => {
        const d = new Date(dStr);
        const dayBn = isNaN(d.getTime()) ? '' : FULL_WEEKDAYS_BN[d.getDay()];
        const mins = dailyLog[dStr] || 0;
        const tasksCount = userState.revisionQueue.filter((r) => r.nextReviewDate === dStr).length;
        rows.push({
          dateStr: dStr,
          dayBn,
          minutes: mins,
          hours: (mins / 60).toFixed(1),
          tasksCount,
          status: mins > 0 ? 'অধ্যয়ন সম্পন্ন' : 'বিরতি'
        });
      });
    }

    let csvContent = '\uFEFFতারিখ,বার,অধ্যয়ন সময় (মিনিট),অধ্যয়ন সময় (ঘণ্টা),ধারাবাহিকতা স্ট্যাটাস,রিভিশন টাস্ক সংখ্যা\r\n';
    rows.forEach((r) => {
      csvContent += `"${r.dateStr}","${r.dayBn}",${r.minutes},${r.hours},"${r.status}",${r.tasksCount}\r\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const fileName =
      scope === 'month'
        ? `Pathsala_Study_Log_${currentYear}_${String(currentMonth + 1).padStart(2, '0')}.csv`
        : `Pathsala_Study_Log_All_Records.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    soundEffects.playSuccess();
    setIsExportModalOpen(false);
  };

  // Export Daily Study Log as PDF (Printable Report via hidden iframe)
  const handleExportPDF = (scope: 'month' | 'all' = exportScope) => {
    const printTitle =
      scope === 'month'
        ? `${MONTH_NAMES_BN[currentMonth]} ${currentYear}`
        : 'সম্পূর্ণ স্টাডি হিস্ট্রি';

    const rows: Array<{
      dateStr: string;
      dayBn: string;
      minutes: number;
      hours: string;
      tasksCount: number;
      status: string;
    }> = [];

    let totalMins = 0;
    let activeDays = 0;
    let totalTasks = 0;

    if (scope === 'month') {
      for (let day = 1; day <= daysInMonth; day++) {
        const dStr = `${monthKeyPrefix}-${String(day).padStart(2, '0')}`;
        const d = new Date(currentYear, currentMonth, day);
        const dayBn = FULL_WEEKDAYS_BN[d.getDay()];
        const mins = dailyLog[dStr] || 0;
        const tasksCount = userState.revisionQueue.filter((r) => r.nextReviewDate === dStr).length;
        totalMins += mins;
        if (mins > 0) activeDays++;
        totalTasks += tasksCount;
        rows.push({
          dateStr: dStr,
          dayBn,
          minutes: mins,
          hours: (mins / 60).toFixed(1),
          tasksCount,
          status: mins > 0 ? 'অধ্যয়ন সম্পন্ন' : '—'
        });
      }
    } else {
      const allDates = Array.from(
        new Set([
          ...Object.keys(dailyLog),
          ...userState.revisionQueue.map((r) => r.nextReviewDate)
        ])
      ).sort();

      allDates.forEach((dStr) => {
        const d = new Date(dStr);
        const dayBn = isNaN(d.getTime()) ? '' : FULL_WEEKDAYS_BN[d.getDay()];
        const mins = dailyLog[dStr] || 0;
        const tasksCount = userState.revisionQueue.filter((r) => r.nextReviewDate === dStr).length;
        totalMins += mins;
        if (mins > 0) activeDays++;
        totalTasks += tasksCount;
        rows.push({
          dateStr: dStr,
          dayBn,
          minutes: mins,
          hours: (mins / 60).toFixed(1),
          tasksCount,
          status: mins > 0 ? 'অধ্যয়ন সম্পন্ন' : '—'
        });
      });
    }

    const avgMins = activeDays > 0 ? Math.round(totalMins / activeDays) : 0;
    const totalHours = (totalMins / 60).toFixed(1);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>পাঠশালা — দৈনিক অধ্যয়ন লগ ও পারফরম্যান্স রিপোর্ট (${printTitle})</title>
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif; padding: 24px; color: #0f172a; background: #fff; line-height: 1.5; }
          .header { border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 20px; font-weight: bold; color: #1e1b4b; }
          .subtitle { font-size: 13px; color: #4338ca; margin-top: 4px; font-weight: 600; }
          .meta { font-size: 11px; color: #475569; text-align: right; line-height: 1.4; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
          .stat-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; text-align: center; }
          .stat-val { font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 2px; }
          .stat-lbl { font-size: 11px; color: #64748b; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #4f46e5; color: white; padding: 8px 10px; text-align: left; font-weight: 600; }
          td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) { background: #f8fafc; }
          .active-badge { color: #047857; font-weight: 600; }
          .inactive { color: #94a3b8; }
          .footer { margin-top: 24px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 10px; color: #64748b; display: flex; justify-content: space-between; }
          @media print {
            body { padding: 0; }
            @page { margin: 1cm; size: A4 portrait; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">পাঠশালা — দৈনিক অধ্যয়ন লগ ও পারফরম্যান্স রিপোর্ট</div>
            <div class="subtitle">সময়কাল: ${printTitle}</div>
          </div>
          <div class="meta">
            <div>শিক্ষার্থী: <strong>${user?.name || 'ক্যান্ডিডেট'}</strong></div>
            <div>টার্গেট: ${user?.targetExam || '৪৭তম বিসিএস / ব্যাংক'}</div>
            <div>প্রিন্ট তারিখ: ${new Date().toLocaleDateString('bn-BD')}</div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-lbl">মোট অধ্যয়ন সময়</div>
            <div class="stat-val">${totalMins} মি (${totalHours}h)</div>
          </div>
          <div class="stat-card">
            <div class="stat-lbl">সক্রিয় পড়ার দিন</div>
            <div class="stat-val">${activeDays} দিন</div>
          </div>
          <div class="stat-card">
            <div class="stat-lbl">দৈনিক গড় অধ্যয়ন</div>
            <div class="stat-val">${avgMins} মি/দিন</div>
          </div>
          <div class="stat-card">
            <div class="stat-lbl">রিভিশন টাস্ক সম্পন্ন</div>
            <div class="stat-val">${totalTasks}টি</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>তারিখ</th>
              <th>বার</th>
              <th>অধ্যয়ন সময় (মিনিট)</th>
              <th>ঘণ্টা</th>
              <th>স্ট্যাটাস</th>
              <th>রিভিশন শিডিউল</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `
              <tr>
                <td style="font-family: monospace; font-weight: 600;">${r.dateStr}</td>
                <td>${r.dayBn}</td>
                <td style="font-family: monospace; font-weight: 600;">${r.minutes} মি</td>
                <td style="font-family: monospace;">${r.hours}h</td>
                <td class="${r.minutes > 0 ? 'active-badge' : 'inactive'}">${r.status}</td>
                <td style="font-family: monospace;">${r.tasksCount > 0 ? `${r.tasksCount}টি টাস্ক` : '—'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          <span>পাঠশালা সরকারি চাকরি প্রস্তুতি প্ল্যাটফর্ম · Study Calendar & Planner</span>
          <span>স্বয়ংক্রিয়ভাবে তৈরি ডিজিটাল রেকর্ড কপি</span>
        </div>
      </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }, 400);
    }
    soundEffects.playSuccess();
    setIsExportModalOpen(false);
  };

  // Generate Weekly Study Plan PDF for upcoming 7 days
  const handleExportWeeklyPlanPDF = () => {
    const next7DaysPlan: Array<{
      dateStr: string;
      dayBn: string;
      dateLabel: string;
      isToday: boolean;
      revisions: RevisionItem[];
      suggestedTopics: Array<{
        subject: string;
        topic: string;
        type: string;
      }>;
      targetMinutes: number;
    }> = [];

    // Find uncompleted syllabus topics for suggestion
    const uncompleted = ALL_SYLLABUS_TOPICS.filter(
      (t) => userState.completedTopics[t.key]?.status !== 'Completed'
    );
    const sourceTopics = uncompleted.length > 0 ? uncompleted : ALL_SYLLABUS_TOPICS;

    let totalPlannedRevisions = 0;
    let totalTargetMinutes = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      const dayBn = FULL_WEEKDAYS_BN[d.getDay()];
      const dateLabel = `${d.getDate()} ${MONTH_NAMES_BN[d.getMonth()]} ${d.getFullYear()}`;
      const isTodayItem = i === 0;

      // Revisions due on this date (or overdue if today)
      const dayRevisions = userState.revisionQueue.filter((r) => {
        if (isTodayItem) {
          return r.nextReviewDate <= dStr;
        }
        return r.nextReviewDate === dStr;
      });
      totalPlannedRevisions += dayRevisions.length;

      // Select 1-2 suggested topics rotated by day index
      const topic1 = sourceTopics[(i * 2) % sourceTopics.length];
      const topic2 = sourceTopics[(i * 2 + 1) % sourceTopics.length];
      const suggested = [
        {
          subject: topic1.subjectName,
          topic: topic1.topicName,
          type: 'মূল থিওরি ও কনসেপ্ট ক্লারিফিকেশন'
        },
        {
          subject: topic2.subjectName,
          topic: topic2.topicName,
          type: 'অনুশীলন ও প্রশ্নব্যাংক সমাধান'
        }
      ];

      const targetMinutes = dayRevisions.length > 0 ? 90 : 75;
      totalTargetMinutes += targetMinutes;

      next7DaysPlan.push({
        dateStr: dStr,
        dayBn,
        dateLabel,
        isToday: isTodayItem,
        revisions: dayRevisions,
        suggestedTopics: suggested,
        targetMinutes
      });
    }

    const startDateLabel = next7DaysPlan[0].dateLabel;
    const endDateLabel = next7DaysPlan[6].dateLabel;
    const totalTargetHours = (totalTargetMinutes / 60).toFixed(1);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>সাপ্তাহিক অধ্যয়ন পরিকল্পনা — পাঠশালা (${startDateLabel} - ${endDateLabel})</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif;
            padding: 24px;
            color: #0f172a;
            background: #ffffff;
            line-height: 1.5;
          }
          .header {
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 12px;
            margin-bottom: 18px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .brand-title {
            font-size: 22px;
            font-weight: 800;
            color: #1e1b4b;
            letter-spacing: -0.02em;
          }
          .brand-subtitle {
            font-size: 13px;
            color: #4338ca;
            font-weight: 600;
            margin-top: 2px;
          }
          .meta-box {
            font-size: 11px;
            color: #475569;
            text-align: right;
            line-height: 1.4;
          }
          .summary-strip {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }
          .summary-card {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 10px;
            text-align: center;
          }
          .summary-val {
            font-size: 17px;
            font-weight: 700;
            color: #1e1b4b;
            margin-top: 2px;
          }
          .summary-lbl {
            font-size: 11px;
            color: #64748b;
          }
          .day-card {
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            margin-bottom: 12px;
            overflow: hidden;
            page-break-inside: avoid;
          }
          .day-header {
            background: #eef2ff;
            border-bottom: 1px solid #cbd5e1;
            padding: 8px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .day-title {
            font-size: 13px;
            font-weight: 700;
            color: #312e81;
          }
          .day-target {
            font-size: 11px;
            font-weight: 600;
            color: #4338ca;
            background: #e0e7ff;
            padding: 2px 8px;
            border-radius: 6px;
          }
          .day-content {
            padding: 10px 14px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
          .column-title {
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-bottom: 6px;
            border-bottom: 1px dashed #e2e8f0;
            padding-bottom: 3px;
          }
          .task-item {
            font-size: 12px;
            color: #1e293b;
            margin-bottom: 5px;
            display: flex;
            align-items: flex-start;
            gap: 6px;
          }
          .task-checkbox {
            display: inline-block;
            width: 13px;
            height: 13px;
            border: 1.5px solid #94a3b8;
            border-radius: 3px;
            margin-top: 2px;
            flex-shrink: 0;
          }
          .tag-rev {
            font-size: 10px;
            background: #fef3c7;
            color: #92400e;
            padding: 1px 5px;
            border-radius: 4px;
            margin-left: 4px;
            font-weight: 600;
          }
          .tag-sug {
            font-size: 10px;
            background: #e0f2fe;
            color: #0369a1;
            padding: 1px 5px;
            border-radius: 4px;
            margin-left: 4px;
          }
          .study-habits {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
            margin-top: 16px;
            font-size: 11px;
            color: #475569;
            line-height: 1.5;
          }
          .footer {
            margin-top: 18px;
            border-top: 1px solid #cbd5e1;
            padding-top: 8px;
            font-size: 10px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body { padding: 0; }
            @page {
              margin: 1cm;
              size: A4 portrait;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand-title">পাঠশালা — সাপ্তাহিক অধ্যয়ন পরিকল্পনা (Weekly Study Plan)</div>
            <div class="brand-subtitle">সময়কাল: ${startDateLabel} থেকে ${endDateLabel} (আগামী ৭ দিন)</div>
          </div>
          <div class="meta-box">
            <div>শিক্ষার্থী: <strong>${user?.name || 'ক্যান্ডিডেট'}</strong></div>
            <div>টার্গেট: <strong>${user?.targetExam || '৪৭তম বিসিএস / ব্যাংক'}</strong></div>
            <div>প্রিন্ট তারিখ: ${new Date().toLocaleDateString('bn-BD')}</div>
          </div>
        </div>

        <div class="summary-strip">
          <div class="summary-card">
            <div class="summary-lbl">পরিকল্পিত সময়কাল</div>
            <div class="summary-val">৭ দিন</div>
          </div>
          <div class="summary-card">
            <div class="summary-lbl">মোট টার্গেট অধ্যয়ন</div>
            <div class="summary-val">${totalTargetHours} ঘণ্টা (${totalTargetMinutes} মি)</div>
          </div>
          <div class="summary-card">
            <div class="summary-lbl">আসন্ন রিভিশন টাস্ক</div>
            <div class="summary-val">${totalPlannedRevisions}টি টপিক</div>
          </div>
          <div class="summary-card">
            <div class="summary-lbl">প্রস্তাবিত নতুন অধ্যায়</div>
            <div class="summary-val">১৪টি টপিক</div>
          </div>
        </div>

        <div>
          ${next7DaysPlan
            .map(
              (day) => `
            <div class="day-card">
              <div class="day-header">
                <div class="day-title">
                  📅 ${day.dayBn} — ${day.dateLabel} ${day.isToday ? '<span style="color:#d97706; font-size:11px;">(আজকের দিন)</span>' : ''}
                </div>
                <div class="day-target">
                  টার্গেট: ${day.targetMinutes} মিনিট
                </div>
              </div>

              <div class="day-content">
                <!-- Column 1: Revisions -->
                <div>
                  <div class="column-title">📌 স্পেসড রিভিশন কিউ (${day.revisions.length}টি)</div>
                  ${
                    day.revisions.length > 0
                      ? day.revisions
                          .map(
                            (rev) => `
                        <div class="task-item">
                          <span class="task-checkbox"></span>
                          <div>
                            <strong>${rev.topic}</strong>
                            <div style="font-size: 10px; color: #64748b;">
                              ${rev.subject} · স্টেপ ${rev.stage} (${rev.intervalDays} দিনের ব্যবধান)
                              <span class="tag-rev">রিভিশন</span>
                            </div>
                          </div>
                        </div>
                      `
                          )
                          .join('')
                      : `<div style="font-size: 11px; color: #94a3b8; font-style: italic;">এই দিনে কোনো পূর্বনির্ধারিত রিভিশন নেই।</div>`
                  }
                </div>

                <!-- Column 2: Suggested Topics -->
                <div>
                  <div class="column-title">💡 প্রস্তাবিত নতুন বিষয় ও অধ্যায় (Suggested)</div>
                  ${day.suggestedTopics
                    .map(
                      (sug) => `
                    <div class="task-item">
                      <span class="task-checkbox"></span>
                      <div>
                        <strong>${sug.topic}</strong>
                        <div style="font-size: 10px; color: #64748b;">
                          ${sug.subject} · ${sug.type}
                          <span class="tag-sug">নতুন</span>
                        </div>
                      </div>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>

        <div class="study-habits">
          <strong>💡 বৈজ্ঞানিক পড়ার অভ্যাস ও রিভিশন নির্দেশিকা:</strong>
          <ul style="margin: 4px 0 0 16px; padding: 0;">
            <li>পড়াশোনার শুরুতে পূর্বের পড়াগুলো ১০-১৫ মিনিট রিভিশন দিয়ে নিন (Active Recall)।</li>
            <li>প্রতিটি সেশনে ২৫ মিনিট একাগ্র পড়া ও ৫ মিনিট বিশ্রামের পমোডোরো টেকনিক অনুসরণ করুন।</li>
            <li>পড়া শেষে চেকবক্স [✓] পূরণ করে আপনার প্রতিদিনের অগ্রগতি ট্র্যাক করুন।</li>
          </ul>
        </div>

        <div class="footer">
          <span>পাঠশালা সরকারি চাকরি প্রস্তুতি হাব · Study Calendar & Planner</span>
          <span>স্টাডি টেবিলে সহজে প্রিন্ট করে টানিয়ে রাখার উপযোগী পরিকল্পনা</span>
        </div>
      </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }, 400);
    }
    soundEffects.playSuccess();
    setIsExportModalOpen(false);
  };

  const handleSaveCustomTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMinutes <= 0) return;
    onAddStudyMinutes(customMinutes, selectedDateStr);
    setIsAddingTime(false);
    soundEffects.playSuccess();
  };

  const handleScheduleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = ALL_SYLLABUS_TOPICS.find((t) => t.topicName === selectedScheduleTopic);
    const subject = matched ? matched.subjectName : 'সাধারণ বিষয়াবলী';
    onScheduleRevision(subject, selectedScheduleTopic, selectedDateStr);
    setIsSchedulingTask(false);
    soundEffects.playSuccess();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Study Calendar & Planner</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                মাসিক ভিউ
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              আপনার অধ্যয়ন সময় ও সাইন্টিফিক রিভিশন শিডিউল ক্যালেন্ডার আকারে পর্যবেক্ষণ করুন
            </p>
          </div>
        </div>

        {/* Month Navigator Controls & Export Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="পূর্ববর্তী মাস"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[140px] text-center font-mono">
              {MONTH_NAMES_BN[currentMonth]} {currentYear}
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="পরবর্তী মাস"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleGoToToday}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-colors"
          >
            আজ
          </button>

          {/* Export Dropdown / Modal Trigger Button */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-semibold shadow-xs transition-colors"
            title="দৈনিক অধ্যয়ন লগ CSV অথবা PDF আকারে এক্সপোর্ট করুন"
          >
            <Download className="w-3.5 h-3.5" />
            <span>লগ এক্সপোর্ট</span>
          </button>

          {/* Weekly Study Plan PDF Direct Button */}
          <button
            type="button"
            onClick={handleExportWeeklyPlanPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            title="আগামী ৭ দিনের রিভিশন টাস্ক ও সাজেস্টেড টপিকের স্টাডি প্ল্যান PDF ডাউনলোড করুন"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>সাপ্তাহিক প্ল্যান PDF</span>
          </button>
        </div>
      </div>

      {/* Export Study Log Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    স্টাডি লগ এক্সপোর্ট (Export Records)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    রেকর্ড সংরক্ষণের জন্য দৈনিক অধ্যয়ন লগ CSV অথবা PDF ফরম্যাটে এক্সপোর্ট করুন
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scope Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                এক্সপোর্ট পরিসীমা নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExportScope('month')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    exportScope === 'month'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">চলতি মাস</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {MONTH_NAMES_BN[currentMonth]} {currentYear} ({daysInMonth} দিন)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setExportScope('all')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    exportScope === 'all'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">সম্পূর্ণ রেকর্ড</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    সকল ট্র্যাকড দিন ও রিভিশন
                  </div>
                </button>
              </div>
            </div>

            {/* Export Format Actions */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={() => handleExportCSV(exportScope)}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>CSV ফাইল ডাউনলোড (Spreadsheet)</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        .csv
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Excel, Google Sheets ও Numbers-এ ব্যবহারের জন্য UTF-8 ফরম্যাট
                    </div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>

              <button
                type="button"
                onClick={() => handleExportPDF(exportScope)}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>PDF রিপোর্ট তৈরি ও প্রিন্ট (Print to PDF)</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300">
                        .pdf
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      অফিসিয়াল ফরম্যাটেড স্টাডি সামারি, দৈনিক চার্ট ও পারফরম্যান্স টেবিল
                    </div>
                  </div>
                </div>
                <Printer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </button>

              <button
                type="button"
                onClick={handleExportWeeklyPlanPDF}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50/40 dark:hover:bg-violet-950/30 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>সাপ্তাহিক অধ্যয়ন পরিকল্পনা PDF (Weekly Plan)</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300">
                        ৭ দিন
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      আগামী ৭ দিনের রিভিশন শিডিউল, সাজেস্টেড টপিক ও ডেইলি চেকলিস্ট
                    </div>
                  </div>
                </div>
                <Printer className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Goal & Total Study Hours Summary Card with Radial Gauge */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-md border border-indigo-800/40 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Column: Goal Settings & Metrics */}
          <div className="flex-1 w-full space-y-4">
            {/* Header row: Title & Minute Goal Presets */}
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-indigo-300 font-semibold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>মাসিক অধ্যয়ন লক্ষ্য ও অগ্রগতি ট্র্যাকার</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {MONTH_NAMES_BN[currentMonth]} {currentYear}-এর স্টাডি গোল
              </h3>
            </div>

            {/* Goal in Minutes Controls */}
            <div className="p-3 rounded-xl bg-white/10 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-indigo-200">
                <span className="font-semibold flex items-center gap-1.5">
                  <span>মাসিক লক্ষ্য (মিনিট):</span>
                  <strong className="text-white font-mono text-sm">{monthlyGoalMinutes} মি</strong>
                  <span className="text-[11px] text-indigo-300">({monthlyGoalHours} ঘণ্টা)</span>
                </span>

                <button
                  type="button"
                  onClick={() => setIsEditingGoal(!isEditingGoal)}
                  className="px-2 py-0.5 rounded-md hover:bg-white/10 text-[11px] text-indigo-200 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-amber-400" />
                  <span>{isEditingGoal ? 'বন্ধ করুন' : 'কাস্টম মিনিট'}</span>
                </button>
              </div>

              {/* Quick Minute Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: '৬০০ মি (১০h)', value: 600 },
                  { label: '১২০০ মি (২০h)', value: 1200 },
                  { label: '১৫০০ মি (২৫h)', value: 1500 },
                  { label: '২৪০০ মি (৪০h)', value: 2400 },
                  { label: '৩৬০০ মি (৬০h)', value: 3600 }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleUpdateGoalMinutes(item.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      monthlyGoalMinutes === item.value
                        ? 'bg-indigo-600 text-white font-bold shadow-xs ring-1 ring-white/30'
                        : 'bg-white/5 text-indigo-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Custom Minutes Input Inline Editor */}
              {isEditingGoal && (
                <div className="pt-2 border-t border-white/10 flex items-center gap-2 animate-in fade-in duration-150">
                  <input
                    type="number"
                    min={60}
                    max={15000}
                    step={30}
                    value={customGoalInput}
                    onChange={(e) => setCustomGoalInput(parseInt(e.target.value, 10) || 0)}
                    placeholder="মিনিট লিখুন (যেমন: ১৮০০)..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/30 border border-white/20 text-white text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdateGoalMinutes(customGoalInput)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>সেভ</span>
                  </button>
                </div>
              )}
            </div>

            {/* Metrics Breakdown Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[10px] text-indigo-300">চলতি মাসে অধ্যয়ন</div>
                <div className="text-base font-bold font-mono text-white mt-0.5">
                  {monthStudyMinutes} <span className="text-[10px] font-normal text-indigo-200">মিনিট</span>
                </div>
                <div className="text-[10px] text-indigo-400 font-mono">({monthTotalStudyHours} ঘণ্টা)</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[10px] text-indigo-300">লক্ষ্য বাকি</div>
                <div className="text-base font-bold font-mono text-amber-300 mt-0.5">
                  {remainingGoalMinutes} <span className="text-[10px] font-normal text-indigo-200">মিনিট</span>
                </div>
                <div className="text-[10px] text-indigo-400 font-mono">({remainingGoalHours} ঘণ্টা)</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-indigo-300">দৈনিক প্রয়োজনীয়</div>
                <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                  ~{dailyNeededMinutes} <span className="text-[10px] font-normal text-indigo-200">মিনিট/দিন</span>
                </div>
                <div className="text-[10px] text-indigo-400">বাকি {daysLeftInMonth} দিনে</div>
              </div>
            </div>

            {/* Smart Daily Target Guidance */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-indigo-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {remainingGoalMinutes > 0 ? (
                    <>
                      মাসিক লক্ষ্য পূরণে আরও <strong className="text-white font-mono">{remainingGoalMinutes} মিনিট</strong> বাকি। দৈনিক প্রায় <strong className="text-amber-300 font-mono">{dailyNeededMinutes} মিনিট</strong> পড়লেই লক্ষ্য অর্জন সম্ভব!
                    </>
                  ) : (
                    <>
                      অসাধারণ সাফল্য! আপনি চলতি মাসের নির্ধারিত <strong className="text-emerald-300 font-mono">{monthlyGoalMinutes} মিনিট</strong> লক্ষ্য অতিক্রম করেছেন।
                    </>
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDateStr(todayStr);
                  setIsAddingTime(true);
                }}
                className="text-[11px] font-semibold text-indigo-300 hover:text-white underline self-start sm:self-auto shrink-0"
              >
                + আজকের সময় লগ
              </button>
            </div>
          </div>

          {/* Right Column: Radial Gauge Chart */}
          <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-56 pt-2 md:pt-0">
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="72%"
                  outerRadius="96%"
                  barSize={14}
                  data={radialGaugeData}
                  startAngle={210}
                  endAngle={-30}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, monthlyGoalMinutes]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: 'rgba(255, 255, 255, 0.08)' }}
                    dataKey="value"
                    cornerRadius={8}
                  />
                </RadialBarChart>
              </ResponsiveContainer>

              {/* Center Metrics in Gauge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none pb-2">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums tracking-tight">
                  {goalPercent}%
                </div>
                <div className="text-[11px] text-indigo-200 font-mono mt-0.5">
                  {monthStudyMinutes} / {monthlyGoalMinutes} মি
                </div>
                <div className="mt-1">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      goalPercent >= 100
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : goalPercent >= 60
                        ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30'
                        : 'bg-white/10 text-indigo-200 border-white/10'
                    }`}
                  >
                    {goalPercent >= 100 ? '🎉 অর্জিত!' : goalPercent >= 60 ? '🔥 গতিশীল' : '📈 চলমান'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center text-[11px] text-indigo-300 font-medium -mt-2">
              রেডিয়াল গেজ প্রোগ্রেস
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Metrics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Monthly Study Time */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">মাসে মোট অধ্যয়ন</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {monthTotalStudyHours}
            <span className="text-xs font-normal text-slate-500 ml-1">ঘণ্টা</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            মোট <strong className="font-mono text-slate-600 dark:text-slate-300">{monthStudyMinutes}</strong> মিনিট ট্র্যাকড
          </div>
        </div>

        {/* Active Study Days */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">অধ্যয়নের সক্রিয় দিন</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {activeStudyDaysCount}
            <span className="text-xs font-normal text-slate-500 ml-1">/ {daysInMonth} দিন</span>
          </div>
          <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
            নিয়মানুবর্তিতা: {daysInMonth > 0 ? Math.round((activeStudyDaysCount / daysInMonth) * 100) : 0}%
          </div>
        </div>

        {/* Scheduled Revision Tasks */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">নির্ধারিত রিভিশন</span>
            <RotateCcw className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {monthRevisionTasksCount}
            <span className="text-xs font-normal text-slate-500 ml-1">টাস্ক</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">স্পেসড রিপিটেশন ক্যালেন্ডার</div>
        </div>

        {/* Daily Average Study */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">দৈনিক গড় অধ্যয়ন</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {avgMinutesPerActiveDay}
            <span className="text-xs font-normal text-slate-500 ml-1">মিনিট</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">প্রতি স্টাডি সেশনে</div>
        </div>
      </div>

      {/* Weekly Consistency Bar Chart Card (Recharts) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>বিগত ৭ দিনের অধ্যয়ন ধারাবাহিকতা (Weekly Study Tracker)</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  {last7DaysActiveDays}/৭ দিন সক্রিয়
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                প্রতিদিনের স্টাডি মিনিট পর্যবেক্ষণ করুন — বারে ক্লিক করে সংশ্লিষ্ট দিনের বিস্তারিত দেখুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 self-start sm:self-auto font-mono">
            <span>
              ৭ দিনে মোট: <strong className="text-slate-900 dark:text-white">{last7DaysTotalMinutes}মি</strong> ({last7DaysTotalHours}h)
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span>
              দৈনিক গড়: <strong className="text-indigo-600 dark:text-indigo-400">{last7DaysAvgMinutes}মি</strong>
            </span>
          </div>
        </div>

        {/* Recharts Bar Chart View */}
        <div className="h-52 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={last7DaysData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              onClick={(state: any) => {
                if (state && state.activePayload && state.activePayload.length) {
                  const clickedDate = state.activePayload[0].payload.dateStr;
                  setSelectedDateStr(clickedDate);
                  soundEffects.playBeep(600, 0.05);
                }
              }}
            >
              <XAxis
                dataKey="dayLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                unit="m"
              />
              <Tooltip
                cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 text-xs shadow-xl font-sans">
                        <div className="font-bold flex items-center justify-between gap-3 text-indigo-300">
                          <span>{data.dateLabel} ({data.dayLabel})</span>
                          {data.isToday && (
                            <span className="text-[10px] bg-indigo-600 px-1.5 py-0.5 rounded text-white font-medium">
                              আজ
                            </span>
                          )}
                        </div>
                        <div className="mt-1.5 text-slate-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          <span>
                            অধ্যয়ন সময়: <strong className="text-white font-mono">{data.minutes} মিনিট</strong> ({data.hours} ঘণ্টা)
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          ক্লিক করে এই দিনের টাস্ক দেখুন
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="minutes" radius={[6, 6, 0, 0]} maxBarSize={42}>
                {last7DaysData.map((entry, index) => {
                  let barColor = '#818cf8';
                  if (entry.dateStr === selectedDateStr) {
                    barColor = '#4f46e5';
                  } else if (entry.minutes >= 90) {
                    barColor = '#10b981';
                  } else if (entry.minutes >= 45) {
                    barColor = '#6366f1';
                  } else if (entry.minutes > 0) {
                    barColor = '#38bdf8';
                  } else {
                    barColor = '#cbd5e1';
                  }

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={barColor}
                      className="cursor-pointer transition-opacity hover:opacity-85"
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend / Footnote */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>৯০+ মিনিট (উচ্চ লক্ষ্য)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>৪৫-৮৯ মিনিট</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
              <span>১-৪৪ মিনিট</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {last7DaysActiveDays >= 5 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                🔥 দারুণ গতি! আপনি সপ্তাহে নিয়মিত পড়ছেন।
              </span>
            ) : (
              <span>প্রতিদিন অন্তত ৩০ মিনিট পড়ার অভ্যাস গড়ে তুলুন।</span>
            )}

            <button
              type="button"
              onClick={handleExportWeeklyPlanPDF}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>আগামী ৭ দিনের প্ল্যান PDF ➔</span>
            </button>
          </div>
        </div>
      </div>

      {/* Study Insights Section: Peak Productivity Time of Day */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Study Insights: ফলপ্রসূ পড়ার সময় ও প্যাটার্ন বিশ্লেষণ</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  স্মার্ট অ্যানালিটিক্স
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                আপনার স্টাডি লগ ও ফোকাস সময়ের ভিত্তিতে দিনের সর্বাধিক কার্যক্ষম সময় বিশ্লেষণ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Award className="w-4 h-4 text-indigo-500" />
            <span>
              সেরা পড়ার দিন: <strong className="text-slate-900 dark:text-white font-bold">{bestDayName}</strong>
            </span>
          </div>
        </div>

        {/* Peak Productivity Highlight Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-200/80 dark:border-amber-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${peakSlot.accentColor}`}>
              <peakSlot.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>আপনার দিনের সর্বাধিক ফলপ্রসূ সময় (Peak Productivity)</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {peakSlot.title} ({peakSlot.timeRange}) — {peakSlot.percentage}% স্টাডি আউটপুট
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                আপনার মস্তিষ্কের অ্যালার্টনেস ও রিটেনশন রেট এই সময়ে সর্বোচ্চ থাকে। এই স্লটে আপনি মোট <strong className="font-mono text-slate-900 dark:text-white">{peakSlot.minutes} মিনিট</strong> পড়া সম্পন্ন করেছেন।
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs shrink-0 md:max-w-xs">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px]">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>এই স্লটের জন্য উপযোগী বিষয়:</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
              {peakSlot.recommendedFor}
            </p>
          </div>
        </div>

        {/* 4 Time Slots Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {timeSlotsAnalysis.map((slot) => {
            const Icon = slot.icon;
            const isPeak = slot.id === peakSlot.id;

            return (
              <div
                key={slot.id}
                className={`p-4 rounded-xl border transition-all ${
                  isPeak
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 ring-1 ring-amber-400/30'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${slot.accentColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {slot.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {slot.timeRange}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                    {slot.percentage}%
                  </span>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">ট্র্যাকড সময়:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {slot.minutes} মি <span className="text-[10px] font-normal text-slate-400">({slot.hours}h)</span>
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${slot.barColor} transition-all duration-500`}
                      style={{ width: `${Math.max(4, slot.percentage)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">উপযোগী: </span>
                  <span>{slot.tag}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strategic Study Recommendations */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>স্টাডি অপটিমাইজেশন টিপস (Scientific Rhythm)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              সকালের সময়টিতে নতুন মুখস্থবিদ্যা বা জটিল সূত্রগুলো পড়ুন। দুপুরের আলস্য দূর করতে ম্যাথ প্র্যাকটিস বা পমোডোরো টাইমার ব্যবহার করুন, এবং রাতের স্লটটি স্পেসড রিভিশন ও ভুল খাতার প্রশ্নাবলির জন্য বরাদ্দ রাখুন।
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedDateStr(todayStr);
              setIsAddingTime(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
          >
            + সেশন যোগ করুন
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Calendar Grid (7 cols) + Selected Date Details (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calendar Grid */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
            {WEEKDAYS_BN.map((day, i) => (
              <div key={i} className="py-1.5">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarCells.map((cell, index) => {
              const minutes = dailyLog[cell.dateStr] || 0;
              const revisions = userState.revisionQueue.filter((r) => r.nextReviewDate === cell.dateStr);
              const isSelected = selectedDateStr === cell.dateStr;

              // Color tone based on study intensity
              let cellBg = 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800/60';
              if (cell.isCurrentMonth) {
                if (minutes >= 90) {
                  cellBg = 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100';
                } else if (minutes >= 45) {
                  cellBg = 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60 text-indigo-950 dark:text-indigo-100';
                } else if (minutes > 0) {
                  cellBg = 'bg-sky-50/70 dark:bg-sky-950/20 border-sky-200/80 dark:border-sky-800/50';
                } else {
                  cellBg = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700';
                }
              } else {
                cellBg = 'bg-slate-50/30 dark:bg-slate-900/20 border-transparent opacity-40';
              }

              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedDateStr(cell.dateStr);
                    soundEffects.playBeep(550, 0.04);
                  }}
                  className={`min-h-[74px] sm:min-h-[88px] p-1.5 sm:p-2 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative group ${cellBg} ${
                    isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900 shadow-xs' : ''
                  }`}
                >
                  {/* Top row: day number and today dot */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold w-5 h-5 rounded-md flex items-center justify-center ${
                        cell.isToday
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : cell.isCurrentMonth
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* Study time badge */}
                    {minutes > 0 && (
                      <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5 inline" />
                        <span>{minutes >= 60 ? `${(minutes / 60).toFixed(1)}h` : `${minutes}m`}</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom indicators: Revision tasks */}
                  <div className="mt-1 space-y-0.5 overflow-hidden">
                    {revisions.slice(0, 2).map((rev, rIdx) => (
                      <div
                        key={rIdx}
                        className="text-[9px] sm:text-[10px] truncate px-1 py-0.5 rounded bg-violet-100/80 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 font-medium"
                        title={rev.topic}
                      >
                        ↻ {rev.topic}
                      </div>
                    ))}
                    {revisions.length > 2 && (
                      <div className="text-[9px] text-slate-400 font-mono pl-0.5">
                        +{revisions.length - 2} আরও
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200"></span>
                <span>স্টাডি সম্পন্ন</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-violet-100 dark:bg-violet-950/60 border border-violet-200"></span>
                <span>রিভিশন টাস্ক</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-600 text-white text-[8px] flex items-center justify-center font-bold">●</span>
                <span>আজকের দিন</span>
              </span>
            </div>
            <span>ক্যালেন্ডারের যেকোনো দিনে ক্লিক করে বিস্তারিত দেখুন</span>
          </div>
        </div>

        {/* Right Column: Selected Day Inspector & Task Planner */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            {/* Selected Date Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
                  নির্বাচিত তারিখের বিবরণ
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedDateStr === todayStr ? 'আজ, ' : ''}
                  {selectedDateStr}
                </h3>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400">এই দিনের সময়</div>
                <div className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {selectedDayMinutes} মিনিট
                </div>
              </div>
            </div>

            {/* Quick Actions for this day */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsAddingTime(!isAddingTime)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-500" />
                <span>স্টাডি সময় লগ</span>
              </button>

              <button
                onClick={() => setIsSchedulingTask(!isSchedulingTask)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-950/30 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <CalendarDays className="w-3.5 h-3.5 text-violet-500" />
                <span>রিভিশন নির্ধারণ</span>
              </button>
            </div>

            {/* Form: Add Study Time manually */}
            {isAddingTime && (
              <form onSubmit={handleSaveCustomTime} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in duration-200">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  অধ্যয়ন সময় যুক্ত করুন (মিনিট):
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={600}
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shrink-0"
                  >
                    যোগ করুন
                  </button>
                </div>
                <div className="flex gap-1.5 pt-1">
                  {[15, 30, 45, 60].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setCustomMinutes(m)}
                      className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border text-[10px] text-slate-600 dark:text-slate-300 font-mono"
                    >
                      +{m}m
                    </button>
                  ))}
                </div>
              </form>
            )}

            {/* Form: Schedule Revision */}
            {isSchedulingTask && (
              <form onSubmit={handleScheduleTaskSubmit} className="p-3.5 rounded-xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 space-y-2 animate-in fade-in duration-200">
                <div className="text-xs font-bold text-violet-950 dark:text-violet-200">
                  এই তারিখে রিভিশন নির্ধারণ করুন:
                </div>
                <select
                  value={selectedScheduleTopic}
                  onChange={(e) => setSelectedScheduleTopic(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-violet-200 dark:border-violet-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                >
                  {ALL_SYLLABUS_TOPICS.map((t) => (
                    <option key={t.key} value={t.topicName}>
                      {t.subjectName} ➔ {t.topicName}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-colors"
                >
                  ক্যালেন্ডারে শিডিউল করুন
                </button>
              </form>
            )}

            {/* Revision Tasks Scheduled For Selected Date */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                <span>রিভিশন তালিকা ({selectedDayRevisions.length})</span>
                {selectedDayRevisions.length > 0 && (
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">
                    স্পেসড কিউ
                  </span>
                )}
              </div>

              {selectedDayRevisions.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
                  এই তারিখে কোনো রিভিশন টাস্ক নির্ধারিত নেই।
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDayRevisions.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                            {rev.subject}
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                            {rev.topic}
                          </div>
                          <div className="text-[10px] text-slate-400">ধাপ: {rev.stage}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <button
                          onClick={() => onClarifyConcept(rev.subject, rev.topic)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-[11px] flex items-center gap-1"
                        >
                          <Lightbulb className="w-3 h-3 text-amber-500" />
                          <span>নোট</span>
                        </button>

                        <button
                          onClick={() => {
                            onAdvanceRevision(rev);
                            soundEffects.playSuccess();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors ml-auto"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>রিভিশন সম্পন্ন</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Spaced repetition tip */}
            <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-300 leading-relaxed">
              💡 <strong>ক্যালেন্ডার টিপ:</strong> প্রতিদিন অন্তত ৩০-৪৫ মিনিট পড়ার অভ্যাস বজায় রাখলে মেধা ও আত্মবিশ্বাস দ্বিগুণ হবে। নির্ধারিত দিনে রিভিশন শেষ করে "রিভিশন সম্পন্ন" বাটনে ক্লিক করুন।
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
