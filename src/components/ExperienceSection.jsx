import React from 'react';
import { EXPERIENCES } from '../data/portfolioData.jsx';

/**
 * ExperienceSection — Matching the header "EXPERIENCE"
 * Renders connected experience nodes with company logos, connecting spine, and technical tags.
 */
export default function ExperienceSection() {
  return (
    <section id="section-journey" className="portfolio-section portfolio-journey-section">
      <div className="section-container">
        {/* Clean Header: Single tag matching section */}
        <div className="section-header-block">
          <div className="contact-image-tag">
            <span>EXPERIENCE</span>
          </div>
        </div>

        {/* Connected Experience List with Logos & Connecting Spine */}
        <div className="timeline-connected-list">
          {EXPERIENCES.map((item, idx) => (
            <div key={item.company} className="timeline-connected-item">
              {/* Left Column: Logo Node & Connecting Line */}
              <div className="timeline-logo-col">
                <div className="timeline-logo-node" title={item.company}>
                  {item.logo}
                </div>
                {idx < EXPERIENCES.length - 1 && <div className="timeline-connecting-spine" />}
              </div>

              {/* Right Column: Experience Details */}
              <div className="timeline-content-col">
                <div className="exp-top-row">
                  <div className="exp-company-block">
                    <h3 className="exp-company-name">{item.company}</h3>
                    <span className="exp-role-title">{item.role}</span>
                  </div>
                  <div className="exp-period-badge">
                    {item.isCurrent && <span className="exp-now-tag">NOW</span>}
                    <span className="exp-period-text">{item.period}</span>
                  </div>
                </div>

                <p className="exp-clean-desc">{item.desc}</p>

                <div className="exp-skills-row">
                  {item.skills.map((skill) => (
                    <span key={skill} className="exp-skill-chip">
                      {skill}
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
