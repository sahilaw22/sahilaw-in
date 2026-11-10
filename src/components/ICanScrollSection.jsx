import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioData } from '../data/usePortfolioData.js';
import { ACTION_WORDS as DEFAULT_ACTION_WORDS } from '../data/portfolioData.jsx';
import './ICanScrollSection.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ICanScrollSection() {
  const sectionRef = useRef(null);
  const wordsRef = useRef(null);

  // Dynamic portfolio content with fallback
  const { action_words } = usePortfolioData();
  const ACTION_WORDS = Array.isArray(action_words) && action_words.length > 0
    ? action_words
    : DEFAULT_ACTION_WORDS;

  const actionWordsRef = useRef(ACTION_WORDS);
  actionWordsRef.current = ACTION_WORDS;

  // Desktop vs Mobile layout mode
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth > 768 : true
  );

  // Desktop wheel state
  const [desktopActiveIndex, setDesktopActiveIndex] = useState(0);
  const desktopActiveIndexRef = useRef(0);
  const lineHeight = 68;

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 768;
      setIsDesktop(desktop);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    let rafId = null;
    let targetIdx = 0;
    let isTicking = false;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const tickDesktop = () => {
      const diff = targetIdx - desktopActiveIndexRef.current;
      if (Math.abs(diff) > 0.001) {
        desktopActiveIndexRef.current = lerp(desktopActiveIndexRef.current, targetIdx, 0.22);
        setDesktopActiveIndex(desktopActiveIndexRef.current);
        rafId = requestAnimationFrame(tickDesktop);
      } else {
        desktopActiveIndexRef.current = targetIdx;
        setDesktopActiveIndex(targetIdx);
        isTicking = false;
      }
    };

    const updateScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = sectionRef.current.offsetHeight - vh;
      if (total <= 0) return;

      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));

      if (isDesktop) {
        // Desktop: 5-slot vertical rolling wheel animation
        const currentWords = actionWordsRef.current;
        const totalSteps = Math.max(1, currentWords.length - 1);
        let wordProgress = 0;
        if (p <= 0.08) {
          wordProgress = 0;
        } else if (p >= 0.92) {
          wordProgress = 1;
        } else {
          wordProgress = (p - 0.08) / 0.84;
        }

        targetIdx = wordProgress * totalSteps;

        if (!isTicking) {
          isTicking = true;
          rafId = requestAnimationFrame(tickDesktop);
        }
      } else {
        // Mobile: single-word cycle animation with stable endpoints
        if (!wordsRef.current) return;
        const currentWords = actionWordsRef.current;
        const items = Array.from(wordsRef.current.children);
        const totalWords = currentWords.length;
        if (totalWords === 0) return;

        let wordProgress = 0;
        if (p <= 0.03) {
          wordProgress = 0;
        } else if (p >= 0.97) {
          wordProgress = 1;
        } else {
          wordProgress = (p - 0.03) / 0.94;
        }

        if (totalWords === 1) {
          items.forEach((el, idx) => {
            el.style.opacity = idx === 0 ? '1' : '0';
            el.style.transform = 'translate3d(0, 0, 0)';
            el.style.visibility = idx === 0 ? 'visible' : 'hidden';
          });
          return;
        }

        const totalSteps = totalWords - 1;
        const stepProgress = wordProgress * totalSteps;
        const currIdx = Math.min(totalWords - 2, Math.floor(stepProgress));
        const fractional = Math.max(0, Math.min(1, stepProgress - currIdx));

        const transitionThreshold = 0.65;
        let easeT = 0;
        if (fractional > transitionThreshold) {
          const rawT = (fractional - transitionThreshold) / (1 - transitionThreshold);
          easeT = rawT * rawT * (3 - 2 * rawT);
        }

        items.forEach((el, idx) => {
          if (idx < currIdx) {
            el.style.opacity = '0';
            el.style.transform = 'translate3d(0, -40%, 0)';
            el.style.visibility = 'hidden';
          } else if (idx === currIdx) {
            const opacity = 1 - easeT;
            const yPercent = -40 * easeT;
            el.style.opacity = opacity.toFixed(4);
            el.style.transform = `translate3d(0, ${yPercent.toFixed(2)}%, 0)`;
            el.style.visibility = opacity > 0.005 ? 'visible' : 'hidden';
          } else if (idx === currIdx + 1) {
            const opacity = easeT;
            const yPercent = 40 * (1 - easeT);
            el.style.opacity = opacity.toFixed(4);
            el.style.transform = `translate3d(0, ${yPercent.toFixed(2)}%, 0)`;
            el.style.visibility = opacity > 0.005 ? 'visible' : 'hidden';
          } else {
            el.style.opacity = '0';
            el.style.transform = 'translate3d(0, 40%, 0)';
            el.style.visibility = 'hidden';
          }
        });
      }
    };

    updateScroll();

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: () => {
        updateScroll();
      },
    });

    window.addEventListener('scroll', updateScroll, { passive: true });

    const refreshTimer = setTimeout(() => {
      updateScroll();
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('scroll', updateScroll);
      if (rafId) cancelAnimationFrame(rafId);
      st.kill();
    };
  }, [isDesktop]);

  return (
    <section
      ref={sectionRef}
      className={`can ${isDesktop ? 'can-desktop-wheel' : 'can-mobile-cycle'}`}
      aria-label="Capabilities and actions"
    >
      <div className="stick">
        {isDesktop ? (
          /* Desktop: Refined 5-slot Vertical Rolling Wheel Animation */
          <div className="can-wheel-row">
            <h2 className="can-prefix">I can</h2>

            <div
              className="can-wheel-viewport"
              style={{ '--wheel-line-height': `${lineHeight}px` }}
            >
              <ul
                className="can-wheel-track"
                style={{
                  transform: `translate3d(0, ${(2 - desktopActiveIndex) * lineHeight}px, 0)`,
                }}
                aria-hidden="true"
              >
                {ACTION_WORDS.map((word, idx) => {
                  const signedDist = idx - desktopActiveIndex;
                  const dist = Math.abs(signedDist);
                  let opacity = 0;
                  let scale = 0.86;
                  let translateY = 0;
                  const isActive = dist < 0.45;

                  if (dist <= 0.45) {
                    // Center active word: full crisp prominence
                    const t = dist / 0.45;
                    opacity = 1.0 - t * 0.15;
                    scale = 1.04 - t * 0.04;
                    translateY = 0;
                  } else if (dist <= 1.1) {
                    // 1 slot away: clearly dimmer so center word dominates
                    const t = (dist - 0.45) / 0.65;
                    opacity = 0.85 - t * 0.53; // reaches ~0.32 at dist 1.1
                    scale = 1.00 - t * 0.07;
                    translateY = signedDist > 0 ? (t * 2) : (-t * 2);
                  } else if (dist <= 2.0) {
                    // 2 slots away: actively appearing from below or disappearing above
                    const t = (dist - 1.1) / 0.9;
                    const smoothFade = 1 - t * t * (3 - 2 * t);
                    opacity = 0.32 * smoothFade; // fades completely to 0 at dist 2.0
                    scale = 0.93 - t * 0.09;
                    // Motion: incoming words slide up into place; outgoing words slide up and away
                    translateY = signedDist > 0 ? (6 * t) : (-6 * t);
                  } else {
                    opacity = 0;
                    scale = 0.84;
                    translateY = signedDist > 0 ? 8 : -8;
                  }

                  return (
                    <li
                      key={`${word}-${idx}`}
                      className={`can-wheel-item ${isActive ? 'is-active' : ''}`}
                      style={{
                        opacity: Number(opacity.toFixed(4)),
                        visibility: opacity > 0.005 ? 'visible' : 'hidden',
                        transform: `scale(${scale.toFixed(3)}) translate3d(0, ${translateY.toFixed(1)}px, 0)`,
                      }}
                    >
                      <span className="can-word-text">{word}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          /* Mobile: Single-line Word Cycle Animation */
          <h2>
            <span className="can-prefix">I can</span>
            <ul ref={wordsRef} id="can-words" aria-hidden="true">
              {ACTION_WORDS.map((word, idx) => (
                <li key={`${word}-${idx}`}>{word}</li>
              ))}
            </ul>
            <span className="sr">
              {`I can ${ACTION_WORDS.map((w) => w.replace(/\.+$/, '')).join(', ')}.`}
            </span>
          </h2>
        )}
      </div>
    </section>
  );
}
