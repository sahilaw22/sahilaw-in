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
  const isHome = currentRoute === '/' || currentRoute === '';
  if (!isHome) return null;

  const [activeSlug, setActiveSlug] = useState('about');
  const [hoveredSlug, setHoveredSlug] = useState(null);

  // Mobile notch visibility: hidden by default, visible during scrolling, auto-hides after 1s idle
  const [isMobileVisible, setIsMobileVisible] = useState(false);
  const mobileHideTimerRef = useRef(null);

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

    let rafId = null;
    let cachedOffsets = null;
    let lastCacheTime = 0;

    function getSectionOffsets() {
      const now = performance.now();
      if (!cachedOffsets || now - lastCacheTime > 1200) {
        const aboutEl = document.getElementById('section-about');
        const journeyEl = document.getElementById('section-journey');
        const skillsEl = document.getElementById('section-skills');
        const contactEl = document.getElementById('section-contact');

        const getTop = (el) => {
          if (!el) return 0;
          let top = 0;
          let curr = el;
          while (curr) {
            top += curr.offsetTop || 0;
            curr = curr.offsetParent;
          }
          return top;
        };

        cachedOffsets = {
          about: getTop(aboutEl),
          journey: getTop(journeyEl),
          skills: getTop(skillsEl),
          contact: getTop(contactEl),
        };
        lastCacheTime = now;
      }
      return cachedOffsets;
    }

    function updateScrollState() {
      // Reveal notch on mobile when user scrolls; hide after 1 second of inactivity
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        setIsMobileVisible(true);
        if (mobileHideTimerRef.current) {
          clearTimeout(mobileHideTimerRef.current);
        }
        mobileHideTimerRef.current = setTimeout(() => {
          if (!isDraggingRef.current) {
            setIsMobileVisible(false);
          }
        }, 1000);
      }

      if (!isHome) return;

      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      const offsets = getSectionOffsets();

      let targetSlug = 'about';
      if (offsets.contact && scrollPos >= offsets.contact) {
        targetSlug = 'contact';
      } else if (offsets.skills && scrollPos >= offsets.skills) {
        targetSlug = 'skills';
      } else if (offsets.journey && scrollPos >= offsets.journey) {
        targetSlug = 'experience';
      }

      setActiveSlug((prev) => (prev === targetSlug ? prev : targetSlug));
    }

    function handleScroll() {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          updateScrollState();
          rafId = null;
        });
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    let attachedLenis = null;
    const checkLenis = () => {
      if (window.lenis && window.lenis !== attachedLenis) {
        if (attachedLenis) {
          try {
            attachedLenis.off('scroll', handleScroll);
          } catch (_) {}
        }
        window.lenis.on('scroll', handleScroll);
        attachedLenis = window.lenis;
      }
    };
    checkLenis();
    const lenisInterval = setInterval(checkLenis, 500);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(lenisInterval);
      if (attachedLenis) {
        try {
          attachedLenis.off('scroll', handleScroll);
        } catch (_) {}
      }
      if (mobileHideTimerRef.current) {
        clearTimeout(mobileHideTimerRef.current);
      }
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

  // Pointer drag handling: allows user to hold and drag the notch on touch/mobile
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;

    // On desktop (mouse), clicking buttons should never trigger dragging
    if (e.pointerType === 'mouse' && e.target.closest('.portfolio-scroll-pill-btn')) {
      return;
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const isTouch = e.pointerType === 'touch' || e.pointerType === 'pen';
    const isHandle = e.target.closest('.notch-drag-handle');

    // Only allow dragging on mobile touch or explicitly on the drag handle
    if (!isMobile && !isTouch && !isHandle) {
      return;
    }

    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startOffsetRef.current = offsetY;
    hasMovedRef.current = false;
  };

  useEffect(() => {
    const onWindowMove = (e) => {
      if (!isDraggingRef.current) return;
      const dy = e.clientY - startYRef.current;
      if (Math.abs(dy) > 5) {
        hasMovedRef.current = true;
        setIsDragging(true);
        setOffsetY(clampOffset(startOffsetRef.current + dy));
      }
    };

    const onWindowUp = (e) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);

        // When user finishes dragging on mobile, restart the 1s idle auto-hide timer
        if (typeof window !== 'undefined' && window.innerWidth <= 768) {
          if (mobileHideTimerRef.current) {
            clearTimeout(mobileHideTimerRef.current);
          }
          mobileHideTimerRef.current = setTimeout(() => {
            setIsMobileVisible(false);
          }, 1000);
        }
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

  const scrollToTarget = (target) => {
    if (target === 0) {
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const selector = typeof target === 'string' ? target : null;
    const el = selector ? document.querySelector(selector) : target;

    if (window.lenis && el) {
      window.lenis.scrollTo(el, { duration: 1.1, offset: 0 });
    } else if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handlePillClick = (pill) => {
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }

    if (typeof play === 'function') {
      play('click');
    }

    // If clicking Pill 1 and user is in the About section, smoothly scroll back to top (Hero)
    if (pill.slug === 'about') {
      const aboutEl = document.getElementById('section-about');
      if (aboutEl) {
        const scrollY = window.scrollY;
        const aboutTop = aboutEl.offsetTop;
        const aboutBottom = aboutTop + aboutEl.offsetHeight;

        if (scrollY >= aboutTop - 120 && scrollY < aboutBottom) {
          scrollToTarget(0);
          return;
        }
      }
    }

    scrollToTarget(`#${pill.targetId}`);
  };

  return (
    <nav
      ref={navRef}
      className={`portfolio-scroll-pills-nav ${
        isMobileVisible ? 'is-mobile-visible' : 'is-mobile-hidden'
      } ${isDragging ? 'is-dragging' : ''}`}
      aria-label="Portfolio quick section navigation"
      onPointerDown={handlePointerDown}
      style={{
        '--notch-offset-y': `${offsetY}px`,
      }}
    >
      {/* Mobile notch drag indicator handle */}
      <div
        className="notch-drag-handle"
        aria-label="Drag navigation handle"
        role="separator"
      />

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
                onClick={(e) => {
                  e.stopPropagation();
                  handlePillClick(pill);
                }}
                onPointerDown={(e) => {
                  if (e.pointerType === 'mouse') {
                    e.stopPropagation();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePillClick(pill);
                  }
                }}
                className={`portfolio-scroll-pill-btn cursor-target ${isActive ? 'is-active' : ''}`} data-cursor-label={pill.label}
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
