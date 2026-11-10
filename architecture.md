# Portfolio Architecture & Engineering System Map

Technical documentation for the Sahil Ahmed Wani personal portfolio and design engineering web platform.

---

## 1. Executive Summary & Tech Stack

The platform is designed as an interactive, performant web portfolio with zero extraneous runtime frameworks. It combines physics-driven micro-interactions, canvas and WebGL graphics, procedural Web Audio generation, and centralized content schemas.

- **Framework**: React 18 with Vite 5.4 bundler
- **Styling Architecture**: Vanilla CSS (`src/index.css`) with scoped component sheets (`FeaturedProjectsSection.css`, `ExperienceSection.css`, `InteractiveAvatar.css`, `CertificationsSection.css`)
- **Animation & Transitions**: GSAP 3 (ScrollTrigger) with Lenis smooth scrolling integration and Framer Motion
- **Visuals & Graphics**: WebGL2 ribbon cursor on desktop, HTML5 Canvas matrix background, and inline vector SVGs
- **Audio Synthesis**: Native Web Audio API procedural synthesizer (`src/hooks/useSoundEngine.js`)
- **Client Routing**: Hash-based router (`src/hooks/useHashRouter.js`) without server rewrite requirements
- **Backend & Serverless API**: Express-based API mounted via `api/index.js` as a Vercel Serverless Function with `vercel.json` rewrites, backed by SQLite in local/serverless environments with an in-memory fallback store (`server/db.js`) and optional Supabase synchronization

---

## 2. Full Directory Structure Map

