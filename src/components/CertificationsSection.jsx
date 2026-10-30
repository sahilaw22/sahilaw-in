import React from 'react';
import { CERTIFICATIONS } from '../data/portfolioData.jsx';

/**
 * CertificationsSection — Matching the header "CERTIFICATIONS"
 * Clean anti-slop list presenting certifications with company vector logos, issuers, dates, and direct links.
 */
export default function CertificationsSection() {
  return (
    <section id="section-certifications" className="portfolio-section portfolio-certifications-section">
      <div className="section-container">
        {/* Clean Header: Single tag without duplicate titles */}
        <div className="section-header-block">
          <div className="contact-image-tag">
            <span>CERTIFICATIONS</span>
          </div>
        </div>

        {/* Clean Certifications List */}
        <div className="certifications-clean-list">
          {CERTIFICATIONS.map((cert) => (
            <a
              key={cert.title}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-clean-row"
              title={`View ${cert.title}`}
            >
              <div className="cert-row-left">
                <div className="cert-clean-icon">
                  {cert.icon}
                </div>
                <div className="cert-clean-text">
                  <span className="cert-clean-title">{cert.title}</span>
                  <span className="cert-clean-issuer">{cert.issuer}</span>
                </div>
              </div>

              <div className="cert-row-right">
                <span className="cert-clean-year">{cert.year}</span>
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
