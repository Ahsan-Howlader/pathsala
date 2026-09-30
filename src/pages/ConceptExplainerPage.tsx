import React, { useState } from 'react';
import {
  Lightbulb,
  Search,
  Sparkles,
  BookmarkPlus,
  RotateCcw,
  Volume2,
  Video,
  CheckCircle2,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { SYLLABUS_DATA } from '../data/syllabusData';
import { explainConcept, ConceptExplanation } from '../services/aiExplainer';
import { soundEffects } from '../services/soundEffects';

interface ConceptExplainerPageProps {
  onAddToRevision: (subject: string, topic: string) => void;
  onSaveNote: (subject: string, topic: string, content: string) => void;
  onOpenVideo: (topic: string) => void;
}

const POPULAR_TOPICS = [
  { subject: 'বাংলা ব্যাকরণ ও সাহিত্য', topic: 'কারক ও বিভক্তি' },
  { subject: 'বাংলা ব্যাকরণ ও সাহিত্য', topic: 'সমাস ও প্রকারভেদ' },
  { subject: 'গাণিতিক যুক্তি ও মানসিক দক্ষতা', topic: 'শতকরা (Percentage) নির্ণয় ও প্রয়োগ' },
  { subject: 'গাণিতিক যুক্তি ও মানসিক দক্ষতা', topic: 'লাভ ও ক্ষতি (Profit & Loss)' },
  { subject: 'English Language & Literature', topic: 'Subject-Verb Agreement Rules' },
  { subject: 'বাংলাদেশ বিষয়াবলী', topic: 'সংবিধানের গুরুত্বপূর্ণ অনুচ্ছেদসমূহ' }
];

export const ConceptExplainerPage: React.FC<ConceptExplainerPageProps> = ({
  onAddToRevision,
  onSaveNote,
  onOpenVideo
}) => {
  const [selectedSubject, setSelectedSubject] = useState(SYLLABUS_DATA[0].name);
  const [topicInput, setTopicInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<ConceptExplanation | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleFetchExplanation = async (subj = selectedSubject, top = topicInput) => {
    if (!top.trim()) {
      alert('দয়া করে কোনো টপিক বা অধ্যায়ের নাম লিখুন।');
      return;
    }
    setLoading(true);
    setSelectedQuizAnswer(null);
    setShowQuizResult(false);

    try {
      const result = await explainConcept(subj, top.trim());
      setExplanation(result);
      soundEffects.playBeep(650, 0.1);
    } catch {
      alert('ব্যাখ্যা লোড হতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (subj: string, top: string) => {
    setSelectedSubject(subj);
    setTopicInput(top);
    handleFetchExplanation(subj, top);
  };

  const handleSpeak = () => {
    if (!explanation) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const textToSpeak = `${explanation.topic}। মূল ধারণা: ${explanation.coreDefinition}। শর্টকাট টিপস: ${explanation.shortcutTips.join('। ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const handleQuizOptionClick = (idx: number) => {
    setSelectedQuizAnswer(idx);
    setShowQuizResult(true);
    if (explanation && idx === explanation.practiceQuiz.correctIndex) {
      soundEffects.playSuccess();
    } else {
      soundEffects.playBeep(300, 0.2);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Daily Topic Concept Clarifier
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              যেকোনো জটিল নিয়ম, অধ্যায় বা সূত্র ইনপুট দিন — পাঠশালা এআই শিক্ষক আপনাকে সহজ করে বুঝিয়ে দেবে
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-4">
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              বিষয় নির্বাচন করুন
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {SYLLABUS_DATA.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-8">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              টপিক বা চ্যাপ্টারের নাম
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFetchExplanation()}
                  placeholder="যেমন: কারক ও বিভক্তি, সমাস, শতকরা, লাভ-ক্ষতি, Prepositions..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              <button
                onClick={() => handleFetchExplanation()}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'প্রস্তুত হচ্ছে...' : 'ব্যাখ্যা নিন'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hot Quick Chips */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            সর্বাধিক জিজ্ঞাসিত টপিকসমূহ:
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TOPICS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickSelect(item.subject, item.topic)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {item.topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation Result Output */}
      {explanation && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Action Bar for the Explanation */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                {explanation.subject}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {explanation.topic}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  speaking
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="ভয়েসে শুনুন"
              >
                <Volume2 className="w-4 h-4" />
                <span>{speaking ? 'বন্ধ করুন' : 'শুনুন'}</span>
              </button>

              <button
                onClick={() => {
                  onAddToRevision(explanation.subject, explanation.topic);
                  triggerToast(`‘${explanation.topic}’ স্পেসড রিভিশন তালিকায় যুক্ত হয়েছে!`);
                }}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-violet-500" />
                <span>রিভিশনে রাখুন</span>
              </button>

              <button
                onClick={() => {
                  onSaveNote(explanation.subject, explanation.topic, explanation.coreDefinition);
                  triggerToast(`‘${explanation.topic}’ নোটসে সেভ হয়েছে!`);
                }}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <BookmarkPlus className="w-4 h-4 text-emerald-500" />
                <span>নোট সেভ</span>
              </button>

              <button
                onClick={() => onOpenVideo(explanation.topic)}
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Video className="w-4 h-4" />
                <span>ভিডিও ক্লাস</span>
              </button>
            </div>
          </div>

          {/* Section 1: Core Concept Definition */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">১</span>
              <span>মূল ধারণা ও সংজ্ঞা (Core Concept)</span>
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {explanation.coreDefinition}
            </p>
          </div>

          {/* Section 2: Real-World Analogy */}
          <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
            <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-300 flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 flex items-center justify-center text-xs font-bold">২</span>
              <span>সহজ বাস্তব উদাহরণ ও অ্যানালজি (Practical Example)</span>
            </h4>
            <p className="text-sm text-indigo-900/90 dark:text-indigo-200/90 leading-relaxed">
              {explanation.realWorldAnalogy}
            </p>
          </div>

          {/* Section 3: Past Exam Analysis */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">৩</span>
              <span>বিগত বিসিএস ও চাকরির পরীক্ষার প্রশ্ন বিশ্লেষণ</span>
            </h4>
            <ul className="space-y-2">
              {explanation.pastExamAnalysis.map((item, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Shortcut Tips & Mnemonics */}
          <div className="p-6 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
            <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-lg bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-center text-xs font-bold">৪</span>
              <span>পরীক্ষার হলের শর্টকাট কৌশল ও ম্যাজিক রুলস</span>
            </h4>
            <div className="space-y-2">
              {explanation.shortcutTips.map((tip, i) => (
                <div key={i} className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Common Traps / Pitfalls */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <span>সাধারণ ভুলভ্রান্তি ও সতর্কতা (Common Traps to Avoid)</span>
            </h4>
            <div className="space-y-2">
              {explanation.commonPitfalls.map((pitfall, i) => (
                <div key={i} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-rose-50/50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900/30">
                  {pitfall}
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Mini Practice Quiz */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                তাত্ক্ষণিক সেলফ-চেক কুইজ (Instant Concept Check)
              </h4>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
              {explanation.practiceQuiz.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {explanation.practiceQuiz.options.map((option, idx) => {
                const isSelected = selectedQuizAnswer === idx;
                const isCorrect = idx === explanation.practiceQuiz.correctIndex;
                let btnStyle = 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200';

                if (showQuizResult) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleQuizOptionClick(idx)}
                    disabled={showQuizResult}
                    className={`p-3 text-left rounded-xl border text-xs sm:text-sm transition-all ${btnStyle}`}
                  >
                    <span className="font-semibold mr-2 font-mono">{String.fromCharCode(65 + idx)}.</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {showQuizResult && (
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">ব্যাখ্যা: </span>
                {explanation.practiceQuiz.explanation}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
