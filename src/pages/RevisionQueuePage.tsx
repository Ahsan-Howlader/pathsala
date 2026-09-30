import React from 'react';
import { RotateCcw, CheckCircle2, Calendar, Lightbulb, Trash2 } from 'lucide-react';
import { RevisionItem, UserState } from '../types';
import { soundEffects } from '../services/soundEffects';

interface RevisionQueuePageProps {
  userState: UserState;
  onAdvanceRevision: (item: RevisionItem) => void;
  onRemoveRevision: (id: string) => void;
  onClarifyConcept: (subject: string, topic: string) => void;
}

export const RevisionQueuePage: React.FC<RevisionQueuePageProps> = ({
  userState,
  onAdvanceRevision,
  onRemoveRevision,
  onClarifyConcept
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const dueItems = userState.revisionQueue.filter((item) => item.nextReviewDate <= todayStr);
  const upcomingItems = userState.revisionQueue.filter((item) => item.nextReviewDate > todayStr);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Spaced Revision Queue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              এবিংহাউসের বিস্মরণ রেখা (Forgetting Curve) ভিত্তিক বৈজ্ঞানিক পুনরাবৃত্তি শিডিউল
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-200/60 dark:border-violet-800/60 text-xs text-violet-900 dark:text-violet-300 leading-relaxed">
          💡 মানুষের মস্তিষ্ক নতুন পড়া বিষয় দ্রুত ভুলে যায়। ১ম দিন, ৩য় দিন, ৭ম দিন এবং ৩০তম দিনে রিভিশন দিলে তথ্য দীর্ঘমেয়াদী স্মৃতিতে (Long-term Memory) স্থায়ী হয়ে যায়।
        </div>
      </div>

      {/* Due Today Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>আজকের রিভিশন তালিকা</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-mono">
              {dueItems.length}
            </span>
          </h3>
        </div>

        {dueItems.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              আজকে কোনো রিভিশন বাকি নেই!
            </div>
            <p className="text-xs text-slate-400 mt-1">
              সিলেবাস থেকে নতুন কোনো টপিক পড়ুন এবং ‘রিভিশন করুন’ বাটনে ক্লিক করে শিডিউলে যুক্ত করুন।
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dueItems.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {item.subject}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.topic}
                  </h4>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                    <span>ধাপ: {item.stage}</span>
                    <span>·</span>
                    <span>পূর্ববর্তী ব্যবধান: {item.intervalDays} দিন</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onClarifyConcept(item.subject, item.topic)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>কনসেপ্ট পড়ুন</span>
                  </button>

                  <button
                    onClick={() => {
                      onAdvanceRevision(item);
                      soundEffects.playSuccess();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>রিভিশন সম্পন্ন</span>
                  </button>

                  <button
                    onClick={() => onRemoveRevision(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
                    title="তালিকা থেকে বাদ দিন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Section */}
      {upcomingItems.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            আসন্ন রিভিশন সূচি ({upcomingItems.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcomingItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                    {item.subject}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
                    {item.topic}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>পরবর্তী তারিখ: {item.nextReviewDate}</span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveRevision(item.id)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
