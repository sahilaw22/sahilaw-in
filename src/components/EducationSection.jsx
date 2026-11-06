import React from 'react';
import { usePortfolioData } from '../data/usePortfolioData.js';

// Education section with institution nodes, coursework, and credentials
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
          {education.map((item, idx) => {
            const imgSrc =
              (typeof item.image === 'string' && item.image) ||
              (typeof item.logo === 'string' &&
                (item.logo.startsWith('http') || item.logo.startsWith('/') || item.logo.startsWith('data:'))
                ? item.logo
                : null);

            const coursesList = item.courses || item.highlights || [];
            const descText = item.desc || item.description_paragraph || '';

            return (
              <div key={item.id || item.degree} className="timeline-connected-item">
                {/* Left Column: School/College Logo Node & Connecting Line */}
                <div className="timeline-logo-col">
                  <div
                    className={`timeline-logo-node ${imgSrc ? 'has-clean-logo' : ''}`}
                    title={item.institution}
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.institution}
                        className="timeline-logo-img-clean"
                        loading="lazy"
                      />
                    ) : React.isValidElement(item.logo) ? (
                      item.logo
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
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

                  {descText && <p className="exp-clean-desc">{descText}</p>}

                  {coursesList && coursesList.length > 0 && (
                    <div className="exp-skills-row">
                      {coursesList.map((course) => (
                        <span key={course} className="exp-skill-chip">
                          {course}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
