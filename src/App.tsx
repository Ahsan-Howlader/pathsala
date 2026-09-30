import React, { useState, useEffect } from 'react';
import { PageId, UserProfile, UserState, QuizQuestion, RevisionItem } from './types';
import { ALL_SYLLABUS_TOPICS } from './data/syllabusData';
import { AuthModal } from './components/AuthModal';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { HomePage } from './pages/HomePage';
import { ConceptExplainerPage } from './pages/ConceptExplainerPage';
import { PomodoroPage } from './pages/PomodoroPage';
import { AITutorPage } from './pages/AITutorPage';
import { SyllabusPage } from './pages/SyllabusPage';
import { CurrentAffairsPage } from './pages/CurrentAffairsPage';
import { VivaSimulatorPage } from './pages/VivaSimulatorPage';
import { PodcastPage } from './pages/PodcastPage';
import { FocusWorldPage } from './pages/FocusWorldPage';
import { DailyChallengePage } from './pages/DailyChallengePage';
import { JobEligibilityPage } from './pages/JobEligibilityPage';
import { MockTestsPage } from './pages/MockTestsPage';
import { RevisionQueuePage } from './pages/RevisionQueuePage';
import { ErrorLogPage } from './pages/ErrorLogPage';
import { SettingsPage } from './pages/SettingsPage';

const DEFAULT_USER: UserProfile = {
  email: 'candidate@pathsala.com',
  name: 'রহিম আহমেদ',
  targetExam: '৪৭তম বিসিএস (সাধারণ ক্যাডার)',
  avatarColor: 'bg-indigo-600'
};

