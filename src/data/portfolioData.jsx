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
    company: 'BigTopSocial',
    role: 'Web Developer Intern',
    position: 'Web Developer Intern',
    period: 'DEC 2025 - PRESENT',
    startDate: 'December 2025',
    endDate: 'Present',
    location: 'Nagpur',
    isCurrent: true,
    image: '/company/BT.png',
    website: 'https://www.bigtopsocial.com/',
    github: 'https://github.com/NagpurHeightsOfficial/Official_Bigtopsocial',
    description: [
      'Designed, Developed, and Deployed the official website for BigtopSocials as a Web Developer Intern, delivering a responsive, high-performance user experience aligned with the brand digital strategy.',
      'Maintained and enhanced Nagpur Heights property listing platforms by implementing structured JSON data workflows for efficient content management.',
      'Created and optimized web assets, including images, graphics, and UI components, improving visual consistency and performance across digital platforms.',
      'Developed brand toolkits and social media creatives to strengthen visual identity, enhance marketing communication, and maintain cohesive branding across online channels.',
    ],
    desc: 'Designed, developed, and deployed the official website for BigtopSocials as a Web Developer Intern. Maintained property listing platforms and optimized responsive UI assets.',
    skills: ['Next.js', 'Tailwind CSS', 'TypeScript', 'React', 'Figma', 'Vercel', 'Canva'],
  },
  {
    company: 'Lamp Hub',
    role: 'Front End Developer Intern',
    position: 'Front End Developer Intern',
    period: 'JAN 2025 - MAR 2025',
    startDate: 'January 2025',
    endDate: 'March 2025',
    location: 'Nagpur (Remote)',
    isCurrent: false,
    image: '/company/LH.png',
    website: 'https://lamphub.com/',
    linkedin: 'https://www.linkedin.com/company/lamp-hub/',
    description: [
      'Remote web development internship at LampHub, gaining hands-on experience with HTML, CSS, Bootstrap, jQuery, and jQuery UI.',
      'Built responsive interfaces and interactive components to understand layout systems and styling workflows.',
      'Developed the Quiz Mitra project, a web-based quiz management system allowing teachers to manage quizzes while students attempt quizzes online.',
      'Strengthened debugging, code structuring, and frontend best practices through project-based learning and iterative improvements.',
    ],
    desc: 'Remote web development internship at LampHub, building responsive interfaces and developing the Quiz Mitra quiz management system with interactive UI components.',
    skills: ['HTML', 'JavaScript', 'CSS', 'SQL', 'Bootstrap', 'jQuery'],
  },
  {
    company: 'Big Block Theory',
    role: 'Reddit Growth & Research Intern',
    position: 'Reddit Growth & Research Intern',
    period: 'JUL 2026 - PRESENT',
    startDate: 'July 2026',
    endDate: 'Present',
    location: 'India',
    isCurrent: true,
    image: '/company/loop.png',
    description: [
      'Conducted in-depth research on Reddit communities, platform trends, and user behavior to identify high-potential content opportunities.',
      'Developed and executed organic growth strategies, tested data-driven content formats, and collaborated with product teams to turn research into actionable user acquisition.',
    ],
    desc: 'Conducted in-depth research on Reddit communities, platform trends, and user behavior to identify high-potential content opportunities. Developed and executed organic growth strategies.',
    skills: ['Reddit Analytics', 'Growth Strategy', 'Audience Research', 'Content Optimization'],
  },
  {
    company: 'FlyRank AI',
    role: 'Frontend AI Intern',
    position: 'Frontend AI Intern',
    period: 'JUL 2026 - SEP 2026',
    startDate: 'July 2026',
    endDate: 'September 2026',
    location: 'Remote',
    isCurrent: false,
    image: '/company/prepeasy.png',
    description: [
      'Designed and developed responsive frontend interfaces for AI-powered ranking and content tools using React, Next.js, TypeScript, and Tailwind CSS.',
      'Built interactive chat surfaces, result visualization dashboards, and integrated LLM streaming APIs to translate raw model outputs into intuitive web experiences.',
    ],
    desc: 'Designed and developed responsive frontend interfaces for AI-powered ranking and content tools using React, Next.js, TypeScript, and Tailwind CSS.',
    skills: ['React', 'Next.js', 'TypeScript', 'LLM Streaming', 'Tailwind CSS'],
  },
  {
    company: 'Perplexity',
    role: 'Campus Partner',
    position: 'Campus Partner',
    period: 'SEP 2025 - NOV 2025',
    startDate: 'September 2025',
    endDate: 'November 2025',
    location: 'India',
    isCurrent: false,
    image: '/company/expelee.png',
    description: [
      'Spearheaded AI awareness and campus engagement initiatives for Perplexity AI, driving student adoption, workflow optimization, and hands-on workshops on agentic search tools.',
    ],
    desc: 'Spearheaded AI awareness and campus engagement initiatives for Perplexity AI, driving student adoption, workflow optimization, and hands-on workshops on agentic search tools.',
    skills: ['AI Evangelism', 'Community Growth', 'Workshops', 'Perplexity Pro'],
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
    certificateImage: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80',
    description: 'Demonstrated proficiency in Google Cloud computing fundamentals, cloud security, and scalable infrastructure.',
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
    certificateImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    description: 'Mastered production-grade multi-agent architectures, tool calling, and evaluation pipelines using Gemini and Kaggle.',
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
    certificateImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    description: 'Completed comprehensive coursework in enterprise generative AI patterns and cloud solutions.',
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
    certificateImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    description: 'Practical data science foundations covering analytical reasoning and decision-making.',
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
    certificateImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80'
    ],
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
    certificateImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80'
    ],
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

