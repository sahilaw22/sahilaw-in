/**
 * Verified Portfolio Knowledge Base Seed
 * Extracted exclusively from actual codebase sources:
 * - src/data/portfolioData.jsx
 * - src/pages/ProjectsPage.jsx
 * - src/components/ContactSection.jsx
 * - src/components/HeroHeader.jsx
 * - src/data/blog.js
 */

export const INITIAL_SETTINGS = [
  { key: 'confidenceThreshold', value: '0.62' },
  { key: 'ambiguityThreshold', value: '0.38' },
  { key: 'botName', value: 'Portfolio Assistant' },
  { key: 'portfolioOwner', value: 'Sahil Ahmed Wani' },
  { key: 'contactEmail', value: 'sahilaw502@gmail.com' },
  { key: 'retentionDays', value: '90' },
  { key: 'rateLimitPerMin', value: '30' },
];

export const INITIAL_TEMPLATES = [
  {
    key: 'greeting',
    name: 'Greeting Response',
    template:
      "Hi! I am Sahil. You can ask me about my [projects](#/projects), technical stack, work experience, or how to [reach me directly](mailto:sahilaw502@gmail.com).",
  },
  {
    key: 'thanks',
    name: 'Thanks Response',
    template:
      "You are welcome! Let me know if you want to look into my [projects](#/projects) or view my [resume](#/careers).",
  },
  {
    key: 'acknowledgement',
    name: 'Acknowledgement Response',
    template:
      "Got it. Let me know if you want to explore the [Web Audio Synth](#/projects) or review my [technical stack](#/careers).",
  },
  {
    key: 'farewell',
    name: 'Farewell Response',
    template:
      "Thanks for visiting! You can reach me anytime at [sahilaw502@gmail.com](mailto:sahilaw502@gmail.com). Have a great day.",
  },
  {
    key: 'help',
    name: 'Help & Capabilities',
    template:
      "You can ask me about my [projects](#/projects), React and Flutter engineering, internships, or [contact details](mailto:sahilaw502@gmail.com).",
  },
  {
    key: 'identity',
    name: 'Assistant Identity',
    template:
      "I am Sahil's portfolio interface. I run on a deterministic matching engine using verified facts from this codebase without external generative model calls.",
  },
  {
    key: 'out_of_scope',
    name: 'Out of Scope Query',
    template:
      "I focus on software engineering, my projects, skills, and background. Ask about my [projects](#/projects) or check my [resume](#/careers).",
  },
  {
    key: 'ambiguous',
    name: 'Ambiguous Question Clarification',
    template:
      "Your question could refer to a few different areas. Are you looking for a specific project like the [Web Audio Synth](#/projects), my skills, or work experience?",
  },
  {
    key: 'fallback',
    name: 'Unanswered / Low Confidence Fallback',
    template:
      "I do not have a verified answer for that topic yet. You can explore my [projects](#/projects), view my [skills](#/careers), or email me directly at [sahilaw502@gmail.com](mailto:sahilaw502@gmail.com).",
  },
];

