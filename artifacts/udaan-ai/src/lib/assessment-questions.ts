export interface QuestionData {
  question: string;
  options: string[];
  isFreeText: boolean;
}

export interface AnswerHistory {
  question: string;
  answer: string;
  questionIndex: number;
}

export type QuestionStep = "welcome" | "qualification" | "stream" | "subjects" | "direction" | "field" | "goal" | "plan" | "challenge" | "specific-skills" | "complete";

// WELCOME SCREEN
export const WELCOME_SCREEN: QuestionData = {
  question: "Hey there! 👋 I'm your Udaan AI mentor. I'm going to ask you a few questions to understand you better and build your perfect personalised learning roadmap. There are no right or wrong answers — just be honest and I'll handle the rest!",
  options: ["Let's Begin →"],
  isFreeText: false,
};

// Q1: QUALIFICATION (always same)
export const Q1_QUALIFICATION: QuestionData = {
  question: "First things first — what's your current qualification?",
  options: [
    "📚 In School (10th/11th/12th)",
    "🎓 Completed 12th",
    "🏫 Currently in College/University",
    "🎓 Completed Graduation",
    "💼 Working Professional",
    "🔄 Looking for Career Change",
  ],
  isFreeText: false,
};

// Q2: Stream (if Q1 = School/Completed 12th)
export const Q2_STREAM: QuestionData = {
  question: "Which stream are you in?",
  options: [
    "🔬 Science",
    "📊 Commerce",
    "🎨 Arts/Humanities",
    "📚 Vocational/Other",
  ],
  isFreeText: false,
};

// Q2: Currently studying (if Q1 = Currently in College)
export const Q2_COLLEGE: QuestionData = {
  question: "What are you currently studying?",
  options: [
    "💻 Engineering (BE/BTech)",
    "🖥️ BCA/BSc Computer Science",
    "💼 BBA/BBM/BCom",
    "🎨 Design (BDes/BFA)",
    "📰 Mass Communication/Journalism",
    "🔬 BSc Science",
    "📚 BA Arts/Humanities",
    "⚖️ Law (LLB)",
    "🤷 Other",
  ],
  isFreeText: false,
};

// Q2: Graduated in (if Q1 = Completed Graduation)
export const Q2_GRADUATION: QuestionData = {
  question: "What did you graduate in?",
  options: [
    "💻 Engineering/Technology",
    "💼 Business/Commerce",
    "🎨 Design/Arts",
    "🔬 Science",
    "📰 Media/Journalism",
    "📚 Humanities/Social Science",
    "🤷 Other",
  ],
  isFreeText: false,
};

// Q2: Working in (if Q1 = Working Professional)
export const Q2_WORKING: QuestionData = {
  question: "What field are you currently working in?",
  options: [
    "💻 IT/Technology",
    "📊 Finance/Banking",
    "🎨 Design/Creative",
    "📢 Marketing/Sales",
    "🏥 Healthcare",
    "🏭 Manufacturing/Operations",
    "📚 Education",
    "🤷 Other field",
  ],
  isFreeText: false,
};

// Q2: Currently doing (if Q1 = Career Change)
export const Q2_CAREER_CHANGE: QuestionData = {
  question: "What are you currently doing?",
  options: [
    "💼 Working in non-tech field",
    "🏠 Homemaker wanting to restart career",
    "🎓 Just completed studies, exploring",
    "❌ Job loss, need to rebuild skills",
    "🔄 Completely lost, need guidance",
  ],
  isFreeText: false,
};

// Q3: Science subjects (if Q2 = Science)
export const Q3_SCIENCE_SUBJECTS: QuestionData = {
  question: "Which subjects do you have?",
  options: [
    "📐 PCM (Physics, Chemistry, Maths)",
    "⚗️ PCB (Physics, Chemistry, Biology)",
    "🔬 PCMB (All four subjects)",
    "💻 CS/IT (Computer Science)",
  ],
  isFreeText: false,
};

// Q3: Commerce subjects (if Q2 = Commerce)
export const Q3_COMMERCE_SUBJECTS: QuestionData = {
  question: "Which subjects do you have?",
  options: [
    "📊 With Mathematics",
    "📚 Without Mathematics",
    "💹 Economics & Statistics focused",
    "📱 IT/Computer as additional subject",
  ],
  isFreeText: false,
};

// Q3: Arts subjects (if Q2 = Arts)
export const Q3_ARTS_SUBJECTS: QuestionData = {
  question: "Which subjects/area are you in?",
  options: [
    "✍️ English & Literature",
    "🎨 Fine Arts & Drawing",
    "📰 Journalism & Mass Communication",
    "🧠 Psychology & Sociology",
    "📜 History & Political Science",
    "🗣️ Languages & Linguistics",
  ],
  isFreeText: false,
};

// Q3: Engineering branch (if Q2 = Engineering)
export const Q3_ENGINEERING_BRANCH: QuestionData = {
  question: "Which engineering branch?",
  options: [
    "💻 Computer Science/IT",
    "⚡ Electronics & Communication",
    "⚙️ Mechanical",
    "🏗️ Civil",
    "🔬 Chemical/Other",
  ],
  isFreeText: false,
};

// Q3: Business area (if Q2 = BBA/BCom)
export const Q3_BUSINESS_AREA: QuestionData = {
  question: "What area of business interests you?",
  options: [
    "📢 Marketing & Sales",
    "💰 Finance & Accounting",
    "👥 Human Resources",
    "🏢 Entrepreneurship",
    "💻 Business + Technology (Fintech/Digital)",
    "🤷 Not sure",
  ],
  isFreeText: false,
};

// Q3: Design stream (if Q2 = Design)
export const Q3_DESIGN_STREAM: QuestionData = {
  question: "Which design stream?",
  options: [
    "🖥️ UI/UX Design (apps & web)",
    "🎨 Graphic & Visual Design",
    "🏠 Interior/Product Design",
    "🎬 Motion & Film Design",
    "🤷 Exploring all areas",
  ],
  isFreeText: false,
};

// Q3: Working in tech duration (if Q2 = IT/Technology)
export const Q3_TECH_DURATION: QuestionData = {
  question: "How long have you been working in tech?",
  options: [
    "📅 Less than 1 year (fresher)",
    "📅 1-3 years",
    "📅 3-5 years",
    "📅 5+ years (senior)",
  ],
  isFreeText: false,
};

// Q3: Goal in finance (if Q2 = Finance/Banking)
export const Q3_FINANCE_GOAL: QuestionData = {
  question: "What's your goal?",
  options: [
    "📈 Move to higher position",
    "💹 Get into investment banking",
    "💻 Move into Fintech",
    "🚀 Start financial advisory business",
    "📊 Learn data skills for finance",
  ],
  isFreeText: false,
};

// Q3: Want to move into (if Q2 = Other field wanting to change)
export const Q3_MOVE_INTO: QuestionData = {
  question: "What field do you want to move into?",
  options: [
    "💻 Technology/IT",
    "📊 Data & Analytics",
    "🎨 Design & Creative",
    "📢 Digital Marketing",
    "🏢 Business Management",
    "🤷 Help me decide",
  ],
  isFreeText: false,
};

