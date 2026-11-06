# Project Map & Quick Reference

This file provides a directory and component map of the portfolio workspace (`Avara` and `MySite`). It enables fast lookups for routes, components, styles, data sources, hooks, backend modules, and configuration files.

---

## 1. Routing & Pages (`src/pages/`)

| Route | Page Component | CSS File | Description & Key Elements |
|---|---|---|---|
| `#/` | [`src/pages/HomePage.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/pages/HomePage.jsx) | Global [`src/index.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/index.css) | Single-page scroll layout containing HeroHeader, AboutSection, SkillsSection, FeaturedProjectsSection, ExperienceSection, EducationSection, CertificationsSection, and ContactSection. |
| `#/projects` | [`src/pages/ProjectsPage.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/pages/ProjectsPage.jsx) | [`src/components/ui/OrbitDeck.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ui/OrbitDeck.css) | 3D OrbitDeck carousel showcase with autoplay, drag interaction, detail view trigger, and link to all projects. |
| `#/projects/all` | [`src/pages/ProjectsPage.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/pages/ProjectsPage.jsx) (showAll) | [`src/index.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/index.css) | Responsive card grid of all projects with tech stacks, action buttons, and modal integration. |
| `#/experience` | [`src/pages/ExperiencePage.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/pages/ExperiencePage.jsx) | [`src/pages/ExperiencePage.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/pages/ExperiencePage.css) | Full work experience timeline with always-open detail cards, role details, and skills chips. |
| `#/careers` (Resume) | [`src/pages/ResumePage.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/pages/ResumePage.jsx) | [`src/index.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/index.css) | Resume view formatted for screen and print/PDF export. Supports inline editing in admin mode. |
| `#/chat` | [`src/pages/ChatPage.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/pages/ChatPage.jsx) | [`src/index.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/index.css) | Interactive AI chat assistant powered by client-side and server deterministic matching engine. |
| `#/blog` | [`src/pages/BlogPage.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/pages/BlogPage.jsx) | [`src/index.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/index.css) | Blog articles directory with category filtering. |
| `#/blog/:slug` | [`src/pages/PostPage.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/pages/PostPage.jsx) | [`src/components/MarkdownContent.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/MarkdownContent.css) | Individual blog post reader with markdown parsing. |
| `#/admin` | [`src/pages/AdminPage.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/pages/AdminPage.jsx) | [`src/pages/AdminPage.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/pages/AdminPage.css) | Administrative control panel: content editing (projects, experience, education, skills), knowledge base QA training, and visitor analytics. |

---

## 2. Core Navigation & Frame

| Component | File Path | Stylesheet | Notes |
|---|---|---|---|
| Main Entry / Shell | [`src/App.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/App.jsx) | [`src/index.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/index.css) | App lifecycle, route dispatching via `useHashRouter`, error boundary wrapping, background ribbons cursor effect. |
| Bottom / Top Nav | [`src/components/BottomNav.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/BottomNav.jsx) | [`src/components/ui/expandable-tabs.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ui/expandable-tabs.css) | Liquid glass floating dock. Docked at bottom on desktop, top on mobile. Hides during project detail modals and preloader. |
| Expandable Tabs UI | [`src/components/ui/expandable-tabs.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ui/expandable-tabs.jsx) | [`src/components/ui/expandable-tabs.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ui/expandable-tabs.css) | Low-level tab pill primitive with active state animation and Lucide icon rendering. |
| Side Notch Navigation | [`src/components/RightScrollPills.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/RightScrollPills.jsx) | [`src/index.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/index.css) | 4-pill floating side navigation for home sections. Draggable on mobile touch, audio feedback on pill clicks. |
| Project Detail Modal | [`src/components/DetailModal.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/DetailModal.jsx) | [`src/index.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/index.css) | Full project view modal with sticky back button on mobile, keyboard navigation (Escape, Left, Right), next/prev arrows, and body scroll lock. |

---

## 3. Sections & Homepage Components (`src/components/`)

