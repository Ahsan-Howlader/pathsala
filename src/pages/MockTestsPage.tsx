import React, { useState, useEffect } from 'react';
import { FileCheck2, Clock, Award, CheckCircle2, XCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { MOCK_TESTS } from '../data/studyData';
import { QuizQuestion } from '../types';
import { soundEffects } from '../services/soundEffects';

interface MockTestsPageProps {
  onLogMistake: (q: QuizQuestion, yourAnswer: string) => void;
}

export const MockTestsPage: React.FC<MockTestsPageProps> = ({ onLogMistake }) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(MOCK_TESTS[0].id);
  const [examState, setExamState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const activeTest = MOCK_TESTS.find((t) => t.id === selectedExamId) || MOCK_TESTS[0];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (examState === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (examState === 'running' && timeLeft === 0) {
      handleFinishExam();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [examState, timeLeft]);

  const handleStartExam = (testId = selectedExamId) => {
    setSelectedExamId(testId);
    const test = MOCK_TESTS.find((t) => t.id === testId) || MOCK_TESTS[0];
    setTimeLeft(test.timeLimitMinutes * 60);
    setUserAnswers({});
    setExamState('running');
    soundEffects.playBeep(600, 0.1);
  };

  const handleSelectAnswer = (qId: string, optIndex: number) => {
    if (examState !== 'running') return;
    setUserAnswers((prev) => {
      // Toggle if already selected
      if (prev[qId] === optIndex) {
        const copy = { ...prev };
        delete copy[qId];
        return copy;
      }
      return { ...prev, [qId]: optIndex };
    });
    soundEffects.playBeep(700, 0.04);
  };

  const handleFinishExam = () => {
    setExamState('completed');
    soundEffects.playBell();

    // Log mistakes
    activeTest.questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans !== undefined && ans !== q.correctIndex) {
        onLogMistake(
          {
            id: q.id,
            subject: activeTest.title,
            topic: 'মডেল টেস্ট',
            question: q.question,
            options: q.options as [string, string, string, string],
            correctIndex: q.correctIndex,
            explanation: q.explanation
          },
          q.options[ans]
        );
      }
    });
  };

  // Calculations
  const totalQuestions = activeTest.questions.length;
  let correctCount = 0;
  let wrongCount = 0;

  activeTest.questions.forEach((q) => {
    const ans = userAnswers[q.id];
    if (ans !== undefined) {
      if (ans === q.correctIndex) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }
  });

  const attemptedCount = correctCount + wrongCount;
  const negativePenalty = wrongCount * activeTest.negativeMarking;
  const netScore = Math.max(0, Number((correctCount - negativePenalty).toFixed(2)));

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Mock Tests & Interactive OMR
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                বাস্তব ওএমআর শিট এবং টাইমার সহ প্রতিযোগিতামূলক মডেল টেস্ট
              </p>
            </div>
          </div>

          {examState === 'running' && (
            <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-4 py-2 rounded-xl text-red-600 dark:text-red-400">
              <Clock className="w-4 h-4 animate-pulse" />
              <span className="font-mono text-base font-bold tabular-nums">{formattedTime}</span>
            </div>
          )}
        </div>

        {/* Exam Picker when idle */}
        {examState === 'idle' && (
          <div className="mt-5 space-y-3">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
              মডেল টেস্ট সিলেক্ট করুন:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_TESTS.map((test) => (
                <div
                  key={test.id}
                  onClick={() => setSelectedExamId(test.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedExamId === test.id
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {test.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span>{test.totalQuestions} প্রশ্ন</span>
                    <span>·</span>
                    <span>{test.timeLimitMinutes} মিনিট</span>
                    <span>·</span>
                    <span>নেগেটিভ মার্কিং: -{test.negativeMarking}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleStartExam()}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
              >
                মডেল টেস্ট শুরু করুন
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Running Exam Mode */}
      {examState === 'running' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white">
              উত্তর দেওয়া হয়েছে: <strong className="font-mono text-indigo-600">{Object.keys(userAnswers).length}</strong> / {totalQuestions}
            </span>
            <button
              onClick={handleFinishExam}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              পরীক্ষা শেষ করুন
            </button>
          </div>

          <div className="space-y-4">
            {activeTest.questions.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold font-mono text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </p>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedOpt === oIdx;

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectAnswer(q.id, oIdx)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono shrink-0 ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                : 'border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleFinishExam}
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              পরীক্ষা সমাপ্ত ও ফলাফল দেখুন
            </button>
          </div>
        </div>
      )}

      {/* Completed Exam Results & Review */}
      {examState === 'completed' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 mx-auto flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                মডেল টেস্ট ফলাফল শিট
              </h3>
              <p className="text-xs text-slate-400">{activeTest.title}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">সঠিক উত্তর</div>
                <div className="text-xl font-bold text-emerald-600 font-mono mt-0.5">{correctCount}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">ভুল উত্তর</div>
                <div className="text-xl font-bold text-rose-500 font-mono mt-0.5">{wrongCount}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">নেগেটিভ কর্তন</div>
                <div className="text-xl font-bold text-amber-600 font-mono mt-0.5">-{negativePenalty}</div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">প্রাপ্ত মোট নম্বর</div>
                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                  {netScore} / {totalQuestions}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setExamState('idle')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>অন্য মডেল টেস্ট দিন</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              ব্যাখ্যা সহ উত্তরপত্র পর্যালোচনা
            </h4>

            {activeTest.questions.map((q, qIndex) => {
              const myAnswer = userAnswers[q.id];
              const isCorrect = myAnswer === q.correctIndex;
              const isSkipped = myAnswer === undefined;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800'
                      : isSkipped
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      : 'bg-white dark:bg-slate-900 border-rose-300 dark:border-rose-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2">
                      <span className="font-bold font-mono text-xs text-slate-500 mt-0.5">
                        {qIndex + 1}.
                      </span>
                      <div className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                        {q.question}
                      </div>
                    </div>

                    <div className="shrink-0 text-xs font-semibold">
                      {isCorrect ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> সঠিক
                        </span>
                      ) : isSkipped ? (
                        <span className="text-slate-400">অননুশীলিত</span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> ভুল
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Options with highlight */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
                    {q.options.map((opt, oIdx) => {
                      const isThisCorrect = oIdx === q.correctIndex;
                      const isMyChoice = oIdx === myAnswer;

                      let style = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
                      if (isThisCorrect) {
                        style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                      } else if (isMyChoice && !isCorrect) {
                        style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through';
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${style}`}
                        >
                          <span className="font-mono font-bold text-[10px] w-4 h-4 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                    <strong className="text-indigo-600 dark:text-indigo-400">ব্যাখ্যা: </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