// Q3: Direction for career change (if Q2 = Career Change)
export const Q3_CAREER_DIRECTION: QuestionData = {
  question: "What direction are you thinking of moving?",
  options: [
    "💻 Technology & Software",
    "📊 Data & Analytics",
    "🎨 Design & Creative",
    "📢 Digital Marketing",
    "✍️ Content & Writing",
    "🤷 Help me decide completely",
  ],
  isFreeText: false,
};

// Q3: Other field (if Q2 = Other in graduation)
export const Q3_OTHER_FIELD: QuestionData = {
  question: "What field were you studying in?",
  options: [
    "📚 Arts & Humanities",
    "⚖️ Law",
    "🏥 Healthcare/Nursing",
    "🌾 Agriculture",
    "📖 Education/Teaching",
    "🤷 Something else",
  ],
  isFreeText: false,
};

// Q4: PCM - Plan after 12th
export const Q4_PCM_PLAN: QuestionData = {
  question: "What's your plan after 12th?",
  options: [
    "🎓 Engineering (JEE preparation)",
    "💻 Direct into Software/Coding",
    "📊 Data Science & AI field",
    "🏦 Finance & Banking sector",
    "🤷 Still confused, need guidance",
  ],
  isFreeText: false,
};

// Q4: PCB - Direction
export const Q4_PCB_DIRECTION: QuestionData = {
  question: "Your biology background opens many doors! What direction interests you?",
  options: [
    "🏥 Medical (NEET preparation)",
    "💊 Pharmacy or Nursing",
    "🧬 Biotech & Research",
    "💻 Health Tech & Bioinformatics",
    "✍️ Medical Content/Writing",
    "🤷 Still figuring out",
  ],
  isFreeText: false,
};

// Q4: PCMB - What pulls you more
export const Q4_PCMB_PULL: QuestionData = {
  question: "You have both maths and biology — great combination! What pulls you more?",
  options: [
    "🏥 Medical/Healthcare path",
    "💻 Technology & Engineering",
    "🧬 Research & Science",
    "📊 Data & Analytics",
    "🤷 Help me decide",
  ],
  isFreeText: false,
};

// Q4: CS/IT - What to build
export const Q4_CS_BUILD: QuestionData = {
  question: "You already have CS background! What do you want to build?",
  options: [
    "🌐 Web Applications",
    "📱 Mobile Apps",
    "🤖 AI & Machine Learning",
    "🔒 Cybersecurity",
    "🎮 Game Development",
    "🤷 Not decided yet",
  ],
  isFreeText: false,
};

// Q4: Commerce with Maths - Direction
export const Q4_COMMERCE_MATHS_DIRECTION: QuestionData = {
  question: "Commerce with Maths opens amazing doors! What direction excites you?",
  options: [
    "📊 Chartered Accountancy (CA)",
    "💹 Stock Market & Trading",
    "📈 Financial Analysis & Banking",
    "💼 Business Management (MBA path)",
    "💻 Fintech (Finance + Technology)",
    "🤷 Still exploring options",
  ],
  isFreeText: false,
};

// Q4: Commerce without Maths - Interests
export const Q4_COMMERCE_NO_MATHS: QuestionData = {
  question: "Commerce without maths still has great opportunities! What interests you?",
  options: [
    "📊 Accounting & Taxation",
    "📢 Marketing & Sales",
    "🏢 Business Management",
    "✍️ Business Content & Writing",
    "💻 Digital Marketing",
    "🤷 Still exploring",
  ],
  isFreeText: false,
};

// Q4: Journalism - What excites you
export const Q4_JOURNALISM: QuestionData = {
  question: "Media is transforming fast! What excites you?",
  options: [
    "📱 Digital Journalism",
    "🎬 Video Content Creation",
    "📻 Podcasting & Audio",
    "✍️ Content Writing & Blogging",
    "📸 Photography & Photojournalism",
    "📺 TV & Broadcast Media",
  ],
  isFreeText: false,
};

// Q4: Fine Arts - Direction
export const Q4_FINE_ARTS: QuestionData = {
  question: "Creative field has gone digital! What direction?",
  options: [
    "🎨 Graphic Design (digital)",
    "📱 UI/UX Design for apps",
    "🎬 Motion Graphics & Animation",
    "📸 Photography (professional)",
    "🖌️ Traditional + digital art",
    "🤷 Not sure yet",
  ],
  isFreeText: false,
};

// Q4: Psychology - Career paths
export const Q4_PSYCHOLOGY: QuestionData = {
  question: "Psychology has many career paths! What interests you?",
  options: [
    "🧠 Clinical Psychology/Counselling",
    "💼 HR & Organizational Psychology",
    "📢 Consumer Psychology/Marketing",
    "📚 Teaching & Research",
    "💻 User Research for Tech products",
  ],
  isFreeText: false,
};

// Q4: English/Literature - Goal
export const Q4_ENGLISH: QuestionData = {
  question: "Language skills are super valuable! What's your goal?",
  options: [
    "✍️ Content Writing & Copywriting",
    "📰 Journalism & Reporting",
    "📚 Publishing & Editing",
    "🎭 Creative Writing",
    "🌐 Technical Writing for Tech",
  ],
  isFreeText: false,
};

// Q4: CS/IT Engineering - Focus
export const Q4_CS_ENGINEERING_FOCUS: QuestionData = {
  question: "CS engineers have many paths! What's your main focus right now?",
  options: [
    "💼 Get placed in good tech company",
    "🚀 Build my own startup",
    "💻 Freelancing alongside college",
    "🎓 Higher studies (MS/MTech)",
    "🤷 Still figuring out",
  ],
  isFreeText: false,
};

// Q4: Non-CS Engineering - Goal
export const Q4_NON_CS_ENGINEERING_GOAL: QuestionData = {
  question: "Many non-CS engineers switch to tech! What's your goal?",
  options: [
    "💻 Switch to software/coding",
    "📊 Data analytics in my field",
    "🏢 Core job in my branch",
    "💼 MBA after engineering",
    "🤷 Not decided yet",
  ],
  isFreeText: false,
};

// Q4: BCA/BSc CS - Focus
export const Q4_BCA_FOCUS: QuestionData = {
  question: "You have a tech foundation! What do you want to focus on?",
  options: [
    "💼 Job placement after graduation",
    "🚀 Freelancing now",
    "💻 Build projects & portfolio",
    "🎓 MCA/MTech after graduation",
    "🤷 Still exploring",
  ],
  isFreeText: false,
};

// Q4: Engineering - Looking for now
export const Q4_ENGINEERING_NOW: QuestionData = {
  question: "What are you looking for now?",
  options: [
    "💼 Job in tech company",
    "🚀 Start my own business",
    "💻 Freelancing",
    "🎓 Higher studies (MS/MBA)",
    "📊 Switch to Data Science/AI",
    "🤷 Still figuring out",
  ],
  isFreeText: false,
};

// Q4: Business - Next step
export const Q4_BUSINESS_NEXT: QuestionData = {
  question: "What's your next step?",
  options: [
    "💼 Corporate job",
    "📊 MBA/Higher studies",
    "🏢 Start my own business",
    "💻 Learn tech skills (Fintech/Digital Marketing)",
    "🤷 Exploring options",
  ],
  isFreeText: false,
};

// Q4: IT working - Goal right now
export const Q4_IT_GOAL: QuestionData = {
  question: "What's your goal right now?",
  options: [
    "📈 Get promoted to senior role",
    "💰 Switch to higher paying company",
    "🤖 Move into AI/ML field",
    "🚀 Start my own tech business",
    "💻 Upskill to stay relevant",
    "🌍 Get international/remote job",
  ],
  isFreeText: false,
};

