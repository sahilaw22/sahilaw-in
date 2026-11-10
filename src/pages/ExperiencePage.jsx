import { usePortfolioData } from '../data/usePortfolioData.js';
import { ExperienceCard } from '../components/ExperienceCard.jsx';
import '../components/ExperienceSection.css';
import './ExperiencePage.css';

export default function ExperiencePage() {
  const { experiences } = usePortfolioData();

  return (
    <main className="experience-page">
      <header className="experience-page-header">
        <h1 className="experience-page-title">Work Experience</h1>
        <p className="experience-page-subtitle">
          My work experiences across different companies and roles.
        </p>

        <div className="experience-page-meta-row">
          <span className="experience-count-badge">
            <span className="experience-count-label">All Experiences</span>
            <span className="experience-count-number">({experiences.length} {experiences.length === 1 ? 'experience' : 'experiences'})</span>
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
              isLast={idx === experiences.length - 1}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

