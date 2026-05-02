export interface SkillVideo {
  id: string;
  title: string;
  duration: string;
  youtubeId: string;
  watched: boolean;
}

export interface SkillVideos {
  skillName: string;
  levelName: string;
  phaseName: string;
  phaseNumber: number;
  videos: SkillVideo[];
  exercises: { id: string; description: string; completed: boolean }[];
}

// Video mapping for each skill - Phase 1 videos
export const SKILL_VIDEO_MAPPING: Record<string, SkillVideos> = {
  "Communication Skills": {
    skillName: "Communication Skills",
    levelName: "Beginner",
    phaseName: "Communication Skills",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Communication Skills - Full Course", duration: "14:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "How to Speak Confidently", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Active Listening Masterclass", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Practice active listening in a conversation", completed: false },
      { id: "2", description: "Record yourself speaking and review it", completed: false },
    ],
  },

  "Content Writing": {
    skillName: "Content Writing",
    levelName: "Beginner",
    phaseName: "Content Writing",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Content Writing for Beginners", duration: "13:20", youtubeId: "Jkc9HdGcTpM", watched: false },
      { id: "2", title: "How to Write Engaging Blog Posts", duration: "16:45", youtubeId: "sDI7EiPV3tA", watched: false },
      { id: "3", title: "SEO Writing Tutorial", duration: "14:30", youtubeId: "xsVTqzratPs", watched: false },
    ],
    exercises: [
      { id: "1", description: "Write a blog post outline", completed: false },
      { id: "2", description: "Practice writing 5 headline variations", completed: false },
    ],
  },

  "Digital Marketing": {
    skillName: "Digital Marketing",
    levelName: "Beginner",
    phaseName: "Digital Marketing",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Digital Marketing Full Course", duration: "14:20", youtubeId: "nU-IIXBWlS4", watched: false },
      { id: "2", title: "Social Media Marketing Strategy", duration: "16:45", youtubeId: "q9gag_dJubQ", watched: false },
      { id: "3", title: "SEO Tutorial for Beginners", duration: "12:30", youtubeId: "xsVTqzratPs", watched: false },
    ],
    exercises: [
      { id: "1", description: "Analyze the marketing funnel of a brand you like", completed: false },
      { id: "2", description: "Create a simple customer journey map", completed: false },
    ],
  },

  "Canva": {
    skillName: "Canva",
    levelName: "Beginner",
    phaseName: "Canva Design",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Canva Tutorial for Beginners", duration: "13:20", youtubeId: "DHBBbfMoFbE", watched: false },
      { id: "2", title: "Graphic Design Basics", duration: "16:45", youtubeId: "9QTCvayLhCA", watched: false },
      { id: "3", title: "Color Theory for Designers", duration: "14:30", youtubeId: "AvgCkHrcj90", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a mood board for a brand", completed: false },
      { id: "2", description: "Practice color palette creation in Canva", completed: false },
    ],
  },

  "Graphic Design": {
    skillName: "Graphic Design",
    levelName: "Beginner",
    phaseName: "Graphic Design",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Canva Tutorial for Beginners", duration: "13:20", youtubeId: "DHBBbfMoFbE", watched: false },
      { id: "2", title: "Graphic Design Basics", duration: "16:45", youtubeId: "9QTCvayLhCA", watched: false },
      { id: "3", title: "Color Theory for Designers", duration: "14:30", youtubeId: "AvgCkHrcj90", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a mood board for a brand", completed: false },
      { id: "2", description: "Practice color palette creation in Canva", completed: false },
    ],
  },

  "MS Office": {
    skillName: "MS Office",
    levelName: "Beginner",
    phaseName: "Microsoft Office",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Microsoft Excel Full Course", duration: "15:20", youtubeId: "PSNXoAs2FtQ", watched: false },
      { id: "2", title: "Word for Beginners", duration: "16:45", youtubeId: "S-qlL8tDMuQ", watched: false },
      { id: "3", title: "PowerPoint Tutorial", duration: "14:30", youtubeId: "MHoI7cMiEwo", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a simple spreadsheet in Excel", completed: false },
      { id: "2", description: "Write a document in Word with formatting", completed: false },
    ],
  },

  "MS Excel": {
    skillName: "MS Excel",
    levelName: "Beginner",
    phaseName: "Microsoft Excel",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Microsoft Excel Full Course", duration: "15:20", youtubeId: "PSNXoAs2FtQ", watched: false },
      { id: "2", title: "Word for Beginners", duration: "16:45", youtubeId: "S-qlL8tDMuQ", watched: false },
      { id: "3", title: "PowerPoint Tutorial", duration: "14:30", youtubeId: "MHoI7cMiEwo", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a simple spreadsheet in Excel", completed: false },
      { id: "2", description: "Write a document in Word with formatting", completed: false },
    ],
  },

  "Interview Preparation": {
    skillName: "Interview Preparation",
    levelName: "Beginner",
    phaseName: "Interview Preparation",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "How to Crack Job Interviews", duration: "13:20", youtubeId: "KIwVQ5XLKVA", watched: false },
      { id: "2", title: "Common Interview Questions", duration: "16:45", youtubeId: "1mHjMNZZvFo", watched: false },
      { id: "3", title: "Body Language in Interviews", duration: "14:30", youtubeId: "PCWVi5pAa30", watched: false },
    ],
    exercises: [
      { id: "1", description: "Prepare answers for 10 common interview questions", completed: false },
      { id: "2", description: "Practice mock interview with a friend", completed: false },
    ],
  },

  "Resume Building": {
    skillName: "Resume Building",
    levelName: "Beginner",
    phaseName: "Resume Building",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "How to Write a Resume", duration: "13:20", youtubeId: "y8YH0Qbu5h4", watched: false },
      { id: "2", title: "Resume Tips for Freshers", duration: "16:45", youtubeId: "Tt08KmFfIYQ", watched: false },
      { id: "3", title: "LinkedIn Profile Tips", duration: "14:30", youtubeId: "BcfGWi8ATCs", watched: false },
    ],
    exercises: [
      { id: "1", description: "Draft your resume from scratch", completed: false },
      { id: "2", description: "Update your LinkedIn profile", completed: false },
    ],
  },

  "Public Speaking": {
    skillName: "Public Speaking",
    levelName: "Beginner",
    phaseName: "Public Speaking",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Public Speaking Full Course", duration: "13:20", youtubeId: "tUqzMkKqVNY", watched: false },
      { id: "2", title: "Overcome Stage Fear", duration: "16:45", youtubeId: "KIMsHKjMmLY", watched: false },
      { id: "3", title: "TED Talk Secrets", duration: "14:30", youtubeId: "Unzc731iCUY", watched: false },
    ],
    exercises: [
      { id: "1", description: "Write and practice a 3-minute speech", completed: false },
      { id: "2", description: "Record yourself and identify improvements", completed: false },
    ],
  },

  "Python": {
    skillName: "Python",
    levelName: "Beginner",
    phaseName: "Python Programming",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Python for Beginners Full Course", duration: "15:20", youtubeId: "kqtD5dpn9C8", watched: false },
      { id: "2", title: "Python Variables and Data Types", duration: "12:45", youtubeId: "cQT33yu9pY8", watched: false },
      { id: "3", title: "Python Control Flow", duration: "18:20", youtubeId: "DZwmZ8Usvnk", watched: false },
    ],
    exercises: [
      { id: "1", description: "Write a Hello World program", completed: false },
      { id: "2", description: "Create variables of different types", completed: false },
    ],
  },

  "Web Development": {
    skillName: "Web Development",
    levelName: "Beginner",
    phaseName: "Web Development",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "HTML Full Course", duration: "12:20", youtubeId: "pQN-pnXPaVg", watched: false },
      { id: "2", title: "CSS Tutorial", duration: "19:45", youtubeId: "1Rs2ND1ryYc", watched: false },
      { id: "3", title: "JavaScript Basics", duration: "16:30", youtubeId: "W6NZfCO5SIk", watched: false },
    ],
    exercises: [
      { id: "1", description: "Build your first HTML page", completed: false },
      { id: "2", description: "Create a simple personal bio page", completed: false },
    ],
  },

  "UI/UX Design": {
    skillName: "UI/UX Design",
    levelName: "Beginner",
    phaseName: "UI/UX Design",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "UI UX Design Full Course", duration: "13:20", youtubeId: "5CxXhyhT6Fc", watched: false },
      { id: "2", title: "Figma Tutorial", duration: "18:45", youtubeId: "FTFaQWZBqQ8", watched: false },
      { id: "3", title: "Design Thinking", duration: "22:30", youtubeId: "a7sEoEvT8l8", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a free Figma account and explore", completed: false },
      { id: "2", description: "Sketch wireframes for a simple app by hand", completed: false },
    ],
  },

  "Data Science": {
    skillName: "Data Science",
    levelName: "Beginner",
    phaseName: "Data Science",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Data Science Full Course", duration: "15:20", youtubeId: "ua-CiDNNj30", watched: false },
      { id: "2", title: "Statistics for Beginners", duration: "18:45", youtubeId: "xxpc-HPKN28", watched: false },
      { id: "3", title: "Excel for Data Analysis", duration: "14:30", youtubeId: "PSNXoAs2FtQ", watched: false },
    ],
    exercises: [
      { id: "1", description: "Install Python and Jupyter Notebook", completed: false },
      { id: "2", description: "Practice basic Python operations in Jupyter", completed: false },
    ],
  },

  "Machine Learning": {
    skillName: "Machine Learning",
    levelName: "Beginner",
    phaseName: "Machine Learning",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Machine Learning Basics", duration: "17:20", youtubeId: "NWONeJKn6kc", watched: false },
      { id: "2", title: "ML Algorithms Explained", duration: "19:45", youtubeId: "OGxgnH8y2NM", watched: false },
      { id: "3", title: "Python for ML Setup", duration: "15:30", youtubeId: "7eh4d6sabA0", watched: false },
    ],
    exercises: [
      { id: "1", description: "Identify real-world ML applications", completed: false },
      { id: "2", description: "Practice with a simple classification dataset", completed: false },
    ],
  },

  "Cybersecurity": {
    skillName: "Cybersecurity",
    levelName: "Beginner",
    phaseName: "Cybersecurity",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Cybersecurity Full Course", duration: "14:20", youtubeId: "hXSFdwIOfnE", watched: false },
      { id: "2", title: "Ethical Hacking Basics", duration: "11:45", youtubeId: "aU5uMqniukA", watched: false },
      { id: "3", title: "Network Security Fundamentals", duration: "16:30", youtubeId: "E03gh1huvW4", watched: false },
    ],
    exercises: [
      { id: "1", description: "Research and list 5 recent cyber attacks from news", completed: false },
      { id: "2", description: "Identify security vulnerabilities in a sample scenario", completed: false },
    ],
  },

  "Social Media Marketing": {
    skillName: "Social Media Marketing",
    levelName: "Beginner",
    phaseName: "Social Media Marketing",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Social Media Marketing Course", duration: "14:20", youtubeId: "q9gag_dJubQ", watched: false },
      { id: "2", title: "Instagram Growth Strategy", duration: "16:45", youtubeId: "7n7g-9Y3eVU", watched: false },
      { id: "3", title: "Facebook Marketing Tutorial", duration: "14:30", youtubeId: "_4kCmMZyJGA", watched: false },
    ],
    exercises: [
      { id: "1", description: "Analyze social media strategy of a brand", completed: false },
      { id: "2", description: "Create a content calendar for 30 days", completed: false },
    ],
  },

  "Accounting Principles": {
    skillName: "Accounting Principles",
    levelName: "Beginner",
    phaseName: "Accounting Principles",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Accounting Basics Full Course", duration: "15:20", youtubeId: "yYX4bvQSqbo", watched: false },
      { id: "2", title: "Financial Statements Explained", duration: "16:45", youtubeId: "uI4i_a0gOYE", watched: false },
      { id: "3", title: "Bookkeeping for Beginners", duration: "14:30", youtubeId: "4J3Gi1IhbXU", watched: false },
    ],
    exercises: [
      { id: "1", description: "Practice basic accounting equations", completed: false },
      { id: "2", description: "Create a simple balance sheet", completed: false },
    ],
  },

  "Taxation Basics": {
    skillName: "Taxation Basics",
    levelName: "Beginner",
    phaseName: "Taxation Basics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Income Tax for Beginners India", duration: "15:20", youtubeId: "3k6M0VW9p1E", watched: false },
      { id: "2", title: "GST Complete Guide", duration: "16:45", youtubeId: "2Q-R2gNkm48", watched: false },
      { id: "3", title: "Tax Filing Tutorial India", duration: "14:30", youtubeId: "FP8pFHbHdE4", watched: false },
    ],
    exercises: [
      { id: "1", description: "Calculate income tax for a sample case", completed: false },
      { id: "2", description: "Understand GST registration process", completed: false },
    ],
  },

  "Financial Statements": {
    skillName: "Financial Statements",
    levelName: "Beginner",
    phaseName: "Financial Statements",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Financial Statements Full Course", duration: "15:20", youtubeId: "uI4i_a0gOYE", watched: false },
      { id: "2", title: "Balance Sheet Explained", duration: "16:45", youtubeId: "A5CJ_BZlIaA", watched: false },
      { id: "3", title: "Profit and Loss Statement", duration: "14:30", youtubeId: "nIMklDa_8MQ", watched: false },
    ],
    exercises: [
      { id: "1", description: "Analyze a sample balance sheet", completed: false },
      { id: "2", description: "Create a P&L statement", completed: false },
    ],
  },

  "Tally Excel": {
    skillName: "Tally Excel",
    levelName: "Beginner",
    phaseName: "Tally Excel",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Tally Prime Full Course", duration: "15:20", youtubeId: "bqbI4h-bCEg", watched: false },
      { id: "2", title: "Excel for Accountants", duration: "16:45", youtubeId: "PSNXoAs2FtQ", watched: false },
      { id: "3", title: "Advanced Excel Tutorial", duration: "14:30", youtubeId: "K74_FNnlIF8", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a company in Tally", completed: false },
      { id: "2", description: "Use Excel formulas for accounting", completed: false },
    ],
  },

  "Business Laws": {
    skillName: "Business Laws",
    levelName: "Beginner",
    phaseName: "Business Laws",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Business Law Basics", duration: "15:20", youtubeId: "dlYUAcwMY9g", watched: false },
      { id: "2", title: "Contract Law Explained", duration: "16:45", youtubeId: "VvqsEEB9Zj4", watched: false },
      { id: "3", title: "Company Law India", duration: "14:30", youtubeId: "4J3Gi1IhbXU", watched: false },
    ],
    exercises: [
      { id: "1", description: "Understand basic business law concepts", completed: false },
      { id: "2", description: "Review a sample contract", completed: false },
    ],
  },

  "CA Foundation Prep": {
    skillName: "CA Foundation Prep",
    levelName: "Beginner",
    phaseName: "CA Foundation Prep",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "CA Foundation Complete Guide", duration: "15:20", youtubeId: "n8TBWx8Yd7M", watched: false },
      { id: "2", title: "CA Foundation Maths", duration: "16:45", youtubeId: "yTGCOEpG9E0", watched: false },
      { id: "3", title: "CA Foundation Economics", duration: "14:30", youtubeId: "vRpCCh9x-NA", watched: false },
    ],
    exercises: [
      { id: "1", description: "Practice CA foundation sample questions", completed: false },
      { id: "2", description: "Create a study schedule", completed: false },
    ],
  },

  "Content Creation": {
    skillName: "Content Creation",
    levelName: "Beginner",
    phaseName: "Content Creation",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Content Creation Masterclass", duration: "13:20", youtubeId: "Jkc9HdGcTpM", watched: false },
      { id: "2", title: "Video Content for Beginners", duration: "16:45", youtubeId: "XpopyNZKYKw", watched: false },
      { id: "3", title: "Instagram Reels Strategy", duration: "14:30", youtubeId: "7n7g-9Y3eVU", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a content calendar for 30 days", completed: false },
      { id: "2", description: "Write and publish your first blog post", completed: false },
    ],
  },

  "Video Editing": {
    skillName: "Video Editing",
    levelName: "Beginner",
    phaseName: "Video Editing",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Video Editing for Beginners", duration: "13:20", youtubeId: "8NRi4T8RsAE", watched: false },
      { id: "2", title: "Premiere Pro Full Course", duration: "16:45", youtubeId: "Hls3Tp7JS8E", watched: false },
      { id: "3", title: "Reels Editing Tutorial", duration: "14:30", youtubeId: "GhFHi4dTKtc", watched: false },
    ],
    exercises: [
      { id: "1", description: "Edit a simple video using free tools", completed: false },
      { id: "2", description: "Add transitions and effects to a video", completed: false },
    ],
  },

  "YouTube SEO": {
    skillName: "YouTube SEO",
    levelName: "Beginner",
    phaseName: "YouTube SEO",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "YouTube SEO Tutorial", duration: "13:20", youtubeId: "aMdYKCB2ELw", watched: false },
      { id: "2", title: "YouTube Algorithm Explained", duration: "16:45", youtubeId: "oAJnwBaSyAs", watched: false },
      { id: "3", title: "YouTube Growth Strategy", duration: "14:30", youtubeId: "XpopyNZKYKw", watched: false },
    ],
    exercises: [
      { id: "1", description: "Optimize a video title and description", completed: false },
      { id: "2", description: "Research keywords for your niche", completed: false },
    ],
  },

  "Storytelling": {
    skillName: "Storytelling",
    levelName: "Beginner",
    phaseName: "Storytelling",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Storytelling Masterclass", duration: "13:20", youtubeId: "HSoHeSjFMkk", watched: false },
      { id: "2", title: "How to Tell a Great Story", duration: "16:45", youtubeId: "oP3c1h8v2ZQ", watched: false },
      { id: "3", title: "Narrative Writing Tips", duration: "14:30", youtubeId: "sDI7EiPV3tA", watched: false },
    ],
    exercises: [
      { id: "1", description: "Write a short story with a clear arc", completed: false },
      { id: "2", description: "Practice telling a story to someone", completed: false },
    ],
  },

  "Digital Reporting": {
    skillName: "Digital Reporting",
    levelName: "Beginner",
    phaseName: "Digital Reporting",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Digital Journalism Course", duration: "13:20", youtubeId: "Jkc9HdGcTpM", watched: false },
      { id: "2", title: "Online Reporting Basics", duration: "16:45", youtubeId: "sDI7EiPV3tA", watched: false },
      { id: "3", title: "Fact Checking in Journalism", duration: "14:30", youtubeId: "HSoHeSjFMkk", watched: false },
    ],
    exercises: [
      { id: "1", description: "Write a digital news article", completed: false },
      { id: "2", description: "Practice fact-checking online content", completed: false },
    ],
  },

  // Hyphenated skill mappings for URL compatibility
  "social-media-marketing": {
    skillName: "Social Media Marketing",
    levelName: "Beginner",
    phaseName: "Social Media Marketing",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Social Media Marketing Full Course", duration: "18:30", youtubeId: "q9gag_dJubQ", watched: false },
      { id: "2", title: "Instagram Growth Strategy 2024", duration: "15:45", youtubeId: "7n7g-9Y3eVU", watched: false },
      { id: "3", title: "Facebook & Instagram Ads Tutorial", duration: "22:10", youtubeId: "_4kCmMZyJGA", watched: false },
    ],
    exercises: [
      { id: "1", description: "Analyze social media strategy of a brand", completed: false },
      { id: "2", description: "Create a content calendar for 30 days", completed: false },
    ],
  },

  "content-creation": {
    skillName: "Content Creation",
    levelName: "Beginner",
    phaseName: "Content Creation",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Content Creation Masterclass", duration: "20:15", youtubeId: "Jkc9HdGcTpM", watched: false },
      { id: "2", title: "How to Make Viral Reels", duration: "12:30", youtubeId: "7n7g-9Y3eVU", watched: false },
      { id: "3", title: "YouTube Content Strategy", duration: "16:45", youtubeId: "XpopyNZKYKw", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a content calendar for 30 days", completed: false },
      { id: "2", description: "Write and publish your first blog post", completed: false },
    ],
  },

  "communication-skills": {
    skillName: "Communication Skills",
    levelName: "Beginner",
    phaseName: "Communication Skills",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Communication Skills Training", duration: "14:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "How to Speak Confidently", duration: "11:30", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Active Listening Masterclass", duration: "13:15", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Practice active listening in a conversation", completed: false },
      { id: "2", description: "Record yourself speaking and review it", completed: false },
    ],
  },

  "accounting-principles": {
    skillName: "Accounting Principles",
    levelName: "Beginner",
    phaseName: "Accounting Principles",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Accounting Basics Full Course", duration: "25:30", youtubeId: "yYX4bvQSqbo", watched: false },
      { id: "2", title: "Financial Statements Explained", duration: "18:45", youtubeId: "uI4i_a0gOYE", watched: false },
      { id: "3", title: "Bookkeeping for Beginners", duration: "20:10", youtubeId: "4J3Gi1IhbXU", watched: false },
    ],
    exercises: [
      { id: "1", description: "Practice basic accounting equations", completed: false },
      { id: "2", description: "Create a simple balance sheet", completed: false },
    ],
  },

  "python": {
    skillName: "Python",
    levelName: "Beginner",
    phaseName: "Python Programming",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Python for Beginners Full Course", duration: "15:30", youtubeId: "kqtD5dpn9C8", watched: false },
      { id: "2", title: "Python Variables and Data Types", duration: "12:45", youtubeId: "cQT33yu9pY8", watched: false },
      { id: "3", title: "Python Control Flow", duration: "18:20", youtubeId: "DZwmZ8Usvnk", watched: false },
    ],
    exercises: [
      { id: "1", description: "Write a Hello World program", completed: false },
      { id: "2", description: "Create variables of different types", completed: false },
    ],
  },

  "web-development": {
    skillName: "Web Development",
    levelName: "Beginner",
    phaseName: "Web Development",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "HTML Full Course for Beginners", duration: "19:45", youtubeId: "pQN-pnXPaVg", watched: false },
      { id: "2", title: "CSS Tutorial for Beginners", duration: "16:30", youtubeId: "1Rs2ND1ryYc", watched: false },
      { id: "3", title: "JavaScript Basics", duration: "22:15", youtubeId: "W6NZfCO5SIk", watched: false },
    ],
    exercises: [
      { id: "1", description: "Build your first HTML page", completed: false },
      { id: "2", description: "Create a simple personal bio page", completed: false },
    ],
  },

  "digital-marketing": {
    skillName: "Digital Marketing",
    levelName: "Beginner",
    phaseName: "Digital Marketing",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Digital Marketing Full Course", duration: "24:30", youtubeId: "nU-IIXBWlS4", watched: false },
      { id: "2", title: "SEO Tutorial for Beginners", duration: "18:15", youtubeId: "xsVTqzratPs", watched: false },
      { id: "3", title: "Google Ads Tutorial", duration: "20:45", youtubeId: "lD3PzWBJ7k4", watched: false },
    ],
    exercises: [
      { id: "1", description: "Analyze the marketing funnel of a brand", completed: false },
      { id: "2", description: "Create a simple customer journey map", completed: false },
    ],
  },

  "graphic-design": {
    skillName: "Graphic Design",
    levelName: "Beginner",
    phaseName: "Graphic Design",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Graphic Design Full Course", duration: "16:20", youtubeId: "9QTCvayLhCA", watched: false },
      { id: "2", title: "Canva Tutorial for Beginners", duration: "14:30", youtubeId: "DHBBbfMoFbE", watched: false },
      { id: "3", title: "Color Theory for Designers", duration: "12:15", youtubeId: "AvgCkHrcj90", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a mood board for a brand", completed: false },
      { id: "2", description: "Practice color palette creation in Canva", completed: false },
    ],
  },

  "ui-ux-design": {
    skillName: "UI/UX Design",
    levelName: "Beginner",
    phaseName: "UI/UX Design",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "UI UX Design Full Course", duration: "20:30", youtubeId: "5CxXhyhT6Fc", watched: false },
      { id: "2", title: "Figma Tutorial for Beginners", duration: "25:15", youtubeId: "FTFaQWZBqQ8", watched: false },
      { id: "3", title: "Design Thinking Process", duration: "16:45", youtubeId: "a7sEoEvT8l8", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a free Figma account and explore", completed: false },
      { id: "2", description: "Sketch wireframes for a simple app by hand", completed: false },
    ],
  },

  "data-science": {
    skillName: "Data Science",
    levelName: "Beginner",
    phaseName: "Data Science",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Data Science Full Course", duration: "28:30", youtubeId: "ua-CiDNNj30", watched: false },
      { id: "2", title: "Statistics for Data Science", duration: "22:15", youtubeId: "xxpc-HPKN28", watched: false },
      { id: "3", title: "Excel for Data Analysis", duration: "18:45", youtubeId: "PSNXoAs2FtQ", watched: false },
    ],
    exercises: [
      { id: "1", description: "Install Python and Jupyter Notebook", completed: false },
      { id: "2", description: "Practice basic Python operations in Jupyter", completed: false },
    ],
  },

  "machine-learning": {
    skillName: "Machine Learning",
    levelName: "Beginner",
    phaseName: "Machine Learning",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Machine Learning for Beginners", duration: "24:20", youtubeId: "NWONeJKn6kc", watched: false },
      { id: "2", title: "ML Algorithms Explained", duration: "19:30", youtubeId: "OGxgnH8y2NM", watched: false },
      { id: "3", title: "Python for Machine Learning", duration: "22:15", youtubeId: "7eh4d6sabA0", watched: false },
    ],
    exercises: [
      { id: "1", description: "Identify real-world ML applications", completed: false },
      { id: "2", description: "Practice with a simple classification dataset", completed: false },
    ],
  },

  "cybersecurity": {
    skillName: "Cybersecurity",
    levelName: "Beginner",
    phaseName: "Cybersecurity",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Cybersecurity Full Course", duration: "26:30", youtubeId: "hXSFdwIOfnE", watched: false },
      { id: "2", title: "Ethical Hacking Basics", duration: "20:15", youtubeId: "aU5uMqniukA", watched: false },
      { id: "3", title: "Network Security Fundamentals", duration: "18:45", youtubeId: "E03gh1huvW4", watched: false },
    ],
    exercises: [
      { id: "1", description: "Research and list 5 recent cyber attacks from news", completed: false },
      { id: "2", description: "Identify security vulnerabilities in a sample scenario", completed: false },
    ],
  },

  "public-speaking": {
    skillName: "Public Speaking",
    levelName: "Beginner",
    phaseName: "Public Speaking",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Public Speaking Full Course", duration: "16:20", youtubeId: "tUqzMkKqVNY", watched: false },
      { id: "2", title: "Overcome Stage Fear", duration: "12:30", youtubeId: "KIMsHKjMmLY", watched: false },
      { id: "3", title: "TED Talk Secrets", duration: "14:15", youtubeId: "Unzc731iCUY", watched: false },
    ],
    exercises: [
      { id: "1", description: "Write and practice a 3-minute speech", completed: false },
      { id: "2", description: "Record yourself and identify improvements", completed: false },
    ],
  },

  "interview-preparation": {
    skillName: "Interview Preparation",
    levelName: "Beginner",
    phaseName: "Interview Preparation",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "How to Crack Job Interviews", duration: "18:30", youtubeId: "KIwVQ5XLKVA", watched: false },
      { id: "2", title: "Common Interview Questions", duration: "15:45", youtubeId: "1mHjMNZZvFo", watched: false },
      { id: "3", title: "Body Language in Interviews", duration: "12:20", youtubeId: "PCWVi5pAa30", watched: false },
    ],
    exercises: [
      { id: "1", description: "Prepare answers for 10 common interview questions", completed: false },
      { id: "2", description: "Practice mock interview with a friend", completed: false },
    ],
  },

  // HR Skills
  "hr-fundamentals": {
    skillName: "HR Fundamentals",
    levelName: "Beginner",
    phaseName: "HR Fundamentals",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "HR Fundamentals Full Course", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "Human Resource Management Basics", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "HR Roles and Responsibilities", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Understand key HR functions", completed: false },
      { id: "2", description: "Research HR department structure of a company", completed: false },
    ],
  },

  "recruitment-skills": {
    skillName: "Recruitment Skills",
    levelName: "Beginner",
    phaseName: "Recruitment Skills",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Recruitment and Selection Process", duration: "15:20", youtubeId: "KIwVQ5XLKVA", watched: false },
      { id: "2", title: "How to Interview Candidates", duration: "16:45", youtubeId: "1mHjMNZZvFo", watched: false },
      { id: "3", title: "Sourcing and Screening", duration: "14:30", youtubeId: "PCWVi5pAa30", watched: false },
    ],
    exercises: [
      { id: "1", description: "Practice conducting a mock interview", completed: false },
      { id: "2", description: "Create a job description template", completed: false },
    ],
  },

  "ms-excel-for-hr": {
    skillName: "MS Excel for HR",
    levelName: "Beginner",
    phaseName: "MS Excel for HR",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Excel for HR Professionals", duration: "15:20", youtubeId: "PSNXoAs2FtQ", watched: false },
      { id: "2", title: "HR Data Analysis in Excel", duration: "16:45", youtubeId: "K74_FNnlIF8", watched: false },
      { id: "3", title: "Excel Formulas for HR", duration: "14:30", youtubeId: "S-qlL8tDMuQ", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create an employee database in Excel", completed: false },
      { id: "2", description: "Use Excel formulas for HR calculations", completed: false },
    ],
  },

  "labor-laws-basics": {
    skillName: "Labor Laws Basics",
    levelName: "Beginner",
    phaseName: "Labor Laws Basics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Indian Labor Laws Overview", duration: "15:20", youtubeId: "dlYUAcwMY9g", watched: false },
      { id: "2", title: "Employee Rights and Laws", duration: "16:45", youtubeId: "VvqsEEB9Zj4", watched: false },
      { id: "3", title: "Compliance for HR", duration: "14:30", youtubeId: "4J3Gi1IhbXU", watched: false },
    ],
    exercises: [
      { id: "1", description: "Research key labor laws in India", completed: false },
      { id: "2", description: "Understand employee compliance requirements", completed: false },
    ],
  },

  "hr-analytics": {
    skillName: "HR Analytics",
    levelName: "Beginner",
    phaseName: "HR Analytics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "HR Analytics Introduction", duration: "15:20", youtubeId: "PSNXoAs2FtQ", watched: false },
      { id: "2", title: "Data-Driven HR Decisions", duration: "16:45", youtubeId: "K74_FNnlIF8", watched: false },
      { id: "3", title: "HR Metrics and KPIs", duration: "14:30", youtubeId: "xxpc-HPKN28", watched: false },
    ],
    exercises: [
      { id: "1", description: "Identify key HR metrics", completed: false },
      { id: "2", description: "Create a simple HR dashboard in Excel", completed: false },
    ],
  },

  "interview-techniques": {
    skillName: "Interview Techniques",
    levelName: "Beginner",
    phaseName: "Interview Techniques",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Interview Techniques for HR", duration: "15:20", youtubeId: "KIwVQ5XLKVA", watched: false },
      { id: "2", title: "Behavioral Interview Questions", duration: "16:45", youtubeId: "1mHjMNZZvFo", watched: false },
      { id: "3", title: "Structured Interview Process", duration: "14:30", youtubeId: "PCWVi5pAa30", watched: false },
    ],
    exercises: [
      { id: "1", description: "Practice structured interview techniques", completed: false },
      { id: "2", description: "Create an interview evaluation form", completed: false },
    ],
  },

  "linkedin-for-hr": {
    skillName: "LinkedIn for HR",
    levelName: "Beginner",
    phaseName: "LinkedIn for HR",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "LinkedIn Recruiting Guide", duration: "15:20", youtubeId: "BcfGWi8ATCs", watched: false },
      { id: "2", title: "Sourcing Candidates on LinkedIn", duration: "16:45", youtubeId: "Tt08KmFfIYQ", watched: false },
      { id: "3", title: "LinkedIn for HR Branding", duration: "14:30", youtubeId: "y8YH0Qbu5h4", watched: false },
    ],
    exercises: [
      { id: "1", description: "Optimize LinkedIn profile for HR", completed: false },
      { id: "2", description: "Practice candidate sourcing on LinkedIn", completed: false },
    ],
  },

  // Marketing Skills
  "marketing-fundamentals": {
    skillName: "Marketing Fundamentals",
    levelName: "Beginner",
    phaseName: "Marketing Fundamentals",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Marketing Fundamentals Full Course", duration: "15:20", youtubeId: "nU-IIXBWlS4", watched: false },
      { id: "2", title: "Marketing Mix 4Ps", duration: "16:45", youtubeId: "q9gag_dJubQ", watched: false },
      { id: "3", title: "Brand Management Basics", duration: "14:30", youtubeId: "xsVTqzratPs", watched: false },
    ],
    exercises: [
      { id: "1", description: "Analyze marketing strategy of a brand", completed: false },
      { id: "2", description: "Create a marketing mix for a product", completed: false },
    ],
  },

  "google-analytics": {
    skillName: "Google Analytics",
    levelName: "Beginner",
    phaseName: "Google Analytics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Google Analytics Tutorial", duration: "15:20", youtubeId: "lD3PzWBJ7k4", watched: false },
      { id: "2", title: "GA4 for Beginners", duration: "16:45", youtubeId: "xsVTqzratPs", watched: false },
      { id: "3", title: "Analytics for Marketing", duration: "14:30", youtubeId: "nU-IIXBWlS4", watched: false },
    ],
    exercises: [
      { id: "1", description: "Set up Google Analytics account", completed: false },
      { id: "2", description: "Analyze website traffic data", completed: false },
    ],
  },

  "seo-basics": {
    skillName: "SEO Basics",
    levelName: "Beginner",
    phaseName: "SEO Basics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "SEO Tutorial for Beginners", duration: "15:20", youtubeId: "xsVTqzratPs", watched: false },
      { id: "2", title: "On-Page SEO", duration: "16:45", youtubeId: "lD3PzWBJ7k4", watched: false },
      { id: "3", title: "Keyword Research", duration: "14:30", youtubeId: "nU-IIXBWlS4", watched: false },
    ],
    exercises: [
      { id: "1", description: "Perform keyword research for a topic", completed: false },
      { id: "2", description: "Optimize a webpage for SEO", completed: false },
    ],
  },

  // Finance Skills
  "financial-accounting": {
    skillName: "Financial Accounting",
    levelName: "Beginner",
    phaseName: "Financial Accounting",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Financial Accounting Full Course", duration: "15:20", youtubeId: "yYX4bvQSqbo", watched: false },
      { id: "2", title: "Accounting Principles", duration: "16:45", youtubeId: "uI4i_a0gOYE", watched: false },
      { id: "3", title: "Financial Statements", duration: "14:30", youtubeId: "4J3Gi1IhbXU", watched: false },
    ],
    exercises: [
      { id: "1", description: "Practice basic accounting entries", completed: false },
      { id: "2", description: "Create a simple balance sheet", completed: false },
    ],
  },

  "ms-excel-advanced": {
    skillName: "MS Excel Advanced",
    levelName: "Beginner",
    phaseName: "MS Excel Advanced",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Advanced Excel Tutorial", duration: "15:20", youtubeId: "K74_FNnlIF8", watched: false },
      { id: "2", title: "Excel Formulas and Functions", duration: "16:45", youtubeId: "PSNXoAs2FtQ", watched: false },
      { id: "3", title: "Pivot Tables in Excel", duration: "14:30", youtubeId: "S-qlL8tDMuQ", watched: false },
    ],
    exercises: [
      { id: "1", description: "Practice advanced Excel formulas", completed: false },
      { id: "2", description: "Create pivot tables for data analysis", completed: false },
    ],
  },

  "financial-analysis": {
    skillName: "Financial Analysis",
    levelName: "Beginner",
    phaseName: "Financial Analysis",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Financial Analysis Tutorial", duration: "15:20", youtubeId: "uI4i_a0gOYE", watched: false },
      { id: "2", title: "Ratio Analysis", duration: "16:45", youtubeId: "nIMklDa_8MQ", watched: false },
      { id: "3", title: "Excel for Financial Analysis", duration: "14:30", youtubeId: "PSNXoAs2FtQ", watched: false },
    ],
    exercises: [
      { id: "1", description: "Perform ratio analysis on financial statements", completed: false },
      { id: "2", description: "Create a financial analysis report", completed: false },
    ],
  },

  "tally-prime": {
    skillName: "Tally Prime",
    levelName: "Beginner",
    phaseName: "Tally Prime",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Tally Prime Full Course", duration: "15:20", youtubeId: "bqbI4h-bCEg", watched: false },
      { id: "2", title: "Tally for Accounting", duration: "16:45", youtubeId: "4J3Gi1IhbXU", watched: false },
      { id: "3", title: "Tally GST Tutorial", duration: "14:30", youtubeId: "2Q-R2gNkm48", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a company in Tally Prime", completed: false },
      { id: "2", description: "Record transactions in Tally", completed: false },
    ],
  },

  "investment-basics": {
    skillName: "Investment Basics",
    levelName: "Beginner",
    phaseName: "Investment Basics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Investment Basics for Beginners", duration: "15:20", youtubeId: "uI4i_a0gOYE", watched: false },
      { id: "2", title: "Stock Market Basics", duration: "16:45", youtubeId: "nIMklDa_8MQ", watched: false },
      { id: "3", title: "Mutual Funds Explained", duration: "14:30", youtubeId: "4J3Gi1IhbXU", watched: false },
    ],
    exercises: [
      { id: "1", description: "Research different investment options", completed: false },
      { id: "2", description: "Create a simple investment plan", completed: false },
    ],
  },

  "financial-modeling": {
    skillName: "Financial Modeling",
    levelName: "Beginner",
    phaseName: "Financial Modeling",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Financial Modeling Tutorial", duration: "15:20", youtubeId: "K74_FNnlIF8", watched: false },
      { id: "2", title: "Excel for Financial Modeling", duration: "16:45", youtubeId: "PSNXoAs2FtQ", watched: false },
      { id: "3", title: "Building Financial Models", duration: "14:30", youtubeId: "uI4i_a0gOYE", watched: false },
    ],
    exercises: [
      { id: "1", description: "Build a simple financial model in Excel", completed: false },
      { id: "2", description: "Create a projection model", completed: false },
    ],
  },

  // Web Development Skills
  "html-css": {
    skillName: "HTML & CSS",
    levelName: "Beginner",
    phaseName: "HTML & CSS",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "HTML Full Course", duration: "15:20", youtubeId: "pQN-pnXPaVg", watched: false },
      { id: "2", title: "CSS Tutorial", duration: "16:45", youtubeId: "1Rs2ND1ryYc", watched: false },
      { id: "3", title: "Responsive Web Design", duration: "14:30", youtubeId: "W6NZfCO5SIk", watched: false },
    ],
    exercises: [
      { id: "1", description: "Build your first HTML page", completed: false },
      { id: "2", description: "Style a webpage with CSS", completed: false },
    ],
  },

  "javascript": {
    skillName: "JavaScript",
    levelName: "Beginner",
    phaseName: "JavaScript",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "JavaScript Full Course", duration: "15:20", youtubeId: "W6NZfCO5SIk", watched: false },
      { id: "2", title: "JavaScript Basics", duration: "16:45", youtubeId: "PkZNo7MFNFg", watched: false },
      { id: "3", title: "DOM Manipulation", duration: "14:30", youtubeId: "W6NZfCO5SIk", watched: false },
    ],
    exercises: [
      { id: "1", description: "Write JavaScript functions", completed: false },
      { id: "2", description: "Manipulate DOM elements", completed: false },
    ],
  },

  "react": {
    skillName: "React",
    levelName: "Beginner",
    phaseName: "React",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "React Tutorial for Beginners", duration: "15:20", youtubeId: "w7ejDZ8SWv8", watched: false },
      { id: "2", title: "React Hooks Explained", duration: "16:45", youtubeId: "T8EZZXSnYBk", watched: false },
      { id: "3", title: "Building React Apps", duration: "14:30", youtubeId: "SqcY0GlETPk", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a simple React component", completed: false },
      { id: "2", description: "Build a React app with hooks", completed: false },
    ],
  },

  "node-js": {
    skillName: "Node.js",
    levelName: "Beginner",
    phaseName: "Node.js",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Node.js Tutorial for Beginners", duration: "15:20", youtubeId: "Oe421EPjeBE", watched: false },
      { id: "2", title: "Express.js Basics", duration: "16:45", youtubeId: "L72fhGm1tfE", watched: false },
      { id: "3", title: "Building APIs with Node", duration: "14:30", youtubeId: "Oe421EPjeBE", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a simple Node.js server", completed: false },
      { id: "2", description: "Build a REST API with Express", completed: false },
    ],
  },

  "database-basics": {
    skillName: "Database Basics",
    levelName: "Beginner",
    phaseName: "Database Basics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Database Tutorial for Beginners", duration: "15:20", youtubeId: "HXV3zeQKqyg", watched: false },
      { id: "2", title: "SQL Basics", duration: "16:45", youtubeId: "7sT4LB3c34A", watched: false },
      { id: "3", title: "MySQL Tutorial", duration: "14:30", youtubeId: "7S_tPM1JhcI", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create a simple database schema", completed: false },
      { id: "2", description: "Write SQL queries", completed: false },
    ],
  },

  "git": {
    skillName: "Git",
    levelName: "Beginner",
    phaseName: "Git",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Git Tutorial for Beginners", duration: "15:20", youtubeId: "RGOj5yH7evk", watched: false },
      { id: "2", title: "GitHub Tutorial", duration: "16:45", youtubeId: "fJ9I_uP9lZo", watched: false },
      { id: "3", title: "Git Commands Explained", duration: "14:30", youtubeId: "RGOj5yH7evk", watched: false },
    ],
    exercises: [
      { id: "1", description: "Initialize a Git repository", completed: false },
      { id: "2", description: "Push code to GitHub", completed: false },
    ],
  },

  "dsa-basics": {
    skillName: "DSA Basics",
    levelName: "Beginner",
    phaseName: "DSA Basics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Data Structures Tutorial", duration: "15:20", youtubeId: "B9PLqFc9xqk", watched: false },
      { id: "2", title: "Algorithms Explained", duration: "16:45", youtubeId: "pI0jQsQmQkA", watched: false },
      { id: "3", title: "DSA for Interviews", duration: "14:30", youtubeId: "B9PLqFc9xqk", watched: false },
    ],
    exercises: [
      { id: "1", description: "Implement basic data structures", completed: false },
      { id: "2", description: "Solve simple algorithm problems", completed: false },
    ],
  },

  "system-design-basics": {
    skillName: "System Design Basics",
    levelName: "Beginner",
    phaseName: "System Design Basics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "System Design Tutorial", duration: "15:20", youtubeId: "xRSdKn4KvqY", watched: false },
      { id: "2", title: "Scalability Explained", duration: "16:45", youtubeId: "pI0jQsQmQkA", watched: false },
      { id: "3", title: "Database Design", duration: "14:30", youtubeId: "HXV3zeQKqyg", watched: false },
    ],
    exercises: [
      { id: "1", description: "Design a simple system architecture", completed: false },
      { id: "2", description: "Create a database schema", completed: false },
    ],
  },

  // AI/ML Skills
  "statistics": {
    skillName: "Statistics",
    levelName: "Beginner",
    phaseName: "Statistics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Statistics for Data Science", duration: "15:20", youtubeId: "xxpc-HPKN28", watched: false },
      { id: "2", title: "Probability Basics", duration: "16:45", youtubeId: "ua-CiDNNj30", watched: false },
      { id: "3", title: "Statistical Analysis", duration: "14:30", youtubeId: "PSNXoAs2FtQ", watched: false },
    ],
    exercises: [
      { id: "1", description: "Practice basic statistical calculations", completed: false },
      { id: "2", description: "Analyze a dataset using statistics", completed: false },
    ],
  },

  "data-analysis": {
    skillName: "Data Analysis",
    levelName: "Beginner",
    phaseName: "Data Analysis",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Data Analysis Tutorial", duration: "15:20", youtubeId: "ua-CiDNNj30", watched: false },
      { id: "2", title: "Python for Data Analysis", duration: "16:45", youtubeId: "kqtD5dpn9C8", watched: false },
      { id: "3", title: "Excel for Data Analysis", duration: "14:30", youtubeId: "PSNXoAs2FtQ", watched: false },
    ],
    exercises: [
      { id: "1", description: "Analyze a sample dataset", completed: false },
      { id: "2", description: "Create data visualizations", completed: false },
    ],
  },

  "deep-learning": {
    skillName: "Deep Learning",
    levelName: "Beginner",
    phaseName: "Deep Learning",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Deep Learning Tutorial", duration: "15:20", youtubeId: "NWONeJKn6kc", watched: false },
      { id: "2", title: "Neural Networks Explained", duration: "16:45", youtubeId: "OGxgnH8y2NM", watched: false },
      { id: "3", title: "TensorFlow for Beginners", duration: "14:30", youtubeId: "7eh4d6sabA0", watched: false },
    ],
    exercises: [
      { id: "1", description: "Build a simple neural network", completed: false },
      { id: "2", description: "Train a model on sample data", completed: false },
    ],
  },

  "ml-projects": {
    skillName: "ML Projects",
    levelName: "Beginner",
    phaseName: "ML Projects",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "ML Project Ideas", duration: "15:20", youtubeId: "NWONeJKn6kc", watched: false },
      { id: "2", title: "Building ML Projects", duration: "16:45", youtubeId: "OGxgnH8y2NM", watched: false },
      { id: "3", title: "End-to-End ML Project", duration: "14:30", youtubeId: "7eh4d6sabA0", watched: false },
    ],
    exercises: [
      { id: "1", description: "Complete a simple ML project", completed: false },
      { id: "2", description: "Deploy a model", completed: false },
    ],
  },

  "model-deployment": {
    skillName: "Model Deployment",
    levelName: "Beginner",
    phaseName: "Model Deployment",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Model Deployment Tutorial", duration: "15:20", youtubeId: "7eh4d6sabA0", watched: false },
      { id: "2", title: "MLOps Basics", duration: "16:45", youtubeId: "NWONeJKn6kc", watched: false },
      { id: "3", title: "Deploying ML Models", duration: "14:30", youtubeId: "OGxgnH8y2NM", watched: false },
    ],
    exercises: [
      { id: "1", description: "Deploy a simple model", completed: false },
      { id: "2", description: "Set up a model API", completed: false },
    ],
  },

  // Medical/Pharmacy Skills
  "biology-advanced": {
    skillName: "Biology Advanced",
    levelName: "Beginner",
    phaseName: "Biology Advanced",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Biology for NEET", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "Cell Biology", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Human Physiology", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Study cell biology concepts", completed: false },
      { id: "2", description: "Practice NEET biology questions", completed: false },
    ],
  },

  "chemistry-advanced": {
    skillName: "Chemistry Advanced",
    levelName: "Beginner",
    phaseName: "Chemistry Advanced",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Chemistry for NEET", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "Organic Chemistry", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Physical Chemistry", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Study organic chemistry reactions", completed: false },
      { id: "2", description: "Practice NEET chemistry questions", completed: false },
    ],
  },

  "physics-for-neet": {
    skillName: "Physics for NEET",
    levelName: "Beginner",
    phaseName: "Physics for NEET",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Physics for NEET", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "Mechanics", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Thermodynamics", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Solve physics numerical problems", completed: false },
      { id: "2", description: "Practice NEET physics questions", completed: false },
    ],
  },

  "neet-mock-tests": {
    skillName: "NEET Mock Tests",
    levelName: "Beginner",
    phaseName: "NEET Mock Tests",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "NEET Preparation Strategy", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "Solving NEET Papers", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Time Management for NEET", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Take a NEET mock test", completed: false },
      { id: "2", description: "Analyze mock test performance", completed: false },
    ],
  },

  "medical-terminology": {
    skillName: "Medical Terminology",
    levelName: "Beginner",
    phaseName: "Medical Terminology",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Medical Terminology Basics", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "Common Medical Terms", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Anatomy Terminology", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Learn common medical prefixes", completed: false },
      { id: "2", description: "Practice medical terminology", completed: false },
    ],
  },

  "anatomy-basics": {
    skillName: "Anatomy Basics",
    levelName: "Beginner",
    phaseName: "Anatomy Basics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Human Anatomy Basics", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "Skeletal System", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Organ Systems", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Study human body systems", completed: false },
      { id: "2", description: "Label anatomical structures", completed: false },
    ],
  },

  "study-techniques": {
    skillName: "Study Techniques",
    levelName: "Beginner",
    phaseName: "Study Techniques",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Effective Study Techniques", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "Memory Techniques", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Time Management for Students", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Practice active recall", completed: false },
      { id: "2", description: "Create a study schedule", completed: false },
    ],
  },

  "pharmaceutical-chemistry": {
    skillName: "Pharmaceutical Chemistry",
    levelName: "Beginner",
    phaseName: "Pharmaceutical Chemistry",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Pharmaceutical Chemistry Basics", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "Drug Chemistry", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Medicinal Chemistry", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Study drug structures", completed: false },
      { id: "2", description: "Practice pharmaceutical chemistry problems", completed: false },
    ],
  },

  "pharmacology": {
    skillName: "Pharmacology",
    levelName: "Beginner",
    phaseName: "Pharmacology",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Pharmacology Basics", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "Drug Actions", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Clinical Pharmacology", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Study drug mechanisms", completed: false },
      { id: "2", description: "Practice pharmacology questions", completed: false },
    ],
  },

  "gpat-preparation": {
    skillName: "GPAT Preparation",
    levelName: "Beginner",
    phaseName: "GPAT Preparation",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "GPAT Preparation Strategy", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "GPAT Mock Tests", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "GPAT Syllabus Coverage", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Take a GPAT mock test", completed: false },
      { id: "2", description: "Analyze GPAT preparation", completed: false },
    ],
  },

  "drug-regulations": {
    skillName: "Drug Regulations",
    levelName: "Beginner",
    phaseName: "Drug Regulations",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Drug Regulations in India", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "FDA Guidelines", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Pharmacy Law", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Study drug approval process", completed: false },
      { id: "2", description: "Understand pharmacy regulations", completed: false },
    ],
  },

  "clinical-pharmacy-basics": {
    skillName: "Clinical Pharmacy Basics",
    levelName: "Beginner",
    phaseName: "Clinical Pharmacy Basics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Clinical Pharmacy Basics", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "Patient Counseling", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Clinical Practice", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Practice patient counseling scenarios", completed: false },
      { id: "2", description: "Study clinical pharmacy cases", completed: false },
    ],
  },

  // Health Tech Skills
  "python-basics": {
    skillName: "Python Basics",
    levelName: "Beginner",
    phaseName: "Python Basics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Python for Beginners", duration: "15:20", youtubeId: "kqtD5dpn9C8", watched: false },
      { id: "2", title: "Python Basics", duration: "16:45", youtubeId: "cQT33yu9pY8", watched: false },
      { id: "3", title: "Python Control Flow", duration: "14:30", youtubeId: "DZwmZ8Usvnk", watched: false },
    ],
    exercises: [
      { id: "1", description: "Write Python programs", completed: false },
      { id: "2", description: "Practice Python syntax", completed: false },
    ],
  },

  "healthcare-data": {
    skillName: "Healthcare Data",
    levelName: "Beginner",
    phaseName: "Healthcare Data",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Healthcare Data Analytics", duration: "15:20", youtubeId: "PSNXoAs2FtQ", watched: false },
      { id: "2", title: "Medical Data Management", duration: "16:45", youtubeId: "K74_FNnlIF8", watched: false },
      { id: "3", title: "Health Informatics", duration: "14:30", youtubeId: "xxpc-HPKN28", watched: false },
    ],
    exercises: [
      { id: "1", description: "Analyze healthcare datasets", completed: false },
      { id: "2", description: "Practice medical data management", completed: false },
    ],
  },

  "bioinformatics": {
    skillName: "Bioinformatics",
    levelName: "Beginner",
    phaseName: "Bioinformatics",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Bioinformatics Basics", duration: "15:20", youtubeId: "kqtD5dpn9C8", watched: false },
      { id: "2", title: "Computational Biology", duration: "16:45", youtubeId: "ua-CiDNNj30", watched: false },
      { id: "3", title: "Bioinformatics Tools", duration: "14:30", youtubeId: "xxpc-HPKN28", watched: false },
    ],
    exercises: [
      { id: "1", description: "Use bioinformatics tools", completed: false },
      { id: "2", "description": "Analyze biological data", completed: false },
    ],
  },

  "excel-for-healthcare": {
    skillName: "Excel for Healthcare",
    levelName: "Beginner",
    phaseName: "Excel for Healthcare",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Excel for Healthcare Professionals", duration: "15:20", youtubeId: "PSNXoAs2FtQ", watched: false },
      { id: "2", title: "Healthcare Data in Excel", duration: "16:45", youtubeId: "K74_FNnlIF8", watched: false },
      { id: "3", title: "Medical Records Management", duration: "14:30", youtubeId: "S-qlL8tDMuQ", watched: false },
    ],
    exercises: [
      { id: "1", description: "Create healthcare data spreadsheets", completed: false },
      { id: "2", description: "Manage medical records in Excel", completed: false },
    ],
  },

  "research-methods": {
    skillName: "Research Methods",
    levelName: "Beginner",
    phaseName: "Research Methods",
    phaseNumber: 1,
    videos: [
      { id: "1", title: "Research Methods Basics", duration: "15:20", youtubeId: "HAnw168huqA", watched: false },
      { id: "2", title: "Scientific Research", duration: "16:45", youtubeId: "tShavGuo0_E", watched: false },
      { id: "3", title: "Data Collection Methods", duration: "14:30", youtubeId: "H0_yKBitO8M", watched: false },
    ],
    exercises: [
      { id: "1", description: "Design a research study", completed: false },
      { id: "2", description: "Practice data collection methods", completed: false },
    ],
  },
};

