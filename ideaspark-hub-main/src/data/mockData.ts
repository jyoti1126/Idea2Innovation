// Mock data for demo mode (no backend required)

export const mockUser = {
  name: 'Demo User',
  email: 'demo@idea2execution.com',
  username: 'demouser',
};

export const mockIdeas = [
  {
    _id: 'idea-1',
    title: 'AI Resume Builder for Students',
    description: 'An AI-powered platform that helps college students create professional resumes tailored to specific job roles.',
    targetAudience: 'College Students',
    problem: 'Students struggle to create professional resumes',
    feasibilityScore: 82,
    marketPotential: 'High',
    competitionLevel: 'Medium',
    progress: 65,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'idea-2',
    title: 'Local Food Delivery for Small Towns',
    description: 'A hyperlocal food delivery app connecting small-town restaurants with nearby customers.',
    targetAudience: 'Small Town Residents',
    problem: 'No food delivery options in tier-3 cities',
    feasibilityScore: 74,
    marketPotential: 'High',
    competitionLevel: 'Low',
    progress: 30,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export const mockDashboard = {
  totalIdeas: 2,
  activeRoadmaps: 1,
  ideas: mockIdeas,
};

export const mockActivity = [
  { date: getDayStr(-6), count: 2 },
  { date: getDayStr(-5), count: 1 },
  { date: getDayStr(-4), count: 3 },
  { date: getDayStr(-3), count: 0 },
  { date: getDayStr(-2), count: 4 },
  { date: getDayStr(-1), count: 2 },
  { date: getDayStr(0), count: 1 },
];

function getDayStr(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

export const mockGeneratedIdeas = [
  {
    title: 'Smart Study Planner App',
    description: 'An AI-driven study planner that creates personalized study schedules based on exam dates, learning style, and subject difficulty.',
    targetAudience: 'Students',
    feasibilityScore: 85,
    marketDemand: 'High',
    competitionLevel: 'Medium',
    surveyQuestions: [
      'How many hours do you currently spend planning your study schedule?',
      'Would you pay ₹99/month for a smart study planner?',
      'What features matter most: reminders, analytics, or AI suggestions?',
    ],
  },
  {
    title: 'Freelancer Invoice Manager',
    description: 'A simple invoicing tool for freelancers with auto-generated GST invoices, payment tracking, and client management.',
    targetAudience: 'Freelancers',
    feasibilityScore: 78,
    marketDemand: 'High',
    competitionLevel: 'Low',
    surveyQuestions: [
      'How do you currently create invoices for your clients?',
      'Would automated GST calculation save you time?',
      'How important is payment reminder automation to you?',
    ],
  },
];

export const mockRoadmap = {
  _id: 'roadmap-1',
  ideaId: 'idea-1',
  ideaTitle: 'AI Resume Builder for Students',
  overallProgress: 40,
  modules: [
    {
      _id: 'mod-1',
      title: 'Market Validation',
      moduleNumber: 1,
      moduleColor: '#4F46E5',
      subtasks: [
        { _id: 'st-1', title: 'Survey 50 college students', description: 'Create a Google Form and share in college WhatsApp groups', isCompleted: true, completedAt: new Date(Date.now() - 86400000 * 5).toISOString(), note: 'Got 67 responses! Most students want a free tier.' },
        { _id: 'st-2', title: 'Analyze competitor products', description: 'List top 5 resume builders and note gaps', isCompleted: true, completedAt: new Date(Date.now() - 86400000 * 3).toISOString(), note: '' },
        { _id: 'st-3', title: 'Define unique value proposition', description: 'What makes yours different from Canva Resume?', isCompleted: false, note: '' },
      ],
    },
    {
      _id: 'mod-2',
      title: 'MVP Development',
      moduleNumber: 2,
      moduleColor: '#7C3AED',
      subtasks: [
        { _id: 'st-4', title: 'Design wireframes in Figma', description: 'Create low-fi mockups for 5 key screens', isCompleted: true, completedAt: new Date(Date.now() - 86400000).toISOString(), note: '' },
        { _id: 'st-5', title: 'Build frontend with React', description: 'Set up project, implement UI components', isCompleted: false, note: '' },
        { _id: 'st-6', title: 'Integrate AI for resume suggestions', description: 'Use OpenAI API for role-specific bullet points', isCompleted: false, note: '' },
      ],
    },
    {
      _id: 'mod-3',
      title: 'Launch & Marketing',
      moduleNumber: 3,
      moduleColor: '#059669',
      subtasks: [
        { _id: 'st-7', title: 'Create landing page', description: 'Build a conversion-focused landing page', isCompleted: false, note: '' },
        { _id: 'st-8', title: 'Launch on Product Hunt', description: 'Prepare assets and schedule launch day', isCompleted: false, note: '' },
      ],
    },
  ],
};

export const mockNotes = [
  { _id: 'note-1', title: '💡 Idea', sectionTitle: '💡 Idea', content: '<p>My startup idea is to build an AI-powered resume builder specifically for college students.</p>' },
  { _id: 'note-2', title: '👥 Customer Aspect', sectionTitle: '👥 Customer Aspect', content: '' },
  { _id: 'note-3', title: '📊 Market Research', sectionTitle: '📊 Market Research', content: '' },
  { _id: 'note-4', title: '🔨 Product Building', sectionTitle: '🔨 Product Building', content: '' },
  { _id: 'note-5', title: '📣 Marketing', sectionTitle: '📣 Marketing', content: '' },
  { _id: 'note-6', title: '🚀 Launching', sectionTitle: '🚀 Launching', content: '' },
];

export const mockCourses = [
  { _id: 'course-1', title: 'Startup Fundamentals 101', description: 'Learn the basics of building a startup from scratch.', thumbnail: '', lessons: [{ _id: 'l1', title: 'What is a Startup?' }, { _id: 'l2', title: 'Finding Product-Market Fit' }] },
  { _id: 'course-2', title: 'Digital Marketing Mastery', description: 'Master SEO, social media, and paid advertising.', thumbnail: '', lessons: [{ _id: 'l3', title: 'SEO Basics' }] },
  { _id: 'course-3', title: 'Financial Planning for Founders', description: 'Budgeting, fundraising, and financial models.', thumbnail: '', lessons: [] },
];

export const mockBooks = [
  { _id: 'book-1', title: 'Zero to One', coverImage: '' },
  { _id: 'book-2', title: 'The Lean Startup', coverImage: '' },
  { _id: 'book-3', title: 'Start with Why', coverImage: '' },
];

export const mockPosts = [
  {
    _id: 'post-1',
    title: '10 Mistakes First-Time Founders Make',
    description: 'Starting a business is exciting, but many first-time founders fall into common traps. Here are the top 10 mistakes to avoid: 1) Not validating the idea before building. 2) Trying to build everything at once. 3) Ignoring customer feedback. 4) Spending too much on branding too early.',
    image: '',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'post-2',
    title: 'How to Validate Your Startup Idea in 48 Hours',
    description: 'You don\'t need months to know if your idea has potential. Use this 48-hour framework: Day 1 — Talk to 20 potential users. Day 2 — Build a simple landing page and measure signups.',
    image: '',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'post-3',
    title: 'The Power of Building in Public',
    description: 'Sharing your journey openly on Twitter and LinkedIn can attract early adopters, mentors, and even investors. Here\'s why building in public works and how to start today.',
    image: '',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];
