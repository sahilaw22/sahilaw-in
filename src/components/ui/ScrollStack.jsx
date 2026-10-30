import React, { useEffect, useRef } from 'react';
import './ScrollStack.css';

/**
 * ScrollStack - React Bits Component
 * Variant: deck
 *
 * Implements stacking card animation using requestAnimationFrame and scroll tracking:
 * Each card stays sticky and progressively stacks into a deck, scaling down, dimming,
 * and offsetting as following cards scroll over it.
 */
export function ScrollStack({
  children,
  className = '',
  itemDistance = 90,
  itemScale = 0.045,
  itemStackDistance = 20,
  baseScale = 0.84,
  blurAmount = 2.5,
  variant = 'deck',
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.scroll-stack-item'));
    if (!cards.length) return;

    let ticking = false;

    const updateStack = () => {
      const windowHeight = window.innerHeight;
      const stackTop = windowHeight * 0.16; // Pinning position from top of viewport

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardTop = rect.top;

        // How much of the subsequent cards have scrolled past this card's sticky trigger
        // Look at the cards coming after this one
        let stackedCoverCount = 0;
        for (let j = index + 1; j < cards.length; j++) {
          const nextRect = cards[j].getBoundingClientRect();
          // Distance from next card to the stack top
          const distToTop = nextRect.top - stackTop;
          if (distToTop < 200) {
            // Next card is encroaching or stacking on top
            const progress = Math.max(0, Math.min(1, (200 - distToTop) / 200));
            stackedCoverCount += progress;
          }
        }

        // Apply deck variant transformations
        if (stackedCoverCount > 0) {
          const scale = Math.max(baseScale, 1 - stackedCoverCount * itemScale);
          const translateY = -(stackedCoverCount * (itemStackDistance * 0.4));
          const opacity = Math.max(0.35, 1 - stackedCoverCount * 0.18);
          const blur = Math.min(blurAmount, stackedCoverCount * (blurAmount * 0.7));

          card.style.transform = `scale(${scale.toFixed(4)}) translateY(${translateY.toFixed(1)}px)`;
          card.style.opacity = `${opacity.toFixed(3)}`;
          card.style.filter = blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : 'none';
        } else {
          // Card is at rest or active
          card.style.transform = 'scale(1) translateY(0px)';
          card.style.opacity = '1';
          card.style.filter = 'none';
        }
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
  }, [itemDistance, itemScale, itemStackDistance, baseScale, blurAmount, variant]);

  return (
    <div
      ref={containerRef}
      className={`scroll-stack-container ${className}`}
      data-variant={variant}
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

