import { useState, useEffect, useRef, useCallback } from 'react';
import { TechIcon } from '../TechIcons.jsx';
import './OrbitDeck.css';

/**
 * OrbitDeck: 3D Card Carousel Slider
 * Optimized for Mobile & Desktop
 * Displays projects with full-bleed background imagery and classic portfolio content layout
 */
export default function OrbitDeck({
  projects = [],
  onSelectProject,
  autoPlay = true,
  autoPlayInterval = 4500,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0); // drag distance in px
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const containerRef = useRef(null);
  const pointerStartRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const hasMovedRef = useRef(false);
  const isHoveredRef = useRef(false);

  // Responsive window tracker
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = projects.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!autoPlay || isDragging || total <= 1) return;

    const timer = setInterval(() => {
      if (!isHoveredRef.current && !isPointerDownRef.current) {
        nextSlide();
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isDragging, total, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Pointer / Touch / Mouse Drag Handling
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    isPointerDownRef.current = true;
    hasMovedRef.current = false;
    const startX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    pointerStartRef.current = startX;
    setIsDragging(true);
    setDragOffset(0);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  };

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const delta = clientX - pointerStartRef.current;
    if (Math.abs(delta) > 4) {
      hasMovedRef.current = true;
    }
    setDragOffset(delta);
  };

  const handlePointerUp = (e) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    try {
      if (e?.currentTarget?.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // fallback
    }

    const threshold = 35; // minimum drag distance in px
    if (dragOffset > threshold) {
      prevSlide();
    } else if (dragOffset < -threshold) {
      nextSlide();
    }
    setDragOffset(0);
  };

  const handlePointerCancel = (e) => {
    isPointerDownRef.current = false;
    setIsDragging(false);
    setDragOffset(0);
    try {
      if (e?.currentTarget?.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // fallback
    }
  };

  // Fluid responsive parameters
  const isMobile = windowWidth <= 640;
  const isTablet = windowWidth > 640 && windowWidth <= 920;

  const baseX = isMobile ? Math.min(195, windowWidth * 0.44) : isTablet ? 265 : 320;
  const baseY = isMobile ? 2.0 : 3.4;
  const baseZ = isMobile ? -520 : isTablet ? -660 : -780;
  const baseRot = isMobile ? 24 : isTablet ? 28 : 31;

  // 3D transform computation for index
  const getCardStyle = (index) => {
    if (total === 0) return {};

    // Relative distance in circular carousel
    let diff = index - currentIndex;
    while (diff > total / 2) diff -= total;
    while (diff < -total / 2) diff += total;

    // Fractional progress from dragging
    const swipeUnit = Math.max(150, baseX * 0.75);
    const dragProgress = isDragging ? dragOffset / swipeUnit : 0;
    const eff = diff + dragProgress;

    // Center card at rest
    if (Math.abs(eff) < 0.04 && !isDragging) {
      return {
        transform: `translate3d(0px, 0px, 0px) rotateY(0deg)`,
        zIndex: 4,
        opacity: 1,
        pointerEvents: 'auto',
        transition: isDragging
          ? 'none'
          : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
      };
    }

    const x = eff * baseX;
    const y = Math.abs(eff) * baseY;
    const z = -Math.abs(eff) * Math.abs(baseZ);
    const rotY = -eff * baseRot;

    let zIndex = 1;
    if (Math.abs(eff) < 0.5) {
      zIndex = 4;
    } else if (Math.abs(eff) > 1.4) {
      zIndex = 0;
    }

    let opacity = 1;
    if (Math.abs(eff) > 1.25) {
      opacity = Math.max(0, 1 - (Math.abs(eff) - 1.25) * 2.2);
    } else if (Math.abs(eff) >= 0.5) {
      opacity = isMobile ? 0.88 : 0.92;
    }

    const isClickable = opacity > 0.05 && Math.abs(eff) <= 1.2;

    return {
      transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg)`,
      zIndex,
      opacity,
      pointerEvents: isClickable ? 'auto' : 'none',
      transition: isDragging
        ? 'none'
        : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
    };
  };

  return (
    <div
      className="od-wrapper"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        if (isPointerDownRef.current) handlePointerUp();
      }}
    >
      {/* 3D Orbit Deck Scene */}
      <div
        ref={containerRef}
        className={`od-scene ${isDragging ? 'is-dragging' : ''}`}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects 3D Orbit Deck"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onDragStart={(e) => e.preventDefault()}
      >
        {projects.map((project, index) => {
          let diff = index - currentIndex;
          while (diff > total / 2) diff -= total;
          while (diff < -total / 2) diff += total;
          const isCenter = diff === 0;
          const isLeft = diff === -1;
          const isRight = diff === 1;

          const cardStyle = getCardStyle(index);

          const handleCardClick = (e) => {
            if (hasMovedRef.current) return;
            if (isLeft) {
              e.stopPropagation();
              prevSlide();
            } else if (isRight) {
              e.stopPropagation();
              nextSlide();
            } else if (isCenter && onSelectProject) {
              onSelectProject(project);
            }
          };

          return (
            <article
              key={project.id || project.title}
              className="od-card"
              data-od-slide={index}
              data-od-name={project.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${total}`}
              {...(isCenter ? { 'data-od-centre': '' } : {})}
              style={cardStyle}
              onClick={handleCardClick}
            >
              {/* Full bleed card background image */}
              <img
                src={project.image}
                alt={project.title}
                className="od-card-bg-img"
                draggable={false}
                decoding="async"
              />

              {/* Gradient overlay for text clarity */}
              <div className="od-card-bg-overlay" aria-hidden="true" />

              {/* Card Body: Bold header, 2-line sentence, Tech stack (one line, max 5), Actions */}
              <div className="od-card-body">
                <h2 className="od-card-title">{project.title}</h2>

                <p className="od-card-details">{project.details}</p>

                {project.tech && project.tech.length > 0 && (
                  <div
                    className="od-card-tech-line"
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onWheel={(e) => {
                      if (e.deltaY !== 0) {
                        e.currentTarget.scrollLeft += e.deltaY;
                      }
                    }}
                  >
                    {project.tech.map((t) => (
                      <span key={t} className="od-tech-pill">
                        <TechIcon name={t} size={10} />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                )}

                <div className="od-card-actions">
                  <button
                    type="button"
                    className="od-btn-detail"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectProject) onSelectProject(project);
                    }}
                  >
                    View details
                  </button>

                  {project.link && (
                    <a
                      className="od-visit-btn"
                      href={project.link}
                      target={project.link.startsWith('http') ? '_blank' : undefined}
                      rel={project.link.startsWith('http') ? 'noreferrer' : undefined}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Visit</span>
                      <svg
                        viewBox="0 0 24 24"
                        width="11"
                        height="11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination Pill */}
      {total > 1 && (
        <div className="od-pagination" role="tablist" aria-label="Projects">
          {projects.map((p, i) => (
            <button
              key={p.id || i}
              type="button"
              className={`od-dot ${i === currentIndex ? 'is-active' : ''}`}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Slide ${i + 1}: ${p.title}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
