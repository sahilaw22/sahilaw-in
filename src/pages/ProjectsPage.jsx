import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { TechIcon } from '../components/TechIcons.jsx';
import OrbitDeck from '../components/ui/OrbitDeck.jsx';

const projects = [
  {
    id: 1,
    title: 'Sahil Recreation',
    description: 'Interactive 3D portfolio & sound engine',
    details: 'A visual portfolio system designed around fluid movement, spatial sound, and interactive brand discovery.',
    longDetails: 'A fully interactive portfolio experience built from scratch using React 18, GSAP 3, and the Web Audio API. The experience features spatially-aware ambient sound that responds to user interaction, draggable brand logos with physics-based motion, and a glassmorphic sidebar that reveals project and personal details. Every microinteraction was hand-crafted for a premium feel. The floating logo grid uses GSAP transforms with carefully tuned easing curves, and the sound engine dynamically layers ambient tones based on scroll depth and hover states.',
    tech: ['React', 'GSAP', 'CSS3', 'JavaScript', 'Node.js', 'Canvas'],
    techFull: ['React 18', 'GSAP 3', 'Web Audio API', 'Vite', 'CSS Custom Properties', 'Node.js'],
    image: '/projects/sahil-recreation.jpg',
    videoThumb: '/projects/sahil-recreation.jpg',
    link: 'https://github.com/sahilaw22',
    github: 'https://github.com/sahilaw22',
    isWorking: true,
  },
  {
    id: 2,
    title: 'Web Audio Synth',
    description: 'Browser audio synthesizer experiment',
    details: 'A browser audio workstation exploring oscillator synthesis, filter controls, and interactive audio visualizer.',
    longDetails: 'A fully browser-based audio synthesizer built using the Web Audio API without external libraries. Features include multi-oscillator synthesis (sine, saw, square waves), a low-pass filter with resonance control, an ADSR envelope, and real-time waveform visualization on an HTML Canvas. The UI is designed to feel like a hardware synthesizer with touch-friendly knobs and sliders. Keyboard mapping lets users play notes directly, making it a functional mini-instrument.',
    tech: ['Web Audio', 'JavaScript', 'Canvas', 'CSS3', 'React', 'TypeScript'],
    techFull: ['Web Audio API', 'Vanilla JavaScript', 'HTML Canvas', 'CSS Grid', 'TypeScript'],
    image: '/projects/audio-synth.png',
    videoThumb: '/projects/audio-synth.png',
    link: 'https://github.com/sahilaw22',
    github: 'https://github.com/sahilaw22',
    isWorking: true,
  },
  {
    id: 3,
    title: 'ConnectKit Theme',
    description: 'Modern Web3 UI design system',
    details: 'A polished interface study for reusable Web3 connect flows, wallet modals, and consistent component states.',
    longDetails: 'A comprehensive design system and component library for Web3 wallet connection flows. Built on top of ConnectKit with custom themes, animated modal transitions, responsive layouts, and dark/light mode support. Includes reusable React components for wallet selection, balance display, network switching, and transaction confirmation states. All components are fully documented with Storybook and tested for accessibility.',
    tech: ['React', 'UI/UX', 'Figma', 'TypeScript', 'CSS3', 'JavaScript'],
    techFull: ['React', 'ConnectKit', 'Figma', 'Storybook', 'Framer Motion', 'TypeScript'],
    image: '/projects/connectkit.png',
    videoThumb: '/projects/connectkit.png',
    link: 'https://github.com/sahilaw22',
    github: 'https://github.com/sahilaw22',
    isWorking: true,
  },
  {
    id: 4,
    title: 'Lurian AI',
    description: 'AI-assisted conversational companion',
    details: 'A real-time conversational layer that helps visitors understand project case studies and workflows.',
    longDetails: 'An intelligent portfolio assistant powered by a language model fine-tuned on engineering content. The interface mimics a modern chat application with streaming responses, suggested prompts, and contextual follow-up questions. The AI can explain technical decisions, describe the engineering process behind projects, and answer general questions about skills and experience. Built with React, a custom streaming hook, and a serverless edge function for low-latency responses.',
    tech: ['React', 'AI Engine', 'TypeScript', 'Node.js', 'JavaScript', 'Figma'],
    techFull: ['React 18', 'LLM API', 'Edge Functions', 'TypeScript', 'Framer Motion', 'Node.js'],
    image: '/projects/lurian-ai.png',
    videoThumb: '/projects/lurian-ai.png',
    link: '#/chat',
    github: 'https://github.com/sahilaw22',
    isWorking: true,
  },
];

