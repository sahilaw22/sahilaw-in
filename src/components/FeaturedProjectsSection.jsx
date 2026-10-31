import React from 'react';
import { ScrollStack, ScrollStackItem } from './ui/ScrollStack.jsx';
import { TechIcon } from './TechIcons.jsx';
import './FeaturedProjectsSection.css';

const FEATURED_PROJECTS = [
  {
    id: 1,
    title: 'Sahil Recreation',
    details: 'Interactive 3D portfolio & spatial Web Audio engine with physics-driven mechanics and fluid motion.',
    tech: ['React', 'GSAP', 'CSS3', 'Node.js', 'Canvas'],
    image: '/projects/sahil-recreation.jpg',
    link: '#/projects',
    website: 'https://github.com/sahilaw22',
  },
  {
    id: 4,
    title: 'Lurian AI',
    details: 'Real-time conversational companion featuring streaming responses, suggested query prompts, and context grounding.',
    tech: ['React', 'AI Engine', 'TypeScript', 'Node.js', 'Figma'],
    image: '/projects/lurian-ai.png',
    link: '#/chat',
    website: '#/chat',
  },
  {
    id: 2,
    title: 'Web Audio Synth',
    details: 'Browser audio workstation exploring oscillator synthesis, filter resonance, and real-time canvas visualizer.',
    tech: ['Web Audio', 'JavaScript', 'Canvas', 'CSS3', 'TypeScript'],
    image: '/projects/audio-synth.png',
    link: '#/projects',
    website: 'https://github.com/sahilaw22',
  },
  {
    id: 3,
    title: 'ConnectKit Theme',
    details: 'Polished design system for Web3 connect flows, accessible modal transitions, and state management.',
    tech: ['React', 'UI/UX', 'Figma', 'TypeScript', 'CSS3'],
    image: '/projects/connectkit.png',
    link: '#/projects',
    website: 'https://github.com/sahilaw22',
  },
];

export default function FeaturedProjectsSection({ play }) {
  return (
    <section id="section-featured-projects" className="portfolio-section portfolio-featured-projects-section">
      {/* Cascading Card Stack matching reference diagram with pinned header */}
      <ScrollStack
        header={
          <div className="featured-work-center-header">
            <div className="contact-image-tag">
              <span>FEATURED WORK</span>
            </div>
          </div>
        }
      >
        {FEATURED_PROJECTS.map((project, idx) => (
          <ScrollStackItem
            key={project.id}
            index={idx}
          >
            <div
              className="scroll-stack-card"
              role="button"
              tabIndex={0}
              onClick={() => {
                play?.('click');
                window.location.hash = project.link;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  play?.('click');
                  window.location.hash = project.link;
                }
              }}
              aria-label={`View ${project.title}`}
            >
              {/* Image banner with gradient overlay */}
              <div className="scroll-stack-image-box">
                <img
                  src={project.image}
                  alt={project.title}
                  className="scroll-stack-img"
                  loading="lazy"
                />
                <div className="scroll-stack-image-gradient" />
              </div>

              {/* Card body matching project pages */}
              <div className="scroll-stack-body">
                <div>
                  <h3 className="scroll-stack-title">{project.title}</h3>
                  <p className="scroll-stack-details">{project.details}</p>
                </div>

                <div className="scroll-stack-bottom-row">
                  <div className="scroll-stack-tech-dotted">
                    {project.tech.map((t) => (
                      <span key={t} className="scroll-stack-chip">
                        <TechIcon name={t} />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>

                  <a
                    href={project.website || project.link}
                    target={project.website?.startsWith('http') ? '_blank' : undefined}
                    rel={project.website?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="scroll-stack-arrow-link"
                    title={`Visit ${project.title}`}
                    aria-label={`Visit ${project.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      play?.('click');
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>

      {/* Explore All Projects button (same style and class as project page, links to /projects/all) */}
      <div className="projects-more-section">
        <a
          href="#/projects/all"
          className="projects-more-button"
          onClick={() => play?.('click')}
          aria-label="Explore all projects"
        >
          <span>Explore all projects</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
