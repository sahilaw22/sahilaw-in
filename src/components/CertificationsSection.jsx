import React, { useState } from 'react';
import { usePortfolioData } from '../data/usePortfolioData.js';
import { CERTIFICATIONS, ACHIEVEMENTS } from '../data/portfolioData.jsx';
import './CertificationsSection.css';

const INITIAL_LIMIT = 4;

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
          {visibleItems.map((item, idx) => {
            const logoSrc = item.image || item.logo;
            const isImageLogo = typeof logoSrc === 'string' && (logoSrc.startsWith('data:') || logoSrc.startsWith('http') || logoSrc.startsWith('/'));

            return (
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
                    {isImageLogo ? (
                      <img
                        src={logoSrc}
                        alt=""
                        aria-hidden="true"
                        style={{ width: '22px', height: '22px', objectFit: 'contain', borderRadius: '4px' }}
                      />
                    ) : (
                      item.icon || (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="7" />
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                        </svg>
                      )
                    )}
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
            );
          })}
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
