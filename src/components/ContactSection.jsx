import { useState, useEffect } from 'react';
import { PORTFOLIO_EMAIL, openGmailDirect, copyToClipboard } from '../lib/emailHelper.js';
import { usePortfolioData } from '../data/usePortfolioData.js';
import { getSocialIconSvg } from './SocialIcons.jsx';
import TechText from './TechText';

export default function ContactSection({ play }) {
  const [localTime, setLocalTime] = useState('');
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { meta, social_links } = usePortfolioData();

  const email = meta?.email || PORTFOLIO_EMAIL;
  const contactStatus = meta?.contact_status || 'OPEN TO PRODUCT DESIGN ROLES';
  const locationCity = meta?.location || 'JAMMU, INDIA';
  const linkedinUrl = meta?.linkedin || 'https://www.linkedin.com/in/sahil-a-057a0231a';
  const threadsUrl = meta?.threads || 'https://www.threads.com/@sahilaw2';
  const githubUrl = meta?.github || 'https://github.com/sahilaw22';

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
        {/* Contact Header Block with Hover TechText Animation (Desktop only) */}
        <div
          className="contact-header-interactive-wrap cursor-target"
          data-cursor-label="Interact"
          onMouseEnter={() => {
            if (typeof window !== 'undefined' && window.innerWidth > 768) {
              setIsHovered(true);
            }
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Category Header */}
          <div className="contact-image-tag">
            <span>CONTACT</span>
          </div>

          {/* Main Headline */}
          <div className="contact-title-interactive-wrap">
            {/* Static Headline */}
            <h2 className={`contact-image-title ${isHovered ? 'is-hovered' : ''}`}>
              <span className="contact-title-line-1">LET'S BUILD</span>
              <span className="contact-title-line-2">SOMETHING FEEL RIGHT</span>
            </h2>

            {/* TechText Canvas on Hover */}
            <div
              className={`contact-techtext-wrapper ${isHovered ? 'is-active' : ''}`}
              aria-hidden={!isHovered}
            >
              <TechText
                text="LET'S TALK"
                fontFamily="'Share Tech', 'Share', 'Space Grotesk', sans-serif"
                fontWeight={600}
                fontSize={150}
                align="left"
                reveal="letter"
                dashLength={4}
                dashGap={2}
                specks={15}
                intro="none"
                introDuration={2}
                clickKick
                guides={false}
                color="#ffffff"
              />
            </div>
          </div>
        </div>

        {/* Status Meta Items */}
        <div className="contact-image-meta">
          <div className="contact-meta-row">
            <span className="contact-radar-dot" aria-hidden="true">
              <span className="contact-radar-core" />
            </span>
            <span className="contact-meta-text">{contactStatus}</span>
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
              {localTime ? `${localTime} IN ${locationCity}` : locationCity}
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
              className="email-capsule-copy-btn cursor-target" data-cursor-label={copied ? "Copied" : "Copy"}
              onClick={handleCopyEmail}
              title="Click to copy email address"
              aria-label="Copy email address to clipboard"
            >
              <span className="email-at-badge" aria-hidden="true">
                {copied ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              className="email-capsule-arrow cursor-target" data-cursor-label="Gmail"
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

        {/* Secondary Socials: Transparent Icon Links Row */}
        <div className="contact-keycaps-row">
          {(Array.isArray(social_links) && social_links.length > 0
            ? social_links.filter(s => s.is_published !== false && s.url)
            : [
                { id: 'social-github', platform: 'GitHub', url: githubUrl, icon: 'github' },
                { id: 'social-linkedin', platform: 'LinkedIn', url: linkedinUrl, icon: 'linkedin' },
                { id: 'social-threads', platform: 'Threads', url: threadsUrl, icon: 'threads' },
              ]
          )
          .filter((s) => {
            const p = (s.platform || '').toLowerCase();
            return p !== 'x' && !p.includes('twitter') && p !== 'email' && !s.url?.startsWith('mailto:');
          })
          .map((s) => {
            const isEmail = (s.platform || '').toLowerCase() === 'email' || s.url?.startsWith('mailto:');
            return (
              <a
                key={s.id || s.platform}
                href={s.url}
                target={isEmail ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="scoot-btn-3d cursor-target"
                data-cursor-label={s.platform}
                aria-label={s.platform}
                onClick={(e) => {
                  e.currentTarget.blur();
                  play?.('click');
                  if (isEmail) {
                    e.preventDefault();
                    openGmailDirect(email);
                  }
                }}
                onPointerUp={(e) => e.currentTarget.blur()}
                onMouseLeave={(e) => e.currentTarget.blur()}
                onTouchEnd={(e) => e.currentTarget.blur()}
              >
                {getSocialIconSvg(s.icon || s.platform)}
                <span className="social-icon-tooltip" aria-hidden="true">{s.platform}</span>
              </a>
            );
          })}
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
