import React from 'react';
import TextRevealParagraph from './TextRevealParagraph';
import { usePortfolioData } from '../data/usePortfolioData.js';

/**
 * AboutSection — Matching the header "ABOUT ME"
 * Contains the animated text reveal narrative with inline SkillIcons,
 * a minimalist 3D View Resume action, and the technical career timeline.
 */
export default function AboutSection({ play }) {
  const { about } = usePortfolioData();

  return (
    <section id="section-about" className="portfolio-section portfolio-about-section">
      <div className="section-container">
        {/* Clean Header: Single tag matching header */}
        <div className="section-header-block">
          <div className="contact-image-tag">
            <span>ABOUT ME</span>
          </div>
        </div>

        {/* Animated Text Reveal Narrative */}
        <TextRevealParagraph paragraphs={about} />

        {/* View Resume Button: Compact 3D White Button */}
        <div className="about-resume-wrap">
          <a
            href="#/resume"
            onClick={() => play?.('click')}
            className="about-resume-3d-capsule"
            aria-label="View Resume"
          >
            <span className="resume-capsule-text">View Resume</span>
            <span className="resume-capsule-arrow" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
