import { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { TechIcon } from '../components/TechIcons.jsx';
import OrbitDeck from '../components/ui/OrbitDeck.jsx';
import DetailModal from '../components/DetailModal.jsx';
import LottiePlayer from '../components/ui/LottiePlayer.jsx';
import submarineData from '../assets/submarine.json';
import { usePortfolioData } from '../data/usePortfolioData.js';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/portfolioData.jsx';

function BlocksIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2" />
      <rect x="14" y="2" width="8" height="8" rx="1" />
    </svg>
  );
}

function SmartphoneIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function GlobeIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function CpuIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20v2" />
      <path d="M12 2v2" />
      <path d="M17 20v2" />
      <path d="M17 2v2" />
      <path d="M2 12h2" />
      <path d="M2 17h2" />
      <path d="M2 7h2" />
      <path d="M20 12h2" />
      <path d="M20 17h2" />
      <path d="M20 7h2" />
      <path d="M7 20v2" />
      <path d="M7 2v2" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
    </svg>
  );
}

function RobotArmIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 21 7.5 8.322" />
      <path d="m14 7 1.75-3.767a.5.5 0 0 1 .662-.172L20 5.005" />
      <path d="m20 8.998-3.588 1.944a.5.5 0 0 1-.662-.172L14 7H8" />
      <path d="M3.486 21h10" />
      <path d="M5 21V8.732" />
      <circle cx="6" cy="7" r="2" />
    </svg>
  );
}

const PROJECT_CATEGORIES = [
  { id: 'all', label: 'All', icon: BlocksIcon },
  { id: 'app', label: 'App', icon: SmartphoneIcon },
  { id: 'web', label: 'Web Development', icon: GlobeIcon },
  { id: 'ai-ml', label: 'AI/ML', icon: CpuIcon },
  { id: 'iot', label: 'IoT', icon: RobotArmIcon },
];

function matchesCategory(project, catId) {
  if (catId === 'all') return true;

  const rawCat = (project.category || '').toLowerCase();
  const techList = [
    ...(Array.isArray(project.tech) ? project.tech : []),
    ...(Array.isArray(project.technologies) ? project.technologies : []),
    ...(Array.isArray(project.techFull) ? project.techFull : []),
  ].map((t) => (typeof t === 'string' ? t.toLowerCase() : ''));

  const text = `${project.title || ''} ${project.details || ''} ${project.description || ''}`.toLowerCase();

  if (catId === 'app') {
    return (
      rawCat.includes('app') ||
      rawCat.includes('mobile') ||
      techList.some((t) => t.includes('flutter') || t.includes('react native') || t.includes('dart') || t.includes('android') || t.includes('ios')) ||
      text.includes('mobile app') ||
      text.includes('application')
    );
  }

  if (catId === 'web') {
    return (
      rawCat.includes('web') ||
      rawCat.includes('frontend') ||
      rawCat.includes('fullstack') ||
      rawCat.includes('recreation') ||
      rawCat.includes('design system') ||
      techList.some((t) => t.includes('react') || t.includes('next.js') || t.includes('html') || t.includes('css') || t.includes('javascript') || t.includes('vite')) ||
      text.includes('web') ||
      text.includes('browser')
    );
  }

  if (catId === 'ai-ml') {
    return (
      rawCat.includes('ai') ||
      rawCat.includes('ml') ||
      rawCat.includes('assistant') ||
      rawCat.includes('llm') ||
      techList.some((t) => t.includes('ai') || t.includes('llm') || t.includes('python') || t.includes('gemini') || t.includes('model')) ||
      text.includes('ai') ||
      text.includes('intelligent') ||
      text.includes('language model')
    );
  }

  if (catId === 'iot') {
    return (
      rawCat.includes('iot') ||
      rawCat.includes('hardware') ||
      rawCat.includes('embedded') ||
      rawCat.includes('arduino') ||
      rawCat.includes('esp32') ||
      techList.some((t) => t.includes('iot') || t.includes('arduino') || t.includes('esp') || t.includes('sensors') || t.includes('c++')) ||
      text.includes('iot') ||
      text.includes('hardware') ||
      text.includes('sensor')
    );
  }

  return true;
}