| Section Component | File Path | Stylesheet | Notes |
|---|---|---|---|
| Hero Header | [`src/components/HeroHeader.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/HeroHeader.jsx) | [`src/index.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/index.css) | Top greeting, interactive avatar, and word-staggered rotating roles badge. |
| Rotating Text | [`src/components/RotatingText.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/RotatingText.jsx) | [`src/components/RotatingText.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/RotatingText.css) | Framer Motion / GSAP based text transition used in HeroHeader. |
| Interactive Avatar | [`src/components/InteractiveAvatar.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/InteractiveAvatar.jsx) | [`src/components/InteractiveAvatar.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/InteractiveAvatar.css) | Profile image avatar with hover animations and status indicator. |
| About Section | [`src/components/AboutSection.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/AboutSection.jsx) | [`src/index.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/index.css) | Personal biography, philosophy, GitHub contribution graph, and quick status pills. |
| Skills Section | [`src/components/SkillsSection.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/SkillsSection.jsx) | [`src/index.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/index.css) | Category-based skill pills with SVG icons from `TechIcons.jsx`. |
| Featured Projects | [`src/components/FeaturedProjectsSection.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/FeaturedProjectsSection.jsx) | [`src/components/FeaturedProjectsSection.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/FeaturedProjectsSection.css) | Pinned showcase cards using `ScrollStack.jsx`. Clicking opens `DetailModal`. |
| Scroll Stack | [`src/components/ui/ScrollStack.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ui/ScrollStack.jsx) | [`src/components/ui/ScrollStack.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ui/ScrollStack.css) | Sticky stacking cards with scale and translateY transitions on scroll. |
| Experience Section | [`src/components/ExperienceSection.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ExperienceSection.jsx) | [`src/components/ExperienceSection.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ExperienceSection.css) | Work experiences list with vertical spine connector and CTA button to full experience page. |
| Experience Card | [`src/components/ExperienceCard.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ExperienceCard.jsx) | [`src/components/ExperienceSection.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ExperienceSection.css) | Expandable accordion card: company logo, social links with tooltips, "Working" status pill, and chevron toggle. |
| Education Section | [`src/components/EducationSection.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/EducationSection.jsx) | [`src/index.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/index.css) | Degree, institution, dates, and coursework details. |
| Certifications | [`src/components/CertificationsSection.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/CertificationsSection.jsx) | [`src/components/CertificationsSection.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/CertificationsSection.css) | Verified credentials and certifications list with credential links, desktop hover preview, and modal preview dialog. |
| Contact Section | [`src/components/ContactSection.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ContactSection.jsx) | [`src/index.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/index.css) | Interactive contact form with Direct Email Helper (`emailHelper.js`), quick reach social links, and live clock. |

---

## 4. UI Widgets & Visual Effects (`src/components/ui/`)

