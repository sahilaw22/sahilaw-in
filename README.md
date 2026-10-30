<div align="center">

# Sahil Ahmed Wani

### Frontend Engineer, Mobile Developer & Creative Technologist

Building thoughtful, high-performance web experiences with motion, tactile audio feedback, and modern web engineering.

[![Portfolio Live](https://img.shields.io/badge/Website-sahilaw.in-000000?style=for-the-badge&logo=googlechrome&logoColor=white)](https://sahilaw.in)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sahilaw-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/sahilaw)
[![GitHub](https://img.shields.io/badge/GitHub-sahilaw22-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sahilaw22)
[![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646C99?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Overview](#overview) · [Key Highlights](#key-highlights) · [System Architecture](#system-architecture) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Project Structure](#project-structure)

</div>

---

## Overview

A personal design engineering portfolio built from the ground up to showcase interactive engineering, frontend craftsmanship, and mobile application development. The interface couples physics-based micro-interactions and custom Web Audio API feedback with zero framework slop and strict zero-dependency hash routing.

---

## Key Highlights

- **Interactive 3D Carousel (OrbitDeck)**: Custom cylindrical 3D card deck rendered using CSS 3D perspective transforms with real-time pointer scrub and velocity-based inertia.
- **Web Audio Synthesizer**: Native Web Audio API sound generator creating procedural tactile feedback (subtle clicks, section snaps, focus hums) without external audio files.
- **Vector Career Timeline**: Mathematical SVG step-graph plotting trajectory, education tracks, and internship positions with millisecond-exact scroll anchors.
- **Matrix Code Canvas**: Canvas-driven background rendering low-opacity hex glyph streams with fluid viewport resizing and zero CPU memory leakage.
- **Client-Side Hash Router**: Lightweight zero-dependency router supporting smooth view transitions and immediate direct linking on static hosts (Vercel, GitHub Pages, Netlify).
- **Accessible & Responsive**: Fully keyboard navigable with explicit `:focus-visible` ring indicators, responsive touch targets, and mobile notch docking.

---

## System Architecture

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
  - About Word-by  - Project Modals              - Skills Export    - Simulated Agent
  - Experience     - Archive Directory
  - Education
  - Career Timeline
```

All dynamic data and section content is decoupled from components and maintained centrally in [`src/data/portfolioData.jsx`](src/data/portfolioData.jsx).

---

## Tech Stack

| Domain | Technologies & Libraries |
| :--- | :--- |
| **Core Framework** | React 18, Vite 5.4 |
| **Styling & Theme** | Native Vanilla CSS, CSS Custom Properties, Responsive Fluid Typography |
| **Motion & Animation** | GSAP 3 (ScrollTrigger), Framer Motion |
| **Audio Synthesis** | Web Audio API (OscillatorNode, GainNode, procedural envelopes) |
| **Icons & Badges** | SkillIcons, Custom SVG brand vector assets |
| **Fonts** | Disket Mono, Space Grotesk, Plus Jakarta Sans, Outfit, Syne |

---

## Project Structure

```
├── public/
│   ├── fonts/               # Custom web fonts (Disket Mono)
│   ├── icons/               # SVG vectors & local skill badges
│   ├── images/              # Visual assets and navigation pill thumbnails
│   ├── projects/            # High-resolution project showcase previews
│   └── styles/              # Foundational layout & theme base stylesheets
├── src/
│   ├── components/          # Production UI sections and interactive elements
│   │   ├── ui/              # OrbitDeck 3D carousel & expandable tabs navigation
│   │   ├── CareerTimeline.jsx
│   │   ├── ExperienceSection.jsx
│   │   ├── EducationSection.jsx
│   │   ├── RightScrollPills.jsx
│   │   └── TextRevealParagraph.jsx
│   ├── data/                # Single source of truth for portfolio content
│   │   ├── portfolioData.jsx
│   │   └── blog.js
│   ├── hooks/               # Hash router & Web Audio sound engine hooks
│   ├── pages/               # Top-level view controllers (Home, Projects, Resume, Chat)
│   ├── App.jsx              # Application root coordinator
│   ├── index.css            # Global styling system
│   └── main.jsx             # React DOM entry point
├── PORTFOLIO_ARCHITECTURE.md # Exhaustive technical architecture breakdown
└── vite.config.js           # Vite bundle configuration
```

---

## Getting Started

### Prerequisites

Ensure you have Node.js 18 or later installed on your system.

### Installation

```bash
# Clone the repository
git clone https://github.com/sahilaw22/sahilaw-in.git

# Enter the project directory
cd sahilaw-in

# Install dependencies
npm install
```

### Development

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

## License

This project is open-source and available under the [MIT License](LICENSE).
