import React, { useState } from 'react';
import { Sparkles, Search, Check, Copy, BookmarkPlus, Tag } from 'lucide-react';
import { CURRENT_AFFAIRS_DATA } from '../data/studyData';
import { CurrentAffairItem } from '../types';

interface CurrentAffairsPageProps {
  onSaveNote: (subject: string, topic: string, content: string) => void;
}

export const CurrentAffairsPage: React.FC<CurrentAffairsPageProps> = ({ onSaveNote }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সবগুলো');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['সবগুলো', 'বাংলাদেশ', 'আন্তর্জাতিক', 'অর্থনীতি', 'বিজ্ঞান ও তথ্যপ্রযুক্তি', 'খেলাধুলা'];

  const filteredItems = CURRENT_AFFAIRS_DATA.filter((item) => {
    const matchesCat = selectedCategory === 'সবগুলো' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.keyFacts.some((f) => f.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopy = (item: CurrentAffairItem) => {
    const text = `${item.title} (${item.date})\n${item.summary}\nমূল তথ্য:\n${item.keyFacts.map((f) => '• ' + f).join('\n')}\nউৎস: ${item.source}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Live Current Affairs & GK
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              বিসিএস ও ব্যাংক নিয়োগের জন্য রিয়েল-টাইম সংগৃহীত জাতীয় ও আন্তর্জাতিক সাম্প্রতিক ঘটনাবলী
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="সাম্প্রতিক তথ্য সার্চ করুন (যেমন: অর্থনৈতিক সমীক্ষা, জাতিসংঘ, বাজেট, রোহিঙ্গা)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GK Cards */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {item.category}
                  </span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-slate-400 font-mono">{item.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1 transition-colors"
                    title="কপি করুন"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'কপি হয়েছে' : 'কপি'}</span>
                  </button>

                  <button
                    onClick={() => onSaveNote('সাম্প্রতিক সাধারণ জ্ঞান', item.title, item.summary)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1 transition-colors"
                    title="নোটসে সংরক্ষণ করুন"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-indigo-500" />
                    <span>সেভ</span>
                  </button>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {item.summary}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  পরীক্ষার জন্য স্মরণীয় মূল তথ্য:
                </div>
                {item.keyFacts.map((fact, idx) => (
                  <div key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                    <span>{fact}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-[11px] text-slate-400">
                উৎস: {item.source}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
