import React from 'react';

/**
 * =======================================================================
 * CENTRAL PORTFOLIO DATA STORE
 * =======================================================================
 * This file serves as the single source of truth for all structured
 * content across the portfolio sections (Hero, About, Experience,
 * Education, Skills, and Certifications).
 */

// 1. HERO SECTION ROLES (Rotating Text Badges)
export const HERO_ROLES = [
  'Frontend AI Engineer',
  'UI/UX Designer',
  'App Developer'
];

// 2. ABOUT ME NARRATIVE PARAGRAPHS
export const ABOUT_PARAGRAPHS = [
  'I am a computer engineering student focusing on frontend development, UI design, and practical AI interfaces. I design interfaces in Figma and build them into responsive web and mobile applications using React, TypeScript, and Flutter.',
  'My recent work centers on low-latency streaming interfaces, browser-based audio tools, and design systems with Next.js, Tailwind CSS, and Python. I care about high-contrast typography, keyboard navigation, and shipping reliable code that runs smoothly.',
];

// 3. EXPERIENCE SECTION DATA (Matching header: EXPERIENCE)
export const EXPERIENCES = [
  {
    company: 'Big Block Theory',
    role: 'Reddit Growth & Research Intern',
    period: 'JUL 2026 - PRESENT',
    location: 'India',
    isCurrent: true,
    desc: 'Conducted in-depth research on Reddit communities, platform trends, and user behavior to identify high-potential content opportunities. Developed and executed organic growth strategies, tested data-driven content formats, and collaborated with product teams to turn research into actionable user acquisition.',
    skills: ['Reddit Analytics', 'Growth Strategy', 'Audience Research', 'Content Optimization'],
    logo: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="#ff5555" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 22V12M21 7l-9 5M3 7l9 5" stroke="#ff5555" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    company: 'FlyRank AI',
    role: 'Frontend AI Intern',
    period: 'JUL 2026 - SEP 2026',
    location: 'Remote',
    isCurrent: false,
    desc: 'Designed and developed responsive frontend interfaces for AI-powered ranking and content tools using React, Next.js, TypeScript, and Tailwind CSS. Built interactive chat surfaces, result visualization dashboards, and integrated LLM streaming APIs to translate raw model outputs into intuitive web experiences.',
    skills: ['React', 'Next.js', 'TypeScript', 'LLM Streaming', 'Tailwind CSS'],
    logo: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#a855f7" />
      </svg>
    ),
  },
  {
    company: 'Perplexity',
    role: 'Campus Partner',
    period: 'SEP 2025 - NOV 2025',
    location: 'India',
    isCurrent: false,
    desc: 'Spearheaded AI awareness and campus engagement initiatives for Perplexity AI, driving student adoption, workflow optimization, and hands-on workshops on agentic search tools.',
    skills: ['AI Evangelism', 'Community Growth', 'Workshops', 'Perplexity Pro'],
    logo: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="3.34" y1="7" x2="20.66" y2="17" />
        <line x1="3.34" y1="17" x2="20.66" y2="7" />
        <circle cx="12" cy="12" r="3" fill="#22d3ee" />
      </svg>
    ),
  },
];

// 4. EDUCATION SECTION DATA (Matching header: EDUCATION)
export const EDUCATION_ITEMS = [
  {
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
    logo: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    degree: 'Higher Secondary (12th, PCM)',
    institution: 'SP Smart School, Jammu',
    period: '2021 - 2023',
    isCurrent: false,
    desc: 'Completed Higher Secondary education with specialization in Physics, Chemistry, and Mathematics (PCM), building rigorous analytical reasoning and foundational problem-solving disciplines.',
    courses: ['Physics', 'Chemistry', 'Mathematics', 'Computer Fundamentals'],
    logo: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <polyline points="10 7 12 9 16 5" />
      </svg>
    ),
  },
];

// 5. SKILLS SECTION DATA (Matching header: SKILLS)
export const SKILL_CATEGORIES = [
  {
    category: 'Frontend & Mobile',
    skills: ['React', 'Flutter', 'Next.js', 'TypeScript', 'JavaScript', 'Dart', 'Tailwind CSS', 'HTML/CSS', 'GSAP'],
  },
  {
    category: 'AI & Intelligent Systems',
    skills: ['LLM Agents', 'Gemini API', 'Python', 'RAG Architectures', 'Prompt Engineering'],
  },
  {
    category: 'Backend & Data',
    skills: ['Node.js', 'RESTful APIs', 'SQL / Database', 'Supabase', 'Git / GitHub'],
  },
  {
    category: 'Design & Engineering Tools',
    skills: ['Figma Prototyping', 'Design Systems', 'UI/UX Design', 'Vite', 'C++'],
  },
];

