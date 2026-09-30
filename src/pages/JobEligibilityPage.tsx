import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, AlertCircle, Briefcase, GraduationCap } from 'lucide-react';

interface JobOpportunity {
  title: string;
  maxAgeGeneral: number;
  maxAgeQuota: number;
  requiredDegrees: string[];
  description: string;
}

const JOB_CIRCULAR_STANDARDS: JobOpportunity[] = [
  {
    title: 'বিসিএস (সাধারণ ক্যাডার - প্রশাসন, পুলিশ, পররাষ্ট্র ইত্যাদি)',
    maxAgeGeneral: 30,
    maxAgeQuota: 32,
    requiredDegrees: ['honours', 'masters'],
    description: 'যেকোনো স্বীকৃত বিশ্ববিদ্যালয় থেকে ৪ বছর মেয়াদী স্নাতক/স্নাতকোত্তর ডিগ্রি (ন্যূনতম ২য় শ্রেণি বা সমমান সিজিপিএ)।'
  },
  {
    title: 'বাংলাদেশ ব্যাংক সহকারী পরিচালক (AD - General)',
    maxAgeGeneral: 30,
    maxAgeQuota: 32,
    requiredDegrees: ['honours', 'masters'],
    description: '৪ বছর মেয়াদী স্নাতক অথবা স্নাতকোত্তর ডিগ্রি। কোনো তৃতীয় বিভাগ গ্রহণযোগ্য নয়।'
  },
  {
    title: 'সমন্বিত ১০ ব্যাংক সিনিয়র অফিসার ও অফিসার (সাধারণ/ক্যাশ)',
    maxAgeGeneral: 30,
    maxAgeQuota: 32,
    requiredDegrees: ['honours', 'masters', 'degree'],
    description: 'স্নাতক অথবা ডিগ্রি পাস কোর্স সহ মাস্টার্স ডিগ্রি। ব্যাংকার্স সিলেকশন কমিটি কর্তৃক পরিচালিত।'
  },
  {
    title: 'প্রাথমিক বিদ্যালয় সহকারী শিক্ষক (DPE)',
    maxAgeGeneral: 30,
    maxAgeQuota: 32,
    requiredDegrees: ['honours', 'masters', 'degree'],
    description: 'যেকোনো বিষয়ে ন্যূনতম দ্বিতীয় শ্রেণি বা সমমানের সিজিপিএসহ স্নাতক বা স্নাতক (সম্মান) বা সমমানের ডিগ্রি।'
  },
  {
    title: 'এনটিআরসিএ (NTRCA) স্কুল ও কলেজ শিক্ষক নিবন্ধন',
    maxAgeGeneral: 35,
    maxAgeQuota: 35,
    requiredDegrees: ['honours', 'masters', 'degree'],
    description: 'সংশ্লিষ্ট বিষয়ে স্নাতক/স্নাতকোত্তর। এনটিআরসিএ বিধি অনুযায়ী সর্বোচ্চ বয়সসীমা ৩৫ বছর।'
  },
  {
    title: 'মন্ত্রণালয় ও অধিদপ্তরের ১০ম - ২০তম গ্রেড পদসমূহ',
    maxAgeGeneral: 30,
    maxAgeQuota: 32,
    requiredDegrees: ['hsc', 'degree', 'honours', 'masters'],
    description: 'পদভেদে এইচএসসি পাস (অফিস সহকারী/ডাটা এন্ট্রি) থেকে শুরু করে স্নাতক পাস।'
  }
];

export const JobEligibilityPage: React.FC = () => {
  const [age, setAge] = useState<number>(26);
  const [degree, setDegree] = useState<string>('honours');
  const [quota, setQuota] = useState<string>('general');

  const evaluatedOpportunities = JOB_CIRCULAR_STANDARDS.map((job) => {
    const maxAllowedAge = quota === 'freedomFighter' || quota === 'disabled' ? job.maxAgeQuota : job.maxAgeGeneral;
    const isAgeEligible = age <= maxAllowedAge;
    const isDegreeEligible = job.requiredDegrees.includes(degree);
    const isFullyEligible = isAgeEligible && isDegreeEligible;

    let reason = '';
    if (!isAgeEligible) {
      reason = `বয়স অতিক্রম করেছে (অনুমোদিত সর্বোচ্চ বয়স: ${maxAllowedAge} বছর)`;
    } else if (!isDegreeEligible) {
      reason = 'শিক্ষাগত যোগ্যতা পূর্ণ হয়নি';
    } else {
      reason = 'বয়স ও শিক্ষাগত যোগ্যতা শতভাগ মানসম্মত';
    }

    return {
      ...job,
      maxAllowedAge,
      isFullyEligible,
      isAgeEligible,
      isDegreeEligible,
      reason
    };
  });

  const eligibleCount = evaluatedOpportunities.filter((j) => j.isFullyEligible).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Smart Job Eligibility Checker
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              আপনার বয়স, শিক্ষাগত যোগ্যতা ও কোটা অনুযায়ী কোন কোন সরকারি চাকরিতে আবেদন করতে পারবেন তা একনজরে জানুন
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              বর্তমান বয়স (বছর)
            </label>
            <input
              type="number"
              min={18}
              max={45}
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              সর্বোচ্চ শিক্ষাগত যোগ্যতা
            </label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="masters">মাস্টার্স / স্নাতকোত্তর ডিগ্রি</option>
              <option value="honours">৪ বছর মেয়াদী স্নাতক (সম্মান)</option>
              <option value="degree">৩ বছর মেয়াদী ডিগ্রি পাস কোর্স</option>
              <option value="hsc">এইচএসসি (HSC / আলিম)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              কোটা বা বিশেষ সুবিধা
            </label>
            <select
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="general">সাধারণ প্রার্থী (সর্বোচ্চ ৩০ বছর)</option>
              <option value="freedomFighter">বীর মুক্তিযোদ্ধার সন্তান/নাতি-নাতনি (৩২ বছর)</option>
              <option value="disabled">শারীরিক প্রতিবন্ধী কোটা (৩২ বছর)</option>
              <option value="tribal">ক্ষুদ্র নৃগোষ্ঠী কোটা (৩২ বছর)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Alert */}
      <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold text-slate-900 dark:text-white">
            আপনার বর্তমান প্রোফাইল অনুযায়ী <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{eligibleCount}টি</strong> চাকরির ক্ষেত্রে আবেদনের পূর্ণ যোগ্যতা রয়েছে।
          </span>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evaluatedOpportunities.map((opp, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-all ${
              opp.isFullyEligible
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                {opp.title}
              </h3>
              {opp.isFullyEligible ? (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>যোগ্য</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-rose-500 text-xs font-semibold shrink-0">
                  <XCircle className="w-4 h-4" />
                  <span>অযোগ্য</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              {opp.description}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                বয়সসীমা: <strong className="text-slate-700 dark:text-slate-300 font-mono">{opp.maxAllowedAge} বছর</strong>
              </span>
              <span
                className={`font-semibold ${
                  opp.isFullyEligible
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-500'
                }`}
              >
                {opp.reason}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
