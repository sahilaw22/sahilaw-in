import { useState, useEffect } from 'react';
import { TechIcon } from '../components/TechIcons.jsx';
import OrbitDeck from '../components/ui/OrbitDeck.jsx';
import DetailModal from '../components/DetailModal.jsx';
import { usePortfolioData } from '../data/usePortfolioData.js';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/portfolioData.jsx';

export default function ProjectsPage({ showAll = false }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const { projects: dynamicProjects } = usePortfolioData();
  const projects = dynamicProjects && dynamicProjects.length > 0 ? dynamicProjects : DEFAULT_PROJECTS;

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
          <a href="#/projects" className="projects-back-link cursor-target" data-cursor-label="Back" aria-label="Back">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </a>
          <h1>Projects</h1>
          <p>My projects and work across different technologies and domains.</p>
        </header>

        <section className="projects-grid">
          {projects.map((project) => {
            const projectTech = Array.isArray(project.tech) ? project.tech : (Array.isArray(project.technologies) ? project.technologies : []);
            const projectLink = project.link || project.website || '#/projects';

            return (
              <article
                key={project.id || project.title}
                className="projects-grid-card od-grid-card cursor-target" data-cursor-label="Details"
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
                  <p className="od-card-details">{project.details || project.description}</p>

                  {projectTech && projectTech.length > 0 && (
                    <div
                      className="od-card-tech-line"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {projectTech.map((t) => (
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
                      className="od-btn-detail cursor-target" data-cursor-label="Details"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                    >
                      View details
                    </button>

                    {projectLink && (
                      <a
                        className="od-visit-btn cursor-target" data-cursor-label="Visit"
                        href={projectLink}
                        target={projectLink.startsWith('http') ? '_blank' : undefined}
                        rel={projectLink.startsWith('http') ? 'noreferrer' : undefined}
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
            );
          })}
        </section>

        <DetailModal
          project={selectedProject}
          projectsList={projects}
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
          <a className="projects-more-button cursor-target" data-cursor-label="View All" href="#/projects/all">
            <span>Explore all projects</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </section>

      <DetailModal
        project={selectedProject}
        projectsList={projects}
        onClose={() => setSelectedProject(null)}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
      />
    </main>
  );
}
