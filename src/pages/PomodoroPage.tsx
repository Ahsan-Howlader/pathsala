import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CloudRain, Coffee, Wind, Bell } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface PomodoroPageProps {
  onAddStudyMinutes: (mins: number) => void;
  totalStudyMinutes: number;
}

type Mode = 'focus' | 'shortBreak' | 'longBreak';

const MODE_TIMES: Record<Mode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

export const PomodoroPage: React.FC<PomodoroPageProps> = ({
  onAddStudyMinutes,
  totalStudyMinutes
}) => {
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_TIMES.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ambientType, setAmbientType] = useState<'none' | 'rain' | 'whitenoise' | 'cafe'>('none');
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);

  // Timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      soundEffects.playBell();
      if (mode === 'focus') {
        const focusMins = Math.round(MODE_TIMES.focus / 60);
        onAddStudyMinutes(focusMins);
        setSessionsCompleted((c) => c + 1);
        setMode('shortBreak');
        setTimeLeft(MODE_TIMES.shortBreak);
      } else {
        setMode('focus');
        setTimeLeft(MODE_TIMES.focus);
      }
      setIsRunning(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, mode, onAddStudyMinutes]);

  const toggleTimer = () => {
    soundEffects.playBeep(isRunning ? 400 : 700, 0.1);
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[mode]);
    soundEffects.playBeep(350, 0.1);
  };

  const switchMode = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
  };

  const handleAmbient = (type: 'none' | 'rain' | 'whitenoise' | 'cafe') => {
    setAmbientType(type);
    if (type === 'none') {
      soundEffects.stopAmbient();
    } else {
      soundEffects.startAmbient(type);
    }
  };

  const totalTime = MODE_TIMES[mode];
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG circular properties
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mode Selector Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <button
            onClick={() => switchMode('focus')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'focus'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ফোকাস স্টাডি (২৫ মিনিট)
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            স্বল্প বিরতি (৫ মিনিট)
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'longBreak'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            দীর্ঘ বিরতি (১৫ মিনিট)
          </button>
        </div>
      </div>

      {/* Main Circular Clock Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 280 280">
            {/* Background track */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800"
            />
            {/* Animated progress ring */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className={`transition-all duration-500 ${
                mode === 'focus'
                  ? 'text-indigo-600 dark:text-indigo-500'
                  : mode === 'shortBreak'
                  ? 'text-emerald-500'
                  : 'text-violet-500'
              }`}
            />
          </svg>

          {/* Time digits in the middle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl sm:text-6xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
              {formattedTime}
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-400 mt-2 font-medium">
              {mode === 'focus' ? 'গভীর মনোযোগে অধ্যয়ন' : 'রিফ্রেশিং বিরতি'}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3.5 rounded-2xl text-white font-bold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'বিরতি দিন' : 'শুরু করুন'}</span>
          </button>

          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="রিসেট করুন"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Sound Selector */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 w-full max-w-md">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-center gap-1.5">
            <Volume2 className="w-4 h-4 text-indigo-500" />
            <span>অ্যাম্বিয়েন্ট ফোকাস সাউন্ড (Web Audio Synth)</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleAmbient('none')}
              className={`p-2 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-colors ${
                ambientType === 'none'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <VolumeX className="w-4 h-4" />
              <span>নিস্তব্ধ</span>
            </button>

            <button
              onClick={() => handleAmbient('rain')}
              className={`p-2 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-colors ${
                ambientType === 'rain'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <CloudRain className="w-4 h-4 text-sky-500" />
              <span>বৃষ্টি</span>
            </button>

            <button
              onClick={() => handleAmbient('cafe')}
              className={`p-2 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-colors ${
                ambientType === 'cafe'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Coffee className="w-4 h-4 text-amber-600" />
              <span>ক্যাফে</span>
            </button>

            <button
              onClick={() => handleAmbient('whitenoise')}
              className={`p-2 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-colors ${
                ambientType === 'whitenoise'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Wind className="w-4 h-4 text-slate-500" />
              <span>হোয়াইট নয়েজ</span>
            </button>
          </div>
        </div>

        {/* Completed stats */}
        <div className="mt-6 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4">
          <span>আজ সম্পন্ন সেশন: <strong className="text-slate-800 dark:text-slate-200 font-mono">{sessionsCompleted}টি</strong></span>
          <span aria-hidden="true">·</span>
          <span>মোট অর্জিত সময়: <strong className="text-slate-800 dark:text-slate-200 font-mono">{totalStudyMinutes} মিনিট</strong></span>
        </div>
      </div>
    </div>
  );
};