```
Avara/
├── index.html                     # HTML5 entry shell, font preloads, and metadata
├── package.json                   # Project dependencies and script declarations
├── vite.config.js                 # Vite bundler configuration and dev API proxy
├── vercel.json                    # Vercel deployment configuration & /api rewrites
├── architecture.md                # System engineering guide and directory map
├── readme.md                      # Human-friendly project overview and setup instructions
├── map.md                         # Workspace component and routing quick reference
├── gemini.md                      # Antigravity assistant rules and synchronization protocols
│
├── api/                           # Serverless functions
│   └── index.js                   # Vercel Serverless Function entrypoint for Express API
│
├── public/                        # Static assets served at root
│   ├── company/                   # Organization and partner brand icons
│   ├── fonts/                     # Custom typography assets (Disket Mono, Fredoka)
│   ├── icons/                     # UI and brand vectors
│   │   ├── favicon.svg            # Browser tab mark
│   │   └── skillicons/            # Local SVG skill badges
│   ├── images/                    # Visual assets
│   │   ├── avatar-head.png        # Transparent vector line-art head
│   │   └── navigation/            # 3D floating right-dock navigation pills
│   ├── projects/                  # Project showcase preview thumbnails
│   │   ├── audio-synth.png
│   │   ├── connectkit.png
│   │   ├── lurian-ai.png
│   │   └── sahil-recreation.jpg
│   └── styles/                    # Base layout and theme stylesheets
│       ├── base-layout.css
│       └── base-theme.css
│
├── server/                        # Backend API service
│   ├── api.js                     # Express API routes (analytics, content updates, health)
│   ├── auth.js                    # Admin session authentication middleware
│   ├── db.js                      # SQLite database connection & schema
│   ├── defaultContent.js          # SQLite fallback initial seed template
│   ├── knowledgeSeed.js           # Assistant Q&A seed content
│   ├── matchingEngine.js          # Deterministic assistant matching engine
│   ├── matchingEngine.test.js     # Verification suite for assistant matching engine
│   ├── server.js                  # Standalone local Express server entrypoint
│   ├── supabaseAdmin.js           # Supabase server admin client
│   └── vitePlugin.js              # Vite dev server middleware integration
│
└── src/                           # Application source code
    ├── App.jsx                    # Root application coordinator, desktop ribbons, and route switcher
    ├── main.jsx                   # Vite React DOM entry point
    ├── index.css                  # Global design system, typography, and responsive rules
    │
    ├── assets/                    # Bundled animation assets
    │   ├── darkLoading.json       # Lottie animation for page loader
    │   └── submarine.json         # Lottie animation for empty search states
    │
    ├── components/                # Modular UI components
    │   ├── AboutSection.jsx       # Bio text reveal and career timeline
    │   ├── AnswerTextEditor.css   # Admin markdown answer editor styles
    │   ├── AnswerTextEditor.jsx   # Admin markdown answer editor component
    │   ├── avatarHeadAsset.js     # Inlined avatar SVG vector definition
    │   ├── BottomNav.jsx          # Expandable bottom navigation pill
    │   ├── CertificationsSection.css # Certifications layout, hover preview, and modal card styles
    │   ├── CertificationsSection.jsx # Certifications list with image preview modal and hover preview
    │   ├── ContactSection.jsx     # Email copy action, live clock, and direct reach links
    │   ├── DetailModal.jsx        # Project detail modal dialog with keyboard navigation
    │   ├── EducationSection.css   # Education card layout and institution badge styles
    │   ├── EducationSection.jsx   # Academic history with degree badges
    │   ├── ErrorBoundary.jsx      # React error boundary fallback container
    │   ├── ExperienceCard.jsx     # Accordion card with role details & tech chips
    │   ├── ExperienceSection.css  # Timeline layout and company node styling
    │   ├── ExperienceSection.jsx  # Connected timeline with company nodes & live working tag
    │   ├── FeaturedProjectsSection.css # Stacked deck layout & card styling
    │   ├── FeaturedProjectsSection.jsx # Pinned cascading card deck
    │   ├── GlassDistortionSVG.jsx # SVG filter definition for liquid glass effect
    │   ├── HeroHeader.jsx         # Hero greeting title, inline avatar, and rotating role badge
    │   ├── ICanScrollSection.css  # 5-slot vertical rolling wheel viewport, gradient, and glow styling
    │   ├── ICanScrollSection.jsx  # Capabilities action words wheel with smooth entrance/exit transitions
    │   ├── InteractiveAvatar.css  # Avatar sizing, lens clips, and pupil styles
    │   ├── InteractiveAvatar.jsx  # Spring-physics googly eye tracking and blink animation
    │   ├── LatticeLoader.jsx      # Procedural matrix loader for assistant queries
    │   ├── LetterGlitch.css       # Matrix glitch canvas styling
    │   ├── LetterGlitch.jsx       # Matrix background canvas component
    │   ├── MarkdownContent.css    # Typography styles for parsed markdown
    │   ├── MarkdownContent.jsx    # Safe markdown-to-HTML parser component
    │   ├── PageLoader.css         # Route transition loader styles
    │   ├── PageLoader.jsx         # Lottie-powered page loading indicator
    │   ├── RightScrollPills.jsx   # Desktop floating section jump controls
    │   ├── RotatingText.css       # Animated role badge styles
    │   ├── RotatingText.jsx       # Text rotation component with character animations
    │   ├── SkillsSection.jsx      # Categorized skill badges
    │   ├── SocialIcons.jsx        # Social media vector links
    │   ├── TechIcons.jsx          # SVG dictionary for technology chips
    │   ├── TechText.css           # Interactive canvas typography styling
    │   ├── TechText.jsx           # Procedural dashed canvas typography component
    │   ├── TextRevealParagraph.jsx # Word-level scroll text reveal narrative
    │   └── ui/                    # Reusable interactive widgets
    │       ├── expandable-tabs.css # Navigation dock styling
    │       ├── expandable-tabs.jsx # Navigation capsule tabs primitive
    │       ├── LottiePlayer.jsx   # Lightweight Lottie animation player
    │       ├── OrbitDeck.css      # 3D carousel stage geometry and perspective rules
    │       ├── OrbitDeck.jsx      # 3D interactive spinning project carousel
    │       ├── Preloader.css      # Initial preloader transition styles
    │       ├── Preloader.jsx      # Initial entry loading screen with stairs animation
    │       ├── Ribbons.css        # Canvas styling and mobile removal
    │       ├── Ribbons.jsx        # WebGL2 comet trail cursor for desktop
    │       ├── ScrollStack.css    # Stage geometry and responsive card heights
    │       └── ScrollStack.jsx    # GSAP ScrollTrigger pinned stacked card system
    │
    ├── hooks/                     # Custom hooks
    │   ├── useHashRouter.js       # Client hash router
    │   ├── useSmoothScroll.js     # Lenis smooth scroll engine
    │   ├── useSoundEngine.js      # Procedural Web Audio synthesizer
    │   └── useVisitorTracking.js  # Analytics tracking hook
    │
    ├── lib/                       # Utility libraries
    │   ├── emailHelper.js         # Client email dispatcher (Formspree/mailto)
    │   ├── supabaseClient.js      # Supabase browser client initialization
    │   └── utils.js               # Classname merging and text formatting helpers
    │
    ├── data/                      # Centralized data and storage hooks
    │   ├── blog.js                # Built-in blog posts dataset
    │   ├── portfolioData.jsx      # Canonical portfolio schema and static fallback
    │   └── usePortfolioData.js    # Data hook with real-time sync and multi-source caching
    │
    └── pages/                     # Route views
        ├── AdminPage.css          # Management dashboard styling
        ├── AdminPage.jsx          # Portfolio content editor & visitor analytics
        ├── BlogPage.jsx           # Engineering articles index
        ├── ChatPage.jsx           # Interactive assistant console
        ├── ExperiencePage.css     # Expanded experience view styling
        ├── ExperiencePage.jsx     # Full experience view with centered back navigation
        ├── HomePage.jsx           # Main single-page scroll layout
        ├── PostPage.jsx           # Dynamic markdown reader
        ├── ProjectsPage.jsx       # Project archive and 3D carousel
        └── ResumePage.jsx         # Interactive CV document
```

