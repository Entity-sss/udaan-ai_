import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { getStoredStudent } from "@/lib/auth";
import { Storage } from "@/lib/storage";
import { StarField } from "@/components/StarField";
import { getSkillsFromRoadmap } from "@/lib/skills-progress";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
}

type Screen = "list" | "test" | "results";

// Sample Python questions for Phase 1
const pythonQuestions: Question[] = [
  { id: "1", question: "What is Python?", options: ["A programming language", "A type of snake", "A database", "An operating system"], correct: 0 },
  { id: "2", question: "How do you print in Python?", options: ["console.log()", "print()", "echo()", "System.out.println()"], correct: 1 },
  { id: "3", question: "Which symbol is used for comments in Python?", options: ["//", "/* */", "#", "--"], correct: 2 },
  { id: "4", question: "What is a variable?", options: ["A fixed value that never changes", "A container that stores data", "A type of function", "A loop"], correct: 1 },
  { id: "5", question: "Which of these is a valid variable name?", options: ["1name", "my-variable", "my_variable", "my variable"], correct: 2 },
  { id: "6", question: "What does len() do in Python?", options: ["Makes text longer", "Returns the length of a string or list", "Deletes a variable", "Creates a list"], correct: 1 },
  { id: "7", question: "Which data type stores True or False?", options: ["String", "Integer", "Boolean", "Float"], correct: 2 },
  { id: "8", question: "How do you create a list in Python?", options: ["{}", "()", "[]", "<>"], correct: 2 },
  { id: "9", question: "What is the output of 2 + 3 * 2?", options: ["10", "8", "7", "12"], correct: 1 },
  { id: "10", question: "Which keyword is used to define a function?", options: ["function", "define", "func", "def"], correct: 3 },
];

