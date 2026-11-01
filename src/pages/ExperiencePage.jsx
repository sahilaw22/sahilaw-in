import { useState } from 'react';
import { usePortfolioData } from '../data/usePortfolioData.js';
import { ExperienceCard } from '../components/ExperienceCard.jsx';
import '../components/ExperienceSection.css';
import './ExperiencePage.css';

export default function ExperiencePage() {
  const { experiences } = usePortfolioData();
  const [expandAll, setExpandAll] = useState(true);

  return (
    <main className="experience-page">
      <a href="#/" className="custom-back-btn" aria-label="Back to home">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </a>

      <header className="experience-page-header">
        <div className="experience-page-tag">
          <span>EXPERIENCE</span>
        </div>
        <h1 className="experience-page-title">Work Experience</h1>
        <p className="experience-page-subtitle">
          My professional roles, engineering internships, and product contributions across teams.
        </p>

        <div className="experience-page-meta-row">
          <span className="experience-count-badge">
            {experiences.length} {experiences.length === 1 ? 'Experience' : 'Experiences'}
          </span>
          <button
            type="button"
            onClick={() => setExpandAll((prev) => !prev)}
            className="experience-toggle-all-btn"
          >
            {expandAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </header>

      <section className="experience-page-list" aria-label="All work experiences">
        <div className="sleek-exp-cards-wrapper">
          {experiences.map((exp, idx) => (
            <ExperienceCard
              key={exp.company || idx}
              experience={exp}
              alwaysOpen={false}
              defaultOpen={expandAll}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
