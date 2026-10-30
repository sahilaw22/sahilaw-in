import { useEffect, useState, useRef, useCallback } from 'react';

const PILLS = [
  {
    slug: 'about',
    label: 'About',
    targetId: 'section-about',
    logoSrc: '/images/navigation/nav-about.png',
    fallbackSrc: './images/navigation/nav-about.png',
    glowColor: 'rgba(140, 101, 247, 0.85)',
    accentColor: '#8c65f7',
  },
  {
    slug: 'experience',
    label: 'Experience & Education',
    targetId: 'section-journey',
    logoSrc: '/images/navigation/nav-experience.png',
    fallbackSrc: './images/navigation/nav-experience.png',
    glowColor: 'rgba(255, 119, 51, 0.85)',
    accentColor: '#ff7733',
  },
  {
    slug: 'skills',
    label: 'Certifications & Achievements',
    targetId: 'section-skills',
    logoSrc: '/images/navigation/nav-skills.png',
    fallbackSrc: './images/navigation/nav-skills.png',
    glowColor: 'rgba(56, 189, 248, 0.85)',
    accentColor: '#38bdf8',
  },
  {
    slug: 'contact',
    label: 'Contact',
    targetId: 'section-contact',
    logoSrc: '/images/navigation/nav-contact.png',
    fallbackSrc: './images/navigation/nav-contact.png',
    glowColor: 'rgba(74, 222, 128, 0.85)',
    accentColor: '#4ade80',
  },
];

