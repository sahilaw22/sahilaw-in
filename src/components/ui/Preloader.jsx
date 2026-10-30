import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

// Preloader: React Bits Pro (@reactbits-starter/preloader-tw)
// Supports 5 styles: 'stairs', 'curtain', 'slide', 'circle', 'percentage'
// Default: 'stairs' on solid #f0191a canvas, white "Glad you're here" in Caacupe One hero font
export default function Preloader({
  variant = 'stairs',
  text,
  loadingText = "Glad you're here",
  stairCount = 10,
  stairsRevealFrom = 'left',
  stairsRevealDirection = 'up',
  duration = 1800,
  position = 'fixed',
  zIndex = 99999,
  bgColor = '#f0191a',
  percentagePosition = 'center',
  showPercentageSign = true,
  showProgressBar = true,
  progressBarPosition = 'bottom',
  textClassName = '',
  percentageTextClassName = '',
  active,
  loading,
  onComplete,
}) {
  const displayText = text || loadingText;
  const isControlled = typeof active === 'boolean' || typeof loading === 'boolean';
  const controlledVal = typeof active === 'boolean' ? active : loading;
  const [internalActive, setInternalActive] = useState(true);
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  const isActive = isControlled ? controlledVal : internalActive;

  const handleDismiss = () => {
    if (!isControlled) {
      setInternalActive(false);
    }
  };

  useEffect(() => {
    if (!isActive) return;

    if (variant === 'percentage') {
      const start = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const next = Math.min(100, Math.round((elapsed / duration) * 100));
        setProgress(next);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => handleDismiss(), 180);
        }
      }, 25);
      return () => clearInterval(interval);
    }

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [isActive, duration, isControlled, variant]);

  // Click or key to skip
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

  const getStairDelay = (index) => {
    const stepDuration = 0.045;
    if (stairsRevealFrom === 'right') {
      return (stairCount - 1 - index) * stepDuration;
    }
    if (stairsRevealFrom === 'center') {
      const mid = (stairCount - 1) / 2;
      return Math.abs(index - mid) * (stepDuration * 1.3);
    }
    return index * stepDuration;
  };

  const exitY = stairsRevealDirection === 'down' ? '100%' : '-100%';

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isActive && (
        <motion.div
          key="rb-preloader-root"
          className={`rb-preloader-root variant-${variant}`}
          style={{
            position,
            zIndex,
            backgroundColor: bgColor,
            '--preloader-bg': bgColor,
            '--preloader-stair-bg': bgColor,
          }}
          onClick={handleDismiss}
          role="dialog"
          aria-label="Welcome screen"
        >
          {/* Variant 1: Stairs (signature React Bits Pro stair reveal) */}
          {variant === 'stairs' && (
            <div className="rb-preloader-stairs-wrap">
              {Array.from({ length: stairCount }).map((_, i) => (
                <motion.div
                  key={`stair-${i}`}
                  className="rb-preloader-stair-col"
                  style={{
                    width: `calc(100% / ${stairCount} + 0.5px)`,
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

          {/* Variant 2: Curtain (split horizontal reveal) */}
          {variant === 'curtain' && (
            <div className="rb-preloader-curtain-wrap">
              <motion.div
                className="rb-preloader-curtain-half left"
                style={{ backgroundColor: bgColor }}
                initial={{ x: '0%' }}
                exit={{
                  x: '-100%',
                  transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
                }}
              />
              <motion.div
                className="rb-preloader-curtain-half right"
                style={{ backgroundColor: bgColor }}
                initial={{ x: '0%' }}
                exit={{
                  x: '100%',
                  transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
                }}
              />
            </div>
          )}

          {/* Variant 3: Slide (monolithic vertical or horizontal slide) */}
          {variant === 'slide' && (
            <motion.div
              className="rb-preloader-slide-overlay"
              style={{ backgroundColor: bgColor }}
              initial={{ y: '0%' }}
              exit={{
                y: exitY,
                transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
              }}
            />
          )}

          {/* Variant 4: Circle (expanding circular mask) */}
          {variant === 'circle' && (
            <motion.div
              className="rb-preloader-circle-overlay"
              style={{ backgroundColor: bgColor }}
              initial={{ clipPath: 'circle(100% at 50% 50%)' }}
              exit={{
                clipPath: 'circle(0% at 50% 50%)',
                transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
              }}
            />
          )}

          {/* Typography: Caacupe One hero font */}
          <motion.div
            className={`rb-preloader-text-wrap ${textClassName}`}
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{
              opacity: 0,
              y: -14,
              filter: 'blur(4px)',
              transition: { duration: 0.35, ease: 'easeOut' },
            }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {variant === 'percentage' ? (
              <div className={`rb-preloader-percentage-box ${percentagePosition}`}>
                <h1 className={`rb-preloader-percentage-num ${percentageTextClassName}`}>
                  {progress}
                  {showPercentageSign && '%'}
                </h1>
                <p className="rb-preloader-percentage-sub">{displayText}</p>
                {showProgressBar && (
                  <div className={`rb-preloader-progressbar ${progressBarPosition}`}>
                    <div
                      className="rb-preloader-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <h1 className="rb-preloader-heading">{displayText}</h1>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