export default function ProjectsPage({ showAll = false }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { projects: dynamicProjects } = usePortfolioData();
  const allProjects = dynamicProjects && dynamicProjects.length > 0 ? dynamicProjects : DEFAULT_PROJECTS;

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => matchesCategory(project, activeCategory));
  }, [allProjects, activeCategory]);

  const projectsToDisplay = showAll ? filteredProjects : allProjects;

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

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
    if (!selectedProject || projectsToDisplay.length === 0) return;
    const currentIdx = projectsToDisplay.findIndex((p) => p.id === selectedProject.id);
    const nextIdx = (currentIdx + 1) % projectsToDisplay.length;
    setSelectedProject(projectsToDisplay[nextIdx]);
  }

  function handlePrevProject() {
    if (!selectedProject || projectsToDisplay.length === 0) return;
    const currentIdx = projectsToDisplay.findIndex((p) => p.id === selectedProject.id);
    const prevIdx = (currentIdx - 1 + projectsToDisplay.length) % projectsToDisplay.length;
    setSelectedProject(projectsToDisplay[prevIdx]);
  }

  const activeCategoryObj = PROJECT_CATEGORIES.find((c) => c.id === activeCategory) || PROJECT_CATEGORIES[0];
  const ActiveIcon = activeCategoryObj.icon;

  const categoryDropdown = (
    <div className="projects-dropdown-wrap" ref={dropdownRef}>
      <button
        type="button"
        className={`projects-dropdown-trigger ${isDropdownOpen ? 'is-open' : ''} cursor-target`}
        data-cursor-label={activeCategoryObj.label}
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        aria-expanded={isDropdownOpen}
        aria-haspopup="listbox"
        aria-label="Filter projects by category"
      >
        <span className="projects-dropdown-trigger-icon" aria-hidden="true">
          <ActiveIcon />
        </span>
        <span className="projects-dropdown-current">{activeCategoryObj.label}</span>
        <ChevronDown size={13} className="projects-dropdown-chevron" aria-hidden="true" />
      </button>

      {isDropdownOpen && (
        <div className="projects-dropdown-menu" role="listbox" aria-label="Project categories">
          {PROJECT_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const ItemIcon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`projects-dropdown-item ${isSelected ? 'is-active' : ''} cursor-target`}
                data-cursor-label={cat.label}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setIsDropdownOpen(false);
                }}
              >
                <span className="projects-dropdown-item-left">
                  <span className="projects-dropdown-item-icon" aria-hidden="true">
                    <ItemIcon />
                  </span>
                  <span className="projects-dropdown-item-label">{cat.label}</span>
                </span>
                {isSelected && (
                  <span className="projects-dropdown-item-meta">
                    <Check size={12} className="projects-dropdown-check" aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  if (showAll) {
    return (
      <main className={`projects-page projects-all-page ${isDropdownOpen ? 'projects-cat-open' : ''}`}>
        <header className="projects-header projects-header-all">
          <h1>Projects</h1>
          <p>My projects and work across different technologies and domains.</p>
          {categoryDropdown}
        </header>

        <div className="projects-all-divider-wrap" aria-hidden="true">
          <div className="projects-all-divider-line" />
        </div>

        <section className="projects-grid">
          {projectsToDisplay.length === 0 ? (
            <div className="projects-empty-category">
              <div className="projects-empty-anim">
                <LottiePlayer animationData={submarineData} loop autoplay />
              </div>
              <h2 className="projects-empty-title">Shippping soon...</h2>
              <p className="projects-empty-sub">
                Cooking up some fresh work in this space. Check back a bit later or explore the rest.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className="projects-empty-btn cursor-target"
                data-cursor-label="All Projects"
              >
                <span>Back to all projects</span>
              </button>
            </div>
          ) : (
            projectsToDisplay.map((project) => {
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
          })
        )}
        </section>

        <DetailModal
          project={selectedProject}
          projectsList={projectsToDisplay}
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
          projects={allProjects}
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
        projectsList={allProjects}
        onClose={() => setSelectedProject(null)}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
      />
    </main>
  );
}
