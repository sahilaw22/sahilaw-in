/**
 * Default Content Seed for Dynamic Portfolio Management
 * Persisted in SQLite `portfolio_content` table.
 * Fully editable via Admin Dashboard with real-time sync.
 */

export const DEFAULT_PORTFOLIO_CONTENT = {
  about: [
    'I am a 3rd-year Computer Engineering student who builds with intent and thinks in motion. Turning bold ideas into intuitive interfaces, I bridge front-end craft {{ICON_FIGMA}} and AI engineering to create software that feels as good as it works.',
    'From engineering responsive React {{ICON_REACT}}, TypeScript {{ICON_TYPESCRIPT}}, and Flutter {{ICON_FLUTTER}} applications to deploying intelligent agents and full-stack systems with Tailwind CSS {{ICON_TAILWIND}}, Next.js {{ICON_NEXTJS}}, and Python {{ICON_PYTHON}}, I believe great engineering begins with clarity. I focus on clean code, seamless interactions, and shipping real solutions that solve everyday problems.',
  ],

  experiences: [
    {
      id: 'exp-bbt',
      company: 'Big Block Theory',
      role: 'Reddit Growth & Research Intern',
      period: 'JUL 2026 - PRESENT',
      location: 'India',
      isCurrent: true,
      desc: 'Conducted in-depth research on Reddit communities, platform trends, and user behavior to identify high-potential content opportunities. Developed and executed organic growth strategies, tested data-driven content formats, and collaborated with product teams to turn research into actionable user acquisition.',
      skills: ['Reddit Analytics', 'Growth Strategy', 'Audience Research', 'Content Optimization'],
      logo: 'https://img.icons8.com/color/48/reddit.png',
    },
    {
      id: 'exp-flyrank',
      company: 'FlyRank AI',
      role: 'Frontend AI Intern',
      period: 'JUL 2026 - SEP 2026',
      location: 'Remote',
      isCurrent: false,
      desc: 'Designed and developed responsive frontend interfaces for AI-powered ranking and content tools using React, Next.js, TypeScript, and Tailwind CSS. Built interactive chat surfaces, result visualization dashboards, and integrated LLM streaming APIs to translate raw model outputs into intuitive web experiences.',
      skills: ['React', 'Next.js', 'TypeScript', 'LLM Streaming', 'Tailwind CSS'],
      logo: 'https://img.icons8.com/fluency/48/artificial-intelligence.png',
    },
    {
      id: 'exp-perplexity',
      company: 'Perplexity',
      role: 'Campus Partner',
      period: 'SEP 2025 - NOV 2025',
      location: 'India',
      isCurrent: false,
      desc: 'Spearheaded AI awareness and campus engagement initiatives for Perplexity AI, driving student adoption, workflow optimization, and hands-on workshops on agentic search tools.',
      skills: ['AI Evangelism', 'Community Growth', 'Workshops', 'Perplexity Pro'],
      logo: 'https://img.icons8.com/color/48/search--v1.png',
    },
  ],

  education: [
    {
      id: 'edu-gcet',
      degree: 'B.Tech, Computer Science and Engineering',
      institution: 'Government College of Engineering and Technology, Jammu (GCET Jammu)',
      period: '2024 - 2028',
      isCurrent: true,
      desc: 'Undergraduate Computer Science and Engineering student developing practical software systems alongside foundational theory. Focused on artificial intelligence workflows, data structures, full-stack architectures, and modern cross-platform mobile development.',
      courses: [
        'Artificial Intelligence & ML',
        'Data Structures & Algorithms (DSA)',
        'Database Management Systems (RDBMS)',
        'Full-Stack Web Architecture',
        'Operating Systems & Networks',
        'Object-Oriented Programming (C++)',
      ],
      logo: 'https://img.icons8.com/fluency/48/graduation-cap.png',
    },
    {
      id: 'edu-spsmart',
      degree: 'Higher Secondary (12th, PCM)',
      institution: 'SP Smart School, Jammu',
      period: '2021 - 2023',
      isCurrent: false,
      desc: 'Completed Higher Secondary education with specialization in Physics, Chemistry, and Mathematics (PCM), building rigorous analytical reasoning and foundational problem-solving disciplines.',
      courses: ['Physics', 'Chemistry', 'Mathematics', 'Computer Fundamentals'],
      logo: 'https://img.icons8.com/fluency/48/school.png',
    },
  ],

  skills: [
    {
      id: 'cat-frontend-mobile',
      category: 'Frontend & Mobile',
      skills: ['React', 'Flutter', 'Next.js', 'TypeScript', 'JavaScript', 'Dart', 'Tailwind CSS', 'HTML/CSS', 'GSAP'],
    },
    {
      id: 'cat-ai-systems',
      category: 'AI & Intelligent Systems',
      skills: ['LLM Agents', 'Gemini API', 'Python', 'RAG Architectures', 'Prompt Engineering'],
    },
    {
      id: 'cat-backend-data',
      category: 'Backend & Data',
      skills: ['Node.js', 'RESTful APIs', 'SQL / Database', 'Supabase', 'Git / GitHub'],
    },
    {
      id: 'cat-design-tools',
      category: 'Design & Engineering Tools',
      skills: ['Figma Prototyping', 'Design Systems', 'UI/UX Design', 'Vite', 'C++'],
    },
  ],

  meta: {
    hero_roles: ['Frontend AI Engineer', 'UI/UX Designer', 'App Developer'],
    email: 'sahilaw502@gmail.com',
    github: 'https://github.com/sahilaw22',
    linkedin: 'https://linkedin.com/in/sahilaw',
  },
};

