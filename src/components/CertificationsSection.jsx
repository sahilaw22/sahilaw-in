import React, { useState } from 'react';
import { usePortfolioData } from '../data/usePortfolioData.js';
import { CERTIFICATIONS, ACHIEVEMENTS } from '../data/portfolioData.jsx';
import './CertificationsSection.css';

const INITIAL_LIMIT = 4;

function renderCertIcon(item) {
  const logoSrc = item.image || item.logo;
  if (typeof logoSrc === 'string' && (logoSrc.startsWith('data:') || logoSrc.startsWith('http') || logoSrc.startsWith('/'))) {
    return (
      <img
        src={logoSrc}
        alt=""
        aria-hidden="true"
        style={{ width: '22px', height: '22px', objectFit: 'contain', borderRadius: '4px' }}
      />
    );
  }

  // If item.icon is a valid React element, render it safely
  if (React.isValidElement(item.icon)) {
    return item.icon;
  }

  const titleLower = (item.title || '').toLowerCase();
  const issuerLower = (item.issuer || '').toLowerCase();

  if (issuerLower.includes('google') || titleLower.includes('google cloud')) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4" />
      </svg>
    );
  }
  if (issuerLower.includes('kaggle') || titleLower.includes('kaggle') || titleLower.includes('ai agents')) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#20BEFF">
        <path d="M18.825 21.999h-3.414l-5.029-7.142-2.122 2.039v5.103H5.21V2h3.05v12.24l6.903-7.239h3.693l-6.19 6.273 6.159 8.725z"/>
      </svg>
    );
  }
  if (issuerLower.includes('ibm') || titleLower.includes('ibm')) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#052FAD" strokeWidth="2.4">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="3" y1="14" x2="21" y2="14"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    );
  }
  if (issuerLower.includes('hp') || titleLower.includes('hp')) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#0096D6" strokeWidth="2.2" />
        <path d="M9 16V8l3 3 3-3v8" stroke="#0096D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (titleLower.includes('hacktoberfest')) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.2l6 3v9.6l-6 3-6-3V7.2l6-3z" fill="#FF7A59" />
        <path d="M12 7l-4 4 1.4 1.4L11 10.8V17h2v-6.2l1.6 1.6L16 11l-4-4z" fill="#FF7A59" />
      </svg>
    );
  }
  if (titleLower.includes('holopin') || titleLower.includes('badge')) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#f59e0b" />
      </svg>
    );
  }
  if (issuerLower.includes('girlscript') || titleLower.includes('gssoc')) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <rect width="24" height="24" rx="5" fill="#f97316" />
        <path d="M7 12l3.5 3.5L17 8.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (titleLower.includes('unstop') || titleLower.includes('streak') || titleLower.includes('problem solving')) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }
  if (titleLower.includes('innovator') || titleLower.includes('ideathon') || titleLower.includes('youth')) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    );
  }

  // Fallback badge icon
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

/**
 * CertificationsSection
 * Supports interactive tab switching between verified Certifications and Achievements
 * with dynamic portfolio data sync and a "See all" button when list exceeds initial limit.
 */
export default function CertificationsSection({ play }) {
  const [activeTab, setActiveTab] = useState('certifications');
  const [showAll, setShowAll] = useState(false);
  const { certifications, achievements } = usePortfolioData();

  const certList = certifications && certifications.length > 0 ? certifications : CERTIFICATIONS;
  const achieveList = achievements && achievements.length > 0 ? achievements : ACHIEVEMENTS;

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setShowAll(false);
    play?.('click');
  };

  const currentItems = activeTab === 'certifications' ? certList : achieveList;
  const hasMore = currentItems.length > INITIAL_LIMIT;
  const visibleItems = showAll ? currentItems : currentItems.slice(0, INITIAL_LIMIT);

  return (
    <section id="section-certifications" className="portfolio-section portfolio-certifications-section">
      <div className="section-container">
        {/* Centered Switcher Tabs (normal text, no extra uppercase header) */}
        <div className="cert-achieve-tabs-center">
          <div className="cert-achieve-switcher" role="tablist" aria-label="Certifications and achievements">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'certifications'}
              className={`cert-switch-tab-btn ${activeTab === 'certifications' ? 'is-active' : ''}`}
              onClick={() => handleTabSwitch('certifications')}
            >
              <span>Certifications</span>
              <span className="cert-tab-counter">{certList.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'achievements'}
              className={`cert-switch-tab-btn ${activeTab === 'achievements' ? 'is-active' : ''}`}
              onClick={() => handleTabSwitch('achievements')}
            >
              <span>Achievements</span>
              <span className="cert-tab-counter">{achieveList.length}</span>
            </button>
          </div>
        </div>

        {/* Clean Minimal List for Both Tabs */}
        <div className="certifications-clean-list" role="tabpanel" aria-label={activeTab}>
          {visibleItems.map((item, idx) => (
            <a
              key={item.id || item.title || idx}
              href={item.link || '#'}
              target={item.link ? '_blank' : undefined}
              rel={item.link ? 'noopener noreferrer' : undefined}
              className="cert-clean-row"
              title={`View ${item.title}`}
              onClick={() => play?.('click')}
            >
              <div className="cert-row-left">
                <div className="cert-clean-icon">
                  {renderCertIcon(item)}
                </div>
                <div className="cert-clean-text">
                  <span className="cert-clean-title">{item.title}</span>
                  <span className="cert-clean-issuer">{item.issuer}</span>
                  {item.description && (
                    <p className="cert-clean-desc">{item.description}</p>
                  )}
                </div>
              </div>

              <div className="cert-row-right">
                <span className="cert-clean-year">{activeTab === 'certifications' ? (item.issueDate || item.year) : item.year}</span>
                <svg
                  className="cert-row-arrow"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* See All / Show Less Button when items exceed limit */}
        {hasMore && (
          <div className="cert-see-all-wrap">
            <button
              type="button"
              className="cert-see-all-btn"
              onClick={() => {
                setShowAll((prev) => !prev);
                play?.('click');
              }}
              aria-label={showAll ? 'Show fewer items' : `See all ${currentItems.length} items`}
            >
              <span>{showAll ? 'Show less' : `See all ${activeTab === 'certifications' ? 'certifications' : 'achievements'} (${currentItems.length})`}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: showAll ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