| Widget / Component | File Path | Stylesheet | Notes |
|---|---|---|---|
| OrbitDeck 3D Carousel | [`src/components/ui/OrbitDeck.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ui/OrbitDeck.jsx) | [`src/components/ui/OrbitDeck.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ui/OrbitDeck.css) | 3D transform perspective carousel with swipe physics, pointer capture, keyboard control, and responsive card sizing. |
| Preloader | [`src/components/ui/Preloader.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ui/Preloader.jsx) | [`src/components/ui/Preloader.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ui/Preloader.css) | Initial page loading screen with React Bits Pro stairs animation on solid canvas. |
| LetterGlitch | [`src/components/LetterGlitch.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/LetterGlitch.jsx) | [`src/components/LetterGlitch.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/LetterGlitch.css) | Canvas-based matrix/ASCII text glitch effect for cyber/modern visuals. |
| Ribbons Cursor | [`src/components/ui/Ribbons.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ui/Ribbons.jsx) | [`src/components/ui/Ribbons.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/ui/Ribbons.css) | WebGL comet ribbon trail following the desktop cursor. Disabled on touch devices. |
| Tech Icons | [`src/components/TechIcons.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/TechIcons.jsx) | None (inline SVG) | Complete dictionary of SVG icons for frontend, backend, devops, and database tech. |
| Social Icons | [`src/components/SocialIcons.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/SocialIcons.jsx) | None (inline SVG) | GitHub, LinkedIn, X/Twitter, Email, LeetCode, and Kaggle SVG icons. |
| Markdown Renderer | [`src/components/MarkdownContent.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/MarkdownContent.jsx) | [`src/components/MarkdownContent.css`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/components/MarkdownContent.css) | Sanitized markdown to HTML renderer for blog articles. |

---

## 5. Hooks & Utilities (`src/hooks/`, `src/lib/`, `src/data/`)

| File Path | Purpose |
|---|---|
| [`src/data/usePortfolioData.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/data/usePortfolioData.js) | Primary state hook fetching dynamic portfolio content from `/api/content` with fallback to `portfolioData.jsx`. |
| [`src/data/portfolioData.jsx`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/data/portfolioData.jsx) | Default offline / static fallback content for meta, projects, experiences, skills, education, and certs. |
| [`src/data/blog.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/data/blog.js) | Built-in blog posts dataset and post lookup utilities. |
| [`src/hooks/useHashRouter.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/hooks/useHashRouter.js) | Lightweight hash-based router listener tracking current URL hash routes. |
| [`src/hooks/useSmoothScroll.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/hooks/useSmoothScroll.js) | Smooth scrolling controller handling hash anchors and `sessionStorage.scroll_target`. |
| [`src/hooks/useSoundEngine.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/hooks/useSoundEngine.js) | Web Audio API sound synthesizer for interactive UI click and hover sounds. |
| [`src/hooks/useVisitorTracking.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/hooks/useVisitorTracking.js) | Privacy-respecting visitor session telemetry sending page views to `/api/analytics/track`. |
| [`src/lib/emailHelper.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/lib/emailHelper.js) | Client-side email dispatcher connecting to Formspree / Web3Forms / mailto fallbacks. |
| [`src/lib/utils.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/src/lib/utils.js) | Helper functions: classnames merging (`cn`), date formatting, text clipping. |

---

## 6. Backend Server & Serverless API (`server/`, `api/`)

| File Path | Description |
|---|---|
| [`server/server.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/server/server.js) | Express standalone server for local development and self-hosted environments. Mounts API routes. |
| [`server/api.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/server/api.js) | Core REST API router: `/api/content`, `/api/chat`, `/api/admin/*`, `/api/analytics/*`. |
| [`server/db.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/server/db.js) | SQLite database layer managing `data/assistant-db/portfolio.db` with auto-migration and seeding. |
| [`server/defaultContent.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/server/defaultContent.js) | Database initial seed template mirroring `portfolioData.jsx`. |
| [`server/matchingEngine.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/server/matchingEngine.js) | Deterministic NLP matching engine answering portfolio queries with zero hallucination. |
| [`server/matchingEngine.test.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/server/matchingEngine.test.js) | Test suite (16 tests) verifying matching engine accuracy, greetings, typos, and secrets. |
| [`server/auth.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/server/auth.js) | Session token authentication middleware for protected `/api/admin/*` endpoints. |
| [`server/vitePlugin.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/server/vitePlugin.js) | Vite development plugin embedding the Express API directly into Vite dev server. |
| [`api/index.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/api/index.js) | Vercel serverless function entrypoint wrapping the Express API. |

---

## 7. Configuration & Project Rules

| File Path | Purpose |
|---|---|
| [`gemini.md`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/gemini.md) | Antigravity Assistant Rules & Project Guidelines (Strict 8 rules including zero push without permission, zero emojis, sync protocol). |
| [`vite.config.js`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/vite.config.js) | Vite configuration with code splitting chunk strategies and API plugin integration. |
| [`package.json`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/package.json) | NPM scripts (`dev`, `build`, `test:bot`, `preview`) and dependency definitions. |
| [`vercel.json`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/vercel.json) | Vercel deployment routing and rewrites to `api/index.js` and `dist/index.html`. |
| [`architecture.md`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/architecture.md) | Architectural documentation explaining the hybrid frontend, SQLite storage, and chat engine. |
| [`readme.md`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/readme.md) | Project introduction, architecture table, setup steps, and license links. |
| [`LICENSE`](file:///c:/Program%20Files%20%28x86%29/sahilaw/Projects/Avara/LICENSE) | MIT License file. |

