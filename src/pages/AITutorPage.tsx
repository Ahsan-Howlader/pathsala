import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Volume2, Sparkles, User, RefreshCw } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    sender: 'ai',
    text: `স্বাগতম পাঠশালা AI Tutor-এ! 👋
আমি আপনার সরকারি চাকরি ও বিসিএস পরীক্ষার সার্বক্ষণিক স্টাডি পার্টনার।
বাংলা ব্যাকরণ, ইংরেজি গ্রামার, গণিতের শর্টকাট সূত্র, মুক্তিযুদ্ধ বা সংবিধান—যেকোনো বিষয় নির্দ্বিধায় জিজ্ঞেস করুন।`,
    timestamp: 'এখন'
  }
];

const SUGGESTIONS = [
  'কারক ও বিভক্তি চেনার সবচেয়ে সহজ উপায় কী?',
  'Conditionals sentences-এর চারটি নিয়ম ও উদাহরণ বুঝিয়ে বলুন',
  'শতকরা ও লাভ-ক্ষতির অংক দ্রুত করার শর্টকাট ফর্মুলা দিন',
  'সংবিধানের জরুরি অনুচ্ছেদগুলো সহজে কীভাবে মনে রাখব?'
];

export const AITutorPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (query = inputText) => {
    const text = query.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    soundEffects.playBeep(500, 0.08);

    // Dynamic responses based on subject matter
    setTimeout(() => {
      let aiReply = '';
      const lower = text.toLowerCase();

      if (lower.includes('কারক') || lower.includes('বিভক্তি')) {
        aiReply = `কারক নির্ণয়ের ম্যাজিক ট্রিক:
১. ক্রিয়াকে "কে বা কারা" দিয়ে প্রশ্ন করুন = কর্তৃকারক (যেমন: রহিম বই পড়ে)।
২. "কী বা কাকে" দিয়ে প্রশ্ন = কর্মকারক (যেমন: ঘোড়াকে চাবুক মারো)।
৩. "কী দিয়ে বা কী উপায়ে" প্রশ্ন = করণকারক (যেমন: কলম দিয়ে লিখি)।
৪. নিঃস্বার্থ দান (স্বত্ব ত্যাগ) = সম্প্রদানকারক (যেমন: ভিক্ষুককে ভিক্ষা দাও)।
৫. "হতে, থেকে, চেয়ে, ভয়, উৎপত্তি" = অপাদানকারক (যেমন: তিলে তৈল হয়)।
৬. "স্থান বা কাল/সময়" = অধিকরণকারক (যেমন: তিলে তৈল আছে)।

মনে রাখবেন: 'তিলে তৈল হয়' হলো অপাদান (উৎপন্ন), আর 'তিলে তৈল আছে' হলো অধিকরণ (স্থান)।`;
      } else if (lower.includes('conditional') || lower.includes('tense')) {
        aiReply = `English Conditionals চার ভাগে বিভক্ত:
• Zero Conditional (চিরন্তন সত্য): If + Present, Present. (e.g. If you heat ice, it melts.)
• 1st Conditional (বাস্তব সম্ভাবনা): If + Present Simple, Future Simple (will + base verb). (e.g. If he works hard, he will succeed.)
• 2nd Conditional (অবাস্তব বর্তমান/ভবিষ্যৎ): If + Past Simple, would/could + base verb. 'Be' verb হলে সবসময় 'were' বসবে! (e.g. If I were a bird, I would fly.)
• 3rd Conditional (অতীতের অপূর্ণ সম্ভাবনা): If + Past Perfect (had + V3), would have/could have + V3. (e.g. If they had invited me, I would have gone.)`;
      } else if (lower.includes('শতকরা') || lower.includes('লাভ') || lower.includes('ক্ষতি')) {
        aiReply = `গণিতের গোল্ডেন শর্টকাট সূত্র:
১. দাম বৃদ্ধির পর খরচ অপরিবর্তিত রাখার ফর্মুলা:
ব্যবহার কমাতে হবে = [r / (100 + r)] × 100%
উদাহরণ: তেলের দাম ২৫% বাড়লে: [25 / 125] × 100% = 20% ব্যবহার কমাতে হবে!

২. টাকায় ক টি কিনে টাকায় খ টি বিক্রয় করলে লাভ%:
লাভ% = [(ক - খ) / খ] × ১০০%
উদাহরণ: ৪টি কিনে ৩টি বিক্রি করলে: [(৪-৩)/৩] × ১০০% = ৩৩.৩৩% লাভ!

৩. লাভ বা ক্ষতি সর্বদা ক্রয়মূল্য (Cost Price)-এর উপর হিসাব করতে হয়।`;
      } else if (lower.includes('সংবিধান') || lower.includes('অনুচ্ছেদ')) {
        aiReply = `সংবিধানের হট অনুচ্ছেদসমূহ যা বিসিএস ও ব্যাংকে বারবার আসে:
• অনুচ্ছেদ ৭: সংবিধানের প্রাধান্য (প্রজাতন্ত্রের মালিক জনগণ)।
• অনুচ্ছেদ ১১: গণতন্ত্র ও মৌলিক মানবাধিকার।
• অনুচ্ছেদ ১৭: অবৈতনিক ও বাধ্যতামূলক প্রাথমিক শিক্ষা।
• অনুচ্ছেদ ২৭: আইনের দৃষ্টিতে সমতা।
• অনুচ্ছেদ ২৮: ধর্ম, বর্ণ, লিঙ্গভেদে বৈষম্য নিষিদ্ধ।
• অনুচ্ছেদ ২৯: সরকারি নিয়োগে সুযোগের সমতা।
• অনুচ্ছেদ ৪৪: মৌলিক অধিকার বলবৎকরণ।
• অনুচ্ছেদ ৭০: ফ্লোর ক্রসিং (দলের বিপক্ষে ভোট দিলে আসন বাতিল)।
• অনুচ্ছেদ ১০২: হাইকোর্টের রিট জারির এখতিয়ার।`;
      } else {
        aiReply = `চমৎকার প্রশ্ন! ‘${text}’ সরকারি চাকরি পরীক্ষার জন্য একটি নির্ভরযোগ্য টপিক।
পড়ার মূল কৌশল:
১. বিগত ১০ বছরের বিসিএস ও পিএসসি নন-ক্যাডার প্রশ্নব্যাংক থেকে এই টপিকের প্রশ্নগুলো আগে আলাদা করুন।
২. সাধারণ নিয়মের ব্যতিক্রমগুলো হাইলাইট করে আলাদা ছোট ডায়েরিতে লিখে রাখুন।
৩. পাঠশালার "Daily Concept Clarifier" ও "Spaced Revision"-এ এই টপিকটি যুক্ত করে সপ্তাহে একবার সেলফ-টেস্ট দিন।

আপনার আর কোনো সুনির্দিষ্ট গাণিতিক সমস্যা বা নিয়ম জানার থাকলে বলুন, আমি সমাধান করে দিচ্ছি।`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      soundEffects.playBeep(750, 0.08);
    }, 600);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Private Tutor
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              বিসিএস, পিএসসি নন-ক্যাডার ও ব্যাংক নিয়োগের ২৪/৭ এআই শিক্ষক
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-1.5"
          title="নতুন চ্যাট শুরু করুন"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">নতুন চ্যাট</span>
        </button>
      </div>

      {/* Suggestion Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item)}
            className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shadow-2xs"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isAI
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isAI
                    ? 'bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {isAI && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="p-1 hover:opacity-100 transition-opacity flex items-center gap-1"
                      title="ভয়েসে শুনুন"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>শুনুন</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
            <span>পাঠশালা এআই শিক্ষক উত্তর লিখছেন...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Composer */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-xs shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="আপনার প্রশ্ন বা দ্বিধা এখানে লিখুন..."
          className="flex-1 px-4 py-2.5 bg-transparent text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