// 6. CERTIFICATIONS SECTION DATA
export const CERTIFICATIONS = [
  {
    title: 'Google Cloud Skills Profile',
    issuer: 'Google Cloud Skills Boost',
    issueDate: 'Issued Oct 2025',
    year: '2025',
    link: 'https://www.skills.google/public_profiles/28d9b2e7-95ee-45b6-97e9-acda35018f7a',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4" />
      </svg>
    ),
  },
  {
    title: 'AI Agents Intensive Course with Google',
    issuer: 'Google & Kaggle',
    issueDate: 'Issued Nov 2025',
    year: '2025',
    link: 'https://www.kaggle.com/certification/badges/sahilahmedwani/105',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#20BEFF">
        <path d="M18.825 21.999h-3.414l-5.029-7.142-2.122 2.039v5.103H5.21V2h3.05v12.24l6.903-7.239h3.693l-6.19 6.273 6.159 8.725z"/>
      </svg>
    ),
  },
  {
    title: 'IBM SkillsBuild Gen AI & Cloud Computing',
    issuer: 'IBM',
    issueDate: 'Issued Jan 2026',
    year: '2026',
    link: 'https://skills.yourlearning.ibm.com/certificate/share/b1a4e79638ewogICJvYmplY3RUeXBlIiA6ICJBQ1RJVklUWSIsCiAgImxlYXJuZXJDTlVNIiA6ICI3OTc3NzAyUkVHIiwKICAib2JqZWN0SWQiIDogIlBMQU4tMEUwQTM5MEE2MTlGIgp98f17046926-10',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#052FAD" strokeWidth="2.4">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="3" y1="14" x2="21" y2="14"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    ),
  },
  {
    title: 'HP LIFE Data Science & Analytics Foundations',
    issuer: 'HP LIFE Foundation',
    issueDate: 'Issued Aug 2025',
    year: '2025',
    link: 'https://www.life-global.org/',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#0096D6" strokeWidth="2.2" />
        <path d="M9 16V8l3 3 3-3v8" stroke="#0096D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// 7. HONORS & ACHIEVEMENTS SECTION DATA (Matching clean certification row design)
export const ACHIEVEMENTS = [
  {
    title: 'Top 1000 Innovator – SBI Youth Ideathon',
    issuer: 'ThinkStartup & IIT Delhi',
    year: 'Oct 2025',
    link: 'https://thinkstartup.in/',
    description: 'Selected among top 1,000 innovators across India for prototype feasibility, social impact, and technical execution.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
  },
  {
    title: 'Hacktoberfest 2025 (Super Contributor)',
    issuer: 'DigitalOcean & TreeNation',
    year: 'Nov 2025',
    link: 'https://hacktoberfest.com/',
    description: 'Recognized as a Super Contributor for merged pull requests across open-source frontend and developer tooling ecosystems.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.2l6 3v9.6l-6 3-6-3V7.2l6-3z" fill="#FF7A59" />
        <path d="M12 7l-4 4 1.4 1.4L11 10.8V17h2v-6.2l1.6 1.6L16 11l-4-4z" fill="#FF7A59" />
      </svg>
    ),
  },
  {
    title: 'Super Contributor Holopin Badges',
    issuer: 'Holopin (Hacktoberfest)',
    year: 'Nov 2025',
    link: 'https://www.holopin.io/@sahilahmedwani',
    description: 'Earned verified multi-tier contribution badges reflecting consistent open-source software delivery and community pull requests.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#f59e0b" />
      </svg>
    ),
  },
  {
    title: 'GirlScript Summer of Code (GSSOC\'26)',
    issuer: 'GirlScript Foundation',
    year: 'Mar 2026',
    link: 'https://gssoc.girlscript.tech/',
    description: 'Selected contributor participating in high-impact open-source web applications and developer tooling repositories.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <rect width="24" height="24" rx="5" fill="#f97316" />
        <path d="M7 12l3.5 3.5L17 8.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Unstop 30-Day POTD Problem Solving Streak',
    issuer: 'Unstop Practice',
    year: 'Dec 2025',
    link: 'https://unstop.com/',
    description: 'Maintained a verified 30-day continuous algorithm and data structures streak with daily problem solving.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];
