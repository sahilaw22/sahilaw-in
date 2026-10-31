# Portfolio Architecture & Engineering System Map

An exhaustive architectural reference and technical guide for the Sahil Ahmed Wani Design Engineering Portfolio.

---

## 1. Executive Summary & Tech Stack

This portfolio is a crafted, high-performance web experience blending front-end craft with interactive engineering. It features zero unnecessary dependencies, centralized data modeling, semantic asset directories, and a 1:1 match between on-screen section headers and component files.

- **Framework**: React 18 (Vite 5.4.21)
- **Styling**: Vanilla CSS (`src/index.css`) with unified technical grid architecture, complemented by foundational base styles (`public/styles/base-layout.css` and `public/styles/base-theme.css`)
- **Animations**: GSAP 3 (ScrollTrigger), Framer Motion
- **Icons**: SkillIcons (`skillicons.dev`), Custom SVG Brand Marks, `TechIcons.jsx`
- **Audio Engine**: Web Audio API Synthesizer (`src/hooks/useSoundEngine.js`)
- **Routing**: Zero-dependency Client-side Hash Router (`src/hooks/useHashRouter.js`)

---

## 2. Full Directory Structure Map

```
Avara/
├── index.html                     # HTML5 entry shell, font preloads, and favicon link
├── package.json                   # Project scripts and dependencies
├── vite.config.js                 # Vite bundler configuration
├── PORTFOLIO_ARCHITECTURE.md      # This comprehensive architectural reference
│
├── public/                        # Static Assets (served directly at root URL)
│   ├── fonts/                     # Custom typography assets
│   │   ├── Disket-Mono-Bold.ttf
│   │   └── Disket-Mono-Regular.ttf
│   ├── icons/                     # UI and brand vectors
│   │   ├── favicon.svg            # Tab favicon (relocated from legacy ethereum.svg)
│   │   └── skillicons/            # Local SVG skill badges (figma.svg, flutter.svg, react.svg)
│   ├── images/                    # Visual imagery and UI graphics
│   │   ├── navigation/            # 3D floating right-dock navigation pills
│   │   │   ├── nav-about.png      # Pill for About section (formerly aave.png)
│   │   │   ├── nav-experience.png # Pill for Experience section (formerly family.png)
│   │   │   ├── nav-skills.png     # Pill for Skills section (formerly lens.png)
│   │   │   └── nav-contact.png    # Pill for Contact section (formerly gho.png)
│   │   └── tools/
│   │       └── orbit-deck/        # Interactive OrbitDeck tool cards
│   ├── projects/                  # Project showcase preview thumbnails
│   │   ├── audio-synth.png
│   │   ├── connectkit.png
│   │   ├── lurian-ai.png
│   │   └── sahil-recreation.jpg
│   ├── styles/                    # Foundational base vendor stylesheets
│   │   ├── base-layout.css        # Clean rename of legacy 4e31a4da7006a8eb.css
│   │   └── base-theme.css         # Clean rename of legacy 6c3c9d7b984e6c12.css
│   ├── about-banner.jpg           # About section visual banner
│   ├── profile.jpg                # Profile photography
│   ├── profile.png                # Transparent profile portrait
│   └── spider.png                 # Hanging spider scroll cue indicator
│
└── src/                           # Application Source Code
    ├── App.jsx                    # Root application coordinator & route renderer
    ├── main.jsx                   # Vite React DOM entry point
    ├── index.css                  # Global technical stylesheet & typography rules
    │
    ├── components/                # Production UI components (1:1 header match)
    │   ├── AboutSection.jsx       # [ABOUT ME] section container
    │   ├── BottomNav.jsx          # Floating bottom expandable tabs navigation
    │   ├── CareerTimeline.jsx     # Vector career & education step-graph ruler
    │   ├── CertificationsSection.jsx # [CERTIFICATIONS] list with issuer icons
    │   ├── ContactSection.jsx     # [CONTACT] interactive email & social links
    │   ├── EducationSection.jsx   # [EDUCATION] connected spine with logos
    │   ├── ExperienceSection.jsx  # [EXPERIENCE] connected spine with company logos
    │   ├── FeaturedProjectsSection.jsx # [FEATURED PROJECTS] pinned cascading stack
    │   ├── FeaturedProjectsSection.css # Stacked card styling and pinned slot
    │   ├── GlassDistortionSVG.jsx # SVG filter definitions for glass refraction
    │   ├── HeroHeader.jsx         # Hero rotating title badge with status-red glow
    │   ├── LatticeLoader.jsx      # Matrix grid orbital loader for chat console
    │   ├── LetterGlitch.jsx       # Matrix hex-code background canvas
    │   ├── LetterGlitch.css       # Canvas styling for background
    │   ├── Preloader.jsx          # Re-export of React Bits Pro entrance preloader
    │   ├── RightScrollPills.jsx   # Right-side vertical section jump pills
    │   ├── RotatingText.jsx       # Spring-physics role text rotation
    │   ├── RotatingText.css       # Rotating text transitions
    │   ├── SkillsSection.jsx      # [SKILLS] categorized technology pills
    │   ├── SocialIcons.jsx        # Hero GitHub, LinkedIn, X, Discord links
    │   ├── TechIcons.jsx          # Micro-icon vector dictionary for tech stacks
    │   ├── TextRevealParagraph.jsx # ScrollTrigger word reveal with SkillIcons
    │   │
    │   └── ui/                    # Specialized interactive UI widgets
    │       ├── expandable-tabs.jsx # Micro-animated navigation capsule
    │       ├── expandable-tabs.css # Navigation styles
    │       ├── Preloader.jsx      # React Bits Pro 10-stair entrance reveal
    │       ├── Preloader.css      # Preloader styles & navbar suppression
    │       ├── ScrollStack.jsx    # GSAP ScrollTrigger pinned stacked deck
    │       ├── ScrollStack.css    # Pinned card stack positioning
    │       ├── OrbitDeck.jsx      # 3D interactive spinning project carousel
    │       └── OrbitDeck.css      # 3D transforms & perspective layout
    │
    ├── data/                      # Centralized Content & State Data
    │   ├── portfolioData.jsx      # Single source of truth for all section data
    │   └── blog.js                # Markdown articles and blog post metadata
    │
    ├── hooks/                     # Custom React Hooks
    │   ├── useHashRouter.js       # Lightweight hash routing engine
    │   └── useSoundEngine.js      # Synthesizer audio engine (click, hover, success)
    │
    ├── lib/
    │   └── utils.js               # Class name merging utility (clsx / tailwind-merge)
    │
    └── pages/                     # Top-level Route Views
        ├── HomePage.jsx           # Main full-scroll single-page portfolio
        ├── ProjectsPage.jsx       # 3D OrbitDeck interactive project showcase
        ├── ResumePage.jsx         # Interactive resume & CV document viewer
        ├── ChatPage.jsx           # AI Interactive chat terminal with LatticeLoader
        ├── BlogPage.jsx           # Engineering writings and tutorials index
        └── PostPage.jsx           # Single blog article dynamic reader
```

