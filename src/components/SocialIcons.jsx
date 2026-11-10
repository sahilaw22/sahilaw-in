import { useRef } from 'react';
import { PORTFOLIO_EMAIL, openGmailDirect } from '../lib/emailHelper.js';
import { usePortfolioData } from '../data/usePortfolioData.js';

export function getSocialIconSvg(platform = '') {
  const p = (platform || '').toLowerCase().trim();

  if (p.includes('thread')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
        <path d="M186.42,123.65a63.81,63.81,0,0,0-11.13-6.72c-4-29.89-24-39.31-33.1-42.07-19.78-6-42.51,1.19-52.85,16.7a8,8,0,0,0,13.32,8.88c6.37-9.56,22-14.16,34.89-10.27,9.95,3,16.82,10.3,20.15,21a81.05,81.05,0,0,0-15.29-1.43c-13.92,0-26.95,3.59-36.67,10.1C94.3,127.57,88,139,88,152c0,20.58,15.86,35.52,37.71,35.52a48,48,0,0,0,34.35-14.81c6.44-6.7,14-18.36,15.61-37.1.38.26.74.53,1.1.8C186.88,144.05,192,154.68,192,168c0,19.36-20.34,48-64,48-26.73,0-45.48-8.65-57.34-26.44C60.93,175,56,154.26,56,128s4.93-47,14.66-61.56C82.52,48.65,101.27,40,128,40c32.93,0,54,13.25,64.53,40.52a8,8,0,1,0,14.93-5.75C194.68,41.56,167.2,24,128,24,96,24,72.19,35.29,57.34,57.56,45.83,74.83,40,98.52,40,128s5.83,53.17,17.34,70.44C72.19,220.71,96,232,128,232c30.07,0,48.9-11.48,59.4-21.1C200.3,199.08,208,183,208,168,208,149.66,200.54,134.32,186.42,123.65ZM148.53,161.62a31.94,31.94,0,0,1-22.82,9.9c-10.81,0-21.71-6-21.71-19.52,0-12.63,12-26.21,38.41-26.21a63.88,63.88,0,0,1,16.65.2C160,142.32,156,153.86,148.53,161.62Z" />
      </svg>
    );
  }

  if (p.includes('linkedin')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
        <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z" />
      </svg>
    );
  }

  if (p.includes('github')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
        <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z" />
      </svg>
    );
  }

  if (p === 'x' || p.includes('twitter')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
        <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.9,94.62,23.51A8,8,0,0,0,87.88,20H40a8,8,0,0,0-6.75,12.29l62.6,98.37L34.08,198.61a8,8,0,0,0,11.84,10.76l58.84-64.72,48.62,76.39A8,8,0,0,0,160.12,224H208a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h22.18L186.57,208Z" />
      </svg>
    );
  }

  if (p.includes('instagram')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
      </svg>
    );
  }

  if (p.includes('youtube')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
        <path d="M234.44,69.6a24.18,24.18,0,0,0-17-17.11C202.39,48,128,48,128,48s-74.39,0-89.44,4.49a24.18,24.18,0,0,0-17,17.11C17,84.73,17,128,17,128s0,43.27,4.56,58.4a24.18,24.18,0,0,0,17,17.11C53.61,208,128,208,128,208s74.39,0,89.44-4.49a24.18,24.18,0,0,0,17-17.11C239,171.27,239,128,239,128S239,84.73,234.44,69.6ZM104,160V96l56,32Z" />
      </svg>
    );
  }

  if (p.includes('discord')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
        <path d="M219.82,60.84A168.32,168.32,0,0,0,177.34,47a8,8,0,0,0-8.23,3.75,123.63,123.63,0,0,0-5.46,11.23,154.89,154.89,0,0,0-71.3,0A123.63,123.63,0,0,0,86.89,50.75a8,8,0,0,0-8.23-3.75,168.32,168.32,0,0,0-42.48,13.84,8.08,8.08,0,0,0-4.14,6.43C21.71,130.68,31.7,192,60.13,205.86a8.09,8.09,0,0,0,6.92-.32,126,126,0,0,0,26.47-13.68,8,8,0,0,0,1.38-11.45,86.49,86.49,0,0,1-12.72-12.18,8,8,0,0,1,5.18-13.41c1.37.1,2.75.24,4.14.39a119.5,119.5,0,0,0,73.24,0c1.39-.15,2.77-.29,4.14-.39a8,8,0,0,1,5.18,13.41,86.49,86.49,0,0,1-12.72,12.18,8,8,0,0,0,1.38,11.45A126,126,0,0,0,189,205.54a8.09,8.09,0,0,0,6.92.32c28.43-13.86,38.42-75.18,28.09-138.59A8.08,8.08,0,0,0,219.82,60.84ZM92,144a16,16,0,1,1,16-16A16,16,0,0,1,92,144Zm72,0a16,16,0,1,1,16-16A16,16,0,0,1,164,144Z" />
      </svg>
    );
  }

  // Default: Web link icon
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

// Social media icon links: visible on the home page hero
export default function SocialIcons() {
  const containerRef = useRef(null);
  const { meta, social_links } = usePortfolioData();

  const emailTarget = meta?.email || PORTFOLIO_EMAIL;

  // Fallback to default canonical profiles if social_links not loaded
  let links = [];

  if (Array.isArray(social_links) && social_links.length > 0) {
    links = social_links
      .filter((s) => s.is_published !== false && s.url)
      .map((s) => ({
        label: s.platform || 'Link',
        href: s.url,
        icon: getSocialIconSvg(s.icon || s.platform),
      }));
  } else {
    links = [
      {
        label: 'GitHub',
        href: meta?.github || 'https://github.com/sahilaw22',
        icon: getSocialIconSvg('github'),
      },
      {
        label: 'LinkedIn',
        href: meta?.linkedin || 'https://www.linkedin.com/in/sahil-a-057a0231a',
        icon: getSocialIconSvg('linkedin'),
      },
      {
        label: 'Threads',
        href: meta?.threads || 'https://www.threads.com/@sahilaw2',
        icon: getSocialIconSvg('threads'),
      },
    ];
  }

  // Remove X / Twitter from Hero
  links = links.filter((l) => {
    const lbl = (l.label || '').toLowerCase();
    return lbl !== 'x' && !lbl.includes('twitter');
  });

  // Keep Email in Hero section without duplication
  const hasEmail = links.some((l) => (l.label || '').toLowerCase() === 'email');
  if (!hasEmail) {
    links.push({
      label: 'Email',
      href: `mailto:${emailTarget}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
        </svg>
      ),
    });
  }

  return (
    <div id="social-icons-wrapper" className="social-icons-wrapper" ref={containerRef}>
      <ul className="styles_links__5qJaS">
        {links.map((link) => {
          const isEmail = link.label === 'Email' || link.href?.startsWith('mailto:');
          return (
            <li key={link.label} className="social-icon-item">
              <a
                href={link.href}
                className="social-icon-btn cursor-target"
                data-cursor-label={link.label}
                target={isEmail ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={link.label}
                onClick={(e) => {
                  e.currentTarget.blur();
                  if (isEmail) {
                    e.preventDefault();
                    openGmailDirect(emailTarget);
                  }
                }}
                onPointerUp={(e) => e.currentTarget.blur()}
                onMouseLeave={(e) => e.currentTarget.blur()}
                onTouchEnd={(e) => e.currentTarget.blur()}
              >
                {link.icon}
                <span className="social-icon-tooltip" aria-hidden="true">{link.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
