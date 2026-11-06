import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TechIcon } from '../TechIcons.jsx';
import './OrbitDeck.css';

/**
 * MobileSwipeDeck: 3D Card Swipe Deck adapted from reference sanjanagvn-portfolio
 * Uses Framer Motion drag gestures and perspective transforms
 * Preserves exact portfolio card UI and components
 */
function MobileSwipeDeck({
  projects = [],
  currentIndex = 0,
  setCurrentIndex,
  onSelectProject,
  autoPlay = true,
  autoPlayInterval = 4500,
  windowWidth = 380,
}) {
  const [direction, setDirection] = useState(0);
  const isInteractingRef = useRef(false);
  const total = projects.length;

  const handlePrevious = useCallback(() => {
    if (total <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total, setCurrentIndex]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total, setCurrentIndex]);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex, setCurrentIndex]);

  const handleDragEnd = (_event, info) => {
    isInteractingRef.current = false;
    const swipeThreshold = 55;
    const velocityThreshold = 250;
    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrevious();
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevious, handleNext]);

  // Auto-play timer for mobile
  useEffect(() => {
    if (!autoPlay || total <= 1) return;

    const timer = setInterval(() => {
      if (!isInteractingRef.current) {
        handleNext();
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, total, handleNext]);

  // Fluid card position and 3D perspective style based on offset from active (from reference)
  const getCardStyle = (index) => {
    let offset = index - currentIndex;
    while (offset > total / 2) offset -= total;
    while (offset < -total / 2) offset += total;
    const absOffset = Math.abs(offset);

    // Only show cards within range of ±1 from active
    if (absOffset > 1) {
      return { display: 'none' };
    }

    const stepX = Math.min(80, Math.max(62, (windowWidth || 380) * 0.19));
    const x = `calc(-50% + ${offset * stepX}px)`;
    const scale = 1 - absOffset * 0.12;
    const opacity = 1 - absOffset * 0.4;
    const rotateZ = offset * 4;
    const rotateY = offset * -10;
    const z = -absOffset * 80;

    return {
      x,
      scale,
      opacity,
      rotateZ,
      rotateY,
      z,
      zIndex: 10 - absOffset,
    };
  };

  return (
    <div className="od-wrapper od-mobile-wrapper">
      <div className="od-mobile-stage">
        <AnimatePresence initial={false} custom={direction}>
          {projects.map((project, index) => {
            let diff = index - currentIndex;
            while (diff > total / 2) diff -= total;
            while (diff < -total / 2) diff += total;
            const absDiff = Math.abs(diff);

            if (absDiff > 1) return null;

            const style = getCardStyle(index);
            const isActive = diff === 0;
            const isLeft = diff === -1;
            const isRight = diff === 1;

            const projectTech = Array.isArray(project.tech)
              ? project.tech
              : (Array.isArray(project.technologies) ? project.technologies : []);
            const projectLink = project.link || project.website;

            return (
              <motion.div
                key={project.id || index}
                custom={direction}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={style}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.5,
                  ease: [0.32, 0.72, 0, 1],
                }}
                drag={isActive ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => {
                  isInteractingRef.current = true;
                }}
                onDragEnd={isActive ? handleDragEnd : undefined}
                className="od-mobile-motion-card"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  y: '-50%',
                  transformStyle: 'preserve-3d',
                  width: 'min(280px, 80vw)',
                  height: '340px',
                  pointerEvents: isActive || isLeft || isRight ? 'auto' : 'none',
                }}
                onClick={(e) => {
                  if (isLeft) {
                    e.stopPropagation();
                    handlePrevious();
                  } else if (isRight) {
                    e.stopPropagation();
                    handleNext();
                  } else if (isActive && onSelectProject) {
                    onSelectProject(project);
                  }
                }}
              >
                <article
                  className="od-card"
                  data-od-slide={index}
                  data-od-name={project.title}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${total}`}
                  {...(isActive ? { 'data-od-centre': '' } : {})}
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

                  {/* Card Body */}
                  <div className="od-card-body">
                    <h2 className="od-card-title">{project.title}</h2>

                    <p className="od-card-details">{project.details || project.description}</p>

                    {projectTech && projectTech.length > 0 && (
                      <div
                        className="od-card-tech-line"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        {projectTech.map((t) => (
                          <span key={t} className="od-tech-pill">
                            <TechIcon name={t} size={10} />
                            <span>{t}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    <div
                      className="od-card-actions"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="od-btn-detail cursor-target"
                        data-cursor-label="Details"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectProject) onSelectProject(project);
                        }}
                      >
                        View details
                      </button>

                      {projectLink && (
                        <a
                          className="od-visit-btn cursor-target"
                          data-cursor-label="Visit"
                          href={projectLink}
                          target={projectLink.startsWith('http') ? '_blank' : undefined}
                          rel={projectLink.startsWith('http') ? 'noreferrer' : undefined}
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
              </motion.div>
            );
          })}
        </AnimatePresence>
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

/**
 * OrbitDeck: 3D Card Carousel Slider
 * Optimized for Mobile & Desktop
 * Mobile uses Framer Motion swipe deck; Desktop uses 3D Orbit Carousel
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

  // Auto-play timer (desktop)
  useEffect(() => {
    if (!autoPlay || isDragging || total <= 1 || windowWidth <= 768) return;

    const timer = setInterval(() => {
      if (!isHoveredRef.current && !isPointerDownRef.current) {
        nextSlide();
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isDragging, total, nextSlide, windowWidth]);

  // Keyboard navigation
  useEffect(() => {
    if (windowWidth <= 768) return; // Handled by MobileSwipeDeck
    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide, windowWidth]);

  // If on mobile (<= 768px), render Framer Motion card swipe deck
  if (windowWidth <= 768) {
    return (
      <MobileSwipeDeck
        projects={projects}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        onSelectProject={onSelectProject}
        autoPlay={autoPlay}
        autoPlayInterval={autoPlayInterval}
        windowWidth={windowWidth}
      />
    );
  }

  // Pointer / Touch / Mouse Drag Handling (Desktop Orbit)
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    // Do not capture pointer if clicking on buttons, links, or actions
    if (e.target.closest('button, a, .od-btn-detail, .od-visit-btn, .od-card-actions, .od-card-tech-line')) {
      return;
    }
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
    if (Math.abs(delta) > 14) {
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

                <div
                  className="od-card-actions"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="od-btn-detail"
                    onPointerDown={(e) => e.stopPropagation()}
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