// Q5: PCM Engineering - Field
export const Q5_ENGINEERING_FIELD: QuestionData = {
  question: "Which engineering field interests you?",
  options: [
    "💻 Computer Science/IT",
    "⚡ Electronics & Communication",
    "⚙️ Mechanical Engineering",
    "🏗️ Civil Engineering",
    "🤷 Not decided yet",
  ],
  isFreeText: false,
};

// Q5: PCM Software - Area
export const Q5_SOFTWARE_AREA: QuestionData = {
  question: "Which area of software development?",
  options: [
    "🌐 Web Development",
    "📱 Mobile App Development",
    "🤖 Artificial Intelligence",
    "🔒 Cybersecurity",
    "🤷 Help me choose",
  ],
  isFreeText: false,
};

// Q5: PCM Data Science - Field
export const Q5_DATA_FIELD: QuestionData = {
  question: "Your maths background is great! Which data field?",
  options: [
    "📊 Data Science & Analytics",
    "🤖 Machine Learning & AI",
    "📈 Business Analytics",
    "💹 Financial Data Analysis",
    "🤷 Not sure yet",
  ],
  isFreeText: false,
};

// Q5: PCB Health Tech - Area
export const Q5_HEALTH_TECH_AREA: QuestionData = {
  question: "Health Tech combines biology + tech! Which area?",
  options: [
    "🧬 Bioinformatics",
    "📊 Healthcare Data Analytics",
    "💊 Pharmaceutical Tech",
    "🏥 Hospital Management Systems",
    "🤷 Explore all options",
  ],
  isFreeText: false,
};

// Q5: PCB Medical - NEET
export const Q5_MEDICAL_NEET: QuestionData = {
  question: "Are you preparing for NEET?",
  options: [
    "✅ Yes actively preparing",
    "📚 Just started preparation",
    "🔄 Dropped and trying again",
    "❌ Reconsidering medical path",
  ],
  isFreeText: false,
};

// Q5: Commerce Maths Fintech - Area
export const Q5_FINTECH_AREA: QuestionData = {
  question: "Fintech is booming in India! Which area?",
  options: [
    "💳 Payment Systems & UPI",
    "🤖 AI in Finance",
    "📊 Financial Data Analytics",
    "💰 Crypto & Blockchain basics",
    "🏦 Digital Banking",
  ],
  isFreeText: false,
};

// Q5: Stock Market - Goal
export const Q5_STOCK_MARKET_GOAL: QuestionData = {
  question: "What's your goal with stock market?",
  options: [
    "📈 Personal investing & trading",
    "💼 Career as financial analyst",
    "🏢 Start investment advisory",
    "📊 Quantitative trading & algo",
    "🤷 General knowledge first",
  ],
  isFreeText: false,
};

// Q5: Digital Marketing - Area
export const Q5_DIGITAL_MARKETING_AREA: QuestionData = {
  question: "Digital marketing is everywhere! Which area?",
  options: [
    "📱 Social Media Marketing",
    "🔍 SEO & Content Marketing",
    "💰 Performance Marketing & Ads",
    "📧 Email & CRM Marketing",
    "🎯 Complete digital marketing",
  ],
  isFreeText: false,
};

// Q5: CS Engineering - Company type
export const Q5_CS_COMPANY_TYPE: QuestionData = {
  question: "Which type of company?",
  options: [
    "🏢 Service companies (TCS/Infosys)",
    "🚀 Product companies (Google/Amazon)",
    "💡 Startups",
    "🌍 International companies",
    "🤷 Any good opportunity",
  ],
  isFreeText: false,
};

// Q5: CS Engineering - Tech area
export const Q5_CS_TECH_AREA: QuestionData = {
  question: "Which tech area are you strongest in?",
  options: [
    "🌐 Web Development",
    "📊 Data Science & AI",
    "📱 Mobile Development",
    "🔒 Cybersecurity",
    "☁️ Cloud & DevOps",
    "🤷 Still building skills",
  ],
  isFreeText: false,
};

// Q5: Marketing - Area
export const Q5_MARKETING_AREA: QuestionData = {
  question: "Marketing has gone digital! Which area?",
  options: [
    "📱 Digital & Social Media Marketing",
    "💰 Performance Marketing",
    "✍️ Content & Brand Marketing",
    "📊 Marketing Analytics",
    "🎯 All round marketing",
  ],
  isFreeText: false,
};

// Q4: Other field - Main goal
export const Q4_OTHER_GOAL: QuestionData = {
  question: "What's your main goal right now?",
  options: [
    "💼 Get a good job",
    "🚀 Start my own business",
    "💻 Learn new skills",
    "🔄 Change my career path",
    "🤷 Still figuring out",
  ],
  isFreeText: false,
};

// Q5: Other field - Interest area
export const Q5_OTHER_INTEREST: QuestionData = {
  question: "Which area interests you most?",
  options: [
    "💻 Technology & Digital Skills",
    "📢 Marketing & Communication",
    "🎨 Design & Creative",
    "📊 Data & Analytics",
    "✍️ Content & Writing",
    "🤷 Help me decide",
  ],
  isFreeText: false,
};

// Q6: Other field - Skill level
export const Q6_OTHER_SKILL_LEVEL: QuestionData = {
  question: "What's your current skill level in your chosen area?",
  options: [
    "❌ Complete beginner",
    "📖 Know some basics",
    "✅ Intermediate level",
    "🔥 Advanced, want to go further",
  ],
  isFreeText: false,
};

// SECOND TO LAST QUESTION: Biggest challenge
export const Q_CHALLENGE: QuestionData = {
  question: "One last thing — what's your biggest challenge when it comes to learning?",
  options: [
    "😰 Don't know where to start",
    "⏰ Can't stay consistent",
    "💸 Worried about cost",
    "🤯 Too much information everywhere",
    "😔 Tried before but gave up",
    "💪 None, I'm ready to go!",
  ],
  isFreeText: false,
};

// Q5: CA Preparation Status (for Commerce + Maths + CA path)
export const Q5_CA_PREPARATION: QuestionData = {
  question: "Have you started CA preparation?",
  options: [
    "❌ Not yet started",
    "📖 Self studying",
    "🏫 Joined coaching",
    "✅ Already registered for foundation",
  ],
  isFreeText: false,
};

// Q6: CA Challenge (for Commerce + Maths + CA path)
export const Q6_CA_CHALLENGE: QuestionData = {
  question: "What's your biggest challenge with CA?",
  options: [
    "📚 Too much syllabus",
    "🧮 Maths and accounts tough",
    "⏰ Time management",
    "💰 Coaching fees",
    "🤷 Don't know where to start",
  ],
  isFreeText: false,
};

// Q5: Video Equipment (for Arts + Journalism + Video path)
export const Q5_VIDEO_EQUIPMENT: QuestionData = {
  question: "Do you have any equipment?",
  options: [
    "📱 Just my smartphone",
    "📷 Basic camera",
    "🎥 Good camera setup",
    "❌ No equipment yet",
  ],
  isFreeText: false,
};

