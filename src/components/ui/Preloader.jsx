import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

// Preloader: seamless background, refined green Welcome text, and smooth reveal
export default function Preloader({
  text = 'Welcome',
  stairCount = 8,
  stairsRevealFrom = 'left',
  stairsRevealDirection = 'up',
  duration = 1700,
  position = 'fixed',
  zIndex = 99999,
  bgColor = '#060709',
  textColor = '#61dca3',
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
          className="rb-preloader-root"
          style={{
            position,
            zIndex,
            backgroundColor: bgColor,
            '--preloader-bg': bgColor,
            '--preloader-stair-bg': bgColor,
            '--preloader-text-color': textColor,
          }}
          onClick={handleDismiss}
          role="dialog"
          aria-label="Loading preview"
        >
          {/* Seamless Transition Columns: zero borders, zero grid lines, zero shadows */}
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

          {/* Centered Green Welcome Typography */}
          <motion.div
            className="rb-preloader-welcome-wrap"
            initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{
              opacity: 0,
              y: -12,
              filter: 'blur(6px)',
              transition: { duration: 0.32, ease: 'easeOut' },
            }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="rb-preloader-welcome-text">{text}</h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
