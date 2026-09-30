import React, { useState } from 'react';
import { Users, Clock, Send, MessageSquare, Flame, ThumbsUp, Coffee, Sparkles } from 'lucide-react';
import { PEER_USERS } from '../data/studyData';
import { UserProfile } from '../types';
import { soundEffects } from '../services/soundEffects';

interface FocusWorldPageProps {
  user: UserProfile;
}

export const FocusWorldPage: React.FC<FocusWorldPageProps> = ({ user }) => {
  const [myFocusTask, setMyFocusTask] = useState('৪৭তম বিসিএস: বাংলা ব্যাকরণ ও গণিত প্রস্তুতি');
  const [inputTask, setInputTask] = useState('');
  const [cheers, setCheers] = useState<Record<string, number>>({});
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'তানভীর হাসান', text: 'আজ সংবিধানের অনুচ্ছেদগুলো রিভিশন শেষ করলাম! সবার কেমন চলছে?', time: '৫ মিনিট আগে' },
    { sender: 'ফাতিমা আক্তার', text: 'ব্যাংক ম্যাথের লাভ-ক্ষতি শর্টকাটগুলো দারুণ কাজে দিচ্ছে।', time: '২ মিনিট আগে' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTask.trim()) return;
    setMyFocusTask(inputTask.trim());
    setInputTask('');
    soundEffects.playBeep(600, 0.08);
  };

  const handleCheer = (peerId: string) => {
    setCheers((prev) => ({ ...prev, [peerId]: (prev[peerId] || 0) + 1 }));
    soundEffects.playBeep(800, 0.06);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        sender: user.name,
        text: chatInput.trim(),
        time: 'এখন'
      }
    ]);
    setChatInput('');
    soundEffects.playBeep(700, 0.08);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Focus World (Live Study Room)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                এই মুহূর্তে অনলাইনে সক্রিয় সহযোদ্ধাদের সাথে একসাথে নিরবচ্ছিন্ন প্রস্তুতি নিন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ৬ জন লাইভ স্টাডি করছেন
            </span>
          </div>
        </div>

        {/* My Focus Status bar */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              {user.name[0]}
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">আপনার বর্তমান লক্ষ্য:</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {myFocusTask}
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateTask} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={inputTask}
              onChange={(e) => setInputTask(e.target.value)}
              placeholder="পড়ার লক্ষ্য পরিবর্তন করুন..."
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 flex-1 sm:w-60"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shrink-0"
            >
              আপডেট
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Aspirants List */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            স্টাডি রুমে সহযোদ্ধাগণ
          </h3>

          <div className="space-y-3">
            {PEER_USERS.map((peer) => {
              const count = cheers[peer.id] || 0;
              return (
                <div
                  key={peer.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-9 h-9 rounded-full ${peer.avatar} text-white flex items-center justify-center font-bold text-xs`}>
                        {peer.name[0]}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{peer.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({peer.minutes} মিনিট ধরে ফোকাসড)
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {peer.task}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCheer(peer.id)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors flex items-center gap-1.5 shrink-0"
                    title="উৎসাহ দিন"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>{count > 0 ? `+${count}` : 'সাবাশ'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Study Encouragement Chat */}
        <div className="lg:col-span-5 flex flex-col h-[480px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs p-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              স্টাডি মোটিভেশনাল ওয়াল
            </h4>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                  <span>{m.sender}</span>
                  <span className="text-[10px] font-normal text-slate-400">{m.time}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="একটি অনুপ্রেরণামূলক বার্তা দিন..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
