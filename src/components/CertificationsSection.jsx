import React, { useState } from 'react';
import { CERTIFICATIONS, ACHIEVEMENTS } from '../data/portfolioData.jsx';
import './CertificationsSection.css';

/**
 * CertificationsSection
 * Supports interactive tab switching between verified Certifications and Achievements
 * with the exact same clean, minimal list design.
 */
export default function CertificationsSection({ play }) {
  const [activeTab, setActiveTab] = useState('certifications');

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    play?.('click');
  };

  const currentItems = activeTab === 'certifications' ? CERTIFICATIONS : ACHIEVEMENTS;

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
              <span className="cert-tab-counter">{CERTIFICATIONS.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'achievements'}
              className={`cert-switch-tab-btn ${activeTab === 'achievements' ? 'is-active' : ''}`}
              onClick={() => handleTabSwitch('achievements')}
            >
              <span>Achievements</span>
              <span className="cert-tab-counter">{ACHIEVEMENTS.length}</span>
            </button>
          </div>
        </div>

        {/* Clean Minimal List for Both Tabs */}
        <div className="certifications-clean-list" role="tabpanel" aria-label={activeTab}>
          {currentItems.map((item) => (
            <a
              key={item.title}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-clean-row"
              title={`View ${item.title}`}
              onClick={() => play?.('click')}
            >
              <div className="cert-row-left">
                <div className="cert-clean-icon">
                  {item.icon}
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
      </div>
    </section>
  );
}
