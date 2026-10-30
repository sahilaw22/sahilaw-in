<div align="center">

# My Coolofio

### Personal portfolio, design engineering experiments, and modular content management.

Built with React 18, GSAP 3, Framer Motion, and native browser APIs. Zero router dependencies, dark liquid aesthetics, procedural audio feedback, and client-side hash navigation.

<br />

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,js,ts,tailwind,figma,flutter" alt="Tech Stack Badges" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production_Ready-10b981?style=flat-square" alt="Status" />
  &nbsp;
  <img src="https://img.shields.io/badge/Preloader-React_Bits_Pro-38bdf8?style=flat-square" alt="Preloader" />
  &nbsp;
  <img src="https://img.shields.io/badge/Cards-Scroll_Stack_Deck-8c65f7?style=flat-square" alt="Scroll Stack" />
  &nbsp;
  <img src="https://img.shields.io/badge/Audio-Web_Audio_API-ec4899?style=flat-square" alt="Audio" />
</p>

[Overview](#overview) · [Core Features](#core-features) · [Architecture Pipeline](#architecture-pipeline) · [Admin & Data Export](#admin--data-export) · [Local Development](#local-development)

</div>

---

## Overview

My Coolofio is a personal portfolio and creative engineering showcase. It combines tactile micro-interactions, procedural Web Audio feedback, an interactive 3D OrbitDeck project carousel, and an admin management panel with one-click ZIP backup export.

---

## Core Features

- **React Bits Pro Preloader**: Staggered staircase entrance screen (`@reactbits-starter/preloader-tw`) with custom obsidian/emerald palette, minimal anti-slop copy, and keyboard/click skip affordance.
- **Scroll Stack Project Deck**: Featured work presented in a stacked card deck (`@reactbits-starter/scroll-stack-tw`) that glides and scales smoothly as the user scrolls.
- **3D OrbitDeck Carousel**: Cylindrical card perspective ring powered by CSS 3D matrix math with pointer scrub and inertial dampening.
- **Procedural Web Audio Engine**: Synthesized acoustic clicks and frequency pops triggered on interactive elements using the native Web Audio API with zero external media files.
- **SkillIcons & Custom Badges**: Inline technology pills rendered via `skillicons.dev` alongside custom uploaded skill icons managed in the admin dashboard.
- **Dual Tab Recognition**: Modular Certification & Recognition sections featuring issue dates, issuing organizations, and direct credential links.
- **Admin Dashboard & ZIP Export**: In-browser portfolio content editor with live JSON preview and full ZIP package backup bundling all assets and structured data.
- **Zero-Dependency Hash Router**: Smooth client-side view switching compatible with all static hosting providers.

---

## Architecture Pipeline

```
                                  [ index.html ]
                                        │
                                        ▼
                                   [ main.jsx ]
                                        │
                                   [ App.jsx ]
                   (Matrix Canvas, Sound Engine, Hash Router)
                                        │
       ┌─────────────────┬──────────────┴──────────────┬─────────────────┐
       ▼                 ▼                             ▼                 ▼
  [ HomePage ]     [ ProjectsPage ]              [ ResumePage ]     [ AdminPage ]
  - Preloader      - 3D OrbitDeck                - PDF Document     - Live Editor
  - Hero Header    - Project Modals              - Skills Export    - Skill Manager
  - About Section  - Archive Grid                - Experience       - ZIP Export
  - Experience
  - Scroll Stack
  - Skills
  - Certifications
  - Contact
```

All data is structured modularly in [`data/`](data/) and read through [`src/data/usePortfolioData.js`](src/data/usePortfolioData.js).

---

## Admin & Data Export

The portfolio includes an administrative workspace (`#/admin`) designed for quick updates:

1. **Inline Skills Manager**: Add, edit, or remove skills with support for comma-separated entries, skillicons slugs, and custom image uploads.
2. **One-Click ZIP Backup**: Click **Export ZIP** in the admin toolbar to download a complete, structured ZIP archive containing:
   - Modular JSON files (`about.json`, `experiences.json`, `education.json`, `skills.json`, `meta.json`, `knowledge-base.json`)
   - Custom uploaded logos extracted into `assets/logos/`
   - Archive manifest with timestamp and versioning

---

## Local Development

### Prerequisites

- Node.js 18 or later
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/sahilaw22/sahilaw-in.git

# Enter project directory
cd sahilaw-in

# Install dependencies
npm install
```

### Running Locally

```bash
# Start Vite development server
npm run dev

# Run backend API & question matcher test suite
npm run test:bot
```

### Production Build

```bash
# Build optimized production bundle into dist/
npm run build

# Preview build locally
npm run preview
```

---

## License

MIT © [Sahil](https://github.com/sahilaw22)
