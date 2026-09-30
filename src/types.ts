export type PageId =
  | 'home'
  | 'conceptExplainer'
  | 'pomodoro'
  | 'calendar'
  | 'tutor'
  | 'syllabus'
  | 'current'
  | 'viva'
  | 'podcast'
  | 'focusRoom'
  | 'challenge'
  | 'eligibility'
  | 'exams'
  | 'revision'
  | 'errors'
  | 'settings';

export interface UserProfile {
  email: string;
  name: string;
  targetExam: string;
  avatarColor: string;
}

export interface TopicProgress {
  status: 'Not Started' | 'In Progress' | 'Completed';
  lastStudied?: string;
  notes?: string;
}

export interface ErrorItem {
  id: string;
  subject: string;
  topic: string;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
  timestamp: string;
}

export interface RevisionItem {
  id: string;
  topicId: string;
  subject: string;
  topic: string;
  addedAt: string;
  nextReviewDate: string;
  intervalDays: number;
  stage: number;
}

export interface UserState {
  completedTopics: Record<string, TopicProgress>;
  studyMinutes: number;
  todayMinutes: number;
  dailyStudyLog?: Record<string, number>;
  timeSlotMinutes?: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  challengeScore: number;
  challengeStreak: number;
  lastChallengeDate: string;
  errorLog: ErrorItem[];
  revisionQueue: RevisionItem[];
  savedNotes: Array<{ id: string; subject: string; topic: string; content: string; date: string }>;
}

export interface SyllabusSubject {
  id: string;
  name: string;
  icon: string;
  groups: {
    name: string;
    topics: string[];
  }[];
}

export interface QuizQuestion {
  id: string;
  subject: string;
  topic: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface CurrentAffairItem {
  id: string;
  category: 'বাংলাদেশ' | 'আন্তর্জাতিক' | 'অর্থনীতি' | 'বিজ্ঞান ও তথ্যপ্রযুক্তি' | 'খেলাধুলা';
  title: string;
  date: string;
  summary: string;
  keyFacts: string[];
  source: string;
}

export interface VivaQuestion {
  id: string;
  cadre: string;
  interviewer: string;
  role: string;
  question: string;
  context: string;
  modelAnswer: string;
  rubrics: {
    criteria: string;
    points: string;
  }[];
}

export interface PodcastLesson {
  id: string;
  title: string;
  subject: string;
  duration: string;
  description: string;
  transcript: string;
}