export default function RightScrollPills({ play, currentRoute = '/' }) {
  const [activeSlug, setActiveSlug] = useState('about');
  const [hoveredSlug, setHoveredSlug] = useState(null);

  // In-memory vertical slide offset (resets back to 0 on page reload)
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startOffsetRef = useRef(0);
  const hasMovedRef = useRef(false);
  const navRef = useRef(null);

  // Scroll detection: Keep pills active and sync active slug
  useEffect(() => {
    const isHome = currentRoute === '/' || currentRoute === '';

    if (!isHome) {
      if (currentRoute.startsWith('/projects')) {
        setActiveSlug('skills');
      } else if (currentRoute === '/careers' || currentRoute === '/resume') {
        setActiveSlug('experience');
      } else if (currentRoute === '/chat') {
        setActiveSlug('contact');
      }
    }

    function handleScroll() {
      if (!isHome) return;

      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      const aboutEl = document.getElementById('section-about');
      const journeyEl = document.getElementById('section-journey');
      const skillsEl = document.getElementById('section-skills');
      const contactEl = document.getElementById('section-contact');

      if (contactEl && scrollPos >= contactEl.offsetTop) {
        setActiveSlug('contact');
      } else if (skillsEl && scrollPos >= skillsEl.offsetTop) {
        setActiveSlug('skills');
      } else if (journeyEl && scrollPos >= journeyEl.offsetTop) {
        setActiveSlug('experience');
      } else {
        setActiveSlug('about');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentRoute]);

  // Clamp helper for vertical dragging within viewport bounds
  const clampOffset = useCallback((targetOffset) => {
    if (typeof window === 'undefined') return targetOffset;
    const navEl = navRef.current;
    const navHeight = navEl ? navEl.offsetHeight : 240;
    const halfHeight = navHeight / 2;
    const windowH = window.innerHeight;

    const maxUp = -(windowH / 2 - 60 - halfHeight);
    const maxDown = windowH / 2 - 85 - halfHeight;

    return Math.max(maxUp, Math.min(maxDown, targetOffset));
  }, []);

  // Pointer/touch drag handling
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch (_) {}
    isDraggingRef.current = true;
    setIsDragging(true);
    startYRef.current = e.clientY;
    startOffsetRef.current = offsetY;
    hasMovedRef.current = false;
  };

  useEffect(() => {
    const onWindowMove = (e) => {
      if (!isDraggingRef.current) return;
      const dy = e.clientY - startYRef.current;
      if (Math.abs(dy) > 4) {
        hasMovedRef.current = true;
      }
      if (hasMovedRef.current) {
        setOffsetY(clampOffset(startOffsetRef.current + dy));
      }
    };

    const onWindowUp = (e) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        try {
          if (e?.pointerId && navRef.current) {
            navRef.current.releasePointerCapture?.(e.pointerId);
          }
        } catch (_) {}
      }
    };

    window.addEventListener('pointermove', onWindowMove, { passive: true });
    window.addEventListener('pointerup', onWindowUp);
    window.addEventListener('pointercancel', onWindowUp);

    return () => {
      window.removeEventListener('pointermove', onWindowMove);
      window.removeEventListener('pointerup', onWindowUp);
      window.removeEventListener('pointercancel', onWindowUp);
    };
  }, [clampOffset]);

  const handlePillClick = (pill) => {
    // If the touch was a slide/drag, do not trigger navigation
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }

    if (typeof play === 'function') {
      play('click');
    }

    const isHome =
      window.location.hash === '' ||
      window.location.hash === '#/' ||
      window.location.hash === '#';

    // If on another page, navigate to home and scroll to target section
    if (!isHome) {
      window.location.hash = '#/';
      setTimeout(() => {
        const el = document.getElementById(pill.targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return;
    }

    // If clicking Pill 1 and user is in the About section, smoothly scroll back to top (Hero)
    if (pill.slug === 'about') {
      const aboutEl = document.getElementById('section-about');
      const heroEl = document.getElementById('section-hero');
      if (aboutEl) {
        const scrollY = window.scrollY;
        const aboutTop = aboutEl.offsetTop;
        const aboutBottom = aboutTop + aboutEl.offsetHeight;

        if (scrollY >= aboutTop - 100 && scrollY < aboutBottom) {
          if (heroEl) {
            heroEl.scrollIntoView({ behavior: 'smooth' });
            return;
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
        }
      }
    }

    const el = document.getElementById(pill.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className="portfolio-scroll-pills-nav"
      aria-label="Portfolio quick section navigation"
      onPointerDown={handlePointerDown}
      style={{
        transform: `translateY(calc(-50% + ${offsetY}px))`,
        transition: isDragging
          ? 'none'
          : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Mobile notch drag indicator handle */}
      <div className="notch-drag-handle" aria-hidden="true" />

      <div className="portfolio-scroll-pills-container">
        {PILLS.map((pill) => {
          const isActive = activeSlug === pill.slug;
          const isHovered = hoveredSlug === pill.slug;

          return (
            <div
              key={pill.slug}
              className="portfolio-scroll-pill-wrapper"
              onMouseEnter={() => {
                if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
                  setHoveredSlug(pill.slug);
                }
              }}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              {/* Floating label badge: ONLY on desktop hover */}
              <div
                className={`portfolio-scroll-pill-tooltip ${
                  isHovered ? 'is-visible' : ''
                }`}
                style={{
                  '--pill-accent': pill.accentColor,
                }}
              >
                <span className="tooltip-label">{pill.label}</span>
              </div>

              {/* 3D Brand Pill Button */}
              <button
                type="button"
                onClick={() => handlePillClick(pill)}
                className={`portfolio-scroll-pill-btn ${isActive ? 'is-active' : ''}`}
                aria-label={`Scroll to ${pill.label}`}
                style={{
                  '--pill-glow': pill.glowColor,
                  '--pill-accent': pill.accentColor,
                }}
              >
                <img
                  src={pill.logoSrc}
                  alt={pill.label}
                  className="portfolio-scroll-pill-img"
                  loading="eager"
                  draggable={false}
                  onError={(e) => {
                    if (!e.currentTarget.dataset.retried) {
                      e.currentTarget.dataset.retried = 'true';
                      e.currentTarget.src = pill.fallbackSrc;
                    }
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
