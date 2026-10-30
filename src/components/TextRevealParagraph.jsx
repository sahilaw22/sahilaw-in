import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// SkillIcons for the About narrative
const ICONS = {
  '{{ICON_FIGMA}}': (
    <img
      src="/icons/skillicons/figma.svg"
      alt="Figma"
      title="Figma (UI/UX)"
      className="about-skill-icon"
      onError={(e) => { e.currentTarget.src = 'https://skillicons.dev/icons?i=figma'; }}
    />
  ),
  '{{ICON_REACT}}': (
    <img
      src="/icons/skillicons/react.svg"
      alt="React"
      title="React.js"
      className="about-skill-icon"
      onError={(e) => { e.currentTarget.src = 'https://skillicons.dev/icons?i=react'; }}
    />
  ),
  '{{ICON_FLUTTER}}': (
    <img
      src="/icons/skillicons/flutter.svg"
      alt="Flutter"
      title="Flutter"
      className="about-skill-icon"
      onError={(e) => { e.currentTarget.src = 'https://skillicons.dev/icons?i=flutter'; }}
    />
  ),
};

export default function TextRevealParagraph({ paragraphs }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const words = Array.from(el.querySelectorAll('.tr-word'));
    if (!words.length) return undefined;

    words.forEach((w) => {
      w.style.opacity = '0.2';
      const s = w.querySelector('.tr-word-text');
      if (s) s.style.opacity = '0.25';
    });

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      end: 'bottom 45%',
      scrub: 0.6,
      onUpdate: (self) => {
        const progress = self.progress;
        const total = words.length;

        words.forEach((word, index) => {
          const wordText = word.querySelector('.tr-word-text');
          const start = index / total;
          const end = Math.min(1, start + 0.16);
          const duration = end - start;

          let wordProgress = 0;
          if (progress >= end) wordProgress = 1;
          else if (progress <= start) wordProgress = 0;
          else wordProgress = (progress - start) / duration;

          const targetOpacity = 0.2 + wordProgress * 0.8;
          word.style.opacity = targetOpacity;

          if (wordText) {
            wordText.style.opacity = Math.max(0.25, wordProgress);
          }
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [paragraphs]);

  return (
    <div ref={containerRef} className="anime-text-container">
      <div className="anime-text">
        {paragraphs.map((para, pIdx) => {
          const tokens = para.split(/\s+/).filter(Boolean);
          return (
            <p key={pIdx} className="tr-paragraph">
              {tokens.map((token, tIdx) => {
                const iconElement = ICONS[token];
                if (iconElement) {
                  return (
                    <span key={tIdx} className="tr-word word inline-icon-wrapper">
                      {iconElement}
                    </span>
                  );
                }

                return (
                  <span key={tIdx} className="tr-word word">
                    <span className="tr-word-text">{token}</span>
                  </span>
                );
              })}
            </p>
          );
        })}
      </div>
    </div>
  );
}
