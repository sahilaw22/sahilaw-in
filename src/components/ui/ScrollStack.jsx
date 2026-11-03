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
 * - Card 2 glides up and docks over Card 1 (step offset 52px).
 * - Card 3 glides up and docks over Card 2 (step offset 78px).
 * - Each card underneath scales down (0.965, 0.930, 0.895) with top-center origin,
 *   keeping the top tab and shoulders visible in a cascading deck.
 * Once all cards are stacked, the pin releases and the entire deck moves
 * upward together into the next section.
 */
export function ScrollStack({ children, header, footer, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const stage = container.querySelector('.scroll-stack-stage');
    const items = Array.from((stage || container).querySelectorAll('.scroll-stack-item'));
    if (!items.length) return undefined;

    const cards = items.map((item) => item.querySelector('.scroll-stack-card') || item);
    const total = items.length;

        const isMobile = window.innerWidth <= 768;
    const stepDistance = isMobile ? 20 : 26;
    const scaleFactor = 0.035;

    // Initial setup:
    // Card 0 (Sahil Recreation) is active at y = 0, scale = 1, opacity = 1
    // Cards 1..N (Lurian AI, Web Audio Synth, ConnectKit) are tucked offscreen below with opacity 0
    // so the bottom cards never show or move prematurely
    cards.forEach((card, i) => {
      gsap.set(items[i], {
        zIndex: 10 + i,
        y: 0,
        yPercent: i === 0 ? 0 : 250,
        opacity: 1,
      });
      gsap.set(card, {
        scale: 1,
        transformOrigin: 'top center',
      });
    });

    const footerEl = container.querySelector('.scroll-stack-pinned-footer');
    if (footerEl) {
      gsap.set(footerEl, {
        opacity: 0,
        yPercent: 120,
        y: 0,
        pointerEvents: 'none',
      });
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: isMobile ? 'top 86px' : 'top 52px',
          end: () => `+=${total * (window.innerHeight * 0.72)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.65,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      // Animate each card sequentially
      for (let i = 1; i < total; i++) {
        const targetY = i * stepDistance;
        const stepLabel = `step-${i}`;

        tl.to(
          items[i],
          {
            yPercent: 0,
            y: targetY,
            opacity: 1,
            ease: 'power1.out',
            duration: 1,
          },
          stepLabel
        );

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
            stepLabel
          );
        }
      }

      // After the last card is docked, animate the explore button following the stack glide
      if (footerEl) {
        const lastStepLabel = `step-${total}`;
        tl.to(
          footerEl,
          {
            yPercent: 0,
            y: 0,
            opacity: 1,
            pointerEvents: 'auto',
            ease: 'power2.out',
            duration: 1.1,
          },
          lastStepLabel
        );
      }
    }, container);

    // Refresh ScrollTrigger after slight delay to ensure all assets are laid out
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [React.Children.count(children)]);

  return (
    <div ref={containerRef} className={`scroll-stack-wrapper ${className}`}>
      {header && <div className="scroll-stack-pinned-header">{header}</div>}
      <div className="scroll-stack-stage">{children}</div>
      {footer && <div className="scroll-stack-pinned-footer">{footer}</div>}
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