const DEFAULT_USER_STATE: UserState = {
  completedTopics: {},
  studyMinutes: 45,
  todayMinutes: 45,
  challengeScore: 120,
  challengeStreak: 4,
  lastChallengeDate: new Date().toISOString().split('T')[0],
  errorLog: [
    {
      id: 'init-err-1',
      subject: 'বাংলা ব্যাকরণ ও সাহিত্য',
      topic: 'কারক ও বিভক্তি',
      question: '"তিলে তৈল হয়" — এখানে "তিলে" কোন কারক?',
      yourAnswer: 'অধিকরণ কারক',
      correctAnswer: 'অপাদান কারক',
      explanation: 'তিলে তৈল হয় বলতে তিল হতে তৈলের উৎপত্তি বা নির্গমন বোঝাচ্ছে, তাই এটি অপাদান কারক।',
      timestamp: 'গতকাল'
    }
  ],
  revisionQueue: [
    {
      id: 'rev-1',
      topicId: 'কারক ও বিভক্তি',
      subject: 'বাংলা ব্যাকরণ ও সাহিত্য',
      topic: 'কারক ও বিভক্তি',
      addedAt: new Date().toISOString().split('T')[0],
      nextReviewDate: new Date().toISOString().split('T')[0],
      intervalDays: 1,
      stage: 1
    },
    {
      id: 'rev-2',
      topicId: 'শতকরা নির্ণয়',
      subject: 'গাণিতিক যুক্তি ও মানসিক দক্ষতা',
      topic: 'শতকরা (Percentage) নির্ণয় ও প্রয়োগ',
      addedAt: new Date().toISOString().split('T')[0],
      nextReviewDate: new Date().toISOString().split('T')[0],
      intervalDays: 3,
      stage: 2
    }
  ],
  savedNotes: []
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pathsala_current_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [allUsersData, setAllUsersData] = useState<Record<string, UserState>>(() => {
    const saved = localStorage.getItem('pathsala_multi_users');
    return saved ? JSON.parse(saved) : { [DEFAULT_USER.email]: DEFAULT_USER_STATE };
  });

  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('pathsala_dark_mode') === 'true';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [videoModalTopic, setVideoModalTopic] = useState<string | null>(null);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pathsala_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Sync users state to localStorage
  useEffect(() => {
    localStorage.setItem('pathsala_multi_users', JSON.stringify(allUsersData));
  }, [allUsersData]);

  // Active user's state
  const activeEmail = currentUser?.email || DEFAULT_USER.email;
  const userState: UserState = allUsersData[activeEmail] || DEFAULT_USER_STATE;

  const updateUserState = (updater: (prev: UserState) => UserState) => {
    setAllUsersData((prev) => {
      const current = prev[activeEmail] || DEFAULT_USER_STATE;
      return {
        ...prev,
        [activeEmail]: updater(current)
      };
    });
  };

  const handleLogin = (profile: UserProfile) => {
    setCurrentUser(profile);
    localStorage.setItem('pathsala_current_user', JSON.stringify(profile));
    if (!allUsersData[profile.email]) {
      setAllUsersData((prev) => ({
        ...prev,
        [profile.email]: { ...DEFAULT_USER_STATE, completedTopics: {} }
      }));
    }
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setShowAuthModal(true);
  };

  // State manipulation handlers
  const handleAddStudyMinutes = (mins: number) => {
    updateUserState((prev) => ({
      ...prev,
      studyMinutes: prev.studyMinutes + mins,
      todayMinutes: prev.todayMinutes + mins
    }));
  };

  const handleToggleTopic = (topicKey: string) => {
    updateUserState((prev) => {
      const currentStatus = prev.completedTopics[topicKey]?.status;
      const nextStatus = currentStatus === 'Completed' ? 'Not Started' : 'Completed';
      return {
        ...prev,
        completedTopics: {
          ...prev.completedTopics,
          [topicKey]: {
            status: nextStatus,
            lastStudied: new Date().toISOString()
          }
        }
      };
    });
  };

  const handleAddToRevision = (subject: string, topic: string) => {
    updateUserState((prev) => {
      // Check if already in queue
      const existing = prev.revisionQueue.find((r) => r.topic === topic);
      if (existing) return prev;

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const newItem: RevisionItem = {
        id: Date.now().toString(),
        topicId: topic,
        subject,
        topic,
        addedAt: new Date().toISOString().split('T')[0],
        nextReviewDate: tomorrow.toISOString().split('T')[0],
        intervalDays: 1,
        stage: 1
      };

      return {
        ...prev,
        revisionQueue: [newItem, ...prev.revisionQueue]
      };
    });
  };

  const handleAdvanceRevision = (item: RevisionItem) => {
    updateUserState((prev) => {
      const intervals = [1, 3, 7, 14, 30];
      const currentIdx = intervals.indexOf(item.intervalDays);
      const nextInterval = currentIdx >= 0 && currentIdx < intervals.length - 1 ? intervals[currentIdx + 1] : 30;

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + nextInterval);

      const updated = prev.revisionQueue.map((r) => {
        if (r.id === item.id) {
          return {
            ...r,
            stage: r.stage + 1,
            intervalDays: nextInterval,
            nextReviewDate: nextDate.toISOString().split('T')[0]
          };
        }
        return r;
      });

      return {
        ...prev,
        revisionQueue: updated
      };
    });
  };

  const handleRemoveRevision = (id: string) => {
    updateUserState((prev) => ({
      ...prev,
      revisionQueue: prev.revisionQueue.filter((r) => r.id !== id)
    }));
  };

  const handleSaveNote = (subject: string, topic: string, content: string) => {
    updateUserState((prev) => ({
      ...prev,
      savedNotes: [
        {
          id: Date.now().toString(),
          subject,
          topic,
          content,
          date: new Date().toLocaleDateString('bn-BD')
        },
        ...prev.savedNotes
      ]
    }));
  };

  const handleLogMistake = (q: QuizQuestion, yourAnswer: string) => {
    updateUserState((prev) => ({
      ...prev,
      errorLog: [
        {
          id: Date.now().toString(),
          subject: q.subject,
          topic: q.topic,
          question: q.question,
          yourAnswer,
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation,
          timestamp: new Date().toLocaleDateString('bn-BD')
        },
        ...prev.errorLog
      ]
    }));
  };

  const handleRemoveError = (id: string) => {
    updateUserState((prev) => ({
      ...prev,
      errorLog: prev.errorLog.filter((e) => e.id !== id)
    }));
  };

  const handleClearAllErrors = () => {
    updateUserState((prev) => ({
      ...prev,
      errorLog: []
    }));
  };

  const handleUpdateChallengeScore = (addedPoints: number, wonStreak: boolean) => {
    updateUserState((prev) => ({
      ...prev,
      challengeScore: prev.challengeScore + addedPoints,
      challengeStreak: wonStreak ? prev.challengeStreak + 1 : prev.challengeStreak,
      lastChallengeDate: new Date().toISOString().split('T')[0]
    }));
  };

  const handleResetUserData = () => {
    updateUserState(() => DEFAULT_USER_STATE);
  };

  const handleClarifyConcept = (subject: string, topic: string) => {
    setCurrentPage('conceptExplainer');
  };

  const handleOpenVideo = (topic: string) => {
    setVideoModalTopic(topic);
    setCurrentPage('syllabus');
  };

  // Metrics
  const totalTopicsCount = ALL_SYLLABUS_TOPICS.length;
  const completedCount = ALL_SYLLABUS_TOPICS.filter(
    (t) => userState.completedTopics[t.key]?.status === 'Completed'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      {/* Auth / Profile Modal */}
      <AuthModal isOpen={showAuthModal} onLogin={handleLogin} />

      {/* Responsive Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        user={currentUser || DEFAULT_USER}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((d) => !d)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Top Bar */}
        <TopNav
          currentPage={currentPage}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigate={setCurrentPage}
          user={currentUser || DEFAULT_USER}
          userState={userState}
          totalTopicsCount={totalTopicsCount}
          completedCount={completedCount}
        />

        {/* Dynamic Page Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentPage === 'home' && (
            <HomePage
              user={currentUser || DEFAULT_USER}
              userState={userState}
              totalTopicsCount={totalTopicsCount}
              completedCount={completedCount}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'conceptExplainer' && (
            <ConceptExplainerPage
              onAddToRevision={handleAddToRevision}
              onSaveNote={handleSaveNote}
              onOpenVideo={handleOpenVideo}
            />
          )}

          {currentPage === 'pomodoro' && (
            <PomodoroPage
              onAddStudyMinutes={handleAddStudyMinutes}
              totalStudyMinutes={userState.studyMinutes}
            />
          )}

          {currentPage === 'tutor' && <AITutorPage />}

          {currentPage === 'syllabus' && (
            <SyllabusPage
              userState={userState}
              onToggleTopic={handleToggleTopic}
              onClarifyConcept={handleClarifyConcept}
              onAddToRevision={handleAddToRevision}
              initialVideoTopic={videoModalTopic}
            />
          )}

          {currentPage === 'current' && <CurrentAffairsPage onSaveNote={handleSaveNote} />}

          {currentPage === 'viva' && <VivaSimulatorPage />}

          {currentPage === 'podcast' && <PodcastPage />}

          {currentPage === 'focusRoom' && <FocusWorldPage user={currentUser || DEFAULT_USER} />}

          {currentPage === 'challenge' && (
            <DailyChallengePage
              userState={userState}
              onUpdateScore={handleUpdateChallengeScore}
              onLogMistake={handleLogMistake}
            />
          )}

          {currentPage === 'eligibility' && <JobEligibilityPage />}

          {currentPage === 'exams' && <MockTestsPage onLogMistake={handleLogMistake} />}

          {currentPage === 'revision' && (
            <RevisionQueuePage
              userState={userState}
              onAdvanceRevision={handleAdvanceRevision}
              onRemoveRevision={handleRemoveRevision}
              onClarifyConcept={handleClarifyConcept}
            />
          )}

          {currentPage === 'errors' && (
            <ErrorLogPage
              userState={userState}
              onRemoveError={handleRemoveError}
              onClearAllErrors={handleClearAllErrors}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              user={currentUser || DEFAULT_USER}
              userState={userState}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode((d) => !d)}
              onResetUserData={handleResetUserData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
