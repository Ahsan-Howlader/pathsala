import React, { useState } from 'react';
import { Zap, Flame, Award, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { DAILY_CHALLENGE_QUESTIONS } from '../data/studyData';
import { QuizQuestion, UserState } from '../types';
import { soundEffects } from '../services/soundEffects';

interface DailyChallengePageProps {
  userState: UserState;
  onUpdateScore: (addedPoints: number, wonStreak: boolean) => void;
  onLogMistake: (q: QuizQuestion, yourAnswer: string) => void;
}

export const DailyChallengePage: React.FC<DailyChallengePageProps> = ({
  userState,
  onUpdateScore,
  onLogMistake
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = DAILY_CHALLENGE_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      soundEffects.playSuccess();
      setSessionScore((s) => s + 20);
      setCorrectCount((c) => c + 1);
    } else {
      soundEffects.playBeep(300, 0.2);
      setSessionScore((s) => Math.max(0, s - 5));
      setWrongCount((w) => w + 1);
      // Auto log mistake to user's Error Log!
      onLogMistake(currentQ, currentQ.options[selectedOption]);
    }
  };

  const handleNext = () => {
    if (currentIndex < DAILY_CHALLENGE_QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      const won = correctCount >= Math.floor(DAILY_CHALLENGE_QUESTIONS.length / 2);
      onUpdateScore(sessionScore, won);
      soundEffects.playBell();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setSessionScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Daily Challenge Arena
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              দৈনিক হাই-ইল্ড বিসিএস ও ব্যাংক এমসিকিউ চ্যালেঞ্জ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">আপনার স্ট্রিক</div>
            <div className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Flame className="w-4 h-4 fill-current" />
              <span>{userState.challengeStreak} দিন</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Body or Finished Screen */}
      {!isFinished ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          {/* Progress header */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span>
              প্রশ্ন <strong className="text-slate-800 dark:text-slate-200 font-mono">{currentIndex + 1}</strong> / {DAILY_CHALLENGE_QUESTIONS.length}
            </span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {currentQ.subject}
            </span>
            <span>
              সেশন স্কোর: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">+{sessionScore}</strong>
            </span>
          </div>

          {/* Question Text */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>
            <div className="text-xs text-slate-400 mt-1">অধ্যায়: {currentQ.topic}</div>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnClass = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                } else if (isSelected) {
                  btnClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold';
                }
              } else if (isSelected) {
                btnClass = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 font-semibold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed animate-in fade-in duration-200">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">ব্যাখ্যা ও প্রেক্ষাপট: </span>
              {currentQ.explanation}
              {selectedOption !== currentQ.correctIndex && (
                <div className="mt-2 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  ⚠️ এই প্রশ্নটি আপনার ‘ভুল খাতা’ (Error Log)-এ যুক্ত করা হয়েছে যেন আপনি পুনরায় প্র্যাকটিস করতে পারেন।
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex justify-end">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
              >
                উত্তর জমা দিন
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2"
              >
                <span>{currentIndex < DAILY_CHALLENGE_QUESTIONS.length - 1 ? 'পরবর্তী প্রশ্ন' : 'ফলাফল দেখুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Finished Result summary */
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              অভিনন্দন! আজকের চ্যালেঞ্জ সম্পন্ন হয়েছে
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              আপনার অর্জিত স্কোর প্রোফাইল রেকর্ডে যুক্ত করা হয়েছে
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-400">সঠিক</div>
              <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">{correctCount}টি</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-400">ভুল</div>
              <div className="text-2xl font-bold text-rose-500 font-mono mt-1">{wrongCount}টি</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-400">পয়েন্ট যোগ</div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-1">+{sessionScore}</div>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>পুনরায় শুরু করুন</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
