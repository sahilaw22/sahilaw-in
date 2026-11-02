# Portfolio Architecture & Engineering System Map

Technical documentation for the Sahil Ahmed Wani personal portfolio and design engineering web platform.

---

## 1. Executive Summary & Tech Stack

The platform is designed as an interactive, performant web portfolio with zero extraneous runtime frameworks. It combines physics-driven micro-interactions, canvas and WebGL graphics, procedural Web Audio generation, and centralized content schemas.

- **Framework**: React 18 with Vite 5.4 bundler
- **Styling Architecture**: Vanilla CSS (`src/index.css`) with scoped component sheets (`FeaturedProjectsSection.css`, `ExperienceSection.css`, `InteractiveAvatar.css`)
- **Animation & Transitions**: GSAP 3 (ScrollTrigger) with Lenis smooth scrolling integration
- **Visuals & Graphics**: WebGL2 ribbon cursor on desktop, HTML5 Canvas matrix background, and inline vector SVGs
- **Audio Synthesis**: Native Web Audio API procedural synthesizer (`src/hooks/useSoundEngine.js`)
- **Client Routing**: Hash-based router (`src/hooks/useHashRouter.js`) without server rewrite requirements
- **Analytics & Content**: SQLite backend API (`server/`) with local browser fallback in `src/data/`

---

## 2. Full Directory Structure Map

```
Avara/
├── index.html                     # HTML5 entry shell, font preloads, and metadata
├── package.json                   # Project dependencies and script declarations
├── vite.config.js                 # Vite bundler configuration
├── architecture.md                # System engineering guide and directory map
├── readme.md                      # Human-friendly project overview and setup instructions
│
├── public/                        # Static assets served at root
│   ├── fonts/                     # Custom typography assets
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
│
├── server/                        # Backend API service
│   ├── api.js                     # Express API routes (analytics, content updates)
│   └── db.js                      # SQLite database connection & schema
│
└── src/                           # Application source code
    ├── App.jsx                    # Root application coordinator, desktop ribbons, and route switcher
    ├── main.jsx                   # Vite React DOM entry point
    ├── index.css                  # Global design system, typography, and responsive rules
    │
    ├── components/                # Modular UI components
    │   ├── InteractiveAvatar.jsx  # Spring-physics googly eye tracking and blink animation
    │   ├── InteractiveAvatar.css  # Avatar sizing, lens clips, and pupil styles
    │   ├── HeroHeader.jsx         # Hero greeting title, inline avatar, and rotating role badge
    │   ├── AboutSection.jsx       # Bio text reveal and career timeline
    │   ├── CareerTimeline.jsx     # Vector career progression step-graph
    │   ├── ExperienceSection.jsx  # Connected timeline with company nodes & live working tag
    │   ├── ExperienceCard.jsx     # Accordion card with role details & tech chips
    │   ├── FeaturedProjectsSection.jsx # Pinned cascading card deck
    │   ├── FeaturedProjectsSection.css # Stacked deck layout & card styling
    │   ├── EducationSection.jsx   # Academic history with degree badges
    │   ├── SkillsSection.jsx      # Categorized skill badges
    │   ├── CertificationsSection.jsx # Certifications & credentials list
    │   ├── ContactSection.jsx     # Email copy action and social links
    │   ├── BottomNav.jsx          # Expandable bottom navigation pill
    │   ├── RightScrollPills.jsx   # Desktop floating section jump controls
    │   ├── SocialIcons.jsx        # Social media vector links
    │   ├── TechIcons.jsx          # SVG dictionary for technology chips
    │   ├── LetterGlitch.jsx       # Matrix background canvas
    │   └── ui/                    # Reusable interactive widgets
    │       ├── Ribbons.jsx        # WebGL2 comet trail cursor for desktop
    │       ├── Ribbons.css        # Canvas styling and mobile removal
    │       ├── ScrollStack.jsx    # GSAP ScrollTrigger pinned stacked card system
    │       ├── ScrollStack.css    # Stage geometry and responsive heights
    │       ├── OrbitDeck.jsx      # 3D interactive spinning project carousel
    │       └── expandable-tabs.jsx # Navigation capsule tabs
    │
    ├── hooks/                     # Custom hooks
    │   ├── useHashRouter.js       # Client hash router
    │   ├── useSoundEngine.js      # Procedural Web Audio synthesizer
    │   ├── useSmoothScroll.js     # Lenis smooth scroll engine
    │   └── useVisitorTracking.js  # Analytics tracking hook
    │
    ├── data/                      # Centralized data and storage hooks
    │   ├── portfolioData.jsx      # Canonical portfolio schema
    │   └── usePortfolioData.js    # Data hook with local storage syncing
    │
    └── pages/                     # Route views
        ├── HomePage.jsx           # Main single-page scroll layout
        ├── ExperiencePage.jsx     # Full experience view with centered back button
        ├── ProjectsPage.jsx       # Project archive and 3D carousel
        ├── ResumePage.jsx         # Interactive CV document
        ├── ChatPage.jsx           # Interactive assistant console
        ├── BlogPage.jsx           # Engineering articles
        ├── PostPage.jsx           # Dynamic markdown reader
        └── AdminPage.jsx          # Portfolio content editor & visitor analytics
```

---

## 3. Core Component Subsystems

### Interactive Avatar (`InteractiveAvatar.jsx`)
- Vector line art rendered over custom SVG sclera and pupil elements.
- Uses spring-damper physics (`stiffness: 0.16`, `damping: 0.24`) to follow the cursor with natural momentum.
- Non-linear deflection scales pupil travel within elliptical boundary constraints.
- Blinking runs on a randomized interval (3.2s to 6.5s) with a 160ms symmetrical blink curve.
- Listens to `visibilitychange` to suspend animation loops when the tab is hidden, preventing background CPU or battery drain.

### Ribbon Cursor (`Ribbons.jsx`)
- Uses WebGL2 shaders to render a fluid ribbon trail on desktop devices.
- Strictly gated via `isDesktopPointer`: skips mounting entirely on mobile devices, touchscreens, and viewports `<= 820px`.
- CSS media query enforces `display: none !important; opacity: 0;` on touch interfaces to prevent gesture interference during native scrolling.

### Cascading Card Stack (`ScrollStack.jsx`)
- Utilizes GSAP ScrollTrigger with `pin: true` and `scrub: 0.65`.
- Cards dock sequentially on scroll (`step-1`, `step-2`, `step-3`), scaling earlier cards down to form a cascading deck.
- The "Explore all projects" button docks in a dedicated final step (`step-4`) after the last project card lands.
- Once the deck is complete, ScrollTrigger unpins naturally so the finished section scrolls into view with the remainder of the page.

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

# Run production build
npm run build

# Preview production build locally
npm run preview
```
