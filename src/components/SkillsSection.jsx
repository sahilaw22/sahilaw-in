import React from 'react';
import { TechIcon } from './TechIcons.jsx';
import { SKILL_CATEGORIES } from '../data/portfolioData.jsx';

/**
 * SkillsSection — Matching the header "SKILLS"
 * Renders categorized skills with technical badges and icons.
 */
export default function SkillsSection() {
  return (
    <section id="section-skills" className="portfolio-section portfolio-skills-section">
      <div className="section-container">
        {/* Clean Header: Single tag without duplicate titles */}
        <div className="section-header-block">
          <div className="contact-image-tag">
            <span>SKILLS</span>
          </div>
        </div>

        {/* Clean Skills Grouping using Project Techstack Pills */}
        <div className="skills-clean-container">
          {SKILL_CATEGORIES.map((group) => (
            <div key={group.category} className="skills-clean-group">
              <h3 className="skills-group-title">{group.category}</h3>
              <div className="skills-pills-wrap">
                {group.skills.map((skill) => (
                  <span key={skill} className="od-tech-pill skill-pill-item">
                    <TechIcon name={skill} size={14} />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
