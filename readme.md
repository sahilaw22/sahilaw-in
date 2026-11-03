<div align="center">

<img src="public/images/avatar-head.png" alt="Sahil's Portfolio Logo" width="100" height="100" />

# Sahil's Portfolio

 Aperformant, interactive design engineering portfolio and live content management system built with React 18, Vite, GSAP, and Node.js.

**Visit:** [sahilaw.in](https://sahilawww.vercel.app)

</div>

---

## Overview

Sahil's Portfolio is an open engineering showcase designed around fluid micro-interactions, low-latency audio feedback, and modular content architecture. Built without bulky component libraries or extraneous runtimes, it balances tactile visual polish with strict 60 FPS performance budgets across desktop and mobile devices.

The application includes an in-browser management workspace, dynamic SQLite-backed content synchronization, and serverless deployment readiness for modern edge platforms.

> [!NOTE]
> The site operates entirely on client-side hash routing (`#/`), allowing static hosting on platforms like Vercel or GitHub Pages while maintaining direct deep linking to projects, career timelines, and interactive tools.

---

## Key Features

- **Spring-Physics Eye Tracking**: Vector avatar in the hero greeting with cursor-following pupils constrained within circular eyewear, organic double-blinks, and background tab idle suspension.
- **GSAP ScrollStack Deck**: Cascading card deck with pin-spacing that docks projects sequentially as the user scrolls, finishing with a gliding action before unlocking subsequent sections.
- **3D OrbitDeck Perspective Ring**: Cylindrical 3D project ring powered by CSS 3D transforms, supporting pointer drag and touch scrubbing.
- **Synthesized Audio Engine**: Procedural sound feedback generated in real time using the browser Web Audio API with zero external audio assets.
- **GPU-Accelerated Ribbon Trail**: Smooth WebGL cursor ribbon on desktop pointers, automatically disabled on mobile screens and touch devices to conserve power.
- **Dynamic Content Management (CRUD)**: SQLite-backed management dashboard allowing real-time edits to projects, work experience, education, skills, narrative text, and contact links without rebuilds.
- **Lightweight Route Chunking**: Code-split route architecture using `React.lazy()` and Rollup manual chunking, delivering an initial entry bundle under 130 kB.

---

## Tech Stack

| Layer | Tools and Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite 5 |
| **Animation & Motion** | GSAP 3 (ScrollTrigger), Lenis Smooth Scroll |
| **Graphics & Audio** | HTML5 Canvas, WebGL2, Web Audio API |
| **Styles & Layout** | Vanilla CSS, CSS Grid/Flexbox, Custom Properties |
| **Icons & Typography** | SkillIcons, inline SVG systems, Disket Mono |
| **Backend & Storage** | Node.js Express API, SQLite (`portfolio.db`), Vercel Serverless |

---

## Quickstart

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher (or pnpm / yarn)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/sahilaw22/sahilaw-in.git
cd sahilaw-in
npm install
```

### Running Locally

To start the Vite development server with hot module replacement:

```bash
npm run dev
```

To run the local backend API server alongside the frontend:

```bash
npm run server
```

> [!IMPORTANT]
> The development server runs on `http://localhost:5173`. When accessing the chatbot or admin portal locally, ensure the backend server is running on `http://localhost:3001` or run `npm run dev` with the integrated Vite proxy plugin.

### Running Tests

Execute the deterministic bot matching engine test suite:

```bash
npm run test:bot
```

### Production Build

Compile and optimize client assets with automatic route chunking:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

| Directory / File | Type | Purpose & Contents |
| :--- | :--- | :--- |
| `api/index.js` | Serverless Function | Vercel Serverless entrypoint exporting the Express API router. |
| `public/company/` | Static Brand Media | Organization and company partner brand logos. |
| `public/fonts/` | Typography Assets | Custom brand font files including Disket Mono variants. |
| `public/icons/` | Vector Library | Local SkillIcon badges, favicon, and system vectors. |
| `public/images/` | Static Artwork | Vector avatar line art (`avatar-head.png`) and navigation dock graphics. |
| `public/projects/` | Media Thumbnails | Project cover assets and demo preview posters. |
| `server/api.js` | Backend API | Express REST endpoints for visitor analytics, chat bot, and content CRUD. |
| `server/db.js` | Database Layer | SQLite connection, table schemas, and persistence operations. |
| `server/matchingEngine.js` | NLP Query Engine | Fast, deterministic matching engine powering the assistant. |
| `src/components/ui/` | Core UI Primitives | Reusable components: `ScrollStack.jsx`, `OrbitDeck.jsx`, `Ribbons.jsx`. |
| `src/components/` | Section Views | `InteractiveAvatar.jsx`, `HeroHeader.jsx`, `ExperienceSection.jsx`, `ContactSection.jsx`. |
| `src/data/` | Content Store | Centralized schema (`portfolioData.jsx`) and reactive hook (`usePortfolioData.js`). |
| `src/hooks/` | Custom Hooks | Audio engine (`useSoundEngine.js`), hash routing, and smooth scrolling. |
| `src/pages/` | Code-Split Views | Route pages: `HomePage`, `ProjectsPage`, `ExperiencePage`, `ResumePage`, `ChatPage`, `AdminPage`. |
| `src/index.css` | Global Styling | Central stylesheet containing design tokens, animations, and responsive media rules. |
| `vercel.json` | Deployment Config | Vercel edge rewrite configurations for `/api/*` routing. |

---

## Content Management & Administration

The portfolio includes an integrated management portal accessible via `#/admin`.

- **Work Experience**: Add, edit, or delete roles, dates, company logos, and skill tags.
- **Projects Showcase**: Create, update, reorder (up/down), and feature projects on the homepage deck.
- **Identity & Links**: Update hero titles, bio narrative, verified email, and social profiles.
- **Visitor Analytics**: View geographic distribution, device types, and page impression metrics.
- **Data Portability**: Download a full JSON and asset archive in a single ZIP file at any time.

---

## Credits

Designed and built by Sahil Ahmed Wani.

Technologies & Tools: React 18, Next.js, Three.js, WebGL, Web Audio, Vite, GSAP, Claude, Gemini.

---

## License

This project is open-source and available under the terms of the [MIT License](LICENSE).