// 8. PROJECTS DATA
export const PROJECTS = [
  {
    id: 'project-sahil-recreation',
    title: 'Sahil Recreation',
    category: 'Design & Code Recreation',
    year: '2026',
    description: 'An interactive portfolio experience with fluid GSAP micro-interactions, canvas matrix background, and procedural Web Audio feedback.',
    details: 'A visual portfolio system designed around fluid movement, spatial sound, and interactive brand discovery.',
    longDetails: 'A fully interactive portfolio experience built from scratch using React 18, GSAP 3, and the Web Audio API. The experience features spatially-aware ambient sound that responds to user interaction, draggable brand logos with physics-based motion, and a glassmorphic sidebar that reveals project and personal details. Every microinteraction was hand-crafted for a premium feel.',
    technologies: ['React 18', 'GSAP 3', 'Web Audio API', 'Canvas API'],
    tech: ['React', 'GSAP', 'CSS3', 'JavaScript', 'Node.js', 'Canvas'],
    techFull: ['React 18', 'GSAP 3', 'Web Audio API', 'Vite', 'CSS Custom Properties', 'Node.js'],
    image: '/projects/sahil-recreation.jpg',
    videoThumb: '/projects/sahil-recreation.jpg',
    link: 'https://github.com/sahilaw22',
    github: 'https://github.com/sahilaw22',
    isWorking: true,
    isFeatured: true,
  },
  {
    id: 'project-lurian-ai',
    title: 'Lurian AI',
    category: 'Conversational Assistant',
    year: '2026',
    description: 'Real-time intelligent portfolio companion that explains architecture decisions, walks through case studies, and handles visitor questions.',
    details: 'A real-time conversational layer that helps visitors understand project case studies and workflows.',
    longDetails: 'An intelligent portfolio assistant powered by a language model fine-tuned on engineering content. The interface mimics a modern chat application with streaming responses, suggested prompts, and contextual follow-up questions. The AI can explain technical decisions, describe the engineering process behind projects, and answer general questions about skills and experience.',
    technologies: ['React 18', 'LLM Streaming', 'Edge Functions', 'Tailwind CSS'],
    tech: ['React', 'AI Engine', 'TypeScript', 'Node.js', 'JavaScript', 'Figma'],
    techFull: ['React 18', 'LLM API', 'Edge Functions', 'TypeScript', 'Framer Motion', 'Node.js'],
    image: '/projects/lurian-ai.png',
    videoThumb: '/projects/lurian-ai.png',
    link: '#/chat',
    github: 'https://github.com/sahilaw22',
    isWorking: true,
    isFeatured: true,
  },
  {
    id: 'project-audio-synth',
    title: 'Web Audio Synth',
    category: 'Audio Experiment',
    year: '2026',
    description: 'Interactive browser audio workstation with multi-oscillator synthesis, resonant filters, ADSR envelope shaping, and real-time canvas waveform visualizer.',
    details: 'A browser audio workstation exploring oscillator synthesis, filter controls, and interactive audio visualizer.',
    longDetails: 'A fully browser-based audio synthesizer built using the Web Audio API without external libraries. Features include multi-oscillator synthesis (sine, saw, square waves), a low-pass filter with resonance control, an ADSR envelope, and real-time waveform visualization on an HTML Canvas.',
    technologies: ['Web Audio API', 'HTML5 Canvas', 'Vanilla JS', 'CSS Grid'],
    tech: ['Web Audio', 'JavaScript', 'Canvas', 'CSS3', 'React', 'TypeScript'],
    techFull: ['Web Audio API', 'Vanilla JavaScript', 'HTML Canvas', 'CSS Grid', 'TypeScript'],
    image: '/projects/audio-synth.png',
    videoThumb: '/projects/audio-synth.png',
    link: 'https://github.com/sahilaw22',
    github: 'https://github.com/sahilaw22',
    isWorking: true,
    isFeatured: true,
  },
  {
    id: 'project-connectkit',
    title: 'ConnectKit Theme',
    category: 'Web3 Design System',
    year: '2026',
    description: 'Modular wallet onboarding system with animated modal transitions, high-contrast dark/light themes, and accessible keyboard-navigable dialogs.',
    details: 'A polished interface study for reusable Web3 connect flows, wallet modals, and consistent component states.',
    longDetails: 'A comprehensive design system and component library for Web3 wallet connection flows. Built on top of ConnectKit with custom themes, animated modal transitions, responsive layouts, and dark/light mode support. Includes reusable React components for wallet selection, balance display, network switching, and transaction confirmation states.',
    technologies: ['React', 'ConnectKit', 'Figma', 'Storybook'],
    tech: ['React', 'UI/UX', 'Figma', 'TypeScript', 'CSS3', 'JavaScript'],
    techFull: ['React', 'ConnectKit', 'Figma', 'Storybook', 'Framer Motion', 'TypeScript'],
    image: '/projects/connectkit.png',
    videoThumb: '/projects/connectkit.png',
    link: 'https://github.com/sahilaw22',
    github: 'https://github.com/sahilaw22',
    isWorking: true,
    isFeatured: true,
  },
];

// 9. TESTIMONIALS DATA
export const TESTIMONIALS = [];
