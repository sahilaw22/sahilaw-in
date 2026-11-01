import React from 'react';
import { usePortfolioData } from '../data/usePortfolioData.js';
import { ExperienceCard } from './ExperienceCard.jsx';
import './ExperienceSection.css';

// Experience section rendering interactive featured role cards and view-all CTA
export default function ExperienceSection() {
  const { experiences } = usePortfolioData();

  // Show top featured experiences on the home page
  const featuredList = experiences && experiences.length > 0 ? experiences.slice(0, 2) : [];

  return (
    <section id="section-journey" className="portfolio-section portfolio-journey-section">
      <div className="section-container">
        {/* Clean Section Tag Header */}
        <div className="section-header-block">
          <div className="contact-image-tag">
            <span>EXPERIENCE</span>
          </div>
        </div>

        <div className="sleek-exp-container">
          <div className="sleek-exp-cards-wrapper sleek-exp-featured-deck">
            {featuredList.map((item, idx) => (
              <ExperienceCard
                key={item.company || idx}
                experience={item}
                defaultOpen={idx === 0}
                isFeatured={true}
                isLast={idx === featuredList.length - 1}
              />
            ))}
          </div>

          {/* View all experience button linking to full experience page */}
          <div className="sleek-exp-footer-cta">
            <a href="#/experience" className="sleek-exp-view-all-btn">
              <span>Show all work experiences</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
