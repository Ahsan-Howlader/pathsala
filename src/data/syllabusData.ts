import { SyllabusSubject } from '../types';

export const SYLLABUS_DATA: SyllabusSubject[] = [
  {
    id: 'bangla',
    name: 'বাংলা ব্যাকরণ ও সাহিত্য',
    icon: 'BookOpen',
    groups: [
      {
        name: 'বাংলা ব্যাকরণ',
        topics: [
          'বানান শুদ্ধকরণ ও ণ-ত্ব ও ষ-ত্ব বিধান',
          'কারক ও বিভক্তি',
          'সমাস ও প্রকারভেদ',
          'সন্ধি ও নিয়মাবলী',
          'শব্দার্থ ও বিপরীত শব্দ',
          'সমার্থক শব্দ ও বাগধারা',
          'এক কথায় প্রকাশ',
          'পদ প্রকরণ ও বাক্য রূপান্তর',
          'উপসর্গ ও অনুসর্গ',
          'ধ্বনি পরিবর্তন ও ধ্বনিতত্ত্ব',
          'পারিভাষিক শব্দ ও অনুবাদ'
        ]
      },
      {
        name: 'বাংলা সাহিত্য',
        topics: [
          'প্রাচীন যুগ: চর্যাপদ ও সমাজচিত্র',
          'মধ্যযুগ: শ্রীকৃষ্ণকীর্তন, বৈষ্ণব পদাবলী ও মঙ্গলকাব্য',
          'রোমান্টিক প্রণয়োপাখ্যান ও আরাকান রাজসভা',
          'ফোর্ট উইলিয়াম কলেজ ও আধুনিক গদ্যের সূচনা',
          'মাইকেল মধুসূদন দত্ত ও আধুনিক বাংলা কবিতা',
          'বঙ্কিমচন্দ্র চট্টোপাধ্যায় ও বাংলা উপন্যাস',
          'রবীন্দ্রনাথ ঠাকুর: কাব্য, নাটক ও ছোটগল্প',
          'কাজী নজরুল ইসলাম: বিদ্রোহী চেতনা ও সাহিত্যকর্ম',
          'জীবনানন্দ দাশ ও কল্লোল যুগ',
          'জসীমউদ্দীন ও পল্লীসাহিত্য',
          'মুক্তিযুদ্ধভিত্তিক সাহিত্য ও উপন্যাস'
        ]
      }
    ]
  },
  {
    id: 'english',
    name: 'English Language & Literature',
    icon: 'FileText',
    groups: [
      {
        name: 'Grammar & Usage',
        topics: [
          'Parts of Speech Identification',
          'Subject-Verb Agreement Rules',
          'Tense & Sequence of Tense',
          'Right Form of Verbs',
          'Prepositions & Appropriate Usage',
          'Voice Change (Active to Passive)',
          'Narration / Direct to Indirect',
          'Conditional Sentences',
          'Clauses & Sentence Transformation',
          'Modifiers & Parallelism',
          'Correction of Common Errors'
        ]
      },
      {
        name: 'Vocabulary & Literature',
        topics: [
          'Synonyms and Antonyms',
          'Idioms and Phrases',
          'Analogy & Word Pairs',
          'Spelling & Commonly Confused Words',
          'One Word Substitutions',
          'Elizabethan & Jacobean Literature (Shakespeare)',
          'Romantic Period (Wordsworth, Keats, Shelley)',
          'Victorian & Modern Period Classics',
          'Literary Terms & Devices'
        ]
      }
    ]
  },
  {
    id: 'math',
    name: 'গাণিতিক যুক্তি ও মানসিক দক্ষতা',
    icon: 'Calculator',
    groups: [
      {
        name: 'পাটিগণিত (Arithmetic)',
        topics: [
          'শতকরা (Percentage) নির্ণয় ও প্রয়োগ',
          'লাভ ও ক্ষতি (Profit & Loss)',
          'সরল ও যৌগিক সুদকষা (Simple & Compound Interest)',
          'অনুপাত ও সমানুপাত (Ratio & Proportion)',
          'ঐকিক নিয়ম, কাজ ও সময় (Unitary Method, Work & Time)',
          'গতিবেগ, ট্রেন ও নৌকার স্রোত (Speed, Train, Boat & Stream)',
          'গড় ও বয়স সংক্রান্ত সমস্যা (Average & Age Problems)',
          'ল.সা.গু ও গ.সা.গু (LCM & HCF)'
        ]
      },
      {
        name: 'বীজগণিত ও জ্যামিতি (Algebra & Geometry)',
        topics: [
          'বীজগণিতীয় সূত্রাবলী ও মান নির্ণয়',
          'উৎপাদকে বিশ্লেষণ ও দ্বিঘাত সমীকরণ',
          'সূচক ও লগারিদম (Indices & Logarithms)',
          'সমান্তর ও গুণোত্তর ধারা (Arithmetic & Geometric Progressions)',
          'সেট ও ভেনচিত্র (Set Theory & Venn Diagrams)',
          'রেখা, কোণ, ত্রিভুজ ও চতুর্ভুজ',
          'বৃত্ত ও পরিমিতি সংক্রান্ত পরিমাপ',
          'স্থানাঙ্ক জ্যামিতি ও ত্রিকোণমিতি'
        ]
      },
      {
        name: 'মানসিক দক্ষতা (Mental Ability)',
        topics: [
          'সংখ্যা ও বর্ণ সিরিজ (Number & Letter Series)',
          'দিক নির্ণয় ও দূরত্ব (Direction Sense)',
          'রক্তের সম্পর্ক (Blood Relations)',
          'ঘড়ি ও ক্যালেন্ডার সংক্রান্ত হিসাব',
          'চিত্র ও জ্যামিতিক প্যাটার্ন বিশ্লেষণ',
          'কোডিং-ডিকোডিং ও সাদৃশ্য'
        ]
      }
    ]
  },
  {
    id: 'bangladesh',
    name: 'বাংলাদেশ বিষয়াবলী',
    icon: 'MapPin',
    groups: [
      {
        name: 'ইতিহাস ও মুক্তিযুদ্ধ',
        topics: [
          'প্রাচীন বাংলার জনপদ ও রাজবংশ',
          'সুলতানি ও মুঘল আমল',
          'ব্রিটিশ ঔপনিবেশিক শাসন ও প্রতিরোধ আন্দোলন',
          '১৯৪৭-এর দেশভাগ ও পাকিস্তান আমল',
          '১৯৫২-এর ভাষা আন্দোলন ও ৬ দফা কর্মসূচি',
          '১৯৬৯-এর গণঅভ্যুত্থান ও ৭০-এর নির্বাচন',
          '১৯৭১-এর মুক্তিযুদ্ধ ও মুজিবনগর সরকার',
          'বীরশ্রেষ্ঠ ও খেতাবপ্রাপ্ত বীর মুক্তিযোদ্ধা',
          'মুক্তিযুদ্ধের সেক্টর ও ঐতিহাসিক দিনপঞ্জি'
        ]
      },
      {
        name: 'সংবিধান, শাসনব্যবস্থা ও অর্থনীতি',
        topics: [
          'বাংলাদেশের সংবিধানের মূলনীতি ও ইতিহাস',
          'সংবিধানের গুরুত্বপূর্ণ অনুচ্ছেদসমূহ (অনুচ্ছেদ ১-১৫৩)',
          'জাতীয় সংসদ ও আইন প্রণয়ন প্রক্রিয়া',
          'বিচার বিভাগ ও স্থানীয় সরকার ব্যবস্থা',
          'বাংলাদেশের ভূপ্রকৃতি ও প্রধান নদ-নদী',
          'অর্থনৈতিক সমীক্ষা ও জাতীয় বাজেট বিশ্লেষণ',
          'মেগা প্রকল্প: পদ্মা সেতু, মেট্রোরেল, কর্ণফুলী টানেল, রূপপুর',
          'বাংলাদেশের কৃষি, শিল্প ও খনিজ সম্পদ',
          'ক্ষুদ্র নৃগোষ্ঠী ও ঐতিহ্যবাহী সংস্কৃতি'
        ]
      }
    ]
  },
  {
    id: 'international',
    name: 'আন্তর্জাতিক বিষয়াবলী',
    icon: 'Globe',
    groups: [
      {
        name: 'বিশ্ব ইতিহাস ও ভূরাজনীতি',
        topics: [
          'প্রথম ও দ্বিতীয় বিশ্বযুদ্ধ এবং ঐতিহাসিক সন্ধি',
          'স্নায়ুযুদ্ধ ও সমসাময়িক বিশ্ব রাজনীতি',
          'জাতিসংঘ ও এর অঙ্গসংগঠনসমূহ (UN, UNESCO, WHO, UNHCR)',
          'আন্তর্জাতিক অর্থনৈতিক প্রতিষ্ঠান (IMF, World Bank, WTO, ADB)',
          'আঞ্চলিক ও আন্তর্জাতিক জোট (SAARC, ASEAN, BIMSTEC, BRICS, NATO, EU)',
          'আন্তর্জাতিক সীমানা, প্রণালী ও ভৌগোলিক ছিটমহল',
          'বিশ্বের প্রধান সামরিক বিরোধ ও মধ্যপ্রাচ্য সংকট',
          'পরিবেশ, বৈশ্বিক উষ্ণতা ও কপ (COP) জলবায়ু সম্মেলন'
        ]
      }
    ]
  },
  {
    id: 'ict_science',
    name: 'বিজ্ঞান ও তথ্যপ্রযুক্তি',
    icon: 'Cpu',
    groups: [
      {
        name: 'কম্পিউটার ও আইসিটি',
        topics: [
          'কম্পিউটার সংগঠন ও হার্ডওয়্যার আর্কিটেকচার',
          'অপারেটিং সিস্টেম ও সফটওয়্যার',
          'নাম্বার সিস্টেম ও বুলিয়ান অ্যালজেবরা',
          'কম্পিউটার নেটওয়ার্ক ও প্রটোকল (LAN, WAN, TCP/IP)',
          'ইন্টারনেট, ওয়েব ও সার্চ ইঞ্জিন কার্যপ্রণালী',
          'ক্লাউড কম্পিউটিং ও সাইবার নিরাপত্তা',
          'কৃত্রিম বুদ্ধিমত্তা (AI), বিগ ডেটা ও মেশিন লার্নিং',
          'ই-কমার্স ও ডিজিটাল বাংলাদেশ/স্মার্ট অর্থনীতি'
        ]
      },
      {
        name: 'সাধারণ বিজ্ঞান',
        topics: [
          'পদার্থের অবস্থা ও পরমাণুর গঠন',
          'আলো, শব্দ ও চুম্বকত্ব',
          'দৈনন্দিন রসায়ন, এসিড-ক্ষার ও পিএইচ (pH)',
          'কোষ, জেনেটিক্স ও মানবদেহের প্রধান অঙ্গসংস্থান',
          'ভিটামিন, খনিজ লবণ ও পুষ্টিবিজ্ঞান',
          'সংক্রামক রোগ, অ্যান্টিবায়োটিক ও ভ্যাকসিন',
          'সৌরজগৎ, মহাবিশ্ব ও আবহাওয়া-জলবায়ু'
        ]
      }
    ]
  }
];

export const ALL_SYLLABUS_TOPICS = SYLLABUS_DATA.flatMap((subj) =>
  subj.groups.flatMap((grp) =>
    grp.topics.map((topic) => ({
      subjectId: subj.id,
      subjectName: subj.name,
      groupName: grp.name,
      topicName: topic,
      key: `${subj.name}|${topic}`
    }))
  )
);
