# Sahil Ahmed Wani — Portfolio & Engineering Showcase

A personal portfolio and interactive web platform built with React, Vite, and GSAP. Features custom micro-interactions, procedural Web Audio feedback, an interactive 3D project carousel, and an in-browser management panel with visitor analytics and ZIP export.

**Live site:** [sahilaw.in](https://sahilaw.in)

---

## Highlights

- **Interactive Avatar**: Vector-based character in the hero greeting with pupils that track cursor movement via spring physics, natural double-blinking, and low-power tab suspension.
- **ScrollStack Project Deck**: Pinned cascading card deck built with GSAP ScrollTrigger. Cards dock sequentially as the user scrolls, finishing with a gliding "Explore all projects" action that unpins smoothly into subsequent sections.
- **3D OrbitDeck Carousel**: Cylindrical perspective ring powered by CSS 3D transforms, with mouse drag and touch scrubbing.
- **Work Experience & Education**: Vertical connected timeline with company logos, animated working indicators, and a dedicated distraction-free route (`#/experience`).
- **Procedural Audio Engine**: Lightweight sound feedback synthesized directly in the browser via the Web Audio API without loading external audio files.
- **Ribbon Cursor**: GPU-accelerated WebGL cursor trail on desktop pointers, completely disabled on touch and mobile screens to preserve battery and frame rates.
- **Admin Workspace & Visitor Analytics**: In-browser content editor with real-time updates, local storage sync, visitor tracking, and one-click ZIP archive backup.
- **Client-Side Hash Routing**: Lightweight router without server rewrite requirements, deployable to GitHub Pages, Vercel, or Netlify.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite 5 |
| **Animation & Motion** | GSAP 3 (ScrollTrigger), Lenis Smooth Scroll |
| **Graphics & Audio** | Canvas API, WebGL2, Web Audio API |
| **Styling** | Vanilla CSS, CSS Grid/Flexbox, Tailwind utility classes |
| **Icons & Media** | SkillIcons, inline SVGs, TechIcon vectors |
| **Data & Storage** | Local Storage, SQLite backend (`portfolio.db`) |

---

## Architecture

```
                                  [ index.html ]
                                        │
                                        ▼
                                   [ main.jsx ]
                                        │
                                        ▼
                                   [ App.jsx ]
            (Desktop Ribbons, Sound Engine, Hash Router, Smooth Scroll)
                                        │
      ┌──────────────┬──────────────────┴──────────────────┬──────────────┐
      ▼              ▼                                     ▼              ▼
 [ HomePage ]   [ ExperiencePage ]                  [ ProjectsPage ] [ AdminPage ]
 - Hero & Avatar - Full Timeline Deck               - 3D OrbitDeck   - Content Editor
 - About Me      - Distraction-Free View            - Archive Grid   - Visitor Stats
 - ScrollStack   - Working Status Indicators        - Project Modals - ZIP Backup Export
 - Education
 - Skills
 - Certifications
 - Contact
```

---

## Directory Structure

```
├── public/                 # Static assets served at root
│   ├── images/             # Visual assets and navigation icons
│   │   ├── avatar-head.png # Vector avatar line art
│   │   └── navigation/     # Navigation pills
│   ├── projects/           # Featured project thumbnails
│   └── styles/             # Base stylesheets
│
├── src/                    # Source code
│   ├── components/         # UI components
│   │   ├── InteractiveAvatar.jsx   # Cursor-following eye physics
│   │   ├── HeroHeader.jsx          # Hero greeting & rotating role
│   │   ├── FeaturedProjectsSection.jsx # Cascading project deck
│   │   ├── ExperienceSection.jsx   # Timeline with company logos
│   │   ├── AboutSection.jsx        # Bio & skill highlights
│   │   ├── ContactSection.jsx      # Contact buttons & social links
│   │   └── ui/                     # Reusable widgets (ScrollStack, Ribbons)
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useHashRouter.js        # Client-side hash router
│   │   ├── useSoundEngine.js       # Procedural audio generator
│   │   ├── useSmoothScroll.js      # Lenis scroll controller
│   │   └── useVisitorTracking.js   # Analytics logger
│   │
│   ├── pages/              # Route views
│   │   ├── HomePage.jsx            # Main scrollable single-page layout
│   │   ├── ExperiencePage.jsx      # Extended career experience view
│   │   ├── ProjectsPage.jsx        # Project gallery & 3D carousel
│   │   ├── ResumePage.jsx          # Interactive CV preview
│   │   ├── ChatPage.jsx            # Interactive assistant
│   │   └── AdminPage.jsx           # Management workspace
│   │
│   └── data/               # Structured content & data hooks
│
└── server/                 # Local Node.js API and analytics server
```

---

## Local Setup

### Prerequisites

- Node.js 18 or later
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/sahilaw22/sahilaw-in.git

# Navigate into the project directory
cd sahilaw-in

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the Vite development server
npm run dev

# Start the optional backend API server
npm run server
```

### Production Build

```bash
# Compile and optimize production assets to dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## License

MIT © [Sahil Ahmed Wani](https://github.com/sahilaw22)