// Function to get videos for a skill
export function getVideosForSkill(skillName: string, level: string = "Beginner", phase: number = 1): SkillVideos {
  // Normalize skill name for matching - convert to lowercase and replace spaces with hyphens
  const normalizedSkill = skillName.trim().toLowerCase().replace(/\s+/g, '-');
  
  // Debug logging
  console.log('getVideosForSkill - Input skillName:', skillName);
  console.log('getVideosForSkill - Normalized skill:', normalizedSkill);
  console.log('getVideosForSkill - Available keys:', Object.keys(SKILL_VIDEO_MAPPING));
  
  // Try to find exact match with hyphens
  const exactMatch = Object.keys(SKILL_VIDEO_MAPPING).find(
    key => key.toLowerCase().replace(/\s+/g, '-') === normalizedSkill
  );
  
  console.log('getVideosForSkill - Exact match:', exactMatch);
  
  if (exactMatch) {
    const mapping = SKILL_VIDEO_MAPPING[exactMatch];
    console.log('getVideosForSkill - Using exact match mapping for:', exactMatch);
    return {
      ...mapping,
      levelName: level,
      phaseNumber: phase,
      phaseName: mapping.phaseName,
    };
  }
  
  // Try exact match without hyphens
  const exactMatchNoHyphen = Object.keys(SKILL_VIDEO_MAPPING).find(
    key => key.toLowerCase() === normalizedSkill
  );
  
  console.log('getVideosForSkill - Exact match no hyphen:', exactMatchNoHyphen);
  
  if (exactMatchNoHyphen) {
    const mapping = SKILL_VIDEO_MAPPING[exactMatchNoHyphen];
    console.log('getVideosForSkill - Using exact match no hyphen for:', exactMatchNoHyphen);
    return {
      ...mapping,
      levelName: level,
      phaseNumber: phase,
      phaseName: mapping.phaseName,
    };
  }
  
  // Try partial match
  const partialMatch = Object.keys(SKILL_VIDEO_MAPPING).find(
    key => normalizedSkill.includes(key.toLowerCase().replace(/\s+/g, '-')) || 
           key.toLowerCase().replace(/\s+/g, '-').includes(normalizedSkill)
  );
  
  console.log('getVideosForSkill - Partial match:', partialMatch);
  
  if (partialMatch) {
    const mapping = SKILL_VIDEO_MAPPING[partialMatch];
    console.log('getVideosForSkill - Using partial match for:', partialMatch);
    return {
      ...mapping,
      levelName: level,
      phaseNumber: phase,
      phaseName: mapping.phaseName,
    };
  }
  
  // Generic fallback with skill name in title - using communication skill videos (NOT Python)
  console.log('getVideosForSkill - Using fallback for:', skillName);
  return {
    skillName: skillName,
    levelName: level,
    phaseName: `Phase ${phase}`,
    phaseNumber: phase,
    videos: [
      { 
        id: "1", 
        title: `${skillName} - Introduction`, 
        duration: "15:00", 
        youtubeId: "HAnw168huqA", // Communication Skills video as fallback (NOT Python)
        watched: false 
      },
      { 
        id: "2", 
        title: `${skillName} Fundamentals`, 
        duration: "18:00", 
        youtubeId: "tShavGuo0_E", // Communication Skills video as fallback (NOT Python)
        watched: false 
      },
      { 
        id: "3", 
        title: `Getting Started with ${skillName}`, 
        duration: "20:00", 
        youtubeId: "H0_yKBitO8M", // Communication Skills video as fallback (NOT Python)
        watched: false 
      },
    ],
    exercises: [
      { id: "1", description: `Complete the introduction tutorial for ${skillName}`, completed: false },
      { id: "2", description: `Practice basic concepts of ${skillName}`, completed: false },
    ],
  };
}