---

## 3. Legacy Directory Refactoring (`public/avara.xyz/` Migration)

The original template contained an unorganized, scraped `public/avara.xyz/` directory with ~1.5 MB of dead Next.js build artifacts, hash-named CSS files, and cryptic media tokens. This has been cleanly refactored into modern, intuitive software engineering paths:

| Legacy Path in `avara.xyz/` | Refactored Clean Path | Engineering Purpose |
| :--- | :--- | :--- |
| `avara.xyz/_next/static/css/4e31a4da7006a8eb.css` | `public/styles/base-layout.css` | Foundational layout styles loaded in `index.html` |
| `avara.xyz/_next/static/css/6c3c9d7b984e6c12.css` | `public/styles/base-theme.css` | Foundational theme variables loaded in `index.html` |
| `avara.xyz/_next/static/media/aave.9745096a.png` | `public/images/navigation/nav-about.png` | 3D navigation pill for About section |
| `avara.xyz/_next/static/media/family.74707479.png`| `public/images/navigation/nav-experience.png`| 3D navigation pill for Experience section |
| `avara.xyz/_next/static/media/lens.0f125713.png`  | `public/images/navigation/nav-skills.png` | 3D navigation pill for Skills section |
| `avara.xyz/_next/static/media/gho.eae3e780.png`   | `public/images/navigation/nav-contact.png` | 3D navigation pill for Contact section |
| `avara.xyz/icons/ethereum.svg`                    | `public/icons/favicon.svg` | Browser tab favicon |
| `avara.xyz/_next/static/chunks/*` (1.5 MB)        | **Deleted** | Obsolete Next.js JavaScript chunks |
| `avara.xyz/_next/static/K_C58gfjIUgw20ICPpyFV/*`  | **Deleted** | Obsolete Next.js build manifests |
| `avara.xyz/fonts/*` (empty stubs)                 | **Deleted** | Zero-byte stub files (typography is in `/fonts/`) |
| `public/avara.xyz/` folder                        | **Deleted** | Completely eradicated |

---

## 4. Header-to-Component Mapping

Every major section in the main portfolio directly corresponds to the visual tag pill rendered on screen:

