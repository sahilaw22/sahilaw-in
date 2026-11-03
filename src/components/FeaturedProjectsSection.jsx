import React, { useState } from 'react';
import { ScrollStack, ScrollStackItem } from './ui/ScrollStack.jsx';
import { TechIcon } from './TechIcons.jsx';
import DetailModal from './DetailModal.jsx';
import { usePortfolioData } from '../data/usePortfolioData.js';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/portfolioData.jsx';
import './FeaturedProjectsSection.css';

export default function FeaturedProjectsSection({ play }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const { projects: dynamicProjects } = usePortfolioData();
  const projectsList = (dynamicProjects && dynamicProjects.length > 0 ? dynamicProjects : DEFAULT_PROJECTS).filter(
    (item) => item.isFeatured !== false
  );

  function handleNextProject() {
    if (!selectedProject) return;
    const currentIdx = projectsList.findIndex((p) => p.id === selectedProject.id);
    const nextIdx = (currentIdx + 1) % projectsList.length;
    setSelectedProject(projectsList[nextIdx]);
  }

  function handlePrevProject() {
    if (!selectedProject) return;
    const currentIdx = projectsList.findIndex((p) => p.id === selectedProject.id);
    const prevIdx = (currentIdx - 1 + projectsList.length) % projectsList.length;
    setSelectedProject(projectsList[prevIdx]);
  }

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
        footer={
          <div className="projects-more-section">
            <a
              href="#/projects/all"
              className="projects-more-button cursor-target" data-cursor-label="View All"
              onClick={() => play?.('click')}
              aria-label="Explore all projects"
            >
              <span>Explore all projects</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        }
      >
        {projectsList.map((project, idx) => {
          const externalUrl = project.website || project.github || project.link;
          const techList = Array.isArray(project.tech) ? project.tech : (Array.isArray(project.technologies) ? project.technologies : []);

          return (
            <ScrollStackItem
              key={project.id || idx}
              index={idx}
            >
              <div
                className="scroll-stack-card cursor-target" data-cursor-label="Details"
                role="button"
                tabIndex={0}
                onClick={() => {
                  play?.('click');
                  setSelectedProject(project);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    play?.('click');
                    setSelectedProject(project);
                  }
                }}
                aria-label={`View details for ${project.title}`}
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
                    <p className="scroll-stack-details">{project.details || project.description}</p>
                  </div>

                  <div className="scroll-stack-bottom-row">
                    <div className="scroll-stack-tech-dotted">
                      {techList.map((t) => (
                        <span key={t} className="scroll-stack-chip">
                          <TechIcon name={t} />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>

                    {externalUrl && (
                      <a
                        href={externalUrl}
                        target={externalUrl.startsWith('http') ? '_blank' : undefined}
                        rel={externalUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="od-visit-btn scroll-stack-visit-btn cursor-target"
                        data-cursor-label="Visit"
                        aria-label={`Visit ${project.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          play?.('click');
                        }}
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
                          aria-hidden="true"
                        >
                          <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          );
        })}
      </ScrollStack>

      <DetailModal
        project={selectedProject}
        projectsList={projectsList}
        onClose={() => setSelectedProject(null)}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
      />
    </section>
  );
}
