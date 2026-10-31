import React, { useEffect, useRef } from 'react';
import './ScrollStack.css';

/**
 * ScrollStack Component - Cascading Deck
 *
 * Implements stacking card animation matching the top-tab reference diagram:
 * Each card sticks at a progressive top offset:
 * Card 0 sticks at baseTop (e.g. 12vh)
 * Card 1 sticks at baseTop + 1 * step (e.g. 12vh + 26px)
 * Card 2 sticks at baseTop + 2 * step (e.g. 12vh + 52px)
 * Card 3 sticks at baseTop + 3 * step (e.g. 12vh + 78px)
 *
 * As cards stack over earlier cards, earlier cards gently scale down (0.965, 0.930, 0.895)
 * with transform-origin: top center, so their top tabs stay visible while their shoulders
 * taper in, perfectly creating the stepped card deck appearance.
 *
 * Once all cards are stacked, the entire deck naturally unpins and moves upward together
 * into the next section as you continue scrolling.
 */
export function ScrollStack({
  children,
  className = '',
  scaleStep = 0.035,
  minScale = 0.88,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = Array.from(container.querySelectorAll('.scroll-stack-item'));
    if (!cards.length) return;

    let ticking = false;

    const updateStack = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const isMobile = windowWidth <= 768;
      const baseTop = windowHeight * (isMobile ? 0.09 : 0.12);
      const stepDistance = isMobile ? 20 : 26;
      const approachDistance = windowHeight * 0.35;

      cards.forEach((card, index) => {
        let coverProgress = 0;

        for (let j = index + 1; j < cards.length; j++) {
          const nextCard = cards[j];
          const nextRect = nextCard.getBoundingClientRect();
          const nextTargetTop = baseTop + j * stepDistance;
          const dist = nextRect.top - nextTargetTop;

          if (dist <= 0) {
            coverProgress += 1;
          } else if (dist < approachDistance) {
            coverProgress += (approachDistance - dist) / approachDistance;
          }
        }

        const scale = Math.max(minScale, 1 - coverProgress * scaleStep);
        const innerCard = card.querySelector('.scroll-stack-card') || card;
        innerCard.style.transform = `scale(${scale.toFixed(4)})`;
        innerCard.style.transformOrigin = 'top center';
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateStack);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateStack();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [scaleStep, minScale]);

  return (
    <div
      ref={containerRef}
      className={`scroll-stack-container ${className}`}
    >
      {children}
    </div>
  );
}

export function ScrollStackItem({
  children,
  className = '',
  style = {},
  index = 0,
}) {
  return (
    <div
      className={`scroll-stack-item ${className}`}
      style={{
        '--stack-idx': index,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default ScrollStack;
