import { usePortfolioData } from '../data/usePortfolioData.js';
import { ExperienceCard } from '../components/ExperienceCard.jsx';
import '../components/ExperienceSection.css';
import './ExperiencePage.css';

export default function ExperiencePage() {
  const { experiences } = usePortfolioData();

  return (
    <main className="experience-page">
      <a href="#/" className="custom-back-btn" aria-label="Back to home">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </a>

      <header className="experience-page-header">
        <h1 className="experience-page-title">Work Experience</h1>
        <p className="experience-page-subtitle">
          My work experiences across different companies and roles.
        </p>

        <div className="experience-page-meta-row">
          <span className="experience-count-badge">
            All Experiences ({experiences.length} {experiences.length === 1 ? 'experience' : 'experiences'})
          </span>
        </div>
      </header>

      <section className="experience-page-list" aria-label="All work experiences">
        <div className="sleek-exp-cards-wrapper">
          {experiences.map((exp, idx) => (
            <ExperienceCard
              key={exp.company || idx}
              experience={exp}
              alwaysOpen={true}
              defaultOpen={true}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

