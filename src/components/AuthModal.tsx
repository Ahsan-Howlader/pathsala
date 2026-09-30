import React, { useState } from 'react';
import { User, ShieldCheck, GraduationCap, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onLogin: (profile: UserProfile) => void;
}

const PRESET_ACCOUNTS: UserProfile[] = [
  { email: 'rahim@gmail.com', name: 'রহিম আহমেদ', targetExam: '৪৭তম বিসিএস (সাধারণ ক্যাডার)', avatarColor: 'bg-indigo-600' },
  { email: 'fatima@gmail.com', name: 'ফাতিমা আক্তার', targetExam: 'কম্বাইন্ড ১০ ব্যাংক ও বাংলাদেশ ব্যাংক এডি', avatarColor: 'bg-emerald-600' },
  { email: 'tanvir@gmail.com', name: 'তানভীর হাসান', targetExam: 'প্রাথমিক সহকারী শিক্ষক ও ৯ম-২০তম গ্রেড', avatarColor: 'bg-purple-600' }
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [targetExam, setTargetExam] = useState('৪৭তম বিসিএস ক্যাডার');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const displayName = name.trim() || email.split('@')[0];
    onLogin({
      email: email.trim().toLowerCase(),
      name: displayName,
      targetExam,
      avatarColor: 'bg-indigo-600'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            প
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">পাঠশালা স্টাডি রুমে স্বাগতম</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">ব্যক্তিগত পোর্টাল ও স্টাডি ট্র্যাকার</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">দ্রুত ডেমো প্রোফাইল নির্বাচন করুন:</p>
          <div className="space-y-2">
            {PRESET_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => onLogin(acc)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${acc.avatarColor} text-white flex items-center justify-center text-xs font-bold`}>
                    {acc.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{acc.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{acc.targetExam}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">অথবা আপনার নিজস্ব ইমেইল</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">আপনার ইমেইল ঠিকানা</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="যেমন: candidate@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">আপনার নাম (ঐচ্ছিক)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: আহসান হাবিব"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">টার্গেট পরীক্ষা</label>
            <select
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="৪৭তম বিসিএস ক্যাডার">৪৭তম বিসিএস (সাধারণ ও কারিগরি)</option>
              <option value="বাংলাদেশ ব্যাংক ও সমন্বিত ব্যাংক">বাংলাদেশ ব্যাংক এডি ও কম্বাইন্ড ব্যাংক</option>
              <option value="প্রাথমিক সহকারী শিক্ষক (DPE)">প্রাথমিক সহকারী শিক্ষক (DPE)</option>
              <option value="১০ম - ২০তম গ্রেড মন্ত্রণালয়">১০ম - ২০তম গ্রেড মন্ত্রণালয় পদসমূহ</option>
              <option value="এনটিআরসিএ (NTRCA) শিক্ষক নিবন্ধন">এনটিআরসিএ (NTRCA) শিক্ষক নিবন্ধন</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>পাঠশালায় প্রবেশ করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>আপনার ব্যক্তিগত পড়ার অগ্রগতি ডিভাইস স্টোরেজে সংরক্ষিত থাকবে</span>
        </div>
      </div>
    </div>
  );
};
