import React, { useState, useEffect } from 'react';
import { Headphones, Play, Pause, Square, RotateCcw, FastForward, Rewind, Volume2 } from 'lucide-react';
import { PODCAST_LESSONS } from '../data/studyData';
import { PodcastLesson } from '../types';

export const PodcastPage: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState<PodcastLesson>(PODCAST_LESSONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlay = (lesson = activeLesson, rate = playbackRate) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lesson.transcript);
    utterance.lang = 'bn-BD';
    utterance.rate = rate;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handlePauseToggle = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        handlePlay(activeLesson, playbackRate);
      }
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleRateChange = (newRate: number) => {
    setPlaybackRate(newRate);
    if (isPlaying) {
      handlePlay(activeLesson, newRate);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Study Podcast Audio Mode
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              চোখ বন্ধ করে বা যাতায়াতের সময় অডিও শুনে শুনে সিলেবাসের রিভিশন সম্পন্ন করুন
            </p>
          </div>
        </div>

        {/* Lesson Selector */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PODCAST_LESSONS.map((pod) => (
            <button
              key={pod.id}
              onClick={() => {
                handleStop();
                setActiveLesson(pod);
              }}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                activeLesson.id === pod.id
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="font-semibold truncate">{pod.title}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
                <span>{pod.subject}</span>
                <span className="font-mono">{pod.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modern Audio Player Bar */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-indigo-300 font-semibold">
              চলমান অডিও পডকাস্ট
            </span>
            <h3 className="text-lg sm:text-xl font-bold mt-1 text-white">
              {activeLesson.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeLesson.description}</p>
          </div>

          {/* Animated sound wave bars when playing */}
          <div className="flex items-center gap-1 h-6">
            {[40, 75, 55, 90, 60, 85, 45, 95].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full bg-indigo-400 transition-all ${
                  isPlaying ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{
                  height: isPlaying ? `${h}%` : '20%',
                  animationDuration: `${0.4 + (i % 3) * 0.2}s`
                }}
              ></span>
            ))}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePauseToggle}
              className="w-12 h-12 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleStop}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="বন্ধ করুন"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Speed Buttons */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-xl text-xs font-mono">
            {[0.75, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => handleRateChange(rate)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  playbackRate === rate
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transcript Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          পডকাস্ট ট্রান্সক্রিপ্ট ও পড়ার নোট
        </h4>
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-normal">
          {activeLesson.transcript}
        </div>
      </div>
    </div>
  );
};
