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
      "Hey there! I am Sahil's portfolio assistant. Feel free to ask about his [featured projects](#/projects), technical stack, work experience, or how to [get in touch](mailto:sahilaw502@gmail.com).",
  },
  {
    key: 'thanks',
    name: 'Thanks Response',
    template:
      "You are welcome! Let me know if you'd like to check out his [projects](#/projects) or review his [technical resume](#/careers).",
  },
  {
    key: 'acknowledgement',
    name: 'Acknowledgement Response',
    template:
      "Got it! Let me know if you would like to explore specific projects like the [Web Audio Synth](#/projects) or check out his [skills](#/careers).",
  },
  {
    key: 'farewell',
    name: 'Farewell Response',
    template:
      "Thanks for visiting Sahil's portfolio! Feel free to [reach out via email](mailto:sahilaw502@gmail.com) anytime. Have a great day!",
  },
  {
    key: 'help',
    name: 'Help & Capabilities',
    template:
      "I am a deterministic portfolio assistant. You can ask me about Sahil's [projects](#/projects), his work with React and Flutter, his internship history, or his [contact details](mailto:sahilaw502@gmail.com).",
  },
  {
    key: 'identity',
    name: 'Assistant Identity',
    template:
      "I am Sahil's custom portfolio assistant. I run on deterministic rules and verified portfolio facts without relying on external generative LLM APIs.",
  },
  {
    key: 'out_of_scope',
    name: 'Out of Scope Query',
    template:
      "I focus specifically on Sahil's software engineering projects, technical skills, and experience. Feel free to ask about his [projects](#/projects) or review his [resume](#/careers)!",
  },
  {
    key: 'ambiguous',
    name: 'Ambiguous Question Clarification',
    template:
      "Your question could refer to a few different areas. Could you clarify whether you're asking about a specific build like the [Web Audio Synth](#/projects), his skills, or his work experience?",
  },
  {
    key: 'fallback',
    name: 'Unanswered / Low Confidence Fallback',
    template:
      "I don't have a verified answer for that yet, but I have logged your question for Sahil to review. In the meantime, feel free to explore his [projects](#/projects) or [email him directly](mailto:sahilaw502@gmail.com).",
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
      "Sahil Ahmed Wani is a Computer Science undergraduate working as a **Frontend AI Engineer** and **UI/UX Designer**. He focuses on pairing responsive web interfaces with intelligent agent systems.\n\nFeel free to explore his work in [Projects](#/projects), review his professional background on [LinkedIn](https://www.linkedin.com/in/sahil-a-057a0231a), or inspect his open-source code on [GitHub](https://github.com/sahilaw22).",
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
      "Sahil builds with intent and thinks in motion. He believes exceptional engineering begins with clarity, clean code structure, and tactile micro-feedback that makes digital tools feel alive.\n\nYou can see this philosophy in action throughout this site's interactive audio feedback, draggable physics elements, and inside the [Projects showcase](#/projects).",
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
      "A team should hire Sahil for three concrete strengths:\n\n1. **Frontend Craft & Motion**: Proven mastery of React 18, TypeScript, Tailwind CSS, and Flutter, translating Figma prototypes into fluid, accessible, and high-performance interfaces.\n2. **Practical AI Engineering**: Direct experience integrating Gemini APIs, LLM streaming pipelines, and agent workflows into consumer-facing web surfaces.\n3. **Product Ownership & Execution**: A track record across engineering and growth roles at FlyRank AI and Big Block Theory, focusing on measurable user impact rather than vanity code.\n\nInspect his interactive builds in [Projects](#/projects) or [email him directly](mailto:sahilaw502@gmail.com).",
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
      "Sahil's work spans interactive audio web apps, Web3 design systems, and frontend AI interfaces. Key highlights include [Sahil Recreation](#/projects), his 3D audio-reactive portfolio engineered with React 18, GSAP, and Web Audio, alongside the browser-based [Web Audio Synth](#/projects).\n\nHe has also developed the [ConnectKit Theme](#/projects) for Web3 wallet onboarding and built [Lurian AI](#/chat) for streaming conversational interfaces. Explore the full interactive gallery in [Projects](#/projects) or browse his code on [GitHub](https://github.com/sahilaw22).",
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
      "The **Web Audio Synth** is a fully browser-based audio workstation built natively with the Web Audio API without external audio libraries. Features include multi-oscillator synthesis (sine, saw, square waves), a low-pass filter with resonance control, and an ADSR envelope.\n\nIt also includes touch-friendly hardware knobs and a real-time waveform visualizer rendered on an HTML Canvas. You can inspect the project in [Projects](#/projects) or check the code on [GitHub](https://github.com/sahilaw22).",
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
      "**Sahil Recreation** is this active portfolio experience. It was engineered from scratch using React 18, GSAP 3, and the Web Audio API, featuring spatially aware ambient audio feedback and physics-based draggable brand logos.\n\nIt also incorporates a 3D card carousel, a matrix code background canvas, and this zero-dependency rule-based assistant. Explore all project cards in [Projects](#/projects).",
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
      "**ConnectKit Theme** is a comprehensive design system and component library for Web3 wallet connection flows. Built on top of ConnectKit, it includes animated modal transitions and responsive dark/light mode support.\n\nIt features reusable React components for wallet selection, balance display, network switching, and transaction confirmations documented with Storybook. Check it out in [Projects](#/projects).",
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
      "**Lurian AI** is an intelligent conversational companion designed to help visitors explore case studies and architectural decisions. It was built using React 18, TypeScript, and serverless edge functions for low-latency streaming responses.\n\nYou can test the full-page conversation interface at [Chat](#/chat) or review the implementation on [GitHub](https://github.com/sahilaw22).",
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
      "Sahil specializes in modern web development and cross-platform mobile apps. His daily toolkit centers on **React 18**, **TypeScript**, **Next.js**, and **Tailwind CSS**, alongside mobile engineering with **Flutter** and **Dart**.\n\nHe also builds intelligent agent workflows with the Gemini API and constructs interactive audio systems with the Web Audio API. Explore live code examples in [Projects](#/projects) or view his full skill breakdown in [Resume](#/careers).",
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
      "Yes, React is Sahil's primary frontend framework. He works with React 18, custom hooks, performance profiling, lazy loading, and modern component design systems.\n\nHe applied React professionally during his frontend AI internship at FlyRank AI and built this entire portfolio with React 18. You can inspect live builds in [Projects](#/projects) or check his code on [GitHub](https://github.com/sahilaw22).",
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
      "Yes, Sahil develops cross-platform mobile applications using Flutter and Dart. He focuses on responsive layouts, clean state management, native performance, and translating Figma prototypes into fluid apps.\n\nHe is currently preparing his mobile application builds for Google Play Store release. You can read more about his mobile background in [Resume](#/careers).",
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
      "Sahil works actively at the intersection of frontend craft and AI engineering. His competencies include building LLM agent workflows, RAG architectures, prompt engineering, and integrating the Gemini API for streaming model outputs.\n\nHe completed Google and Kaggle's AI Agents Intensive course and built real-time streaming interfaces at FlyRank AI. You can review his credentials in [Resume](#/careers).",
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
      "Sahil has completed multiple specialized engineering and growth roles. Most recently, he interned at **FlyRank AI** building streaming LLM interfaces with React and Next.js, and currently serves as a Reddit Growth & Research Intern at **Big Block Theory**.\n\nPreviously, he worked with **Perplexity** as a Campus Partner leading developer adoption workshops. You can explore his complete career timeline in his [Interactive Resume](#/careers).",
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
      "At **Big Block Theory** (JUL 2026 - PRESENT), Sahil serves as a Reddit Growth & Research Intern. He analyzes user behavior and platform engagement to develop data-driven content formats that drive organic user acquisition.\n\nHe works closely with cross-functional product teams to scale user retention. Learn more in his [Resume](#/careers).",
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
      "At **FlyRank AI** (JUL 2026 - SEP 2026), Sahil worked as a Frontend AI Intern. He engineered responsive interfaces for AI-driven ranking tools using React, Next.js, TypeScript, and Tailwind CSS.\n\nHis primary contribution was designing real-time streaming chat surfaces and latency-optimized search dashboards. Read more in his [Resume](#/careers).",
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
      "At **Perplexity** (SEP 2025 - NOV 2025), Sahil served as a Campus Partner. He spearheaded AI awareness initiatives and organized hands-on developer workshops demonstrating workflow optimization with Perplexity Pro.\n\nHis role focused on helping students and developers integrate AI search engines into their research workflows. Learn more in his [Resume](#/careers).",
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
      "Sahil is currently a 3rd-year undergraduate pursuing a **Bachelor of Technology (B.Tech) in Computer Science & Engineering** at GCET Jammu (Government College of Engineering and Technology), expected to graduate in 2027.\n\nHis coursework emphasizes Data Structures, Algorithms, Database Systems, Computer Networks, and Software Engineering. Review his academic details in [Resume](#/careers).",
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
      "Sahil holds several verified technical credentials, notably the **AI Agents Intensive** certification issued by Google and Kaggle.\n\nHe has also completed certifications in modern frontend architecture and mobile development. Check out the verified links in his [Resume](#/careers).",
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
      "You can review Sahil's complete career timeline, technical abilities, and education on his [Resume page](#/careers).\n\nIt features comprehensive details on his engineering internships, academic milestones at GCET Jammu, and verified credentials. You can also [reach him via email](mailto:sahilaw502@gmail.com) for a PDF copy.",
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
      "You can contact Sahil directly via email at [sahilaw502@gmail.com](mailto:sahilaw502@gmail.com) for engineering roles, freelance inquiries, or product collaborations.\n\nYou can also connect with him on [LinkedIn](https://www.linkedin.com/in/sahil-a-057a0231a) or explore his open-source work on [GitHub](https://github.com/sahilaw22).",
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
      "Yes! Sahil is actively open to **Frontend AI Engineering**, **Product Design**, and **Mobile App Development** roles and high-impact internships.\n\nHe is ready to contribute to ambitious engineering teams. Feel free to [send him an email](mailto:sahilaw502@gmail.com) or review his [Resume](#/careers).",
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
      "You can find Sahil across key developer platforms. Review his code and repositories on [GitHub](https://github.com/sahilaw22), or connect with him on [LinkedIn](https://www.linkedin.com/in/sahil-a-057a0231a).\n\nFor direct inquiries, you can always reach him via [email](mailto:sahilaw502@gmail.com).",
    links: [
      { label: 'GitHub', url: 'https://github.com/sahilaw22' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sahil-a-057a0231a' },
    ],
    related_entities: ['GitHub', 'LinkedIn', 'Online Profiles'],
  },
];