// Q6: Content Goal (for Arts + Journalism + Video path)
export const Q6_CONTENT_GOAL: QuestionData = {
  question: "What's your content goal?",
  options: [
    "💰 Earn through YouTube",
    "📢 Build personal brand",
    "🎬 Work in media industry",
    "🏢 Create for businesses",
    "🤷 Just exploring",
  ],
  isFreeText: false,
};

// Q5: Daily Time (for Working Professional paths)
export const Q5_DAILY_TIME: QuestionData = {
  question: "How many hours can you dedicate daily?",
  options: [
    "⏰ 30 minutes",
    "⏰ 1 hour",
    "⏰ 2 hours",
    "⏰ More than 2 hours",
  ],
  isFreeText: false,
};

// Q6: Timeline (for Working Professional paths)
export const Q6_TIMELINE: QuestionData = {
  question: "What's your timeline to achieve your goal?",
  options: [
    "⚡ ASAP - very urgent",
    "📅 Within 3 months",
    "🗓️ Within 6 months",
    "📆 Within 1 year",
    "🤷 No specific timeline",
  ],
  isFreeText: false,
};

// Common Q4: Work environment (for ALL paths after Q3)
export const Q4_WORK_ENVIRONMENT: QuestionData = {
  question: "What kind of work environment do you prefer?",
  options: [
    "🏢 Corporate/MNC",
    "🚀 Startup",
    "🏠 Work from home/Remote",
    "💼 Freelancing/Own business",
    "🤷 Open to anything",
  ],
  isFreeText: false,
};

// Common Q5: Daily time dedication (for ALL paths)
export const Q5_DAILY_TIME_GENERAL: QuestionData = {
  question: "How much time can you dedicate daily?",
  options: [
    "⏰ 30 minutes",
    "⏰ 1 hour",
    "⏰ 2 hours",
    "⏰ 3+ hours",
  ],
  isFreeText: false,
};

// Common Q6: Timeline (for ALL paths)
export const Q6_TIMELINE_GENERAL: QuestionData = {
  question: "What's your target timeline to get job ready?",
  options: [
    "⚡ 3 months - very urgent",
    "📅 6 months",
    "🗓️ 1 year",
    "📆 No rush, learning at my pace",
  ],
  isFreeText: false,
};

// Common Q7: Career fear (for ALL paths)
export const Q7_CAREER_FEAR: QuestionData = {
  question: "What's your biggest fear about your career?",
  options: [
    "😰 Not getting a good job",
    "💰 Low salary",
    "📚 Not having right skills",
    "🏆 Too much competition",
    "💪 None, I'm confident!",
  ],
  isFreeText: false,
};

// Specific Q4 for BBA/BCom + HR path
export const Q4_HR_AREA: QuestionData = {
  question: "Which HR area interests you most?",
  options: [
    "👥 Recruitment & Talent Acquisition",
    "📚 Learning & Development",
    "💰 Compensation & Benefits",
    "🤝 Employee Relations",
    "📊 HR Analytics",
  ],
  isFreeText: false,
};

// Specific Q4 for BBA/BCom + Marketing path
export const Q4_MARKETING_AREA: QuestionData = {
  question: "Which marketing area?",
  options: [
    "📱 Digital Marketing",
    "📺 Brand Marketing",
    "📊 Market Research",
    "💰 Sales & Business Dev",
    "🎯 Product Marketing",
  ],
  isFreeText: false,
};

// Specific Q4 for BBA/BCom + Finance path
export const Q4_FINANCE_AREA: QuestionData = {
  question: "Which finance area?",
  options: [
    "📊 Financial Analysis",
    "💹 Investment & Trading",
    "🏦 Banking",
    "📈 CA/Accounting",
    "💻 Fintech",
  ],
  isFreeText: false,
};

// Specific Q4 for Engineering + CS path
export const Q4_ENGINEERING_COMPANY: QuestionData = {
  question: "What type of company do you want?",
  options: [
    "🏢 Service (TCS/Infosys/Wipro)",
    "🚀 Product (Google/Amazon/Flipkart)",
    "💡 Startup",
    "🌍 International/Remote",
    "🤷 Best opportunity available",
  ],
  isFreeText: false,
};

// Specific Q5 for Engineering + CS path
export const Q5_ENGINEERING_TECH_SKILL: QuestionData = {
  question: "Which tech area excites you most?",
  options: [
    "🌐 Web Development",
    "📱 Mobile Apps",
    "🤖 AI & Machine Learning",
    "☁️ Cloud & DevOps",
    "🔒 Cybersecurity",
  ],
  isFreeText: false,
};

// Specific Q3 for BCA/BSc CS path (replaces Q4_BCA_FOCUS)
export const Q3_BCA_FOCUS_NEW: QuestionData = {
  question: "What's your main focus?",
  options: [
    "💼 Campus placement",
    "🚀 Startup/Entrepreneurship",
    "💻 Freelancing while studying",
    "🎓 Higher studies after graduation",
    "🤷 Still figuring out",
  ],
  isFreeText: false,
};

// Specific Q4 for BCA/BSc CS path
export const Q4_BCA_AREA: QuestionData = {
  question: "Which area excites you most?",
  options: [
    "🌐 Web Development",
    "📱 App Development",
    "🤖 AI & Data Science",
    "🔒 Cybersecurity",
    "🎨 UI/UX Design",
  ],
  isFreeText: false,
};

// Specific Q5 for BCA/BSc CS path
export const Q5_BCA_TIME: QuestionData = {
  question: "How much time daily for skill building?",
  options: [
    "⏰ 30 minutes",
    "⏰ 1-2 hours",
    "⏰ 3-4 hours",
    "⏰ Full time focus",
  ],
  isFreeText: false,
};

// Specific Q4 for Science PCB path - Medical direction
export const Q4_PCB_MEDICAL_DIRECTION: QuestionData = {
  question: "Which medical direction?",
  options: [
    "🏥 MBBS/Clinical Medicine",
    "💊 Pharmacy/BPharm",
    "🧬 Biotech/Research",
    "👩‍⚕️ Nursing/Allied Health",
    "💻 Health Tech/Bioinformatics",
  ],
  isFreeText: false,
};

// Specific Q5 for Science PCB path - Entrance exam
export const Q5_PCB_ENTRANCE_EXAM: QuestionData = {
  question: "What entrance exam are you preparing for?",
  options: [
    "📝 NEET (MBBS/BDS)",
    "🏫 NEET (BAMS/Ayurvedic)",
    "💊 GPAT (Pharmacy)",
    "🔬 JAM (Research)",
    "💻 JEE (Health Tech)",
  ],
  isFreeText: false,
};

// LAST QUESTION: Specific skills (free text)
export const Q_SPECIFIC_SKILLS: QuestionData = {
  question: "Any specific skills you want to make sure are included in your roadmap?",
  options: ["Skip, build my roadmap →"],
  isFreeText: true,
};

