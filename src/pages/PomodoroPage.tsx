import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Volume1, VolumeX, CloudRain, Coffee, Wind, Trees, Sparkles, Sliders } from 'lucide-react';
import { soundEffects, AmbientType } from '../services/soundEffects';

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
  const [ambientType, setAmbientType] = useState<AmbientType>('none');
  const [ambientVolume, setAmbientVolume] = useState<number>(60);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);

  // Stop ambient on unmount
  useEffect(() => {
    return () => {
      soundEffects.stopAmbient();
    };
  }, []);

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

  const handleAmbient = (type: AmbientType) => {
    if (ambientType === type && type !== 'none') {
      // Toggle off if clicking the active one
      setAmbientType('none');
      soundEffects.stopAmbient();
      return;
    }
    setAmbientType(type);
    if (type === 'none') {
      soundEffects.stopAmbient();
    } else {
      soundEffects.startAmbient(type, ambientVolume / 100);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setAmbientVolume(newVol);
    soundEffects.setAmbientVolume(newVol / 100);
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
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 w-full max-w-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-indigo-500" />
              <span>অ্যাম্বিয়েন্ট ব্যাকগ্রাউন্ড সাউন্ড (Ambient Audio)</span>
            </div>

            {ambientType !== 'none' && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>চলছে: {ambientType === 'rain' ? 'বৃষ্টি' : ambientType === 'cafe' ? 'ক্যাফে' : ambientType === 'nature' ? 'প্রকৃতি' : 'হোয়াইট নয়েজ'}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => handleAmbient('none')}
              className={`p-3 rounded-2xl text-xs font-semibold border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                ambientType === 'none'
                  ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <VolumeX className="w-5 h-5 text-slate-400" />
              <span>নিস্তব্ধ</span>
            </button>

            <button
              type="button"
              onClick={() => handleAmbient('rain')}
              className={`p-3 rounded-2xl text-xs font-semibold border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                ambientType === 'rain'
                  ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 ring-1 ring-sky-500 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <CloudRain className="w-5 h-5 text-sky-500" />
              <span>বৃষ্টি (Rain)</span>
            </button>

            <button
              type="button"
              onClick={() => handleAmbient('cafe')}
              className={`p-3 rounded-2xl text-xs font-semibold border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                ambientType === 'cafe'
                  ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Coffee className="w-5 h-5 text-amber-600" />
              <span>ক্যাফে (Café)</span>
            </button>

            <button
              type="button"
              onClick={() => handleAmbient('nature')}
              className={`p-3 rounded-2xl text-xs font-semibold border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                ambientType === 'nature'
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Trees className="w-5 h-5 text-emerald-600" />
              <span>প্রকৃতি (Nature)</span>
            </button>

            <button
              type="button"
              onClick={() => handleAmbient('whitenoise')}
              className={`p-3 rounded-2xl text-xs font-semibold border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                ambientType === 'whitenoise'
                  ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Wind className="w-5 h-5 text-slate-500" />
              <span>ফোকাস নয়েজ</span>
            </button>
          </div>

          {/* Volume Control Bar */}
          {ambientType !== 'none' && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 animate-in fade-in duration-200">
              <Volume1 className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="range"
                min="5"
                max="100"
                value={ambientVolume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
              />
              <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 w-9 text-right shrink-0">
                {ambientVolume}%
              </span>
            </div>
          )}

          <p className="text-[11px] text-center text-slate-400">
            {ambientType === 'rain' && '🌧️ বৃষ্টির রিমঝিম শব্দ বাইরের অনাকাঙ্ক্ষিত শব্দ ঢেকে রাখে।'}
            {ambientType === 'cafe' && '☕ কফি শপের হালকা গুঞ্জন সৃজনশীল চিন্তা ও দীর্ঘ অধ্যয়নে সহায়ক।'}
            {ambientType === 'nature' && '🌲 বনের মৃদু হাওয়া ও পাখির মিষ্টি কিচিরমিচির মানসিক ক্লান্তি কমায়।'}
            {ambientType === 'whitenoise' && '💨 ধারাবাহিক সাউন্ড ওয়েভ পড়ার সময় অন্যমনস্ক হওয়া রোধ করে।'}
            {ambientType === 'none' && 'পড়ার সময় একাগ্রতা ধরে রাখতে পছন্দের যেকোনো সাউন্ড নির্বাচন করুন।'}
          </p>
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