const webDevQuestions: Question[] = [
  { id: "1", question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks Text Mark Language"], correct: 0 },
  { id: "2", question: "Which tag is used to create a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], correct: 1 },
  { id: "3", question: "What is the purpose of CSS?", options: ["To structure content", "To style web pages", "To add interactivity", "To connect databases"], correct: 1 },
  { id: "4", question: "Which CSS property changes text color?", options: ["font-color", "text-color", "color", "foreground"], correct: 2 },
  { id: "5", question: "What does the <div> tag do?", options: ["Creates a division or section", "Draws a line", "Defines a document", "Displays an image"], correct: 0 },
  { id: "6", question: "Which HTML tag is used for the largest heading?", options: ["<head>", "<h6>", "<h1>", "<heading>"], correct: 2 },
  { id: "7", question: "What is the default display value of <div>?", options: ["inline", "block", "inline-block", "flex"], correct: 1 },
  { id: "8", question: "Which selector targets an element with id='header'?", options: [".header", "#header", "header", "*header"], correct: 1 },
  { id: "9", question: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correct: 1 },
  { id: "10", question: "Which tag is used to include JavaScript?", options: ["<js>", "<script>", "<javascript>", "<code>"], correct: 1 },
];

const cybersecurityQuestions: Question[] = [
  { id: "1", question: "What is the primary goal of cybersecurity?", options: ["To hack systems", "To protect systems from attacks", "To create viruses", "To monitor social media"], correct: 1 },
  { id: "2", question: "What is a firewall?", options: ["A type of virus", "A security barrier that filters traffic", "A hacking tool", "A password manager"], correct: 1 },
  { id: "3", question: "What does phishing mean?", options: ["Fishing for data", "Fraudulent attempts to steal information", "A network protocol", "A type of encryption"], correct: 1 },
  { id: "4", question: "What is malware?", options: ["Malicious software", "A secure network", "A password", "A firewall"], correct: 0 },
  { id: "5", question: "What is a VPN?", options: ["Virtual Private Network", "Very Public Network", "Virus Protection Network", "Visual Programming Node"], correct: 0 },
  { id: "6", question: "What is two-factor authentication?", options: ["Using two passwords", "Two different verification methods", "Two accounts", "Two firewalls"], correct: 1 },
  { id: "7", question: "What is a DDoS attack?", options: ["Direct data attack", "Distributed Denial of Service", "Digital data storage", "Data decryption system"], correct: 1 },
  { id: "8", question: "What is social engineering in cybersecurity?", options: ["Building secure software", "Manipulating people to gain access", "Engineering social networks", "Creating social media bots"], correct: 1 },
  { id: "9", question: "What is encryption?", options: ["Creating viruses", "Converting data into secure code", "Deleting files", "Hacking passwords"], correct: 1 },
  { id: "10", question: "What is a vulnerability?", options: ["A secure system", "A weakness that can be exploited", "A type of firewall", "A password"], correct: 1 },
];

const digitalMarketingQuestions: Question[] = [
  { id: "1", question: "What is SEO?", options: ["Search Engine Optimization", "Social Email Optimization", "Site Enhancement Option", "System Entry Operation"], correct: 0 },
  { id: "2", question: "What is the purpose of a marketing funnel?", options: ["To filter emails", "To guide customers through buying journey", "To block ads", "To store data"], correct: 1 },
  { id: "3", question: "What is CTR in digital marketing?", options: ["Click Through Rate", "Cost To Reach", "Customer Target Ratio", "Conversion Total Rate"], correct: 0 },
  { id: "4", question: "What is social media marketing?", options: ["Marketing on social platforms", "Marketing to friends only", "Email marketing", "TV advertising"], correct: 0 },
  { id: "5", question: "What is content marketing?", options: ["Creating valuable content to attract customers", "Selling content", "Deleting content", "Blocking content"], correct: 0 },
  { id: "6", question: "What is PPC advertising?", options: ["Pay Per Click", "Popular Public Content", "Personal Product Campaign", "Primary Promotion Channel"], correct: 0 },
  { id: "7", question: "What is email marketing?", options: ["Marketing via email", "Marketing to email providers", "Selling email addresses", "Blocking emails"], correct: 0 },
  { id: "8", question: "What is a lead in marketing?", options: ["A potential customer", "A lost sale", "A competitor", "A product"], correct: 0 },
  { id: "9", question: "What is conversion rate?", options: ["Percentage of visitors who take action", "Rate of conversion to competitors", "Speed of website loading", "Cost per conversion"], correct: 0 },
  { id: "10", question: "What is KPI in marketing?", options: ["Key Performance Indicator", "Key Profit Index", "Kilobytes Per Inch", "Knowledge Processing Interface"], correct: 0 },
];

const dataScienceQuestions: Question[] = [
  { id: "1", question: "What is data science?", options: ["Study of data to extract insights", "Creating databases only", "Writing code only", "Managing servers"], correct: 0 },
  { id: "2", question: "What is the first step in data science?", options: ["Data collection", "Model deployment", "Visualization", "Reporting"], correct: 0 },
  { id: "3", question: "What is data cleaning?", options: ["Removing errors and inconsistencies", "Deleting all data", "Encrypting data", "Compressing data"], correct: 0 },
  { id: "4", question: "What is a dataset?", options: ["A collection of data", "A single data point", "A database tool", "A programming language"], correct: 0 },
  { id: "5", question: "What is exploratory data analysis?", options: ["Understanding patterns in data", "Deleting data", "Encrypting data", "Storing data"], correct: 0 },
  { id: "6", question: "What is visualization in data science?", options: ["Creating visual representations of data", "Writing code", "Cleaning data", "Collecting data"], correct: 0 },
  { id: "7", question: "What is machine learning?", options: ["Computers learning from data", "Manual programming", "Data storage", "Network security"], correct: 0 },
  { id: "8", question: "What is Python used for in data science?", options: ["Data analysis and modeling", "Only web development", "Only game development", "Only mobile apps"], correct: 0 },
  { id: "9", question: "What is a model in data science?", options: ["A mathematical representation", "A database", "A spreadsheet", "A chart"], correct: 0 },
  { id: "10", question: "What is feature engineering?", options: ["Creating useful features from data", "Deleting features", "Hiding features", "Copying features"], correct: 0 },
];

const machineLearningQuestions: Question[] = [
  { id: "1", question: "What is machine learning?", options: ["Computers learning from data", "Manual coding", "Data storage", "Network security"], correct: 0 },
  { id: "2", question: "What is supervised learning?", options: ["Learning from labeled data", "Learning without labels", "Learning from images only", "Learning from text only"], correct: 0 },
  { id: "3", question: "What is unsupervised learning?", options: ["Finding patterns in unlabeled data", "Learning with labels", "Manual programming", "Data storage"], correct: 0 },
  { id: "4", question: "What is a classification problem?", options: ["Predicting categories", "Predicting numbers", "Clustering data", "Sorting data"], correct: 0 },
  { id: "5", question: "What is regression?", options: ["Predicting continuous values", "Predicting categories", "Clustering", "Classification"], correct: 0 },
  { id: "6", question: "What is a decision tree?", options: ["Tree-based classification model", "A database tree", "A file system", "A network topology"], correct: 0 },
  { id: "7", question: "What is clustering?", options: ["Grouping similar data points", "Classifying data", "Predicting values", "Sorting data"], correct: 0 },
  { id: "8", question: "What is training data?", options: ["Data used to train the model", "Test data only", "Validation data only", "Production data"], correct: 0 },
  { id: "9", question: "What is overfitting?", options: ["Model memorizing training data", "Model too simple", "Model perfect", "Model fast"], correct: 0 },
  { id: "10", question: "What is the purpose of a test set?", options: ["Evaluate model performance", "Train the model", "Store data", "Clean data"], correct: 0 },
];

const designQuestions: Question[] = [
  { id: "1", question: "What is UI design?", options: ["User Interface design", "User Interaction", "Universal Interface", "Utility Integration"], correct: 0 },
  { id: "2", question: "What is UX design?", options: ["User Experience design", "User Execution", "Universal Experience", "Utility Execution"], correct: 0 },
  { id: "3", question: "What is color theory?", options: ["Study of color relationships", "Painting technique", "Color printing", "Color coding"], correct: 0 },
  { id: "4", question: "What is typography?", options: ["Art of arranging type", "Type of paper", "Type of ink", "Type of font"], correct: 0 },
  { id: "5", question: "What is a wireframe?", options: ["Low-fidelity design sketch", "Final design", "Color palette", "Font selection"], correct: 0 },
  { id: "6", question: "What is white space in design?", options: ["Empty space for balance", "White color only", "Space for text only", "Background color"], correct: 0 },
  { id: "7", question: "What is contrast in design?", options: ["Difference between elements", "Similarity of elements", "Same color", "Same size"], correct: 0 },
  { id: "8", question: "What is hierarchy in design?", options: ["Organizing by importance", "Random arrangement", "Same size for all", "No organization"], correct: 0 },
  { id: "9", question: "What is Figma?", options: ["Design collaboration tool", "Photo editor", "Video editor", "Music tool"], correct: 0 },
  { id: "10", question: "What is a mockup?", options: ["High-fidelity design representation", "Sketch", "Wireframe", "Prototype"], correct: 0 },
];

const softSkillsQuestions: Question[] = [
  { id: "1", question: "What is active listening?", options: ["Fully focusing on the speaker", "Hearing without attention", "Multitasking while listening", "Interrupting frequently"], correct: 0 },
  { id: "2", question: "What is body language?", options: ["Non-verbal communication", "Written communication", "Verbal communication", "Digital communication"], correct: 0 },
  { id: "3", question: "What is empathy?", options: ["Understanding others' feelings", "Ignoring emotions", "Being critical", "Being selfish"], correct: 0 },
  { id: "4", question: "What is the purpose of eye contact?", options: ["Show engagement and confidence", "Intimidate others", "Look away", "Show disinterest"], correct: 0 },
  { id: "5", question: "What is a good way to start a conversation?", options: ["Ask open-ended questions", "Talk only about yourself", "Use yes/no questions only", "Stay silent"], correct: 0 },
  { id: "6", question: "What is feedback in communication?", options: ["Constructive response to behavior", "Criticism only", "Praise only", "Ignoring behavior"], correct: 0 },
  { id: "7", question: "What is the 7-38-55 rule?", options: ["Communication breakdown percentages", "Time management", "Budget allocation", "Project phases"], correct: 0 },
  { id: "8", question: "What is assertiveness?", options: ["Confident self-expression", "Aggression", "Passivity", "Silence"], correct: 0 },
  { id: "9", question: "What is conflict resolution?", options: ["Solving disagreements constructively", "Avoiding conflict", "Winning at all costs", "Blaming others"], correct: 0 },
  { id: "10", question: "What is networking?", options: ["Building professional relationships", "Social media only", "Business cards only", "Email only"], correct: 0 },
];

const canvaQuestions: Question[] = [
  { id: "1", question: "What is Canva primarily used for?", options: ["Video editing", "Graphic design", "Coding", "Data analysis"], correct: 1 },
  { id: "2", question: "Which Canva feature lets you resize designs?", options: ["Magic Resize", "Smart Crop", "Auto Scale", "Resize Tool"], correct: 0 },
  { id: "3", question: "What file formats can you export from Canva?", options: ["Only PDF", "Only PNG", "PNG, JPG, PDF, MP4", "Only JPG"], correct: 2 },
  { id: "4", question: "What is a Canva template?", options: ["A pre-made design you can customize", "A blank canvas", "A color palette", "A font style"], correct: 0 },
  { id: "5", question: "Which Canva plan is free?", options: ["Canva Pro", "Canva Enterprise", "Canva Free", "Canva Business"], correct: 2 },
  { id: "6", question: "What does the 'Brand Kit' feature do in Canva?", options: ["Saves your brand colors fonts and logos", "Creates logos automatically", "Generates brand names", "Manages social media"], correct: 0 },
  { id: "7", question: "Can Canva be used on mobile?", options: ["No, desktop only", "Yes, iOS only", "Yes, Android only", "Yes, both iOS and Android"], correct: 3 },
  { id: "8", question: "What is Canva's AI image generator called?", options: ["Canva AI", "Text to Image", "Magic Media", "Dream Lab"], correct: 2 },
  { id: "9", question: "Which element type is NOT available in Canva?", options: ["Shapes", "Icons", "3D models", "Stickers"], correct: 2 },
  { id: "10", question: "What is a 'frame' in Canva used for?", options: ["Adding borders", "Placing images in shapes", "Creating animations", "Adding text"], correct: 1 },
];

const colorTheoryQuestions: Question[] = [
  { id: "1", question: "What are the primary colors?", options: ["Red, Green, Blue", "Red, Yellow, Blue", "Cyan, Magenta, Yellow", "Orange, Purple, Green"], correct: 1 },
  { id: "2", question: "What are complementary colors?", options: ["Colors next to each other on color wheel", "Colors opposite each other on color wheel", "Colors that are all warm", "Colors that are all cool"], correct: 1 },
  { id: "3", question: "What does 'hue' mean?", options: ["The brightness of a color", "The pure color itself", "The darkness of a color", "The warmth of a color"], correct: 1 },
  { id: "4", question: "What is a monochromatic color scheme?", options: ["Using multiple colors", "Using only one color with its shades and tints", "Using only black and white", "Using warm colors only"], correct: 1 },
  { id: "5", question: "Which color is considered warm?", options: ["Blue", "Green", "Purple", "Orange"], correct: 3 },
  { id: "6", question: "What does 'saturation' refer to?", options: ["How light a color is", "How dark a color is", "How pure/intense a color is", "How warm a color is"], correct: 2 },
  { id: "7", question: "What are analogous colors?", options: ["Colors opposite on color wheel", "Colors next to each other on color wheel", "Colors that are all dark", "Colors that are all bright"], correct: 1 },
  { id: "8", question: "What color does mixing Red and Blue make?", options: ["Orange", "Green", "Purple", "Brown"], correct: 2 },
  { id: "9", question: "What is the color wheel used for?", options: ["Measuring color temperature", "Understanding color relationships", "Creating gradients", "Selecting fonts"], correct: 1 },
  { id: "10", question: "What does 'tint' mean in color theory?", options: ["Adding black to a color", "Adding white to a color", "Adding gray to a color", "Removing color"], correct: 1 },
];

const graphicDesignQuestions: Question[] = [
  { id: "1", question: "What does UI stand for?", options: ["User Interface", "Universal Input", "Unique Interaction", "User Integration"], correct: 0 },
  { id: "2", question: "What is typography?", options: ["The art of taking photos", "The art of arranging text", "The art of drawing", "The art of color mixing"], correct: 1 },
  { id: "3", question: "What is white space in design?", options: ["White colored backgrounds", "Empty space around design elements", "White text on dark background", "Space between letters"], correct: 1 },
  { id: "4", question: "What is a vector graphic?", options: ["A photo that can be zoomed in", "A mathematical path that scales without losing quality", "A type of animation", "A 3D graphic"], correct: 1 },
  { id: "5", question: "What does DPI stand for?", options: ["Design Per Inch", "Dots Per Inch", "Digital Print Image", "Design Print Interface"], correct: 1 },
  { id: "6", question: "Which software is used for vector design?", options: ["Photoshop", "Illustrator", "Premiere Pro", "After Effects"], correct: 1 },
  { id: "7", question: "What is kerning in typography?", options: ["The space between lines of text", "The space between individual letters", "The size of text", "The color of text"], correct: 1 },
  { id: "8", question: "What is a logo?", options: ["A type of font", "A visual symbol representing a brand", "A color palette", "A design template"], correct: 1 },
  { id: "9", question: "What is the rule of thirds in design?", options: ["Using only 3 colors", "Dividing design into 3 equal parts for balance", "Using 3 fonts maximum", "Creating 3 versions of every design"], correct: 1 },
  { id: "10", question: "What does CMYK stand for?", options: ["Cyan Magenta Yellow Black", "Color Mode Yellow Key", "Creative Media Yellow Kit", "Cyan Mix Yellow Kombine"], correct: 0 },
];

const communicationSkillsQuestions: Question[] = [
  { id: "1", question: "What is active listening?", options: ["Listening while doing other things", "Fully concentrating on what is being said", "Listening to music", "Asking many questions"], correct: 1 },
  { id: "2", question: "What is non-verbal communication?", options: ["Written communication", "Body language gestures and facial expressions", "Sign language only", "Email communication"], correct: 1 },
  { id: "3", question: "What makes communication effective?", options: ["Using complex words", "Speaking very fast", "Clear concise and relevant messaging", "Using technical jargon"], correct: 2 },
  { id: "4", question: "What is empathy in communication?", options: ["Agreeing with everyone", "Understanding others feelings and perspective", "Being sympathetic always", "Avoiding conflict"], correct: 1 },
  { id: "5", question: "What is the best way to handle disagreement?", options: ["Avoid the conversation", "Listen understand then respond calmly", "Raise your voice", "End the conversation"], correct: 1 },
  { id: "6", question: "What does confidence in communication look like?", options: ["Speaking aggressively", "Making eye contact speaking clearly", "Speaking very slowly", "Using many hand gestures"], correct: 1 },
  { id: "7", question: "What is feedback in communication?", options: ["Criticizing someone", "Response to a message that helps improve", "Repeating what was said", "Ignoring the speaker"], correct: 1 },
  { id: "8", question: "What is paraphrasing?", options: ["Reading a paragraph", "Restating someone's message in your own words", "Writing a summary", "Translating language"], correct: 1 },
  { id: "9", question: "Which of these improves public speaking?", options: ["Reading from notes always", "Practice and preparation", "Speaking very quietly", "Avoiding eye contact"], correct: 1 },
  { id: "10", question: "What is the first step in resolving conflict?", options: ["Win the argument", "Listen to all sides without judgment", "Involve others", "Walk away immediately"], correct: 1 },
];

const socialMediaMarketingQuestions: Question[] = [
  { id: "1", question: "What does engagement mean on social media?", options: ["Number of followers", "Likes comments shares and interactions", "Number of posts", "Amount of money spent"], correct: 1 },
  { id: "2", question: "What is a hashtag used for?", options: ["Making text bold", "Categorizing content for discoverability", "Tagging people", "Adding links"], correct: 1 },
  { id: "3", question: "What is the best time to post on Instagram?", options: ["When your audience is most active", "Midnight every day", "Early morning only", "It doesn't matter"], correct: 0 },
  { id: "4", question: "What is a content calendar?", options: ["A calendar showing holidays", "A plan for scheduling social media posts", "A list of content ideas", "A tool for editing images"], correct: 1 },
  { id: "5", question: "What does CTR stand for?", options: ["Content To Reach", "Click Through Rate", "Creative Text Ratio", "Customer Target Rate"], correct: 1 },
  { id: "6", question: "Which platform is best for B2B marketing?", options: ["TikTok", "Instagram", "LinkedIn", "Snapchat"], correct: 2 },
  { id: "7", question: "What is a social media algorithm?", options: ["A type of advertisement", "System that decides what content users see", "A scheduling tool", "A type of hashtag"], correct: 1 },
  { id: "8", question: "What is influencer marketing?", options: ["Paying celebrities to act in ads", "Partnering with people who have engaged audiences", "Creating viral content", "Running paid advertisements"], correct: 1 },
  { id: "9", question: "What is reach on social media?", options: ["Number of likes", "Number of unique accounts that saw your content", "Number of followers", "Number of shares"], correct: 1 },
  { id: "10", question: "What does going viral mean?", options: ["Getting a computer virus", "Content spreading rapidly to large audiences", "Posting every day", "Having many followers"], correct: 1 },
];

const accountingPrinciplesQuestions: Question[] = [
  { id: "1", question: "What is a balance sheet?", options: ["A list of expenses", "Statement showing assets liabilities and equity", "A tax document", "A bank statement"], correct: 1 },
  { id: "2", question: "What does debit mean in accounting?", options: ["Money going out of bank", "Left side entry that increases assets", "A credit card transaction", "A loan payment"], correct: 1 },
  { id: "3", question: "What is revenue?", options: ["Total expenses of a business", "Income generated from business operations", "Profit after tax", "Money borrowed"], correct: 1 },
  { id: "4", question: "What is depreciation?", options: ["Increase in asset value", "Decrease in asset value over time", "A type of expense", "A tax benefit"], correct: 1 },
  { id: "5", question: "What is the accounting equation?", options: ["Revenue minus Expenses equals Profit", "Assets equals Liabilities plus Equity", "Income minus Tax equals Net income", "Debit equals Credit"], correct: 1 },
  { id: "6", question: "What is a profit and loss statement?", options: ["Shows assets and liabilities", "Shows revenue expenses and profit over a period", "Shows cash flow", "Shows tax payable"], correct: 1 },
  { id: "7", question: "What is working capital?", options: ["Total assets of a company", "Current assets minus current liabilities", "Long term investments", "Annual profit"], correct: 1 },
  { id: "8", question: "What is GST?", options: ["General Sales Tax", "Goods and Services Tax", "Government Service Tax", "General Service Transaction"], correct: 1 },
  { id: "9", question: "What is cash flow?", options: ["Profit of a company", "Movement of money in and out of business", "Bank balance", "Total revenue"], correct: 1 },
  { id: "10", question: "What is an invoice?", options: ["A receipt of payment", "A document requesting payment for goods or services", "A bank statement", "A tax document"], correct: 1 },
];

const hrQuestions: Question[] = [
  { id: "1", question: "What is the primary role of HR?", options: ["Only hiring employees", "Managing employee relations and organizational development", "Only firing employees", "Only payroll management"], correct: 1 },
  { id: "2", question: "What is recruitment?", options: ["Firing employees", "Process of finding and hiring new employees", "Managing payroll", "Training employees"], correct: 1 },
  { id: "3", question: "What is onboarding?", options: ["Saying goodbye to employees", "Process of integrating new employees into the organization", "Conducting interviews", "Creating job descriptions"], correct: 1 },
  { id: "4", question: "What is performance appraisal?", options: ["Evaluating employee job performance", "Hiring new employees", "Firing employees", "Managing payroll"], correct: 0 },
  { id: "5", question: "What is employee engagement?", options: ["Employees working overtime", "Emotional commitment employees have to the organization", "Employee salary", "Employee attendance"], correct: 1 },
  { id: "6", question: "What is a job description?", options: ["Employee resume", "Document outlining job duties and responsibilities", "Employee contract", "Company policy"], correct: 1 },
  { id: "7", question: "What is the purpose of an interview?", options: ["To chat with candidates", "To assess candidate suitability for the job", "To reject candidates", "To hire everyone"], correct: 1 },
  { id: "8", question: "What is HR analytics?", options: ["Analyzing employee data to make better decisions", "Creating employee schedules", "Managing payroll", "Conducting interviews"], correct: 0 },
  { id: "9", question: "What is talent management?", options: ["Managing employee salaries", "Strategic process of attracting developing and retaining talent", "Firing employees", "Creating job postings"], correct: 1 },
  { id: "10", question: "What is labor law compliance?", options: ["Ignoring labor laws", "Following legal requirements related to employment", "Creating company policies", "Managing employee benefits"], correct: 1 },
];

const marketingQuestions: Question[] = [
  { id: "1", question: "What is marketing?", options: ["Selling products only", "Process of creating communicating and delivering value to customers", "Advertising only", "Pricing only"], correct: 1 },
  { id: "2", question: "What are the 4 Ps of marketing?", options: ["Product Price Place Promotion", "People Process Physical Evidence", "Product Performance Price Profit", "Planning Positioning Packaging Pricing"], correct: 0 },
  { id: "3", question: "What is a target market?", options: ["All customers worldwide", "Specific group of customers a company aims to reach", "Competitors only", "Employees only"], correct: 1 },
  { id: "4", question: "What is brand positioning?", options: ["Creating a logo", "How a brand is perceived in the minds of customers", "Setting product prices", "Hiring employees"], correct: 1 },
  { id: "5", question: "What is market research?", options: ["Researching competitors only", "Gathering and analyzing data about market and customers", "Creating advertisements", "Setting prices"], correct: 1 },
  { id: "6", question: "What is a marketing strategy?", options: ["Random advertising", "Comprehensive plan to achieve marketing goals", "Hiring sales team", "Creating a website"], correct: 1 },
  { id: "7", question: "What is customer segmentation?", options: ["Treating all customers the same", "Dividing customers into groups based on characteristics", "Ignoring customers", "Firing customers"], correct: 1 },
  { id: "8", question: "What is a marketing mix?", options: ["Mix of colors in ads", "Combination of product price place and promotion", "Mix of employees", "Mix of competitors"], correct: 1 },
  { id: "9", question: "What is brand equity?", options: ["Brand's stock price", "Value and strength of a brand in the market", "Brand's logo", "Brand's office location"], correct: 1 },
  { id: "10", question: "What is competitive analysis?", options: ["Analyzing company's own performance", "Evaluating competitors' strengths and weaknesses", "Ignoring competitors", "Copying competitors"], correct: 1 },
];

function getQuestionsForSkill(skill: string, level: string, phase: number): Question[] {
  const skillLower = skill.toLowerCase().replace(/\s+/g, '-');
  const levelLower = level.toLowerCase();
  
  // Match by exact hyphenated skill ID first
  if (skillLower === "python") return pythonQuestions;
  if (skillLower === "web-development" || skillLower === "web-dev") return webDevQuestions;
  if (skillLower === "cybersecurity") return cybersecurityQuestions;
  if (skillLower === "digital-marketing") return digitalMarketingQuestions;
  if (skillLower === "data-science") return dataScienceQuestions;
  if (skillLower === "machine-learning" || skillLower === "ml") return machineLearningQuestions;
  if (skillLower === "graphic-design" || skillLower === "ui-ux-design" || skillLower === "design") return graphicDesignQuestions;
  if (skillLower === "communication-skills" || skillLower === "soft-skills") return communicationSkillsQuestions;
  if (skillLower === "canva") return canvaQuestions;
  if (skillLower === "color-theory") return colorTheoryQuestions;
  if (skillLower === "social-media-marketing") return socialMediaMarketingQuestions;
  if (skillLower === "accounting-principles" || skillLower === "accounting") return accountingPrinciplesQuestions;
  
  // HR Skills
  if (skillLower === "hr-fundamentals" || skillLower === "recruitment-skills" || skillLower === "ms-excel-for-hr" || 
      skillLower === "labor-laws-basics" || skillLower === "hr-analytics" || skillLower === "interview-techniques" || 
      skillLower === "linkedin-for-hr") return hrQuestions;
  
  // Marketing Skills
  if (skillLower === "marketing-fundamentals" || skillLower === "google-analytics" || skillLower === "seo-basics") return marketingQuestions;
  
  // Finance Skills
  if (skillLower === "financial-accounting" || skillLower === "ms-excel-advanced" || skillLower === "financial-analysis" ||
      skillLower === "tally-prime" || skillLower === "investment-basics" || skillLower === "financial-modeling") return accountingPrinciplesQuestions;
  
  // Web Development Skills
  if (skillLower === "html-css" || skillLower === "javascript" || skillLower === "react" || skillLower === "node-js" ||
      skillLower === "database-basics" || skillLower === "git" || skillLower === "dsa-basics" || skillLower === "system-design-basics") return webDevQuestions;
  
  // AI/ML Skills
  if (skillLower === "statistics" || skillLower === "data-analysis" || skillLower === "deep-learning" ||
      skillLower === "ml-projects" || skillLower === "model-deployment") return dataScienceQuestions;
  
  // Medical/Pharmacy Skills
  if (skillLower === "biology-advanced" || skillLower === "chemistry-advanced" || skillLower === "physics-for-neet" ||
      skillLower === "neet-mock-tests" || skillLower === "medical-terminology" || skillLower === "anatomy-basics" ||
      skillLower === "study-techniques" || skillLower === "pharmaceutical-chemistry" || skillLower === "pharmacology" ||
      skillLower === "gpat-preparation" || skillLower === "drug-regulations" || skillLower === "clinical-pharmacy-basics") return dataScienceQuestions;
  
  // Health Tech Skills
  if (skillLower === "python-basics" || skillLower === "healthcare-data" || skillLower === "bioinformatics" ||
      skillLower === "excel-for-healthcare" || skillLower === "research-methods") return dataScienceQuestions;
  
  // Fallback to partial matches for backward compatibility
  if (skillLower.includes("python")) return pythonQuestions;
  if (skillLower.includes("web") || skillLower.includes("html") || skillLower.includes("css") || skillLower.includes("javascript") || skillLower.includes("react") || skillLower.includes("node")) return webDevQuestions;
  if (skillLower.includes("cyber") || skillLower.includes("security")) return cybersecurityQuestions;
  if (skillLower.includes("marketing")) return marketingQuestions;
  if (skillLower.includes("data science") || skillLower.includes("data-analysis") || skillLower.includes("statistics")) return dataScienceQuestions;
  if (skillLower.includes("machine learning") || skillLower.includes("ml") || skillLower.includes("deep-learning")) return machineLearningQuestions;
  if (skillLower.includes("design") || skillLower.includes("ui") || skillLower.includes("ux") || skillLower.includes("figma") || skillLower.includes("canva")) return graphicDesignQuestions;
  if (skillLower.includes("soft") || skillLower.includes("communication") || skillLower.includes("speaking")) return communicationSkillsQuestions;
  if (skillLower.includes("hr") || skillLower.includes("recruitment") || skillLower.includes("talent")) return hrQuestions;
  if (skillLower.includes("accounting") || skillLower.includes("financial") || skillLower.includes("tally") || skillLower.includes("excel")) return accountingPrinciplesQuestions;
  if (skillLower.includes("social")) return socialMediaMarketingQuestions;
  if (skillLower.includes("medical") || skillLower.includes("pharmacy") || skillLower.includes("neet") || skillLower.includes("gpat") || skillLower.includes("biology") || skillLower.includes("chemistry") || skillLower.includes("physics")) return dataScienceQuestions;
  
  // Generic fallback for unknown skills - generate generic questions about the skill
  return [
    { id: "1", question: `What is ${skill} primarily used for?`, options: ["Data analysis", "Creative work", "Technical tasks", "All of the above"], correct: 3 },
    { id: "2", question: `Which skill is important for ${skill}?`, options: ["Problem solving", "Communication", "Technical knowledge", "All of the above"], correct: 3 },
    { id: "3", question: `What is a key concept in ${skill}?`, options: ["Fundamentals", "Advanced techniques", "Best practices", "All of the above"], correct: 3 },
    { id: "4", question: `How can you improve your ${skill} skills?`, options: ["Practice", "Study", "Projects", "All of the above"], correct: 3 },
    { id: "5", question: `What tools are commonly used in ${skill}?`, options: ["Software applications", "Manual tools", "Online resources", "All of the above"], correct: 3 },
    { id: "6", question: `What are the benefits of learning ${skill}?`, options: ["Career growth", "Personal development", "Problem solving", "All of the above"], correct: 3 },
    { id: "7", question: `What industries use ${skill}?`, options: ["Technology", "Business", "Creative", "All of the above"], correct: 3 },
    { id: "8", question: `What is the best way to start learning ${skill}?`, options: ["Online courses", "Books", "Practice projects", "All of the above"], correct: 3 },
    { id: "9", question: `What challenges might you face with ${skill}?`, options: ["Complexity", "Time investment", "Learning curve", "All of the above"], correct: 3 },
    { id: "10", question: `What are advanced topics in ${skill}?`, options: ["Specialization", "Integration", "Optimization", "All of the above"], correct: 3 },
  ];
}

const availableTests = [
  { id: "python-phase1", skill: "Python", icon: "🐍", difficulty: "Beginner", questions: 10, duration: 15 },
  { id: "python-phase2", skill: "Python", icon: "🐍", difficulty: "Intermediate", questions: 10, duration: 20 },
  { id: "web-dev", skill: "Web Development", icon: "🌐", difficulty: "Beginner", questions: 10, duration: 15 },
  { id: "data-science", skill: "Data Science", icon: "📊", difficulty: "Intermediate", questions: 10, duration: 20 },
];

function getAvailableTestsFromRoadmap() {
  const roadmapSkills = getSkillsFromRoadmap();
  return roadmapSkills.map(skill => ({
    id: `${skill.id}-phase1`,
    skill: skill.name,
    icon: skill.icon,
    difficulty: "Beginner",
    questions: 10,
    duration: 15,
  }));
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MockTest() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const params = useParams<{ skillId?: string; levelId?: string; phaseId?: string; testType?: string }>();

  const [screen, setScreen] = useState<Screen>("list");
  const [selectedTest, setSelectedTest] = useState<{ id: string; skill: string; icon: string; difficulty: string; questions: number; duration: number } | null>(null);

  const roadmapTests = getAvailableTestsFromRoadmap();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = useCallback(async (finalAnswers: Record<string, number>, qs: Question[]) => {
    setAnswers(finalAnswers);
    setScreen("results");
    setShowReview(false);

    const score = qs.filter(q => finalAnswers[q.id] === q.correct).length;
    const pct = qs.length ? Math.round((score / qs.length) * 100) : 0;
    const passed = pct >= 70;

    if (passed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    const student = getStoredStudent();
    if (student && selectedTest && params.phaseId && params.skillId && params.levelId) {
      const phaseNumber = parseInt(params.phaseId);
      
      // Save to localStorage using Storage utility
      Storage.saveTestResult(params.skillId, params.levelId, phaseNumber, pct, passed);

      // Call complete-phase API to save to database and unlock next phase
      try {
        await fetch('/api/progress/complete-phase', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: student.id,
            skillId: params.skillId,
            level: params.levelId,
            phaseNumber: phaseNumber,
            score: pct,
            passed: passed,
          }),
        });
      } catch (error) {
        console.error("Failed to save progress to database:", error);
      }

      // Also save test result to existing API for backward compatibility
      try {
        await fetch(`/api/skill-progress/test-results/${student.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skillId: selectedTest.skill,
            testType: params.testType || "phase",
            score: pct,
            passed,
            phaseNumber: phaseNumber,
            level: params.levelId,
          }),
        });
      } catch (error) {
        console.error("Failed to save test result:", error);
      }
    }
  }, [selectedTest, params]);

  useEffect(() => {
    if (screen !== "test") return;
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({ title: "Time's up! Question marked as wrong." });
          const newAnswers = { ...answers, [questions[currentIdx].id]: -1 };
          setAnswers(newAnswers);
          setSelected(null);
          if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setTimeLeft(60);
          } else {
            handleSubmit(newAnswers, questions);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, currentIdx]);

  function startTest(testId: string) {
    const test = roadmapTests.find(t => t.id === testId);
    if (!test) return;

    setSelectedTest(test);
    const skillQuestions = getQuestionsForSkill(test.skill, test.difficulty, 1);
    const shuffledQuestions = shuffleArray(skillQuestions);
    setQuestions(shuffledQuestions);
    setCurrentIdx(0);
    setAnswers({});
    setSelected(null);
    setScreen("test");
  }

  function startTestFromParams(skill: string, level: string, phase: number, testType: string) {
    const skillQuestions = getQuestionsForSkill(skill, level, phase);
    const shuffledQuestions = shuffleArray(skillQuestions);
    setQuestions(shuffledQuestions);
    setCurrentIdx(0);
    setAnswers({});
    setSelected(null);
    setSelectedTest({
      id: testType,
      skill: skill,
      icon: "📚",
      difficulty: level,
      questions: shuffledQuestions.length,
      duration: shuffledQuestions.length,
    });
    setScreen("test");
  }

  function handleNext() {
    if (selected === null) {
      toast({ title: "Please select an answer" });
      return;
    }
    const newAnswers = { ...answers, [questions[currentIdx].id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmit(newAnswers, questions);
    }
  }

  function handleRetry() {
    if (!selectedTest) return;
    const skillQuestions = getQuestionsForSkill(selectedTest.skill, selectedTest.difficulty, 1);
    const shuffledQuestions = shuffleArray(skillQuestions);
    setQuestions(shuffledQuestions);
    setCurrentIdx(0);
    setAnswers({});
    setSelected(null);
    setScreen("test");
  }

  useEffect(() => {
    if (params.skillId && params.levelId && params.phaseId && params.testType) {
      startTestFromParams(
        params.skillId,
        params.levelId,
        parseInt(params.phaseId),
        params.testType
      );
    }
  }, [params.skillId, params.levelId, params.phaseId, params.testType]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const score = questions.filter(q => answers[q.id] === q.correct).length;
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const passed = pct >= 70;

  const btnBase: React.CSSProperties = {
    padding: "0.75rem 1.5rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.2s",
    border: "none",
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(13,10,40,0.85)",
    border: "1px solid rgba(124,58,237,0.25)",
    borderRadius: "20px",
    padding: "2rem",
  };

  // TEST LIST SCREEN
  if (screen === "list") return (
    <div style={{ minHeight: "100vh", background: "#0d0b1e", position: "relative", padding: "1.25rem" }}>
      <StarField />
      <div style={{ position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => setLocation("/dashboard")}
            style={{ ...btnBase, background: "transparent", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", marginBottom: "1rem", padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "white", marginBottom: "0.5rem" }}>Mock Tests</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Test your knowledge and unlock new phases</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {roadmapTests.map(test => (
            <div
              key={test.id}
              style={{
                background: cardStyle.background,
                border: cardStyle.border,
                borderRadius: cardStyle.borderRadius,
                padding: "1.5rem",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(76,53,200,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => startTest(test.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2.5rem" }}>{test.icon}</span>
                <div>
                  <h3 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{test.skill}</h3>
                  <span style={{ 
                    padding: "0.2rem 0.6rem", 
                    borderRadius: "12px", 
                    background: test.difficulty === "Beginner" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)",
                    border: test.difficulty === "Beginner" ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(245,158,11,0.3)",
                    color: test.difficulty === "Beginner" ? "#34d399" : "#fbbf24",
                    fontSize: "0.75rem",
                    fontWeight: 700
                  }}>
                    {test.difficulty}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", margin: "0 0 0.25rem" }}>Questions</p>
                  <p style={{ color: "white", fontWeight: 700, margin: 0 }}>{test.questions}</p>
                </div>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", margin: "0 0 0.25rem" }}>Duration</p>
                  <p style={{ color: "white", fontWeight: 700, margin: 0 }}>{test.duration} min</p>
                </div>
              </div>
              <button
                type="button"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "none",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #4c35c8, #9333ea)",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #9333ea, #4c35c8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #4c35c8, #9333ea)";
                }}
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // TEST INTERFACE SCREEN
  if (screen === "test") {
    const q = questions[currentIdx];
    const isWarning = timeLeft <= 15;

    return (
      <div style={{ minHeight: "100vh", background: "#0d0b1e", position: "relative", padding: "1.25rem" }}>
        <StarField />
        <div style={{ position: "relative", zIndex: 10, maxWidth: "680px", margin: "0 auto" }}>
          <style>{`@keyframes pulse-red { 0%,100%{color:#ef4444} 50%{color:#fca5a5} }`}</style>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <span style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa", padding: "0.2rem 0.75rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>
                {selectedTest?.skill} · {selectedTest?.difficulty}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 1rem",
                background: isWarning ? "rgba(239,68,68,0.15)" : "rgba(6,182,212,0.1)",
                border: `1px solid ${isWarning ? "rgba(239,68,68,0.4)" : "rgba(6,182,212,0.3)"}`,
                borderRadius: "20px",
                animation: isWarning ? "pulse-red 1s ease-in-out infinite" : "none",
              }}
            >
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: isWarning ? "#ef4444" : "#67e8f9", fontVariantNumeric: "tabular-nums", letterSpacing: "0.05em" }}>
                ⏱ {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", justifyContent: "center" }}>
            {questions.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: idx < currentIdx ? "#10b981" : idx === currentIdx ? "#7c3aed" : "rgba(255,255,255,0.2)",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              {q.question}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.5rem" }}>
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelected(i)}
                  style={{
                    ...btnBase,
                    padding: "0.875rem 1.25rem",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                    background: selected === i ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selected === i ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.09)"}`,
                    color: selected === i ? "#c084fc" : "rgba(255,255,255,0.75)",
                    fontWeight: selected === i ? 600 : 400,
                  }}
                >
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${selected === i ? "#7c3aed" : "rgba(255,255,255,0.2)"}`,
                    background: selected === i ? "rgba(124,58,237,0.3)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {selected === i && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#a78bfa" }} />}
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", minWidth: "1rem" }}>{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              style={{ ...btnBase, width: "100%", padding: "0.875rem", background: "linear-gradient(135deg, #7c3aed, #9333ea)", color: "white" }}
            >
              {currentIdx === questions.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  return (
    <div style={{ minHeight: "100vh", background: "#0d0b1e", position: "relative", padding: "1.25rem" }}>
      {showConfetti && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: "none",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "4rem",
        }}>
          🎉
        </div>
      )}
      <StarField />
      <div style={{ position: "relative", zIndex: 10, maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ ...cardStyle, textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3.5rem", fontWeight: 900, color: passed ? "#10b981" : "#ef4444", marginBottom: "0.25rem" }}>
            {passed ? "✓ PASS" : "✗ FAIL"}
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
            {score} / {questions.length} Correct
          </div>
          <div style={{ display: "inline-block", padding: "0.3rem 1.25rem", background: `${passed ? "#10b981" : "#ef4444"}20`, border: `1px solid ${passed ? "rgba(16,185,129,0.6)" : "rgba(239,68,68,0.6)"}`, borderRadius: "20px", color: passed ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: "1.1rem" }}>
            {pct}%
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "0.75rem", fontSize: "0.9rem" }}>
            {passed ? "Congratulations! Next phase unlocked 🎉" : "Don't give up! Try again"}
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.25rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setShowReview(!showReview)}
              style={{ ...btnBase, background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#c084fc" }}
            >
              {showReview ? "Hide" : "Review"} Answers
            </button>
            {passed ? (
              <button
                type="button"
                onClick={() => setLocation("/dashboard")}
                style={{ ...btnBase, background: "linear-gradient(135deg, #10b981, #059669)", color: "white" }}
              >
                Continue Learning
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRetry}
                style={{ ...btnBase, background: "linear-gradient(135deg, #7c3aed, #9333ea)", color: "white" }}
              >
                Retry Test
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Correct", value: score, color: "#10b981" },
            { label: "Wrong", value: questions.length - score, color: "#ef4444" },
            { label: "Accuracy", value: `${pct}%`, color: "#7c3aed" },
            { label: "Skill", value: selectedTest?.skill || "", color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} style={{ ...cardStyle, padding: "1rem", textAlign: "center", borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {showReview && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ color: "white", fontWeight: 700, marginBottom: "0.25rem" }}>Answer Review</h3>
            {questions.map((q, idx) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correct;
              return (
                <div
                  key={q.id}
                  style={{
                    ...cardStyle,
                    padding: "1.25rem",
                    borderLeft: `4px solid ${isCorrect ? "#10b981" : "#ef4444"}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>Q{idx + 1}</span>
                    <span style={{ color: isCorrect ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: "0.8rem" }}>
                      {isCorrect ? "✓ Correct" : "✗ Wrong"}
                    </span>
                  </div>
                  <p style={{ color: "white", fontWeight: 600, marginBottom: "0.75rem", lineHeight: 1.4 }}>{q.question}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "0.75rem" }}>
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "0.4rem 0.75rem",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          background: i === q.correct ? "rgba(16,185,129,0.1)" : i === userAns && !isCorrect ? "rgba(239,68,68,0.1)" : "transparent",
                          color: i === q.correct ? "#34d399" : i === userAns && !isCorrect ? "#fca5a5" : "rgba(255,255,255,0.5)",
                          fontWeight: i === q.correct ? 600 : 400,
                          border: `1px solid ${i === q.correct ? "rgba(16,185,129,0.25)" : "transparent"}`,
                        }}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                        {i === q.correct && " ✓"}
                        {i === userAns && !isCorrect && " (Your answer)"}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
  
