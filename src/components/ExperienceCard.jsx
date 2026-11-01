import React, { useState } from 'react';
import './ExperienceSection.css';

const parseDescription = (text) => {
  if (typeof text !== 'string') return '';
  return text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
};

const formatTimelineDate = (exp) => {
  if (!exp) return '';
  const monthMap = {
    jan: 'January', feb: 'February', mar: 'March', apr: 'April',
    may: 'May', jun: 'June', jul: 'July', aug: 'August',
    sep: 'September', oct: 'October', nov: 'November', dec: 'December'
  };

  const cleanPart = (str) => {
    if (!str) return '';
    const trimmed = str.trim();
    if (/^present$/i.test(trimmed)) return 'Present';
    const match = trimmed.match(/^([a-zA-Z]+)\s*(\d{4})?$/);
    if (match) {
      const monthPrefix = match[1].toLowerCase().slice(0, 3);
      const fullMonth = monthMap[monthPrefix] || (match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase());
      const year = match[2] || '';
      return year ? `${fullMonth} ${year}` : fullMonth;
    }
    return trimmed;
  };

  let start = exp.startDate || '';
  let end = exp.endDate || '';

  if (!start && exp.period) {
    const parts = exp.period.split(/[-–—]/);
    start = parts[0]?.trim();
    end = parts[1]?.trim();
  }

  const cleanStart = cleanPart(start);
  const cleanEnd = exp.isCurrent ? 'Present' : cleanPart(end);

  if (cleanStart && cleanEnd) {
    return `${cleanStart} - ${cleanEnd}`;
  }
  return cleanStart || cleanEnd || exp.period || '';
};

export function ExperienceCard({
  experience,
  alwaysOpen = false,
  defaultOpen = false,
  isFeatured = false,
  isLast = false,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isExpanded = alwaysOpen || isOpen;

  const toggleOpen = (e) => {
    e.stopPropagation();
    if (!alwaysOpen) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleCardClick = () => {
    if (!alwaysOpen) {
      setIsOpen((prev) => !prev);
    }
  };

  const descriptionList = Array.isArray(experience.description)
    ? experience.description
    : experience.desc
    ? [experience.desc]
    : [];

  const skillsList = experience.technologies || experience.skills || [];

  const dateRange = formatTimelineDate(experience);

  let locationText = experience.location || '';
  if (locationText.toLowerCase() === 'remote') {
    locationText = '(Remote)';
  }

  return (
    <article
      className={`sleek-exp-card ${isExpanded ? 'is-expanded' : ''} ${isFeatured ? 'is-featured' : ''}`}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleOpen(e);
        }
      }}
    >
      {/* Vertical spine line */}
      {!isLast && (
        <div className="sleek-exp-connecting-line" aria-hidden="true" />
      )}

      {/* Main card header */}
      <div className="sleek-exp-main-row">
        {/* Company logo */}
        <div className="sleek-exp-logo-wrap">
          {experience.image ? (
            <img
              src={experience.image}
              alt={experience.company || 'Company logo'}
              className="sleek-exp-logo-img"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextSibling) {
                  e.currentTarget.nextSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div
            className="sleek-exp-logo-fallback"
            style={{ display: experience.image ? 'none' : 'flex' }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
        </div>

        {/* Details: Row 1 (Company + Date) and Row 2 (Role + Location) */}
        <div className="sleek-exp-details-col">
          <div className="sleek-exp-top-row">
            <div className="sleek-exp-title-row">
              <h3 className="sleek-exp-company-name">{experience.company}</h3>

              {/* Accordion toggle */}
              {!alwaysOpen && (
                <button
                  type="button"
                  onClick={toggleOpen}
                  className={`sleek-exp-toggle-btn ${isExpanded ? 'is-rotated' : ''}`}
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              )}

              {/* Current role indicator */}
              {experience.isCurrent && (
                <div className="sleek-exp-working-badge">
                  <span className="sleek-exp-pulse-dot" />
                  <span>Working</span>
                </div>
              )}

              <div className="sleek-exp-social-links" onClick={(e) => e.stopPropagation()}>
                {experience.website && (
                  <a href={experience.website} target="_blank" rel="noreferrer noopener" className="sleek-exp-icon-btn" title="Visit Website">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </a>
                )}
                {experience.github && (
                  <a href={experience.github} target="_blank" rel="noreferrer noopener" className="sleek-exp-icon-btn" title="GitHub">
                    <svg viewBox="0 0 256 256" width="14" height="14" fill="currentColor">
                      <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z" />
                    </svg>
                  </a>
                )}
                {experience.linkedin && (
                  <a href={experience.linkedin} target="_blank" rel="noreferrer noopener" className="sleek-exp-icon-btn" title="LinkedIn">
                    <svg viewBox="0 0 256 256" width="14" height="14" fill="currentColor">
                      <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z" />
                    </svg>
                  </a>
                )}
                {experience.x && (
                  <a href={experience.x} target="_blank" rel="noreferrer noopener" className="sleek-exp-icon-btn" title="X">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <span className="sleek-exp-date-text">{dateRange}</span>
          </div>

          <div className="sleek-exp-bottom-row">
            <p className="sleek-exp-position-text">
              {experience.position || experience.role}
            </p>
            {locationText && (
              <span className="sleek-exp-location-text">{locationText}</span>
            )}
          </div>
        </div>
      </div>

      {/* Expandable details */}
      <div className={`sleek-exp-accordion ${isExpanded ? 'is-open' : ''}`}>
        <div className="sleek-exp-accordion-inner">
          {/* Skills */}
          {skillsList && skillsList.length > 0 && (
            <div className="sleek-exp-tech-section">
              <h4 className="sleek-exp-tech-heading">Skills</h4>
              <div className="sleek-exp-tech-list">
                {skillsList.map((tech, idx) => {
                  const name = typeof tech === 'string' ? tech : tech.name;
                  const href = typeof tech === 'object' ? tech.href : null;
                  return href ? (
                    <a
                      key={idx}
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="sleek-exp-tech-chip skill-inner-shadow"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{name}</span>
                    </a>
                  ) : (
                    <span key={idx} className="sleek-exp-tech-chip skill-inner-shadow">
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description Bullets */}
          {descriptionList && descriptionList.length > 0 && (
            <div className="sleek-exp-desc-list">
              {descriptionList.map((desc, idx) => (
                <p
                  key={idx}
                  className="sleek-exp-desc-bullet-row"
                  dangerouslySetInnerHTML={{
                    __html: `• ${parseDescription(desc)}`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
