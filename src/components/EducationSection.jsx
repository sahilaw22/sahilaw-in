import React, { useState } from 'react';
import { usePortfolioData } from '../data/usePortfolioData.js';
import { EDUCATION_ITEMS } from '../data/portfolioData.jsx';
import './EducationSection.css';

export default function EducationSection({ play }) {
  const { education: dynamicEdu } = usePortfolioData();
  const rawList = dynamicEdu && dynamicEdu.length > 0 ? dynamicEdu : EDUCATION_ITEMS;

  // Reverse Chronological order: 2024 (B.Tech, CSE · NOW) -> 2021 (Higher Secondary)
  const items = React.useMemo(() => {
    return [...rawList].sort((a, b) => {
      const getYear = (item) => {
        const p = String(item.period || item.year || '');
        const match = p.match(/\b(19\d\d|20\d\d)\b/);
        return match ? parseInt(match[1], 10) : 0;
      };
      return getYear(b) - getYear(a);
    });
  }, [rawList]);

  // Default to the current/active education milestone (2024 at index 0)
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentItem = items[selectedIndex] || items[0] || {};

  const handleSelectMilestone = (idx) => {
    if (idx !== selectedIndex) {
      play?.('click');
      setSelectedIndex(idx);
    }
  };

  if (!items || items.length === 0) return null;

  const renderEduCard = (eduItem) => {
    if (!eduItem) return null;
    const itemImgSrc =
      (typeof eduItem.image === 'string' && eduItem.image) ||
      (typeof eduItem.logo === 'string' &&
        (eduItem.logo.startsWith('http') || eduItem.logo.startsWith('/') || eduItem.logo.startsWith('data:'))
        ? eduItem.logo
        : null);
    const itemCourses = eduItem.courses || eduItem.highlights || [];
    const itemDesc = eduItem.desc || eduItem.description_paragraph || '';

    return (
      <div className="timeline-connected-item edu-minimal-item">
        {/* Left Column: School/College Clean Logo Node */}
        <div className="timeline-logo-col">
          <div
            className={`timeline-logo-node ${itemImgSrc ? 'has-clean-logo' : ''}`}
            title={eduItem.institution}
          >
            {itemImgSrc ? (
              <img
                src={itemImgSrc}
                alt={eduItem.institution}
                className="timeline-logo-img-clean"
                loading="lazy"
              />
            ) : React.isValidElement(eduItem.logo) ? (
              eduItem.logo
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="#ff4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            )}
          </div>
        </div>

        {/* Right Column: Education Details - Clean Minimal Card without orange borders */}
        <div className="timeline-content-col">
          <div className="exp-top-row">
            <div className="exp-company-block">
              <h3 className="exp-company-name">{eduItem.degree}</h3>
              <span className="exp-role-title">{eduItem.institution}</span>
            </div>
            {/* Suitable Place for Timeline Period inside Card */}
            <div className="edu-card-period-wrap">
              {eduItem.isCurrent && <span className="edu-now-tag">NOW</span>}
              <span className="exp-period-text">{eduItem.period}</span>
            </div>
          </div>

          {itemDesc && <p className="exp-clean-desc">{itemDesc}</p>}

          {itemCourses && itemCourses.length > 0 && (
            <div className="exp-skills-row">
              {itemCourses.map((course) => (
                <span key={course} className="exp-skill-chip">
                  {course}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="section-education" className="portfolio-section portfolio-education-section">
      <div className="section-container">
        {/* Clean Header: Single tag matching site typography */}
        <div className="section-header-block">
          <div className="contact-image-tag">
            <span>EDUCATION</span>
          </div>
        </div>

        <div className="edu-expert-wrap">
          {/* Transparent Panel Timeline with 4-Panel Timeline Style Up/Down Lines */}
          <div className="edu-panel-timeline" role="tablist" aria-label="Education Milestones">
            {items.map((item, idx) => {
              const isActive = idx === selectedIndex;
              const yearStr =
                item.period && item.period.includes('-')
                  ? item.period.split('-')[0].trim()
                  : item.year || (idx === 0 ? '2024' : '2021');

              return (
                <button
                  key={item.id || item.degree || idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`edu-tl-item ${isActive ? 'is-active' : 'is-inactive'} cursor-target`}
                  data-cursor-label={yearStr}
                  onClick={() => handleSelectMilestone(idx)}
                >
                  {/* Year with Same Up & Down Line Design from 4-Panel CSS Reference */}
                  <div className="tl-year edu-tl-year">
                    <p className="edu-tl-year-text">{yearStr}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* HR Divider Line: Exact gradient line from Project All Page */}
          <div className="edu-divider-wrap" aria-hidden="true">
            <div className="edu-divider-line" />
          </div>

          {/* Bottom Card: Appears on Click with Smooth Transition */}
          <div className="timeline-connected-list edu-minimal-display-wrap" key={selectedIndex}>
            {renderEduCard(currentItem)}
          </div>
        </div>
      </div>
    </section>
  );
}
