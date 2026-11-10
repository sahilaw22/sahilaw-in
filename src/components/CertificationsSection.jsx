import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '7px' }}
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

function getHoverPosition(rect) {
  if (!rect || typeof window === 'undefined') return { top: 0, left: 0 };
  const approxWidth = 420;
  const approxHeight = 280;
  const padding = 16;

  const centerX = rect.left + rect.width / 2;
  const left = Math.max(padding, Math.min(centerX - approxWidth / 2, window.innerWidth - approxWidth - padding));

  const spaceAbove = rect.top >= approxHeight + padding;
  const top = spaceAbove
    ? rect.top - approxHeight - 12
    : Math.min(rect.bottom + 12, window.innerHeight - approxHeight - padding);

  return { top, left };
}

/**
 * CertificationsSection
 * Supports interactive tab switching between verified Certifications and Achievements
 * with dynamic portfolio data sync and a "See all" button when list exceeds initial limit.
 */
export default function CertificationsSection({ play }) {
  const [activeTab, setActiveTab] = useState('certifications');
  const [showAll, setShowAll] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // { item, images, activeIdx }
  const [hoverPreview, setHoverPreview] = useState(null); // { item, images, currentIdx, rect }
  const switcherRef = useRef(null);
  const { certifications, achievements } = usePortfolioData();

  const certList = certifications && certifications.length > 0 ? certifications : CERTIFICATIONS;
  const achieveList = achievements && achievements.length > 0 ? achievements : ACHIEVEMENTS;

  // Lock background scroll when preview modal is open, exit on Escape key
  useEffect(() => {
    if (!activeModal) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.classList.add('cert-preview-active');
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModal(null);
    };

    const handleWheelOrTouch = (e) => {
      const card = document.getElementById('cert-preview-modal-card');
      if (card && card.contains(e.target)) {
        if (card.scrollHeight > card.clientHeight) return;
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheelOrTouch, { passive: false });
    window.addEventListener('touchmove', handleWheelOrTouch, { passive: false });

    return () => {
      document.body.classList.remove('cert-preview-active');
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheelOrTouch);
      window.removeEventListener('touchmove', handleWheelOrTouch);
    };
  }, [activeModal]);

  // Dismiss hover preview on window scroll or resize
  useEffect(() => {
    if (!hoverPreview) return;
    const handleDismiss = () => setHoverPreview(null);
    window.addEventListener('scroll', handleDismiss, { passive: true });
    window.addEventListener('resize', handleDismiss, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleDismiss);
      window.removeEventListener('resize', handleDismiss);
    };
  }, [hoverPreview]);

  const handleOpenPreview = (e, item, images, activeIdx = 0) => {
    e.preventDefault();
    e.stopPropagation();
    setHoverPreview(null);
    play?.('click');
    setActiveModal({ item, images, activeIdx });
  };

  const handleThumbMouseEnter = (e, item, images, currentIdx = 0) => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (activeModal) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPreview({
      item,
      images,
      currentIdx,
      rect: {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height,
      },
    });
  };

  const handleThumbMouseLeave = () => {
    setHoverPreview(null);
  };

  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return;
    const prevTop = switcherRef.current?.getBoundingClientRect().top;

    setActiveTab(tab);
    setShowAll(false);
    play?.('click');

    if (prevTop !== undefined) {
      requestAnimationFrame(() => {
        const newTop = switcherRef.current?.getBoundingClientRect().top;
        if (newTop !== undefined) {
          const delta = newTop - prevTop;
          if (Math.abs(delta) > 0.5) {
            window.scrollBy({ top: delta, behavior: 'instant' });
          }
        }
      });
    }
  };

  const currentItems = activeTab === 'certifications' ? certList : achieveList;
  const hasMore = currentItems.length > INITIAL_LIMIT;
  const visibleItems = showAll ? currentItems : currentItems.slice(0, INITIAL_LIMIT);

  return (
    <section id="section-certifications" className="portfolio-section portfolio-certifications-section">
      <div className="section-container">
        {/* Centered Switcher Tabs (normal text, no extra uppercase header) */}
        <div className="cert-achieve-tabs-center">
          <div ref={switcherRef} className="cert-achieve-switcher" role="tablist" aria-label="Certifications and achievements">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'certifications'}
              className={`cert-switch-tab-btn cursor-target ${activeTab === 'certifications' ? 'is-active' : ''}`} data-cursor-label="Certifications"
              onClick={() => handleTabSwitch('certifications')}
            >
              <span>Certifications</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'achievements'}
              className={`cert-switch-tab-btn cursor-target ${activeTab === 'achievements' ? 'is-active' : ''}`} data-cursor-label="Achievements"
              onClick={() => handleTabSwitch('achievements')}
            >
              <span>Achievements</span>
            </button>
          </div>
        </div>

        {/* Clean Minimal List for Both Tabs */}
        <div className="certifications-clean-list" role="tabpanel" aria-label={activeTab}>
          {visibleItems.map((item, idx) => {
            const certImg = activeTab === 'certifications'
              ? ((item.certificateImage && typeof item.certificateImage === 'string' && item.certificateImage.trim() && !item.certificateImage.includes('unsplash.com') && !item.certificateImage.includes('placeholder'))
                  ? item.certificateImage.trim()
                  : ((item.certificate_image_url && typeof item.certificate_image_url === 'string' && item.certificate_image_url.trim() && !item.certificate_image_url.includes('unsplash.com') && !item.certificate_image_url.includes('placeholder'))
                      ? item.certificate_image_url.trim()
                      : null))
              : null;
            const rawPhotos = activeTab === 'achievements'
              ? (Array.isArray(item.photos) && item.photos.length > 0
                  ? item.photos
                  : ((item.certificateImage && typeof item.certificateImage === 'string' && item.certificateImage.trim()) ||
                     (item.certificate_image_url && typeof item.certificate_image_url === 'string' && item.certificate_image_url.trim()))
                  ? [item.certificateImage || item.certificate_image_url]
                  : [])
              : [];
            const photos = rawPhotos.filter((p) => p && typeof p === 'string' && !p.includes('unsplash.com') && !p.includes('placeholder'));
            const images = activeTab === 'certifications' ? (certImg ? [certImg] : []) : photos;
            const hasMedia = images.length > 0;
            const issueDateDisplay = activeTab === 'certifications' ? (item.issueDate || item.year) : item.year;

            return (
              <a
                key={item.id || item.title || idx}
                href={item.link || '#'}
                target={item.link ? '_blank' : undefined}
                rel={item.link ? 'noopener noreferrer' : undefined}
                className="cert-clean-row cursor-target"
                data-cursor-label="Verify"
                onClick={() => play?.('click')}
              >
                {/* Header Row: Left is Icon in its old location + Title & Issuer; Right is Date & Link Arrow */}
                <div className="cert-row-top">
                  <div className="cert-row-left">
                    <div className="cert-clean-icon">
                      {renderCertIcon(item)}
                    </div>

                    <div className="cert-clean-text">
                      <span className="cert-clean-title">{item.title}</span>
                      <span className="cert-clean-issuer">{item.issuer}</span>
                    </div>
                  </div>

                  {/* Right Side: Issued Date and External Link Arrow */}
                  <div className="cert-row-right">
                    <span className="cert-clean-year">{issueDateDisplay}</span>
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
                </div>

                {/* Preview Image: Appears ABOVE description only, NOT in icon place */}
                {hasMedia && (
                  <div className="cert-row-thumbs-wrap">
                    {images.map((imgUrl, iIdx) => (
                      <div
                        key={iIdx}
                        role="button"
                        tabIndex={0}
                        className="cert-preview-btn-thumb cursor-target"
                        onClick={(e) => handleOpenPreview(e, item, images, iIdx)}
                        onMouseEnter={(e) => handleThumbMouseEnter(e, item, images, iIdx)}
                        onMouseLeave={handleThumbMouseLeave}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleOpenPreview(e, item, images, iIdx);
                          }
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt=""
                          onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Description: Expands full width across the right area, indented below title and company */}
                {item.description && (
                  <p className="cert-clean-desc">{item.description}</p>
                )}
              </a>
            );
          })}
        </div>

        {/* See All / Show Less Button when items exceed limit */}
        {hasMore && (
          <div className="cert-see-all-wrap">
            <button
              type="button"
              className="cert-see-all-btn cursor-target" data-cursor-label={showAll ? "Less" : "More"}
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

      {/* Desktop Hover Floating Preview: ONLY photo preview without any text */}
      {hoverPreview && typeof document !== 'undefined' && createPortal(
        <div
          className="cert-hover-preview-card"
          style={{
            position: 'fixed',
            top: `${getHoverPosition(hoverPreview.rect).top}px`,
            left: `${getHoverPosition(hoverPreview.rect).left}px`,
            zIndex: 999999,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <img
            src={hoverPreview.images[hoverPreview.currentIdx || 0]}
            alt=""
            className="cert-hover-preview-img"
          />
        </div>,
        document.body
      )}

      {/* Full Modal Preview Card: Rendered in portal outside section for clean isolation */}
      {activeModal && typeof document !== 'undefined' && createPortal(
        <div
          className="cert-preview-modal-backdrop"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeModal.item.title} preview`}
        >
          <div
            id="cert-preview-modal-card"
            className="cert-preview-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image Display Area */}
            <div className="cert-modal-media-wrap">
              <img
                src={activeModal.images[activeModal.activeIdx || 0]}
                alt={`${activeModal.item.title} preview`}
                className="cert-modal-main-image"
                loading="eager"
              />
            </div>

            {/* Multiple Photos Selector if more than 1 image */}
            {activeModal.images.length > 1 && (
              <div className="cert-modal-gallery-strip">
                {activeModal.images.map((imgUrl, gIdx) => (
                  <button
                    key={gIdx}
                    type="button"
                    className={`cert-modal-gallery-thumb cursor-target ${gIdx === (activeModal.activeIdx || 0) ? 'is-active' : ''}`}
                    data-cursor-label={`Photo ${gIdx + 1}`}
                    onClick={() => setActiveModal({ ...activeModal, activeIdx: gIdx })}
                    aria-label={`View photo ${gIdx + 1}`}
                  >
                    <img src={imgUrl} alt="" />
                  </button>
                ))}
              </div>
            )}

            {/* Minimal Content Area Below Image */}
            <div className="cert-modal-content">
              <div className="cert-modal-row-main">
                <div className="cert-modal-title-group">
                  <h3 className="cert-modal-title">{activeModal.item.title}</h3>
                  <div className="cert-modal-subtitle">
                    <span className="cert-modal-issuer">{activeModal.item.issuer}</span>
                  </div>
                </div>

                {(activeModal.item.issueDate || activeModal.item.year) && (
                  <span className="cert-modal-year">{activeModal.item.issueDate || activeModal.item.year}</span>
                )}
              </div>

              {activeModal.item.description && (
                <p className="cert-modal-desc">{activeModal.item.description}</p>
              )}

              {activeModal.item.link && (
                <div className="cert-modal-action-row">
                  <a
                    href={activeModal.item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-modal-verify-link cursor-target"
                    data-cursor-label="Verify"
                    onClick={() => play?.('click')}
                  >
                    <span>Verify credentials</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
