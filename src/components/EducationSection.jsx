import React from 'react';
import { EDUCATION_ITEMS } from '../data/portfolioData.jsx';

/**
 * EducationSection — Matching the header "EDUCATION"
 * Renders educational milestones, university & high school tracks, courses, and active badges.
 */
export default function EducationSection() {
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
          {EDUCATION_ITEMS.map((item, idx) => (
            <div key={item.degree} className="timeline-connected-item">
              {/* Left Column: School/College Logo Node & Connecting Line */}
              <div className="timeline-logo-col">
                <div className="timeline-logo-node" title={item.institution}>
                  {item.logo}
                </div>
                {idx < EDUCATION_ITEMS.length - 1 && <div className="timeline-connecting-spine" />}
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
