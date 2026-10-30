import React from 'react';
import { usePortfolioData } from '../data/usePortfolioData.js';

/**
 * EducationSection — Matching the header "EDUCATION"
 * Renders educational milestones, university & high school tracks, courses, and active badges.
 */
export default function EducationSection() {
  const { education } = usePortfolioData();

  return (
    <section id="section-education" className="portfolio-section portfolio-education-section">
      <div className="section-container">
        {/* Clean Header: Single tag without duplicate titles */}
        <div className="section-header-block">
          <div className="contact-image-tag">
            <span>EDUCATION</span>
          </div>
        </div>

        {/* Connected Education List with Logos & Connecting Spine */}
        <div className="timeline-connected-list">
          {education.map((item, idx) => (
            <div key={item.id || item.degree} className="timeline-connected-item">
              {/* Left Column: School/College Logo Node & Connecting Line */}
              <div className="timeline-logo-col">
                <div className="timeline-logo-node" title={item.institution}>
                  {typeof item.logo === 'string' && (item.logo.startsWith('http') || item.logo.startsWith('/') || item.logo.startsWith('data:')) ? (
                    <img src={item.logo} alt={item.institution} style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />
                  ) : (
                    item.logo || (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    )
                  )}
                </div>
                {idx < education.length - 1 && <div className="timeline-connecting-spine" />}
              </div>

              {/* Right Column: Education Details */}
              <div className="timeline-content-col">
                <div className="exp-top-row">
                  <div className="exp-company-block">
                    <h3 className="exp-company-name">{item.degree}</h3>
                    <span className="exp-role-title">{item.institution}</span>
                  </div>
                  <div className="exp-period-badge">
                    {item.isCurrent && <span className="edu-now-tag">NOW</span>}
                    <span className="exp-period-text">{item.period}</span>
                  </div>
                </div>

                <p className="exp-clean-desc">{item.desc}</p>

                <div className="exp-skills-row">
                  {item.courses.map((course) => (
                    <span key={course} className="exp-skill-chip">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
