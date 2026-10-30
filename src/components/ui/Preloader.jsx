import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

// Preloader: React Bits Pro (@reactbits-starter/preloader-tw)
// Centered pixel "Loading" text with reddish staircase transition
export default function Preloader({
  stairCount = 10,
  stairsRevealFrom = 'left',
  stairsRevealDirection = 'up',
  duration = 1600,
  position = 'fixed',
  zIndex = 99999,
  bgColor = '#0a0305',
  stairColor = 'linear-gradient(180deg, #991b1b 0%, #dc2626 50%, #7f1d1d 100%)',
  active,
  onComplete,
}) {
  const isControlled = typeof active === 'boolean';
  const [internalActive, setInternalActive] = useState(true);
  const completedRef = useRef(false);

  const isActive = isControlled ? active : internalActive;

  const handleDismiss = () => {
    if (!isControlled) {
      setInternalActive(false);
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [isActive, duration, isControlled]);

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

  // Compute stair stagger delay
  const getStairDelay = (index) => {
    const stepDuration = 0.04;
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
          className="rb-preloader-root"
          style={{
            position,
            zIndex,
            backgroundColor: bgColor,
            '--preloader-stair-bg': stairColor,
          }}
          onClick={handleDismiss}
          role="dialog"
          aria-label="Loading preview"
        >
          {/* Reddish Stairs Transition Columns */}
          <div className="rb-preloader-stairs-wrap">
            {Array.from({ length: stairCount }).map((_, i) => (
              <motion.div
                key={`stair-${i}`}
                className="rb-preloader-stair-col"
                style={{
                  width: `${100 / stairCount}%`,
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

          {/* Centered Pixel Typography: Only "Loading", nothing else */}
          <motion.div
            className="rb-preloader-pixel-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.05,
              transition: { duration: 0.26, ease: 'easeOut' },
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <h1 className="rb-preloader-pixel-text">Loading</h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
