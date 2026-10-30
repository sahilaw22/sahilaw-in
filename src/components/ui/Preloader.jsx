import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

/**
 * Preloader — React Bits Pro (@reactbits-starter/preloader-tw)
 * Loading screens in five styles: stairs, percentage, circle, slide, curtain
 *
 * Configured with portfolio design tokens (obsidian #07080b, emerald #61dca3)
 * and human anti-slop copy.
 */
export default function Preloader({
  variant = 'stairs',
  stairCount = 10,
  stairsRevealFrom = 'left',
  stairsRevealDirection = 'up',
  loadingText = 'Loading portfolio',
  textClassName = '',
  bgColor = '#07080b',
  accentColor = '#61dca3',
  duration = 1900,
  position = 'fixed',
  zIndex = 99999,
  percentagePosition = 'center',
  showPercentageSign = true,
  showProgressBar = true,
  progressBarPosition = 'bottom',
  active,
  onComplete,
}) {
  const isControlled = typeof active === 'boolean';
  const [internalActive, setInternalActive] = useState(true);
  const [percentage, setPercentage] = useState(0);
  const completedRef = useRef(false);

  const isActive = isControlled ? active : internalActive;

  const handleDismiss = () => {
    if (!isControlled) {
      setInternalActive(false);
    }
  };

  // Timer / Progress lifecycle
  useEffect(() => {
    if (!isActive) return;

    if (variant === 'percentage') {
      const startTime = performance.now();
      let animFrame;

      const updateProgress = (now) => {
        const elapsed = now - startTime;
        const rawProgress = Math.min(elapsed / (duration * 0.82), 1);
        // Smooth easeOutCubic counter
        const eased = 1 - Math.pow(1 - rawProgress, 3);
        const currentPct = Math.round(eased * 100);
        setPercentage(currentPct);

        if (rawProgress < 1) {
          animFrame = requestAnimationFrame(updateProgress);
        } else {
          setTimeout(handleDismiss, 200);
        }
      };

      animFrame = requestAnimationFrame(updateProgress);
      return () => cancelAnimationFrame(animFrame);
    }

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [isActive, duration, variant, isControlled]);

  // Keyboard shortcut to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isControlled]);

  // Lock body scroll while active
  useEffect(() => {
    if (isActive) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isActive]);

  const handleAnimationComplete = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  };

  // Helper to compute stair stagger delay
  const getStairDelay = (index) => {
    const stepDuration = 0.042;
    if (stairsRevealFrom === 'right') {
      return (stairCount - 1 - index) * stepDuration;
    }
    if (stairsRevealFrom === 'center') {
      const mid = (stairCount - 1) / 2;
      return Math.abs(index - mid) * (stepDuration * 1.35);
    }
    return index * stepDuration;
  };

  const exitY = stairsRevealDirection === 'down' ? '100%' : '-100%';

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isActive && (
        <motion.div
          key="rb-preloader-root"
          className="rb-preloader-root"
          style={{
            position,
            zIndex,
            '--preloader-bg': bgColor,
            '--preloader-accent': accentColor,
            backgroundColor: variant === 'stairs' || variant === 'curtain' ? 'transparent' : bgColor,
          }}
          onClick={handleDismiss}
          role="dialog"
          aria-label="Loading preview"
        >
          {/* ==================== 1. STAIRS VARIANT ==================== */}
          {variant === 'stairs' && (
            <div className="rb-preloader-stairs-wrap">
              {Array.from({ length: stairCount }).map((_, i) => (
                <motion.div
                  key={`stair-${i}`}
                  className="rb-preloader-stair-col"
                  style={{
                    width: `${100 / stairCount}%`,
                    backgroundColor: bgColor,
                  }}
                  initial={{ y: '0%' }}
                  exit={{
                    y: exitY,
                    transition: {
                      duration: 0.65,
                      ease: [0.76, 0, 0.24, 1],
                      delay: getStairDelay(i),
                    },
                  }}
                />
              ))}
            </div>
          )}

          {/* ==================== 2. CURTAIN VARIANT ==================== */}
          {variant === 'curtain' && (
            <>
              <motion.div
                className="rb-preloader-curtain-half rb-preloader-curtain-left"
                initial={{ x: '0%' }}
                exit={{
                  x: '-100%',
                  transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
                }}
              />
              <motion.div
                className="rb-preloader-curtain-half rb-preloader-curtain-right"
                initial={{ x: '0%' }}
                exit={{
                  x: '100%',
                  transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
                }}
              />
            </>
          )}

          {/* ==================== 3. SLIDE VARIANT ==================== */}
          {variant === 'slide' && (
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: bgColor,
                zIndex: 1,
              }}
              initial={{ y: '0%' }}
              exit={{
                y: '-100%',
                transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
              }}
            />
          )}

          {/* ==================== CONTENT LAYER ==================== */}
          <motion.div
            className="rb-preloader-content-layer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -14,
              transition: { duration: 0.35, ease: 'easeOut' },
            }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            {/* Percentage Display */}
            {variant === 'percentage' && (
              <div
                className="rb-preloader-percentage-num"
                style={{
                  alignSelf:
                    percentagePosition === 'bottom-left' || percentagePosition === 'top-left'
                      ? 'flex-start'
                      : 'center',
                }}
              >
                {percentage}
                {showPercentageSign && <span>%</span>}
              </div>
            )}

            {/* Circle Spinner */}
            {variant === 'circle' && (
              <svg className="rb-preloader-spinner-svg" viewBox="0 0 50 50">
                <circle
                  className="rb-preloader-spinner-circle"
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  strokeWidth="3.5"
                />
              </svg>
            )}

            {/* Brand badge & Minimal Human Text */}
            <div className="rb-preloader-brand-badge">
              <span className="rb-preloader-dot" />
              <span>Sahil</span>
            </div>

            {loadingText && (
              <h2 className={`rb-preloader-text ${textClassName}`}>
                {loadingText}
              </h2>
            )}

            <span className="rb-preloader-subtext">Creative Engineering</span>
          </motion.div>

          {/* Progress bar for Percentage variant */}
          {variant === 'percentage' && showProgressBar && (
            <div className={`rb-preloader-progress-track position-${progressBarPosition}`}>
              <div
                className="rb-preloader-progress-fill"
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}

          <div className="rb-preloader-skip-hint">Press Esc or Click to Skip</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