| Visual Header Tag | Component Location | Data Location | Description |
| :--- | :--- | :--- | :--- |
| **HERO** | `src/components/HeroHeader.jsx`<br>`src/components/SocialIcons.jsx` | `portfolioData.jsx` (`HERO_ROLES`) | Intro greeting, pitch, rotating status-red badge (`#ff4444`), and social links. |
| **ABOUT ME** | `src/components/AboutSection.jsx` | `portfolioData.jsx` (`ABOUT_PARAGRAPHS`) | Word-by-word opacity reveal with Figma, React, Flutter SkillIcons placed before tech names and 3D Resume button. |
| **(TIMELINE)** | `src/components/CareerTimeline.jsx` | Sub-component of About | Vector ruler from 2021 to 2026, PCM track, break baseline, internship nodes, and `NOW` status. |
| **EXPERIENCE** | `src/components/ExperienceSection.jsx` | `portfolioData.jsx` (`EXPERIENCES`) | Company nodes (Big Block Theory, FlyRank AI, Perplexity) connected by vertical spine. |
| **FEATURED PROJECTS** | `src/components/FeaturedProjectsSection.jsx`<br>`src/components/ui/ScrollStack.jsx` | `portfolioData.jsx` (`PROJECTS`) | Pinned cascading stacked card deck with solid cards, pinned header/footer, and smooth scroll transitions. |
| **EDUCATION** | `src/components/EducationSection.jsx` | `portfolioData.jsx` (`EDUCATION_ITEMS`) | B.Tech CSE (GCET Jammu) and PCM (SP Smart School) connected with institutional nodes. |
| **SKILLS** | `src/components/SkillsSection.jsx` | `portfolioData.jsx` (`SKILL_CATEGORIES`) | Categorized skill groups (Frontend, AI, Backend, Tools) rendered with `TechIcon` pills. |
| **CERTIFICATIONS** | `src/components/CertificationsSection.jsx` | `portfolioData.jsx` (`CERTIFICATIONS`) | Clean technical rows with brand vectors, issuers, year badges, and direct credential links. |
| **CONTACT** | `src/components/ContactSection.jsx` | `src/components/ContactSection.jsx` | Content-hugging email action button, availability metadata, and direct social links. |

---

## 5. Centralized Data Architecture (`src/data/portfolioData.jsx`)

All dynamic portfolio records are unified inside `src/data/portfolioData.jsx`. Updating credentials, adding an internship, or changing skill sets is performed in this single location:

### Exported Data Models:
1. **`HERO_ROLES`**: Array of role strings displayed in the rotating hero badge.
2. **`ABOUT_PARAGRAPHS`**: Narrative strings with embedded SkillIcon tokens (`{{ICON_FIGMA}}`, `{{ICON_REACT}}`, `{{ICON_FLUTTER}}`).
3. **`EXPERIENCES`**:
   - `company`: Company name
   - `role`: Position title
   - `period`: Date range string
   - `isCurrent`: Boolean flag (renders `#ff4444` `NOW` indicator)
   - `desc`: Summary of work and impact
   - `skills`: Array of technical keywords
   - `logo`: JSX vector logo
4. **`EDUCATION_ITEMS`**:
   - `degree`: Academic degree or diploma
   - `institution`: School or University
   - `period`: Years attended
   - `isCurrent`: Boolean flag
   - `desc`: Overview of focus areas
   - `courses`: Array of core coursework topics
   - `logo`: Institutional vector mark
5. **`SKILL_CATEGORIES`**:
   - `category`: Domain title (Frontend, AI, Backend, Tools)
   - `skills`: Array of individual skill names mapped by `TechIcons.jsx`
6. **`CERTIFICATIONS`**:
   - `title`: Credential name
   - `issuer`: Organization or platform
   - `year`: Issue year
   - `link`: Verification URL
   - `icon`: Company vector badge

---

## 6. Routing & Page Architecture

Routing is managed through hash-based state inside `src/hooks/useHashRouter.js`, allowing zero-configuration hosting on GitHub Pages, Vercel, or Netlify without server rewrite rules.

```
Route Hash               Page Component           View Mode
-------------------------------------------------------------------------
#/ or #                  HomePage.jsx             Full scrolling portfolio
#/projects               ProjectsPage.jsx         3D OrbitDeck project gallery
#/resume or #/careers    ResumePage.jsx           Interactive resume & document viewer
#/chat                   ChatPage.jsx             Interactive AI assistant console
#/blog                   BlogPage.jsx             Articles & technical writeups
#/blog/:slug             PostPage.jsx             Dynamic Markdown article reader
```

---

## 7. Global Layout & Supporting Systems

1. **Fixed Matrix Code Canvas (`LetterGlitch.jsx`)**:
   - Positioned fixed at `z-index: 0` in `App.jsx`.
   - Renders low-opacity hex code matrix (`characters="0123456789ABCDEF"`, `baseOpacity={0.12}`).
2. **Audio Synthesizer Engine (`useSoundEngine.js`)**:
   - Generates responsive click, hover, toggle, and success sounds via the Web Audio API without loading external MP3/WAV files.
3. **Floating Navigation (`BottomNav.jsx` & `RightScrollPills.jsx`)**:
   - Bottom Nav uses `expandable-tabs.jsx` to switch between main views (`/`, `/projects`, `/resume`, `/chat`, `/blog`).
   - Right-side pills allow one-click jumping between sections on the Home page (`#section-about`, `#section-journey`, `#section-skills`, `#section-contact`).
   - Clicking the About pill while already in the About section smoothly scrolls back to the top Hero section.
4. **Scroll Indicators**:
   - Hanging spider visual cue (`public/spider.png`) in `HomePage.jsx` provides an interactive one-click scroll down to the About section.
5. **SkillIcons Asset System (`public/icons/skillicons/`)**:
   - Local SVGs (`figma.svg`, `flutter.svg`, `react.svg`) provide instant 0ms rendering with network fallback to `https://skillicons.dev`.

---

## 8. Build & Verification Commands

```bash
# Development server
npm run dev

# Production build (outputs clean bundles to dist/)
npm run build

# Preview production build locally
npm run preview
```
