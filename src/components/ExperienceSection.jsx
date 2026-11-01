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
              <span>View all experience</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
