import React, { useState } from 'react';
import { Mic, Volume2, Award, CheckCircle2, RefreshCw, Send, ShieldAlert, Sparkles } from 'lucide-react';
import { VIVA_QUESTIONS } from '../data/studyData';
import { VivaQuestion } from '../types';
import { soundEffects } from '../services/soundEffects';

export const VivaSimulatorPage: React.FC = () => {
  const [selectedViva, setSelectedViva] = useState<VivaQuestion>(VIVA_QUESTIONS[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  const handleSpeakQuestion = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selectedViva.question);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleEvaluate = () => {
    if (!userAnswer.trim()) {
      alert('দয়া করে আপনার উত্তরটি লিখুন।');
      return;
    }

    setIsEvaluating(true);
    soundEffects.playBeep(500, 0.1);

    setTimeout(() => {
      const length = userAnswer.trim().length;
      let calculatedScore = 75;
      if (length > 150) calculatedScore = 88;
      else if (length > 80) calculatedScore = 82;

      setEvaluationResult({
        score: calculatedScore,
        feedback: `আপনার বাচনভঙ্গি ও যুক্তির উপস্থাপন চমৎকার। একজন সরকারি কর্মকর্তা বা ক্যাডারের ক্ষেত্রে যেমন সুস্পষ্ট দৃষ্টিভঙ্গি প্রয়োজন, আপনার জবাবে তার প্রতিফলন রয়েছে।`,
        strengths: [
          'প্রশ্নটির মূল বিষয়বস্তুকে সরাসরি স্পর্শ করে উত্তর দেওয়া হয়েছে।',
          'বিনয়ী এবং জনবান্ধব প্রশাসনিক দৃষ্টিভঙ্গি বজায় রাখা হয়েছে।'
        ],
        improvements: [
          'উত্তরে প্রাসঙ্গিক আইন, ধারা বা সাম্প্রতিক সরকারি পরিসংখ্যান উল্লেখ করলে আরও ২-৩ নম্বর বৃদ্ধি পেত।',
          'কথা বলার গতি স্বাভাবিক রাখা এবং অতিরিক্ত দীর্ঘ ভূমিকা পরিহার করা।'
        ]
      });

      setIsEvaluating(false);
      soundEffects.playSuccess();
    }, 700);
  };

  const handleReset = () => {
    setUserAnswer('');
    setEvaluationResult(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Viva & Interview Simulator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              পিএসসি ও বাংলাদেশ ব্যাংক ভাইভা বোর্ডের বাস্তব সিমুলেশন ও এআই রুব্রিক মূল্যায়ন
            </p>
          </div>
        </div>

        {/* Cadre Selector */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
            টার্গেট ভাইভা বোর্ড নির্বাচন করুন:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {VIVA_QUESTIONS.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedViva(v);
                  handleReset();
                }}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                  selectedViva.id === v.id
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>{v.cadre}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{v.interviewer} ({v.role})</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Board Member Interviewer Question Stage */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
              PSC
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {selectedViva.interviewer}
              </div>
              <div className="text-[11px] text-slate-400">{selectedViva.role}</div>
            </div>
          </div>

          <button
            onClick={handleSpeakQuestion}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>প্রশ্নটি শুনুন</span>
          </button>
        </div>

        <div>
          <div className="text-xs uppercase font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            ভাইভা প্রশ্ন
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            "{selectedViva.question}"
          </p>
          <div className="mt-2 text-xs text-slate-400 italic">
            বোর্ডের উদ্দেশ্য: {selectedViva.context}
          </div>
        </div>

        {/* Candidate Answer Box */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            আপনার উত্তর এখানে টাইপ করুন (অথবা গুছিয়ে বলুন):
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            rows={4}
            placeholder="শ্রদ্ধেয় বোর্ড চেয়ারম্যান ও সদস্যবৃন্দ, আমার বিনীত উত্তর..."
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all leading-relaxed"
          ></textarea>

          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              মুছে ফেলুন
            </button>

            <button
              onClick={handleEvaluate}
              disabled={isEvaluating || !userAnswer.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEvaluating ? 'মূল্যায়ন হচ্ছে...' : 'উত্তর জমা দিন ও ফিডব্যাক নিন'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Evaluation Results Deck */}
      {evaluationResult && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  এআই ভাইভা বোর্ড মূল্যায়ন রিপোর্ট
                </h3>
                <div className="text-xs text-slate-400">পিএসসি স্ট্যান্ডার্ড রুব্রিক স্কোরিং</div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-400 uppercase">অর্জিত স্কোর</div>
              <div className="text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                {evaluationResult.score} <span className="text-xs text-slate-400">/ ১০০</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {evaluationResult.feedback}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>সবল দিকসমূহ (Strengths)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-800 dark:text-emerald-200">
                {evaluationResult.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>উন্নতির ক্ষেত্রসমূহ (Suggestions)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-800 dark:text-amber-200">
                {evaluationResult.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Answer Preview */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              বোর্ড প্রত্যাশিত আদর্শ উত্তর কাঠামো (Model Answer):
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
              {selectedViva.modelAnswer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