export const INITIAL_KNOWLEDGE_ENTRIES = [
  // 1. INTRO & ABOUT
  {
    id: 'kb-intro-who-is-sahil',
    category: 'Introduction',
    canonical_question: 'Who is Sahil Ahmed Wani?',
    aliases: [
      'who are you',
      'tell me about yourself',
      'introduce yourself',
      'who is sahil',
      'what is your background',
      'who built this portfolio',
      'about sahil',
      'bio',
    ],
    keywords: ['sahil', 'wani', 'who', 'about', 'intro', 'background', 'bio', 'student', 'engineer'],
    answer:
      "I am a Computer Science undergraduate at GCET Jammu working as a frontend AI engineer and UI designer. I build responsive web and mobile interfaces using React, TypeScript, Tailwind CSS, and Flutter, connecting them to practical AI workflows and audio tools.\n\nYou can inspect my work in [Projects](#/projects), check my background on [LinkedIn](https://www.linkedin.com/in/sahil-a-057a0231a), or review my code on [GitHub](https://github.com/sahilaw22).",
    links: [
      { label: 'View Projects', url: '#/projects' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sahil-a-057a0231a' },
    ],
    related_entities: ['GCET Jammu', 'Frontend AI Engineer', 'UI/UX Designer', 'App Developer'],
  },
  {
    id: 'kb-about-philosophy',
    category: 'About',
    canonical_question: 'What is your design and engineering philosophy?',
    aliases: [
      'ask how i build products',
      'how i build products',
      'how do you build products',
      'how you build products',
      'what is your philosophy',
      'what is your design approach',
      'why do you focus on microinteractions',
      'engineering philosophy',
      'build process',
      'product process',
    ],
    keywords: ['philosophy', 'design', 'craft', 'build', 'approach', 'products', 'principles'],
    answer:
      "I design interfaces in Figma first to nail typography, layout hierarchy, and component states, then implement them cleanly in code with accessible keyboard navigation and fluid motion. I care about tactile feedback, fast load times, and keeping dependencies minimal.\n\nYou can test this directly in the interactive audio feedback on this site and inside the [Projects showcase](#/projects).",
    links: [{ label: 'View Projects', url: '#/projects' }],
    related_entities: ['Frontend craft', 'Motion', 'Tactile feedback'],
  },
  {
    id: 'kb-hire-why-hire-sahil',
    category: 'About',
    canonical_question: 'Why should a team hire me?',
    aliases: [
      'ask why a team should hire me',
      'why a team should hire me',
      'why should a team hire me',
      'why should we hire you',
      'why hire sahil',
      'why hire you',
      'why hire sahil wani',
      'what makes you a strong candidate',
      'why should i hire you',
      'why choose sahil',
      'hire sahil',
    ],
    keywords: ['hire', 'candidate', 'team', 'join', 'why', 'value', 'impact', 'skills', 'engineer'],
    answer:
      "I bring three practical strengths to an engineering team:\n\n1. Frontend craft: I translate Figma designs into fast, accessible, keyboard-navigable React, Next.js, and Flutter code with clean state management.\n2. Applied AI integrations: I have real-world experience building low-latency LLM streaming interfaces, prompt pipelines, and deterministic conversational systems.\n3. Production execution: From frontend internships at FlyRank AI and BigTopSocial to open-source contributions, I focus on shipping working code that solves real problems.\n\nInspect my builds in [Projects](#/projects) or contact me at [sahilaw502@gmail.com](mailto:sahilaw502@gmail.com).",
    links: [
      { label: 'View Resume', url: '#/careers' },
      { label: 'Email Sahil', url: 'mailto:sahilaw502@gmail.com' },
    ],
    related_entities: ['Frontend AI', 'Engineering Craft', 'Product Design'],
  },

  // 2. PROJECTS SUMMARY
  {
    id: 'kb-projects-summary',
    category: 'Projects',
    canonical_question: 'What projects have you built?',
    aliases: [
      'ask about my projects',
      'about my projects',
      'what are your projects',
      'tell me about your projects',
      'show me your projects',
      'what have you built',
      'list your projects',
      'portfolio projects',
      'featured work',
      'best projects',
      'projects',
    ],
    keywords: ['projects', 'built', 'work', 'portfolio', 'showcase', 'apps', 'systems'],
    answer:
      "My key builds include [Sahil Recreation](#/projects), an interactive portfolio with GSAP animations and Web Audio spatial sound; the [Web Audio Synth](#/projects), a native multi-oscillator browser synthesizer with real-time canvas waveforms; the [ConnectKit Theme](#/projects), an accessible Web3 wallet design system; and [Lurian AI](#/chat), a conversational assistant built on deterministic matching.\n\nExplore all builds in [Projects](#/projects) or browse the source repositories on [GitHub](https://github.com/sahilaw22).",
    links: [
      { label: 'View Projects', url: '#/projects' },
      { label: 'GitHub', url: 'https://github.com/sahilaw22' },
    ],
    related_entities: ['Sahil Recreation', 'Web Audio Synth', 'ConnectKit Theme', 'Lurian AI'],
  },

  // 3. SPECIFIC PROJECTS
  {
    id: 'kb-project-audio-synth',
    category: 'Projects',
    canonical_question: 'Tell me about the Web Audio Synth project',
    aliases: [
      'what is the web audio synth',
      'audio synthesizer project',
      'how does the synth work',
      'tell me about your audio project',
      'music project',
      'synthesizer features',
    ],
    keywords: ['audio', 'synth', 'synthesizer', 'web audio', 'oscillator', 'canvas', 'music', 'sound', 'waveform'],
    answer:
      "I built the **Web Audio Synth** as a pure browser-based audio workstation using only the native Web Audio API and HTML5 Canvas, without third-party audio packages. It features multi-oscillator synthesis (sine, saw, square waves), low-pass filter resonance control, ADSR envelopes, and an interactive waveform visualizer.\n\nTest the synthesizer in [Projects](#/projects) or inspect the implementation on [GitHub](https://github.com/sahilaw22).",
    links: [
      { label: 'Synth Showcase', url: '#/projects' },
      { label: 'GitHub', url: 'https://github.com/sahilaw22' },
    ],
    related_entities: ['Web Audio API', 'HTML Canvas', 'TypeScript', 'OscillatorNode'],
  },
  {
    id: 'kb-project-sahil-recreation',
    category: 'Projects',
    canonical_question: 'Tell me about the Sahil Recreation portfolio project',
    aliases: [
      'what is sahil recreation',
      'how did you build this portfolio',
      'how was this site made',
      'tell me about this portfolio system',
      'portfolio tech stack',
    ],
    keywords: ['recreation', 'portfolio', 'site', 'website', 'built', 'audio engine', 'gsap', 'sound'],
    answer:
      "**Sahil Recreation** is this portfolio experience. I engineered it from scratch using React 18, GSAP 3, and the Web Audio API, featuring spatial ambient audio feedback and physics-based draggable brand logos.\n\nIt also incorporates a 3D card carousel, a matrix code background canvas, and this zero-dependency deterministic assistant. Explore all project cards in [Projects](#/projects).",
    links: [{ label: 'View Projects', url: '#/projects' }],
    related_entities: ['React 18', 'GSAP 3', 'Web Audio API', 'Vite'],
  },
  {
    id: 'kb-project-connectkit',
    category: 'Projects',
    canonical_question: 'Tell me about the ConnectKit Theme project',
    aliases: [
      'what is connectkit theme',
      'web3 wallet project',
      'tell me about your web3 project',
      'connectkit ui',
    ],
    keywords: ['connectkit', 'web3', 'wallet', 'crypto', 'theme', 'storybook', 'modal'],
    answer:
      "**ConnectKit Theme** is a design system and component library for Web3 wallet connection flows. Built on top of ConnectKit, it includes animated modal transitions and responsive dark and light mode support.\n\nIt features reusable React components for wallet selection, balance display, network switching, and transaction confirmations documented with Storybook. Check it out in [Projects](#/projects).",
    links: [{ label: 'View Projects', url: '#/projects' }],
    related_entities: ['ConnectKit', 'Figma', 'Storybook', 'Framer Motion', 'TypeScript'],
  },
  {
    id: 'kb-project-lurian-ai',
    category: 'Projects',
    canonical_question: 'Tell me about Lurian AI',
    aliases: [
      'what is lurian ai',
      'lurian project',
      'ai conversational assistant project',
      'tell me about lurian',
    ],
    keywords: ['lurian', 'ai', 'assistant', 'companion', 'conversational', 'edge'],
    answer:
      "**Lurian AI** is this conversational assistant. I engineered it with React 18, TypeScript, and a deterministic rule-based matching engine that runs in the browser and on serverless endpoints with zero hallucinations and zero external API dependencies.\n\nYou can explore case studies here in [Chat](#/chat) or view the codebase on [GitHub](https://github.com/sahilaw22).",
    links: [
      { label: 'Open Chat', url: '#/chat' },
      { label: 'GitHub', url: 'https://github.com/sahilaw22' },
    ],
    related_entities: ['React 18', 'Edge Functions', 'TypeScript', 'Framer Motion'],
  },

  // 4. SKILLS & TECHNOLOGIES
  {
    id: 'kb-skills-all',
    category: 'Skills',
    canonical_question: 'What are your technical skills and tech stack?',
    aliases: [
      'ask about my strongest skills',
      'my strongest skills',
      'what are your strongest skills',
      'strongest skills',
      'core skills',
      'top skills',
      'what technologies do you use',
      'what are your skills',
      'what is your tech stack',
      'what languages do you know',
      'what tools do you use',
      'list your skills',
    ],
    keywords: ['skills', 'technologies', 'tech', 'stack', 'languages', 'frameworks', 'tools'],
    answer:
      "My daily frontend stack is React 18, TypeScript, Tailwind CSS, and Next.js. On mobile, I build cross-platform apps using Flutter and Dart. I also build browser audio workstations with the Web Audio API and hook web interfaces into streaming LLM APIs.\n\nCheck out working examples in [Projects](#/projects) or view my full coursework and credentials in my [Resume](#/careers).",
    links: [
      { label: 'View Projects', url: '#/projects' },
      { label: 'View Resume', url: '#/careers' },
    ],
    related_entities: ['React', 'Flutter', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Figma'],
  },
  {
    id: 'kb-skills-react',
    category: 'Skills',
    canonical_question: 'Do you have experience with React?',
    aliases: [
      'tell me about your react experience',
      'how good are you at react',
      'react js skills',
      'have you used react',
      'do you know react',
    ],
    keywords: ['react', 'react.js', 'reactjs', 'frontend', 'hooks'],
    answer:
      "Yes, React is my primary frontend framework. I work with React 18, custom hooks, performance profiling, lazy loading, and modern component systems.\n\nI applied React professionally during my frontend AI internship at FlyRank AI and built this entire portfolio with React 18. You can inspect live builds in [Projects](#/projects) or check my code on [GitHub](https://github.com/sahilaw22).",
    links: [
      { label: 'View Projects', url: '#/projects' },
      { label: 'GitHub', url: 'https://github.com/sahilaw22' },
    ],
    related_entities: ['React 18', 'FlyRank AI', 'Hooks', 'Vite'],
  },
  {
    id: 'kb-skills-flutter',
    category: 'Skills',
    canonical_question: 'Do you have experience with Flutter and mobile development?',
    aliases: [
      'tell me about your flutter experience',
      'do you know flutter',
      'have you built mobile apps',
      'flutter and dart',
      'android development',
    ],
    keywords: ['flutter', 'dart', 'mobile', 'android', 'app development', 'ios'],
    answer:
      "Yes, I develop cross-platform mobile applications using Flutter and Dart. I focus on responsive layouts, clean state management, native performance, and translating Figma prototypes into fluid apps.\n\nI am currently preparing mobile application builds for Google Play Store release. You can read more about my mobile background in my [Resume](#/careers).",
    links: [{ label: 'View Resume', url: '#/careers' }],
    related_entities: ['Flutter', 'Dart', 'Mobile Development', 'Figma'],
  },
  {
    id: 'kb-skills-ai',
    category: 'Skills',
    canonical_question: 'What is your experience with AI and LLM agents?',
    aliases: [
      'ai engineering experience',
      'have you worked with artificial intelligence',
      'llm agent skills',
      'prompt engineering',
      'gemini api experience',
      'rag',
    ],
    keywords: ['ai', 'artificial intelligence', 'llm', 'agents', 'gemini', 'rag', 'prompt engineering', 'python'],
    answer:
      "I work actively at the intersection of frontend craft and AI engineering. My experience includes building LLM agent workflows, RAG architectures, prompt engineering, and integrating the Gemini API for streaming model outputs.\n\nI completed Google and Kaggle's AI Agents Intensive course and built real-time streaming interfaces at FlyRank AI. You can review my credentials in my [Resume](#/careers).",
    links: [{ label: 'View Resume', url: '#/careers' }],
    related_entities: ['LLM Agents', 'Gemini API', 'Prompt Engineering', 'RAG'],
  },

  // 5. WORK EXPERIENCE & INTERNSHIPS
  {
    id: 'kb-experience-all',
    category: 'Experience',
    canonical_question: 'What is your work experience?',
    aliases: [
      'tell me about your work experience',
      'where have you worked',
      'what internships have you done',
      'employment history',
      'professional experience',
      'past roles',
    ],
    keywords: ['experience', 'work', 'internships', 'jobs', 'roles', 'companies', 'employment'],
    answer:
      "I have held engineering and growth roles across multiple organizations: as a Web Developer Intern at **BigTopSocial** deploying production Next.js sites; as a Frontend AI Intern at **FlyRank AI** building streaming LLM interfaces; as a Frontend Developer Intern at **Lamp Hub** building web quiz systems; and as a Reddit Growth & Research Intern at **Big Block Theory**.\n\nI also served as a Campus Partner for **Perplexity**. View my full timeline in my [Resume](#/careers).",
    links: [{ label: 'View Resume', url: '#/careers' }],
    related_entities: ['Big Block Theory', 'FlyRank AI', 'Perplexity'],
  },
  {
    id: 'kb-experience-big-block-theory',
    category: 'Experience',
    canonical_question: 'Tell me about your role at Big Block Theory',
    aliases: [
      'what do you do at big block theory',
      'big block theory internship',
      'reddit research role',
    ],
    keywords: ['big block theory', 'reddit', 'growth', 'research', 'analytics'],
    answer:
      "At **Big Block Theory** (JUL 2026 - PRESENT), I serve as a Reddit Growth & Research Intern. I analyze user behavior and platform engagement to develop data-driven content formats that support organic user acquisition.\n\nI work closely with cross-functional product teams to scale user retention. Learn more in my [Resume](#/careers).",
    links: [{ label: 'View Resume', url: '#/careers' }],
    related_entities: ['Big Block Theory', 'Growth Strategy', 'Reddit Analytics'],
  },
  {
    id: 'kb-experience-flyrank',
    category: 'Experience',
    canonical_question: 'Tell me about your role at FlyRank AI',
    aliases: [
      'what did you do at flyrank ai',
      'flyrank internship',
      'frontend ai intern role',
    ],
    keywords: ['flyrank', 'flyrank ai', 'frontend ai', 'streaming', 'llm', 'ranking'],
    answer:
      "At **FlyRank AI** (JUL 2026 - SEP 2026), I worked as a Frontend AI Intern. I engineered responsive interfaces for AI-driven ranking tools using React, Next.js, TypeScript, and Tailwind CSS.\n\nMy primary contribution was designing real-time streaming chat surfaces and latency-optimized search dashboards. Read more in my [Resume](#/careers).",
    links: [{ label: 'View Resume', url: '#/careers' }],
    related_entities: ['FlyRank AI', 'React', 'Next.js', 'LLM Streaming'],
  },
  {
    id: 'kb-experience-perplexity',
    category: 'Experience',
    canonical_question: 'Tell me about your role at Perplexity',
    aliases: [
      'what did you do at perplexity',
      'perplexity campus partner',
      'perplexity ai role',
    ],
    keywords: ['perplexity', 'perplexity ai', 'campus partner', 'ambassador', 'workshops'],
    answer:
      "At **Perplexity** (SEP 2025 - NOV 2025), I served as a Campus Partner. I led AI awareness sessions and organized hands-on developer workshops demonstrating workflow optimization with Perplexity Pro.\n\nMy role focused on helping students and developers integrate AI search tools into their research workflows. Learn more in my [Resume](#/careers).",
    links: [{ label: 'View Resume', url: '#/careers' }],
    related_entities: ['Perplexity', 'AI Evangelism', 'Perplexity Pro'],
  },

  // 6. EDUCATION & CREDENTIALS
  {
    id: 'kb-education-gcet',
    category: 'Education',
    canonical_question: 'Where do you study and what is your education?',
    aliases: [
      'what is your education',
      'which college do you go to',
      'what degree are you pursuing',
      'gcet jammu',
      'university',
      'educational background',
    ],
    keywords: ['education', 'college', 'gcet', 'jammu', 'degree', 'cse', 'computer science', 'btech'],
    answer:
      "I am an undergraduate student pursuing my **B.Tech in Computer Science and Engineering** at GCET Jammu (Government College of Engineering and Technology), batch of 2024 to 2028.\n\nMy core studies cover Data Structures and Algorithms, Database Management Systems, Operating Systems, Computer Networks, and Object-Oriented Programming. Review my academic details in my [Resume](#/careers).",
    links: [{ label: 'View Resume', url: '#/careers' }],
    related_entities: ['GCET Jammu', 'Computer Science & Engineering', 'B.Tech'],
  },
  {
    id: 'kb-education-certifications',
    category: 'Education',
    canonical_question: 'What certifications and credentials do you hold?',
    aliases: [
      'list your certifications',
      'what courses have you completed',
      'credentials',
      'licenses and certifications',
    ],
    keywords: ['certifications', 'credentials', 'badges', 'courses', 'google', 'kaggle'],
    answer:
      "I hold several verified technical credentials, notably the **AI Agents Intensive** certification issued by Google and Kaggle.\n\nI have also completed certifications in modern frontend architecture and cloud computing from IBM and HP LIFE. Check out the verified links in my [Resume](#/careers).",
    links: [{ label: 'View Resume', url: '#/careers' }],
    related_entities: ['Google', 'Kaggle', 'AI Agents Intensive'],
  },

  {
    id: 'kb-resume-details',
    category: 'Experience',
    canonical_question: 'Can I view your resume and career details?',
    aliases: [
      'can i view your resume',
      'show me your resume',
      'view resume',
      'show resume',
      'cv',
      'download resume',
      'career details',
      'career timeline',
      'work history',
      'resume',
    ],
    keywords: ['resume', 'cv', 'career', 'timeline', 'credentials', 'experience', 'pdf'],
    answer:
      "You can review my complete career timeline, technical abilities, and education on my [Resume page](#/careers).\n\nIt features comprehensive details on my engineering internships, academic milestones at GCET Jammu, and verified credentials. You can also [reach me via email](mailto:sahilaw502@gmail.com) for a PDF copy.",
    links: [
      { label: 'View Resume', url: '#/careers' },
      { label: 'Email Sahil', url: 'mailto:sahilaw502@gmail.com' },
    ],
    related_entities: ['Resume', 'Career Timeline', 'Credentials'],
  },

  // 7. CONTACT & AVAILABILITY
  {
    id: 'kb-contact-how-to-reach',
    category: 'Contact',
    canonical_question: 'How can I contact Sahil?',
    aliases: [
      'ask how to contact me',
      'how to contact me',
      'how do i contact you',
      'how to reach sahil',
      'contact sahil',
      'what is your email',
      'how to reach you',
      'hire sahil',
      'get in touch',
      'send a message',
    ],
    keywords: ['contact', 'email', 'reach', 'message', 'hire', 'touch', 'gmail', 'collaborate'],
    answer:
      "You can reach me directly at [sahilaw502@gmail.com](mailto:sahilaw502@gmail.com) for engineering roles, internships, or project collaborations.\n\nYou can also find me on [LinkedIn](https://www.linkedin.com/in/sahil-a-057a0231a) and review my repositories on [GitHub](https://github.com/sahilaw22).",
    links: [
      { label: 'Email Sahil', url: 'mailto:sahilaw502@gmail.com' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sahil-a-057a0231a' },
    ],
    related_entities: ['sahilaw502@gmail.com', 'LinkedIn', 'GitHub'],
  },
  {
    id: 'kb-contact-availability',
    category: 'Contact',
    canonical_question: 'Are you available for work or hiring?',
    aliases: [
      'are you open to work',
      'are you looking for a job',
      'can i hire you',
      'job availability',
      'internship availability',
      'freelance availability',
    ],
    keywords: ['available', 'hiring', 'work', 'job', 'internship', 'freelance', 'roles', 'open to work'],
    answer:
      "Yes, I am actively open to **Frontend AI Engineering**, **Product Design**, and **Mobile App Development** roles and internships.\n\nI am ready to contribute to ambitious engineering teams. You can [send me an email](mailto:sahilaw502@gmail.com) or review my [Resume](#/careers).",
    links: [
      { label: 'Send Email', url: 'mailto:sahilaw502@gmail.com' },
      { label: 'View Resume', url: '#/careers' },
    ],
    related_entities: ['Open to Work', 'Frontend AI', 'Product Design'],
  },
  {
    id: 'kb-contact-socials',
    category: 'Contact',
    canonical_question: 'What are your social and professional links?',
    aliases: [
      'what is your github',
      'what is your linkedin',
      'social profiles',
      'find you online',
    ],
    keywords: ['social', 'links', 'github', 'linkedin', 'twitter', 'profiles', 'online'],
    answer:
      "You can find my work across key developer platforms. Review my code and repositories on [GitHub](https://github.com/sahilaw22), or connect with me on [LinkedIn](https://www.linkedin.com/in/sahil-a-057a0231a).\n\nFor direct inquiries, you can always reach me via [email](mailto:sahilaw502@gmail.com).",
    links: [
      { label: 'GitHub', url: 'https://github.com/sahilaw22' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sahil-a-057a0231a' },
    ],
    related_entities: ['GitHub', 'LinkedIn', 'Online Profiles'],
  },
];
