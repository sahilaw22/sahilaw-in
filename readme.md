<div align="center">

# Design Engineering Portfolio

### Spatial micro-interactions, procedural Web Audio feedback, and tactile 3D interfaces.

A personal web experience engineered with React 18, GSAP 3, and native browser APIs. Built with clean technical typography, zero framework bloat, and fluid client-side hash navigation.

<br />

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,js,ts,tailwind,figma,flutter" alt="Tech Stack Badges" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production_Ready-10b981?style=flat-square" alt="Status" />
  &nbsp;
  <img src="https://img.shields.io/badge/Routing-Zero--Dependency_Hash-6366f1?style=flat-square" alt="Routing" />
  &nbsp;
  <img src="https://img.shields.io/badge/Audio-Web_Audio_API-ec4899?style=flat-square" alt="Audio" />
  &nbsp;
  <img src="https://img.shields.io/badge/Motion-GSAP_3_%2B_Framer-f59e0b?style=flat-square" alt="Motion" />
</p>

[Overview](#overview) · [Core Interactive Systems](#core-interactive-systems) · [Architecture Pipeline](#architecture-pipeline) · [Local Development](#local-development) · [Credits](#credits)

</div>

---

## Overview

A modern web experience blending front-end craft with interactive engineering. The interface couples physics-based micro-interactions and custom Web Audio API feedback with an editorial dark liquid theme and zero-dependency hash routing.

---

## Core Interactive Systems

- **3D OrbitDeck Project Showcase**: Interactive cylindrical card carousel powered by CSS 3D matrix perspective transforms with real-time pointer scrub and velocity-based inertia.
- **Web Audio Sound Synthesizer**: Procedural audio engine generating tactile acoustic feedback (subtle clicks, section snaps, focus hums) directly via the Web Audio API without loading external media files.
- **Vector Career Timeline**: Mathematical SVG step-graph plotting career milestones, education tracks, and internship nodes with millisecond-exact scroll anchors.
- **Matrix Code Canvas**: Canvas-driven background rendering low-opacity hex glyph streams with fluid viewport resizing and zero CPU memory leakage.
- **Zero-Dependency Hash Router**: Lightweight router supporting smooth view transitions and immediate direct linking across static hosts (Vercel, GitHub Pages, Netlify).
- **Keyboard & Touch Accessibility**: Accessible navigation dock with explicit `:focus-visible` ring indicators, responsive touch targets, and mobile notch docking.

---

## Architecture Pipeline

```
                                  [ index.html ]
                                        │
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
              [ styles/base-layout.css ]     [ styles/base-theme.css ]
                         │                             │
                         └──────────────┬──────────────┘
                                        ▼
                                  [ main.jsx ]
                                        │
                                  [ App.jsx ]
                   (Matrix Canvas, Sound Engine, Hash Router)
                                        │
       ┌─────────────────┬──────────────┴──────────────┬─────────────────┐
       ▼                 ▼                             ▼                 ▼
  [ HomePage ]     [ ProjectsPage ]              [ ResumePage ]     [ ChatPage ]
  - Hero Header    - 3D OrbitDeck                - ATS Document     - Lattice Loader
  - About Reveal   - Project Modals              - Skills Export    - Simulated Agent
  - Experience     - Archive Directory
  - Education
  - Career Timeline
```

All dynamic data and section content is decoupled from components and maintained centrally in [`src/data/portfolioData.jsx`](src/data/portfolioData.jsx).

---

## Local Development

### Prerequisites

Node.js 18 or later.

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
# Start local development server with Hot Module Replacement
npm run dev
```

### Production Build

```bash
# Compile and minify for production into dist/
npm run build

# Preview production build locally
npm run preview
```

---

## Credits

<div align="center">

Designed and engineered with care by **Sahil**

Special appreciation to the open-source community, **GSAP**, **React**, and **SkillIcons** for providing the building blocks for modern interactive web craft.

</div>
