import { useState, useEffect } from 'react';
import { PORTFOLIO_EMAIL, openGmailDirect, copyToClipboard } from '../lib/emailHelper.js';

export default function ContactSection({ play }) {
  const [localTime, setLocalTime] = useState('');
  const [copied, setCopied] = useState(false);
  const email = PORTFOLIO_EMAIL;

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        setLocalTime(formatter.format(new Date()));
      } catch {
        setLocalTime('IST');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    const ok = await copyToClipboard(email);
    if (ok) {
      setCopied(true);
      play?.('click');
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleOpenGmail = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    play?.('click');
    openGmailDirect(email);
  };

  return (
    <section id="section-contact" className="portfolio-section portfolio-contact-section">
      <div className="contact-image-container">
        {/* Category Header */}
        <div className="contact-image-tag">
          <span>CONTACT</span>
        </div>

        {/* Main Headline */}
        <h2 className="contact-image-title">
          LET'S MAKE SOMETHING
          <br />
          FEEL RIGHT
        </h2>

        {/* Status Meta Items */}
        <div className="contact-image-meta">
          <div className="contact-meta-row">
            <span className="contact-radar-dot" aria-hidden="true">
              <span className="contact-radar-core" />
            </span>
            <span className="contact-meta-text">OPEN TO PRODUCT DESIGN ROLES</span>
          </div>

          <div className="contact-meta-row">
            <svg
              className="contact-meta-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="contact-meta-text">
              {localTime ? `${localTime} IN JAMMU, INDIA` : 'JAMMU, INDIA'}
            </span>
          </div>
        </div>

        {/* Primary Interactive Ivory/Cream Email Card: Copy Email | Open Gmail App / Web */}
        <div className="contact-email-capsule-wrapper">
          <div
            className={`contact-email-capsule ${copied ? 'is-copied' : ''}`}
            role="group"
            aria-label={`Email ${email}`}
          >
            {/* Left section: Click to copy */}
            <button
              type="button"
              className="email-capsule-copy-btn"
              onClick={handleCopyEmail}
              title="Click to copy email address"
              aria-label="Copy email address to clipboard"
            >
              <span className="email-at-badge" aria-hidden="true">
                {copied ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
                  </svg>
                )}
              </span>
              <span className="email-capsule-address">
                {copied ? 'Copied to clipboard' : email}
              </span>
            </button>

            {/* Vertical separator */}
            <div className="email-capsule-divider" aria-hidden="true" />

            {/* Right section: Up arrow button to open Gmail directly */}
            <button
              type="button"
              className="email-capsule-arrow"
              onClick={handleOpenGmail}
              aria-label="Open Gmail directly"
              title="Open in Gmail"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>
          </div>
        </div>

        {/* Secondary Socials: 3D Mechanical Keycaps Row */}
        <div className="contact-keycaps-row">
          <a
            href="https://www.linkedin.com/in/sahil-a-057a0231a"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-keycap-btn"
            aria-label="LinkedIn"
            onClick={() => play?.('click')}
          >
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>

          <a
            href="https://www.threads.com/@sahilaw2"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-keycap-btn"
            aria-label="Threads"
            onClick={() => play?.('click')}
          >
            <svg aria-hidden="true" width="22" height="22" viewBox="-12 -12 346 400">
              <path fill="currentColor" stroke="currentColor" strokeWidth="16" strokeLinejoin="round" d="M267.149,173.742c-.469-54.261-29.885-86.958-79.575-86.958-33.166,0-61.058,15.001-75.708,38.909l32.111,22.384c8.321-13.126,19.806-24.025,40.901-24.025,23.791,0,36.096,13.243,39.612,37.854-11.485-1.758-22.97-2.695-34.807-2.695-64.223,0-94.459,29.064-94.459,67.504,0,39.143,30.236,62.113,74.77,62.113,48.87,0,78.052-32.932,90.005-73.715,12.423,5.625,20.978,18.751,20.978,38.44,0,52.738-60.824,81.45-112.39,81.45-76.059,0-125.75-49.925-125.75-131.141,0-99.498,65.746-163.252,154.111-163.252,59.301,0,88.599,26.017,108.522,60.941l32.815-22.97C316.605,33.342,268.204.997,195.543.997,79.755.997,1,83.15,1,202.337c0,108.991,77.114,172.276,168.995,172.276,75.942,0,152.705-44.3,152.705-120.125,0-39.612-22.736-65.863-55.55-80.747ZM168.588,249.332c-16.759,0-31.525-7.969-31.525-22.619,0-23.087,19.362-35.187,46.064-35.187,12.423,0,23.439,1.758,32.345,4.922-3.75,34.453-24.843,52.884-46.884,52.884Z" />
            </svg>
          </a>

          <a
            href="https://github.com/sahilaw22"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-keycap-btn"
            aria-label="GitHub"
            onClick={() => play?.('click')}
          >
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        </div>

        {/* Horizontal Technical Divider */}
        <hr className="contact-image-divider" />

        {/* Colophon & Attribution */}
        <div className="contact-image-colophon">
          <p className="colophon-copyright">
            © {new Date().getFullYear()} SAHIL AHMED WANI
          </p>
          <p className="colophon-stack">
            DESIGNED AND BUILT BY ME · NEXT.JS, THREE.JS, WEBGL, WEB AUDIO, CLAUDE, GEMINI
          </p>
        </div>
      </div>
    </section>
  );
}
