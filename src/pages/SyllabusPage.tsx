import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Circle,
  Video,
  Lightbulb,
  RotateCcw,
  X,
  Play
} from 'lucide-react';
import { ALL_SYLLABUS_TOPICS, SYLLABUS_DATA } from '../data/syllabusData';
import { UserState } from '../types';
import { soundEffects } from '../services/soundEffects';

interface SyllabusPageProps {
  userState: UserState;
  onToggleTopic: (key: string) => void;
  onClarifyConcept: (subject: string, topic: string) => void;
  onAddToRevision: (subject: string, topic: string) => void;
  initialVideoTopic?: string | null;
}

export const SyllabusPage: React.FC<SyllabusPageProps> = ({
  userState,
  onToggleTopic,
  onClarifyConcept,
  onAddToRevision,
  initialVideoTopic = null
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [activeVideoTopic, setActiveVideoTopic] = useState<string | null>(initialVideoTopic);

  const filteredTopics = ALL_SYLLABUS_TOPICS.filter((item) => {
    const matchesSearch =
      item.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubjectId === 'all' || item.subjectId === selectedSubjectId;

    return matchesSearch && matchesSubject;
  });

  const completedCount = ALL_SYLLABUS_TOPICS.filter(
    (t) => userState.completedTopics[t.key]?.status === 'Completed'
  ).length;

  const totalCount = ALL_SYLLABUS_TOPICS.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleOpenVideo = (topic: string) => {
    setActiveVideoTopic(topic);
    soundEffects.playBeep(600, 0.08);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Video Modal */}
      {activeVideoTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-white truncate max-w-md">
                  ভিডিও লেকচার: {activeVideoTopic}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoTopic(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(
                  activeVideoTopic + ' BCS Job Preparation Bangla Lecture'
                )}`}
                title={activeVideoTopic}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-4 flex items-center justify-between bg-slate-900 text-xs text-slate-400">
              <span>টপিক সংশ্লিষ্ট ইউটিউব টিউটোরিয়াল ও বিগত বছরের সমাধান</span>
              <button
                onClick={() => {
                  const current = activeVideoTopic;
                  setActiveVideoTopic(null);
                  onClarifyConcept('টপিক বিশ্লেষণ', current);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                এআই কনসেপ্ট নোট দেখুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Syllabus Header and Progress Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Syllabus & Video Lessons
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                বিসিএস ও সরকারি চাকরির পূর্ণাঙ্গ সিলেবাস, প্রোগ্রেস ট্র্যাকিং ও ভিডিও লেকচার
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">সিলেবাস সম্পন্ন</div>
            <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {completedCount} / {totalCount} ({progressPct}%)
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>

        {/* Search and Filters */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="টপিক বা অধ্যায় খুঁজুন (যেমন: কারক, লাভ-ক্ষতি, মুক্তিযুদ্ধ, Prepositions)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          {/* Subject Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedSubjectId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedSubjectId === 'all'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              সকল বিষয় ({totalCount})
            </button>
            {SYLLABUS_DATA.map((sub) => {
              const subCount = ALL_SYLLABUS_TOPICS.filter((t) => t.subjectId === sub.id).length;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedSubjectId === sub.id
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {sub.name} ({subCount})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Syllabus Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 w-12 text-center">স্থিতি</th>
                <th className="py-3 px-4">বিষয় ও অধ্যায়</th>
                <th className="py-3 px-4">টপিক</th>
                <th className="py-3 px-4 text-center w-28">ভিডিও</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredTopics.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    কোনো টপিক খুঁজে পাওয়া যায়নি। অনুসন্ধান পরিবর্তন করুন।
                  </td>
                </tr>
              ) : (
                filteredTopics.map((topicItem) => {
                  const isDone = userState.completedTopics[topicItem.key]?.status === 'Completed';

                  return (
                    <tr
                      key={topicItem.key}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Checkbox button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            onToggleTopic(topicItem.key);
                            if (!isDone) soundEffects.playSuccess();
                          }}
                          className="text-slate-400 hover:text-emerald-500 transition-colors"
                          title={isDone ? 'সম্পন্ন হয়েছে (রিসেট করতে ক্লিক করুন)' : 'সম্পন্ন চিহ্নিত করুন'}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                      </td>

                      {/* Subject and Group */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {topicItem.subjectName}
                        </div>
                        <div className="text-[11px] text-slate-400">{topicItem.groupName}</div>
                      </td>

                      {/* Topic Name */}
                      <td className="py-3 px-4">
                        <span
                          className={`font-medium ${
                            isDone
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {topicItem.topicName}
                        </span>
                      </td>

                      {/* Video Button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleOpenVideo(topicItem.topicName)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-[11px] font-semibold transition-colors"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>ভিডিও</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onClarifyConcept(topicItem.subjectName, topicItem.topicName)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="এআই কনসেপ্ট নোট"
                          >
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                          </button>

                          <button
                            onClick={() => onAddToRevision(topicItem.subjectName, topicItem.topicName)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="স্পেসড রিভিশনে যোগ করুন"
                          >
                            <RotateCcw className="w-4 h-4 text-violet-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
