import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollStack.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ScrollStack Component - GSAP Pinned Cascading Deck
 *
 * Implements stacking card animation matching the user's reference diagram:
 * When the section reaches reading position, it pins in place.
 * As the user scrolls:
 * - Card 0 is in place.
 * - Card 1 glides up and docks over Card 0 (step offset 26px).
 * - Card 2 glides up and docks over Card 1.
 * - Card 3 glides up and docks over Card 2.
 * - Each card underneath scales down (0.965, 0.930, 0.895) with top-center origin,
 *   keeping the top tab and shoulders visible in a cascading deck.
 * Once all cards are stacked, the pin releases and the entire deck moves
 * upward together into the next section.
 */
export function ScrollStack({ children, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const items = Array.from(container.querySelectorAll('.scroll-stack-item'));
    if (!items.length) return undefined;

    const cards = items.map((item) => item.querySelector('.scroll-stack-card') || item);
    const total = items.length;

    if (prefersReducedMotion) {
      items.forEach((item) => {
        item.style.position = 'relative';
        item.style.marginBottom = '2rem';
      });
      return undefined;
    }

    const isMobile = window.innerWidth <= 768;
    const stepDistance = isMobile ? 20 : 26;
    const scaleFactor = 0.035;

    // Initial setup:
    // Card 0 sits active at top
    // Cards 1..N sit below the stage
    cards.forEach((card, i) => {
      gsap.set(items[i], { zIndex: 10 + i });
      if (i > 0) {
        gsap.set(items[i], {
          yPercent: 130,
          opacity: 1,
        });
      }
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 14%',
          end: () => `+=${(total - 1) * (window.innerHeight * 0.72)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Animate each subsequent card gliding into place
      for (let i = 1; i < total; i++) {
        const targetY = i * stepDistance;

        // Card i slides up into stack position
        tl.to(
          items[i],
          {
            yPercent: 0,
            y: targetY,
            ease: 'power1.out',
            duration: 1,
          },
          `step-${i}`
        );

        // Scale down all earlier cards in the stack
        for (let prev = 0; prev < i; prev++) {
          const depth = i - prev;
          const targetScale = Math.max(0.88, 1 - depth * scaleFactor);

          tl.to(
            cards[prev],
            {
              scale: targetScale,
              transformOrigin: 'top center',
              ease: 'power1.out',
              duration: 1,
            },
            `step-${i}`
          );
        }
      }
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className={`scroll-stack-wrapper ${className}`}>
      <div className="scroll-stack-stage">{children}</div>
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