// Function to get next question based on conversation history
export function getNextQuestion(history: AnswerHistory[]): QuestionData | null {
  if (history.length === 0) {
    return WELCOME_SCREEN;
  }

  const lastAnswer = history[history.length - 1].answer;
  const answers = history.map(h => h.answer);

  // After welcome, show Q1 (qualification)
  if (history.length === 1 && history[0].question === WELCOME_SCREEN.question) {
    return Q1_QUALIFICATION;
  }

  // Q1 answered - show Q2 based on qualification
  if (history.length === 2) {
    const q1 = answers[1].toLowerCase();
    if (q1.includes("school") || q1.includes("12th")) {
      return Q2_STREAM;
    } else if (q1.includes("college")) {
      return Q2_COLLEGE;
    } else if (q1.includes("graduation")) {
      return Q2_GRADUATION;
    } else if (q1.includes("working")) {
      return Q2_WORKING;
    } else if (q1.includes("career change")) {
      return Q2_CAREER_CHANGE;
    }
  }

  // Q2 answered - show Q3 based on stream/college/working
  if (history.length === 3) {
    const q1 = answers[1].toLowerCase();
    const q2 = answers[2].toLowerCase();

    if (q1.includes("school") || q1.includes("12th")) {
      if (q2.includes("science")) return Q3_SCIENCE_SUBJECTS;
      if (q2.includes("commerce")) return Q3_COMMERCE_SUBJECTS;
      if (q2.includes("arts")) return Q3_ARTS_SUBJECTS;
    } else if (q1.includes("college")) {
      if (q2.includes("engineering")) return Q3_ENGINEERING_BRANCH;
      if (q2.includes("bba") || q2.includes("bcom")) return Q3_BUSINESS_AREA;
      if (q2.includes("design")) return Q3_DESIGN_STREAM;
      if (q2.includes("other")) return Q3_OTHER_FIELD;
    } else if (q1.includes("graduation")) {
      if (q2.includes("other")) return Q3_OTHER_FIELD;
    } else if (q1.includes("working")) {
      if (q2.includes("it/technology")) return Q3_TECH_DURATION;
      if (q2.includes("finance")) return Q3_FINANCE_GOAL;
      if (!q2.includes("it") && !q2.includes("finance")) return Q3_MOVE_INTO;
      if (q2.includes("other")) return Q3_OTHER_FIELD;
    } else if (q1.includes("career change")) {
      return Q3_CAREER_DIRECTION;
    }
  }

  // Q3 answered - show Q4 based on subjects/branch
  if (history.length === 4) {
    const q1 = answers[1].toLowerCase();
    const q2 = answers[2].toLowerCase();
    const q3 = answers[3].toLowerCase();

    // Handle "Other" field path
    if (q3.includes("other") || q3.includes("something else")) {
      return Q4_OTHER_GOAL;
    }

    if (q1.includes("school") || q1.includes("12th")) {
      if (q2.includes("science")) {
        if (q3.includes("pcm")) return Q4_PCM_PLAN;
        if (q3.includes("pcb")) return Q4_PCB_DIRECTION;
        if (q3.includes("pcmb")) return Q4_PCMB_PULL;
        if (q3.includes("cs") || q3.includes("it")) return Q4_CS_BUILD;
      } else if (q2.includes("commerce")) {
        if (q3.includes("math")) return Q4_COMMERCE_MATHS_DIRECTION;
        if (q3.includes("without")) return Q4_COMMERCE_NO_MATHS;
      } else if (q2.includes("arts")) {
        if (q3.includes("journalism")) return Q4_JOURNALISM;
        if (q3.includes("fine arts")) return Q4_FINE_ARTS;
        if (q3.includes("psychology")) return Q4_PSYCHOLOGY;
        if (q3.includes("english")) return Q4_ENGLISH;
      }
    } else if (q1.includes("college")) {
      if (q2.includes("engineering")) {
        if (q3.includes("cs") || q3.includes("it")) return Q4_CS_ENGINEERING_FOCUS;
        return Q4_NON_CS_ENGINEERING_GOAL;
      }
      if (q2.includes("bca") || q2.includes("bsc")) return Q3_BCA_FOCUS_NEW;
      if (q2.includes("bba") || q2.includes("bcom")) return Q3_BUSINESS_AREA;
    } else if (q1.includes("graduation")) {
      if (q2.includes("engineering")) return Q4_ENGINEERING_NOW;
      if (q2.includes("business")) return Q4_BUSINESS_NEXT;
    } else if (q1.includes("working")) {
      if (q2.includes("it")) return Q4_IT_GOAL;
    }
  }

  // Q4 answered - show Q5 for specific paths
  if (history.length === 5) {
    const q1 = answers[1].toLowerCase();
    const q2 = answers[2].toLowerCase();
    const q3 = answers[3].toLowerCase();
    const q4 = answers[4].toLowerCase();

    // Handle "Other" field path - Q4_OTHER_GOAL answered
    if (q4.includes("goal") || q4.includes("job") || q4.includes("business") || q4.includes("learn") || q4.includes("change")) {
      return Q5_OTHER_INTEREST;
    }

    // BBA/BCom + HR path - show Q4_HR_AREA
    if (q1.includes("college") && (q2.includes("bba") || q2.includes("bcom")) && q3.includes("hr")) {
      return Q4_HR_AREA;
    }

    // BBA/BCom + Marketing path - show Q4_MARKETING_AREA
    if (q1.includes("college") && (q2.includes("bba") || q2.includes("bcom")) && q3.includes("marketing")) {
      return Q4_MARKETING_AREA;
    }

    // BBA/BCom + Finance path - show Q4_FINANCE_AREA
    if (q1.includes("college") && (q2.includes("bba") || q2.includes("bcom")) && q3.includes("finance")) {
      return Q4_FINANCE_AREA;
    }

    // Engineering CS path - show Q4_ENGINEERING_COMPANY
    if (q1.includes("college") && q2.includes("engineering") && (q3.includes("cs") || q3.includes("it"))) {
      return Q4_ENGINEERING_COMPANY;
    }

    // BCA/BSc CS path - show Q4_BCA_AREA after Q3_BCA_FOCUS_NEW
    if (q1.includes("college") && (q2.includes("bca") || q2.includes("bsc"))) {
      return Q4_BCA_AREA;
    }

    // Commerce + Maths + CA path - show Q5_CA_PREPARATION
    if (q1.includes("school") && q2.includes("commerce") && q3.includes("math") && q4.includes("ca")) {
      return Q5_CA_PREPARATION;
    }

    // Arts + Journalism + Video path - show Q5_VIDEO_EQUIPMENT
    if (q1.includes("school") && q2.includes("arts") && q3.includes("journalism") && q4.includes("video")) {
      return Q5_VIDEO_EQUIPMENT;
    }

    if (q1.includes("school") || q1.includes("12th")) {
      if (q2.includes("science")) {
        if (q3.includes("pcm")) {
          if (q4.includes("engineering")) return Q5_ENGINEERING_FIELD;
          if (q4.includes("software")) return Q5_SOFTWARE_AREA;
          if (q4.includes("data")) return Q5_DATA_FIELD;
        }
        if (q3.includes("pcb")) {
          if (q4.includes("health tech")) return Q5_HEALTH_TECH_AREA;
          if (q4.includes("medical")) return Q5_MEDICAL_NEET;
        }
      } else if (q2.includes("commerce")) {
        if (q3.includes("math")) {
          if (q4.includes("fintech")) return Q5_FINTECH_AREA;
          if (q4.includes("stock")) return Q5_STOCK_MARKET_GOAL;
        }
        if (q3.includes("without") && q4.includes("digital marketing")) return Q5_DIGITAL_MARKETING_AREA;
      }
    } else if (q1.includes("college")) {
      if (q2.includes("engineering") && q3.includes("cs") && q4.includes("placed")) {
        return Q5_CS_COMPANY_TYPE;
      }
    }
  }

  // Q5 answered - show Q6 for specific paths
  if (history.length === 6) {
    const q4 = answers[4].toLowerCase();
    const q5 = answers[5].toLowerCase();

    // BBA/BCom + HR path - Q4_HR_AREA answered, show common Q4_WORK_ENVIRONMENT
    if (q4.includes("hr") || q4.includes("recruitment") || q4.includes("learning") || q4.includes("compensation") || q4.includes("employee") || q4.includes("analytics")) {
      return Q4_WORK_ENVIRONMENT;
    }

    // BBA/BCom + Marketing path - Q4_MARKETING_AREA answered, show common Q4_WORK_ENVIRONMENT
    if (q4.includes("digital") || q4.includes("brand") || q4.includes("market research") || q4.includes("sales") || q4.includes("product")) {
      return Q4_WORK_ENVIRONMENT;
    }

    // BBA/BCom + Finance path - Q4_FINANCE_AREA answered, show common Q4_WORK_ENVIRONMENT
    if (q4.includes("financial") || q4.includes("investment") || q4.includes("banking") || q4.includes("ca") || q4.includes("fintech")) {
      return Q4_WORK_ENVIRONMENT;
    }

    // Engineering CS path - Q4_ENGINEERING_COMPANY answered, show Q5_ENGINEERING_TECH_SKILL
    if (q4.includes("service") || q4.includes("product") || q4.includes("startup") || q4.includes("international") || q4.includes("opportunity")) {
      return Q5_ENGINEERING_TECH_SKILL;
    }

    // BCA/BSc CS path - Q4_BCA_AREA answered, show Q5_BCA_TIME
    if (q4.includes("web") || q4.includes("app") || q4.includes("ai") || q4.includes("cybersecurity") || q4.includes("ui")) {
      return Q5_BCA_TIME;
    }

    // Science PCB path - Q4_PCB_MEDICAL_DIRECTION answered, show Q5_PCB_ENTRANCE_EXAM
    if (q4.includes("mbbs") || q4.includes("pharmacy") || q4.includes("biotech") || q4.includes("nursing") || q4.includes("health tech")) {
      return Q5_PCB_ENTRANCE_EXAM;
    }

    // Commerce + CA path - Q5_CA_PREPARATION answered, show Q6_CA_CHALLENGE
    if (q4.includes("ca") && (q5.includes("not yet") || q5.includes("self") || q5.includes("coaching") || q5.includes("registered"))) {
      return Q6_CA_CHALLENGE;
    }

    // Arts + Journalism + Video path - Q5_VIDEO_EQUIPMENT answered, show Q6_CONTENT_GOAL
    if (q4.includes("video") && (q5.includes("smartphone") || q5.includes("camera") || q5.includes("no equipment"))) {
      return Q6_CONTENT_GOAL;
    }

    // Handle "Other" field path - Q5_OTHER_INTEREST answered
    if (q5.includes("technology") || q5.includes("marketing") || q5.includes("design") || q5.includes("data") || q5.includes("content") || q5.includes("help")) {
      return Q6_OTHER_SKILL_LEVEL;
    }
  }

  // Q6 answered - show Q7 for specific paths
  if (history.length === 7) {
    const q5 = answers[5].toLowerCase();
    const q6 = answers[6].toLowerCase();

    // BBA/BCom paths - Q4_WORK_ENVIRONMENT answered, show Q5_DAILY_TIME_GENERAL
    if (q5.includes("corporate") || q5.includes("startup") || q5.includes("remote") || q5.includes("freelancing") || q5.includes("open")) {
      return Q5_DAILY_TIME_GENERAL;
    }

    // Engineering CS path - Q5_ENGINEERING_TECH_SKILL answered, show Q4_WORK_ENVIRONMENT
    if (q5.includes("web") || q5.includes("mobile") || q5.includes("ai") || q5.includes("cloud") || q5.includes("cybersecurity")) {
      return Q4_WORK_ENVIRONMENT;
    }

    // BCA/BSc CS path - Q5_BCA_TIME answered, show Q4_WORK_ENVIRONMENT
    if (q5.includes("30") || q5.includes("1-2") || q5.includes("3-4") || q5.includes("full")) {
      return Q4_WORK_ENVIRONMENT;
    }

    // Handle "Other" field path - Q6_OTHER_SKILL_LEVEL answered
    if (q6.includes("beginner") || q6.includes("basics") || q6.includes("intermediate") || q6.includes("advanced")) {
      return Q_CHALLENGE;
    }
  }

  // Q7 answered - show Q8 (common Q5_DAILY_TIME_GENERAL or Q6_TIMELINE_GENERAL)
  if (history.length === 8) {
    const q6 = answers[6].toLowerCase();
    const q7 = answers[7].toLowerCase();

    // BBA/BCom paths - Q5_DAILY_TIME_GENERAL answered, show Q6_TIMELINE_GENERAL
    if (q6.includes("30") || q6.includes("1 hour") || q6.includes("2 hours") || q6.includes("3+")) {
      return Q6_TIMELINE_GENERAL;
    }

    // Engineering CS path - Q4_WORK_ENVIRONMENT answered, show Q5_DAILY_TIME_GENERAL
    if (q6.includes("corporate") || q6.includes("startup") || q6.includes("remote") || q6.includes("freelancing") || q6.includes("open")) {
      return Q5_DAILY_TIME_GENERAL;
    }

    // BCA/BSc CS path - Q4_WORK_ENVIRONMENT answered, show Q5_DAILY_TIME_GENERAL
    if (q6.includes("corporate") || q6.includes("startup") || q6.includes("remote") || q6.includes("freelancing") || q6.includes("open")) {
      return Q5_DAILY_TIME_GENERAL;
    }
  }

  // Q8 answered - show Q9 (common Q6_TIMELINE_GENERAL or Q7_CAREER_FEAR)
  if (history.length === 9) {
    const q7 = answers[7].toLowerCase();
    const q8 = answers[8].toLowerCase();

    // BBA/BCom paths - Q6_TIMELINE_GENERAL answered, show Q7_CAREER_FEAR
    if (q7.includes("3 months") || q7.includes("6 months") || q7.includes("1 year") || q7.includes("no rush")) {
      return Q7_CAREER_FEAR;
    }

    // Engineering CS path - Q5_DAILY_TIME_GENERAL answered, show Q6_TIMELINE_GENERAL
    if (q7.includes("30") || q7.includes("1 hour") || q7.includes("2 hours") || q7.includes("3+")) {
      return Q6_TIMELINE_GENERAL;
    }

    // BCA/BSc CS path - Q5_DAILY_TIME_GENERAL answered, show Q6_TIMELINE_GENERAL
    if (q7.includes("30") || q7.includes("1 hour") || q7.includes("2 hours") || q7.includes("3+")) {
      return Q6_TIMELINE_GENERAL;
    }
  }

  // Q9 answered - show Q10 (common Q7_CAREER_FEAR or Q_CHALLENGE)
  if (history.length === 10) {
    const q8 = answers[8].toLowerCase();
    const q9 = answers[9].toLowerCase();

    // Engineering CS path - Q6_TIMELINE_GENERAL answered, show Q7_CAREER_FEAR
    if (q8.includes("3 months") || q8.includes("6 months") || q8.includes("1 year") || q8.includes("no rush")) {
      return Q7_CAREER_FEAR;
    }

    // BCA/BSc CS path - Q6_TIMELINE_GENERAL answered, show Q7_CAREER_FEAR
    if (q8.includes("3 months") || q8.includes("6 months") || q8.includes("1 year") || q8.includes("no rush")) {
      return Q7_CAREER_FEAR;
    }

    // BBA/BCom paths - Q7_CAREER_FEAR answered, show Q_CHALLENGE
    if (q9.includes("not getting") || q9.includes("low salary") || q9.includes("not having") || q9.includes("competition") || q9.includes("confident")) {
      return Q_CHALLENGE;
    }
  }

  // Q10 answered - show Q_CHALLENGE for Engineering CS and BCA/BSc CS
  if (history.length === 11) {
    const q9 = answers[9].toLowerCase();
    const q10 = answers[10].toLowerCase();

    // Engineering CS path - Q7_CAREER_FEAR answered, show Q_CHALLENGE
    if (q9.includes("not getting") || q9.includes("low salary") || q9.includes("not having") || q9.includes("competition") || q9.includes("confident")) {
      return Q_CHALLENGE;
    }

    // BCA/BSc CS path - Q7_CAREER_FEAR answered, show Q_CHALLENGE
    if (q9.includes("not getting") || q9.includes("low salary") || q9.includes("not having") || q9.includes("competition") || q9.includes("confident")) {
      return Q_CHALLENGE;
    }
  }

  // Working Professional paths - add Q5_DAILY_TIME after Q2_WORKING or Q2_CAREER_CHANGE
  if (history.length === 3) {
    const q1 = answers[1].toLowerCase();
    const q2 = answers[2].toLowerCase();

    if ((q1.includes("working") || q1.includes("career change")) && (q2.includes("it") || q2.includes("finance") || q2.includes("design") || q2.includes("marketing") || q2.includes("healthcare") || q2.includes("manufacturing") || q2.includes("education") || q2.includes("other"))) {
      return Q5_DAILY_TIME;
    }
  }

  // Q5_DAILY_TIME answered - show Q6_TIMELINE for working professionals
  if (history.length === 4) {
    const q3 = answers[3].toLowerCase();
    if (q3.includes("30 minutes") || q3.includes("1 hour") || q3.includes("2 hours") || q3.includes("more than")) {
      return Q6_TIMELINE;
    }
  }

  // Q6_TIMELINE answered - show challenge question if not already shown
  if (history.length >= 5) {
    const lastQuestion = history[history.length - 1].question;
    if (lastQuestion !== Q_CHALLENGE.question && lastQuestion !== Q_SPECIFIC_SKILLS.question) {
      return Q_CHALLENGE;
    }
    if (lastQuestion === Q_CHALLENGE.question) {
      return Q_SPECIFIC_SKILLS;
    }
  }

  // Assessment complete
  return null;
}