function DetailModal({ project, onClose, onNext, onPrev }) {
  // Keyboard navigation
  useEffect(() => {
    if (!project) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose, onNext, onPrev]);

  if (!project) return null;

  const currentIdx = projects.findIndex((p) => p.id === project.id);
  const prevProject = projects[(currentIdx - 1 + projects.length) % projects.length];
  const nextProject = projects[(currentIdx + 1) % projects.length];

  return createPortal(
    <div className="project-detail-backdrop" onClick={onClose}>
      {/* Top Floating Back Button (outside card) */}
      <button
        type="button"
        className="project-modal-top-back"
        onClick={onClose}
        aria-label="Back to projects"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to projects</span>
      </button>

      {/* Main card wrapper with external side navigation buttons */}
      <div className="project-modal-wrapper" onClick={(e) => e.stopPropagation()}>
        {/* Previous Project Button (Outside card, Left side) */}
        <button
          type="button"
          className="project-nav-btn project-nav-prev"
          onClick={onPrev}
          aria-label="Previous project"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Project Detail Card (Borderless) */}
        <article className="project-detail-panel">
          {/* Video / image preview banner with hover play button */}
          <div className="project-detail-media">
            <img src={project.videoThumb} alt={project.title} />
            <div className="project-card-play-overlay">
              <button
                type="button"
                className="project-play-circle-btn"
                aria-label="Play video demo"
              >
                <svg width="32" height="32" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48.24-94.78-64-40A8,8,0,0,0,100,88v80a8,8,0,0,0,12.24,6.78l64-40a8,8,0,0,0,0-13.56ZM116,153.57V102.43L156.91,128Z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="project-detail-body">
            <div className="project-detail-meta">
              {project.techFull.map((t) => (
                <span key={t} className="project-tech-dotted-chip">
                  <TechIcon name={t} size={13} />
                  <span>{t}</span>
                </span>
              ))}
            </div>

            <h2>{project.title}</h2>
            <p className="project-detail-short">{project.details}</p>
            <p className="project-detail-long">{project.longDetails}</p>

            <div className="project-detail-actions">
              <a
                className="project-detail-cta"
                href={project.link}
                target={project.link.startsWith('http') ? '_blank' : undefined}
                rel={project.link.startsWith('http') ? 'noreferrer' : undefined}
              >
                <span>Website</span>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>

              {project.github && (
                <a
                  className="project-detail-source-btn"
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>
        </article>

        {/* Next Project Button (Outside card, Right side) */}
        <button
          type="button"
          className="project-nav-btn project-nav-next"
          onClick={onNext}
          aria-label="Next project"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}

export default function ProjectsPage({ showAll = false }) {
  const [selectedProject, setSelectedProject] = useState(null);

  // Hide floating navbar while in project details view, and restore when back is clicked
  useEffect(() => {
    if (selectedProject) {
      document.body.classList.add('project-detail-active');
    } else {
      document.body.classList.remove('project-detail-active');
    }
    return () => {
      document.body.classList.remove('project-detail-active');
    };
  }, [selectedProject]);

  function handleNextProject() {
    if (!selectedProject) return;
    const currentIdx = projects.findIndex((p) => p.id === selectedProject.id);
    const nextIdx = (currentIdx + 1) % projects.length;
    setSelectedProject(projects[nextIdx]);
  }

  function handlePrevProject() {
    if (!selectedProject) return;
    const currentIdx = projects.findIndex((p) => p.id === selectedProject.id);
    const prevIdx = (currentIdx - 1 + projects.length) % projects.length;
    setSelectedProject(projects[prevIdx]);
  }

  if (showAll) {
    return (
      <main className="projects-page projects-all-page">
        <header className="projects-header projects-header-all">
          <a href="#/projects" className="projects-back-link" aria-label="Back">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </a>
          <h1>Projects</h1>
          <p>My projects and work across different technologies and domains.</p>
        </header>

        <section className="projects-grid">
          {projects.map((project) => (
            <article
              key={project.id || project.title}
              className="projects-grid-card od-grid-card"
              onClick={() => setSelectedProject(project)}
            >
              {/* Full bleed card background image */}
              <img
                src={project.image}
                alt={project.title}
                className="od-card-bg-img"
                draggable={false}
                decoding="async"
              />

              {/* Gradient overlay for text clarity */}
              <div className="od-card-bg-overlay" aria-hidden="true" />

              {/* Card Body matching OrbitDeck */}
              <div className="od-card-body">
                <h2 className="od-card-title">{project.title}</h2>
                <p className="od-card-details">{project.details}</p>

                {project.tech && project.tech.length > 0 && (
                  <div
                    className="od-card-tech-line"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.tech.map((t) => (
                      <span key={t} className="od-tech-pill">
                        <TechIcon name={t} size={10} />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                )}

                <div
                  className="od-card-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="od-btn-detail"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                    }}
                  >
                    View details
                  </button>

                  {project.link && (
                    <a
                      className="od-visit-btn"
                      href={project.link}
                      target={project.link.startsWith('http') ? '_blank' : undefined}
                      rel={project.link.startsWith('http') ? 'noreferrer' : undefined}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Visit</span>
                      <svg
                        viewBox="0 0 24 24"
                        width="11"
                        height="11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>

        <DetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onNext={handleNextProject}
          onPrev={handlePrevProject}
        />
      </main>
    );
  }

  return (
    <main className="projects-page">
      <header className="projects-header">
        <h1>Projects</h1>
        <p className="projects-header-sub">A few things I've built recently</p>
      </header>

      <section className="project-stack-wrap" aria-label="Project showcase">
        <OrbitDeck
          projects={projects}
          onSelectProject={setSelectedProject}
          autoPlay={selectedProject === null}
        />

        <div className="projects-more-section">
          <a className="projects-more-button" href="#/projects/all">
            <span>Explore all projects</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </section>

      <DetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
      />
    </main>
  );
}