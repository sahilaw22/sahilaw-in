import React from 'react';
import { TechIcon } from './TechIcons.jsx';
import { usePortfolioData } from '../data/usePortfolioData.js';

// Skills section displaying categorized technology badges
export default function SkillsSection() {
  const { skills } = usePortfolioData();

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
          {skills.map((group) => (
            <div key={group.id || group.category} className="skills-clean-group">
              <h3 className="skills-group-title">{group.category}</h3>
              <div className="skills-pills-wrap">
                {group.skills.map((skillItem, sIdx) => {
                  const skillName = typeof skillItem === 'string' ? skillItem : skillItem?.name || '';
                  const customIcon = typeof skillItem === 'object' ? (skillItem?.logo || skillItem?.iconUrl || skillItem?.icon) : null;
                  if (!skillName) return null;

                  return (
                    <span key={skillName + sIdx} className="od-tech-pill skill-pill-item">
                      {customIcon ? (
                        <img
                          src={customIcon}
                          alt={skillName}
                          style={{ width: 14, height: 14, objectFit: 'contain', borderRadius: 2 }}
                        />
                      ) : (
                        <TechIcon name={skillName} size={14} />
                      )}
                      <span>{skillName}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
