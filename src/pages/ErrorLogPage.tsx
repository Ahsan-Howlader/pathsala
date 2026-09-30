import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Trash2, BookOpen } from 'lucide-react';
import { UserState } from '../types';
import { soundEffects } from '../services/soundEffects';

interface ErrorLogPageProps {
  userState: UserState;
  onRemoveError: (id: string) => void;
  onClearAllErrors: () => void;
}

export const ErrorLogPage: React.FC<ErrorLogPageProps> = ({
  userState,
  onRemoveError,
  onClearAllErrors
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const subjects = ['all', ...Array.from(new Set(userState.errorLog.map((e) => e.subject)))];

  const filteredErrors = userState.errorLog.filter((item) => {
    return selectedSubject === 'all' || item.subject === selectedSubject;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Error Log (ভুল খাতা)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              কুইজ ও মডেল টেস্টে ভুল হওয়া প্রশ্নগুলো পর্যালোচনা করে দুর্বলতা দূর করুন
            </p>
          </div>
        </div>

        {userState.errorLog.length > 0 && (
          <button
            onClick={() => {
              if (confirm('আপনি কি ভুল খাতার সকল প্রশ্ন মুছে ফেলতে চান?')) {
                onClearAllErrors();
              }
            }}
            className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold self-start sm:self-auto"
          >
            সব ভুল মুছে ফেলুন
          </button>
        )}
      </div>

      {/* Subject Filter */}
      {subjects.length > 2 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sub === 'all' ? `সব বিষয় (${userState.errorLog.length})` : sub}
            </button>
          ))}
        </div>
      )}

      {/* Errors list */}
      {filteredErrors.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ভুল খাতা সম্পূর্ণ খালি!
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            আপনি যখনই ডেইলি চ্যালেঞ্জ বা মডেল টেস্টে কোনো প্রশ্নে ভুল করবেন, তা স্বয়ংক্রিয়ভাবে এখানে সংরক্ষিত হবে যাতে পরে রিভিশন দিতে পারেন।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredErrors.map((err) => (
            <div
              key={err.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {err.subject} · {err.topic}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5 leading-relaxed">
                    {err.question}
                  </h4>
                </div>

                <button
                  onClick={() => {
                    onRemoveError(err.id);
                    soundEffects.playBeep(450, 0.08);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-600 text-slate-400 text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors"
                  title="এই প্রশ্নটি এখন আয়ত্ত করেছি"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>আয়ত্ত করেছি</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 border border-rose-100 dark:border-rose-900/40">
                  <span className="font-semibold block text-[10px] uppercase text-rose-600 dark:text-rose-400 mb-0.5">
                    আপনার উত্তর:
                  </span>
                  <span>{err.yourAnswer}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-900/40">
                  <span className="font-semibold block text-[10px] uppercase text-emerald-600 dark:text-emerald-400 mb-0.5">
                    সঠিক উত্তর:
                  </span>
                  <span>{err.correctAnswer}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                <strong className="text-indigo-600 dark:text-indigo-400">ব্যাখ্যা: </strong>
                {err.explanation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