---

## 3. Core Component Subsystems

### Interactive Avatar (`InteractiveAvatar.jsx`)
- Vector line art rendered over custom SVG sclera and pupil elements.
- Uses spring-damper physics (`stiffness: 0.16`, `damping: 0.24`) to follow the cursor with natural momentum.
- Non-linear deflection scales pupil travel within elliptical boundary constraints.
- Blinking runs on a randomized interval (3.2s to 6.5s) with a 160ms symmetrical blink curve.
- Listens to `visibilitychange` to suspend animation loops when the tab is hidden, preventing background CPU or battery drain.

### Action Words Scroll Wheel (`ICanScrollSection.jsx`)
- 5-slot vertical rolling wheel on desktop (>768px) with continuous cubic ease appear/fade transitions.
- Displays the active center word, exactly 2 words above, and 2 words below in clear visibility; outer words fade smoothly to 0.00 opacity without abrupt pops.
- Vivid reddish gradient (`linear-gradient(135deg, #ff3366 0%, #f43f5e 50%, #e11d48 100%)`) with drop-shadow glow across words.
- Single-line word cycle animation along the X-axis on mobile (<=768px).
- Action words list dynamically customizes from the Admin Dashboard and persists across SQLite and Supabase.

### Ribbon Cursor (`Ribbons.jsx`)
- Uses WebGL2 shaders to render a fluid ribbon trail on desktop devices.
- Strictly gated via `isDesktopPointer`: skips mounting entirely on mobile devices, touchscreens, and viewports `<= 820px`.
- CSS media query enforces `display: none !important; opacity: 0;` on touch interfaces to prevent gesture interference during native scrolling.

### Cascading Card Stack (`ScrollStack.jsx`)
- Utilizes GSAP ScrollTrigger with `pin: true` and `scrub: 0.65`.
- Cards dock sequentially on scroll (`step-1`, `step-2`, `step-3`), scaling earlier cards down to form a cascading deck.
- The "Explore all projects" button docks in a dedicated final step (`step-4`) after the last project card lands.
- Once the deck is complete, ScrollTrigger unpins naturally so the finished section scrolls into view with the remainder of the page.

### 3D OrbitDeck Perspective Ring (`OrbitDeck.jsx`)
- Cylindrical 3D project ring powered by CSS 3D transforms (`rotateY`, `translateZ`).
- Supports pointer drag, mouse wheel, and touch scrubbing with momentum damping.
- Includes responsive geometry calculation that dynamically adjusts cylinder radius and card widths based on screen dimensions.

### Certifications System (`CertificationsSection.jsx`)
- Structured list of verified achievements and credentials with issuer metadata and direct verification links.
- Desktop hover preview renders an instantaneous full-dimension image popover positioned above the active item.
- Interactive modal preview presents the certificate in full dimension with zero image bezels, casting a soft shadow over the metadata and action button below.
- Locks background window and body scroll while active, and automatically suppresses floating side navigation pills.

### Centralized Data Layer (`usePortfolioData.js`)
- Multi-tier data hierarchy: local storage cache (`portfolio_content_cache_v14`) -> backend API (`/api/portfolio-content`) -> canonical fallback (`portfolioData.jsx`).
- Supports real-time Supabase remote synchronization when configured, with seamless offline degradation.
- Uses window CustomEvents (`portfolio_data_updated`) for instantaneous cross-component and cross-tab UI synchronization upon any administrative update.

---

## 4. Routing Architecture

Routing uses hash-based paths managed by `useHashRouter.js`:

| Hash Route | Component | Description |
| :--- | :--- | :--- |
| `#/` or `#` | `HomePage.jsx` | Full scrolling single-page portfolio |
| `#/experience` | `ExperiencePage.jsx` | All career roles with center back navigation |
| `#/projects` | `ProjectsPage.jsx` | 3D OrbitDeck and project showcase |
| `#/projects/all` | `ProjectsPage.jsx` | Full archive grid |
| `#/resume` | `ResumePage.jsx` | Interactive resume view |
| `#/chat` | `ChatPage.jsx` | AI portfolio assistant |
| `#/blog` | `BlogPage.jsx` | Articles index |
| `#/blog/:slug` | `PostPage.jsx` | Article reader |
| `#/admin` | `AdminPage.jsx` | Management dashboard & analytics |

---

## 5. Development & Build Verification

```bash
# Start local development server
npm run dev

# Start local analytics API server
npm run server

# Run deterministic matching engine test suite
npm run test:bot

# Run production build
npm run build

# Preview production build locally
npm run preview
```