// Skill mapping based on conversation history
export function mapSkillsFromConversation(history: AnswerHistory[]): string[] {
  const answers = history.map(h => h.answer).join(" ").toLowerCase();
  const allAnswers = history.map(h => h.answer);

  // BBA + HR path
  if ((answers.includes("bba") || answers.includes("bcom")) && answers.includes("hr")) {
    return ["HR Fundamentals", "Recruitment Skills", "MS Excel for HR", "Communication Skills", "Labor Laws Basics", "HR Analytics", "Interview Techniques", "LinkedIn for HR"];
  }

  // BBA + Marketing path
  if ((answers.includes("bba") || answers.includes("bcom")) && answers.includes("marketing")) {
    return ["Marketing Fundamentals", "Digital Marketing", "Social Media Marketing", "Content Creation", "Canva", "Google Analytics", "SEO Basics"];
  }

  // BBA + Finance path
  if ((answers.includes("bba") || answers.includes("bcom")) && answers.includes("finance")) {
    return ["Financial Accounting", "MS Excel Advanced", "Financial Analysis", "Tally Prime", "Investment Basics", "Financial Modeling"];
  }

  // BBA + Business Management path
  if ((answers.includes("bba") || answers.includes("bcom")) && (answers.includes("entrepreneurship") || answers.includes("business management"))) {
    return ["Business Strategy", "Project Management", "MS Office Suite", "Communication Skills", "Business Analytics", "Leadership Skills", "Entrepreneurship Basics"];
  }

  // Engineering CS + Web Dev path
  if (answers.includes("engineering") && (answers.includes("cs") || answers.includes("computer science")) && (answers.includes("web") || answers.includes("full stack"))) {
    return ["HTML & CSS", "JavaScript", "React", "Node.js", "Database Basics", "Git", "DSA Basics", "System Design Basics"];
  }

  // Engineering CS + AI/ML path
  if (answers.includes("engineering") && (answers.includes("cs") || answers.includes("computer science")) && (answers.includes("ai") || answers.includes("machine learning"))) {
    return ["Python", "Statistics", "Data Analysis", "Machine Learning", "Deep Learning", "ML Projects", "Model Deployment"];
  }

  // Engineering CS + Mobile path
  if (answers.includes("engineering") && (answers.includes("cs") || answers.includes("computer science")) && answers.includes("mobile")) {
    return ["Flutter", "Dart", "UI Design Basics", "Firebase", "REST APIs", "App Deployment", "React Native Basics"];
  }

  // Engineering CS default (if no specific skill chosen)
  if (answers.includes("engineering") && (answers.includes("cs") || answers.includes("computer science"))) {
    return ["HTML & CSS", "JavaScript", "React", "Node.js", "Database Basics", "Git", "DSA Basics", "System Design Basics"];
  }

  // BCA/BSc CS + Web Dev path
  if ((answers.includes("bca") || answers.includes("bsc")) && answers.includes("computer science") && answers.includes("web")) {
    return ["HTML & CSS", "JavaScript", "React", "PHP or Node.js", "MySQL", "Git", "Portfolio Building"];
  }

  // BCA/BSc CS default
  if ((answers.includes("bca") || answers.includes("bsc")) && answers.includes("computer science")) {
    return ["HTML & CSS", "JavaScript", "React", "PHP or Node.js", "MySQL", "Git", "Portfolio Building"];
  }

  // Arts + Journalism + Video path
  if (answers.includes("arts") && answers.includes("journalism") && answers.includes("video")) {
    return ["Video Shooting Basics", "Premiere Pro", "After Effects Basics", "YouTube SEO", "Content Strategy", "Storytelling", "Social Media Growth", "Monetization"];
  }

  // Commerce + CA path
  if (answers.includes("commerce") && answers.includes("ca")) {
    return ["Accounting Principles", "Taxation", "Financial Statements", "Tally Prime", "Business Laws", "CA Foundation Prep", "MS Excel Advanced", "Audit Basics"];
  }

  // Science + PCM + Data Science path
  if (answers.includes("pcm") && answers.includes("data")) {
    return ["Python", "Statistics & Probability", "Pandas & NumPy", "Data Visualization", "SQL", "Machine Learning", "Data Science Projects"];
  }

  // Science + PCB + MBBS/NEET path
  if (answers.includes("pcb") && (answers.includes("medical") || answers.includes("mbbs") || answers.includes("neet"))) {
    return ["Biology Advanced", "Chemistry Advanced", "Physics for NEET", "NEET Mock Tests", "Medical Terminology", "Anatomy Basics", "Study Techniques", "Previous Year Papers"];
  }

  // Science + PCB + Pharmacy path
  if (answers.includes("pcb") && (answers.includes("pharmacy") || answers.includes("bpharm") || answers.includes("gpat"))) {
    return ["Pharmaceutical Chemistry", "Pharmacology", "GPAT Preparation", "Drug Regulations", "Clinical Pharmacy Basics"];
  }

  // Science + PCB + Health Tech path
  if (answers.includes("pcb") && answers.includes("health tech")) {
    return ["Python Basics", "Healthcare Data", "Bioinformatics", "Medical Terminology", "Excel for Healthcare", "Research Methods"];
  }

  // Working Professional + Career Change to Tech
  if (answers.includes("working") && answers.includes("career change") && answers.includes("tech")) {
    return ["Programming Fundamentals", "Python", "Web Dev Basics", "One Specialization", "Portfolio Projects", "LinkedIn Optimization", "Interview Preparation", "Resume Building"];
  }

  // Arts/Humanities + Get Job
  if (answers.includes("arts") && answers.includes("humanities") && answers.includes("job")) {
    return ["Communication Skills", "Content Writing", "Digital Marketing", "MS Office Basics", "Resume Building", "Interview Preparation"];
  }

  // Arts/Humanities + Business
  if (answers.includes("arts") && answers.includes("humanities") && answers.includes("business")) {
    return ["Business Communication", "Social Media Marketing", "Content Creation", "Basic Finance", "Entrepreneurship Basics", "Brand Building"];
  }

  // Law + Get Job
  if (answers.includes("law") && answers.includes("job")) {
    return ["Legal Research", "Document Drafting", "Communication Skills", "MS Office", "Legal Tech Basics", "Professional Ethics"];
  }

  // Healthcare/Nursing + Upskill
  if (answers.includes("healthcare") || answers.includes("nursing") && answers.includes("upskill")) {
    return ["Healthcare Technology", "Medical Data Basics", "Communication Skills", "MS Excel for Healthcare", "Medical Content Writing", "Patient Management Systems"];
  }

  // Education/Teaching + Upskill
  if (answers.includes("education") || answers.includes("teaching") && answers.includes("upskill")) {
    return ["EdTech Tools", "Content Creation", "Online Teaching", "Presentation Skills", "Canva for Education", "YouTube for Teaching"];
  }

  // Technology Interest + Beginner
  if (answers.includes("technology") && answers.includes("beginner")) {
    return ["Computer Basics", "Python Introduction", "Web Development Basics", "Digital Literacy", "Problem Solving", "Communication Skills"];
  }

  // Marketing Interest
  if (answers.includes("marketing") || answers.includes("communication")) {
    return ["Social Media Marketing", "Content Creation", "Canva", "SEO Basics", "Email Marketing", "Digital Advertising"];
  }

  // Design Interest
  if (answers.includes("design") || answers.includes("creative")) {
    return ["Canva", "Figma Basics", "Color Theory", "Typography", "UI Design Principles", "Portfolio Building"];
  }

  // Content/Writing Interest
  if (answers.includes("content") || answers.includes("writing")) {
    return ["Blog Writing", "SEO Writing", "Copywriting", "Content Strategy", "Social Media Content", "Storytelling"];
  }

  // Analytics Interest
  if (answers.includes("data") || answers.includes("analytics")) {
    return ["MS Excel", "Basic Statistics", "Google Analytics", "Data Visualization", "SQL Basics", "Power BI Basics"];
  }

  // PCM + Engineering + CS
  if (answers.includes("pcm") && answers.includes("engineering") && answers.includes("computer science")) {
    return ["Python", "Data Structures", "Web Development", "System Design", "Git & GitHub", "Interview Prep"];
  }

  // PCB + Medical
  if (answers.includes("pcb") && answers.includes("medical")) {
    return ["Biology Advanced", "Chemistry Advanced", "Physics for NEET", "NEET Mock Tests", "Medical Terminology", "Study Techniques"];
  }

  // Commerce + Maths + Stock Market
  if (answers.includes("commerce") && answers.includes("math") && answers.includes("stock")) {
    return ["Stock Market Basics", "Technical Analysis", "Fundamental Analysis", "Excel for Finance", "Trading Psychology", "Portfolio Management"];
  }

  // Commerce + No Maths + Digital Marketing
  if (answers.includes("commerce") && answers.includes("without") && answers.includes("digital marketing")) {
    return ["Social Media Marketing", "Content Creation", "SEO Basics", "Google Analytics", "Canva", "Email Marketing"];
  }

  // Arts + Journalism
  if (answers.includes("arts") && answers.includes("journalism")) {
    return ["Writing Skills", "Journalism Ethics", "Digital Reporting", "Social Media for Journalists", "Video Journalism", "SEO for Content"];
  }

  // Arts + Fine Arts + UI/UX
  if (answers.includes("arts") && answers.includes("fine arts") && answers.includes("ui/ux")) {
    return ["Design Principles", "Canva", "Figma", "UI Design", "UX Research", "Portfolio Building"];
  }

  // Arts + Psychology + User Research
  if (answers.includes("arts") && answers.includes("psychology") && answers.includes("user research")) {
    return ["User Research Methods", "Usability Testing", "Survey Design", "Data Analysis Basics", "Figma Basics", "UX Writing"];
  }

  // Engineering Non-CS + Switch to Tech
  if (answers.includes("engineering") && answers.includes("switch") && answers.includes("tech")) {
    return ["Programming Basics", "Python", "Web Development Basics", "Data Science Intro", "Git", "One Specialization of choice"];
  }

  // Working Professional IT + AI/ML
  if (answers.includes("working") && answers.includes("it") && (answers.includes("ai") || answers.includes("ml"))) {
    return ["Python Advanced", "Machine Learning", "Deep Learning", "NLP", "MLOps", "AI Project Building"];
  }

  // Homemaker + Restart Career
  if (answers.includes("homemaker") || answers.includes("restart")) {
    return ["Digital Skills Basics", "MS Office/Excel", "Digital Marketing", "Content Creation", "Freelancing Skills", "Communication Skills"];
  }

  // Default fallback - map based on final direction (but NEVER show Python + Web Dev + Data Science as generic default)
  if (answers.includes("web development")) return ["HTML/CSS", "JavaScript", "React", "Node.js", "Git", "Deployment"];
  if (answers.includes("data science")) return ["Python", "Statistics", "Pandas", "Machine Learning", "SQL", "Data Visualization"];
  if (answers.includes("mobile")) return ["Flutter", "Dart", "Mobile UI", "API Integration", "State Management", "App Deployment"];
  if (answers.includes("design")) return ["Figma", "Design Principles", "UI Design", "UX Research", "Prototyping", "Portfolio Building"];
  if (answers.includes("marketing")) return ["Social Media Marketing", "SEO", "Content Creation", "Google Analytics", "Email Marketing", "Brand Strategy"];
  if (answers.includes("finance")) return ["Excel", "Financial Analysis", "Accounting", "Taxation", "Investment Basics", "Fintech"];
  if (answers.includes("cybersecurity")) return ["Network Security", "Ethical Hacking", "Web Security", "Cryptography", "Security Tools", "Compliance"];

  // Ultimate fallback - generic learning skills (NOT Python + Web Dev + Data Science)
  return ["Communication Skills", "Problem Solving", "Digital Literacy", "Time Management", "Project Building", "Portfolio Creation"];
}
