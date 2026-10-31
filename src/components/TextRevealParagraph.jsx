import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TECH_ICON_MAP = {
  figma: 'figma',
  react: 'react',
  typescript: 'ts',
  flutter: 'flutter',
  tailwind: 'tailwind',
  tailwindcss: 'tailwind',
  'tailwind css': 'tailwind',
  next: 'nextjs',
  nextjs: 'nextjs',
  'next.js': 'nextjs',
  python: 'py',
  js: 'js',
  javascript: 'js',
  node: 'nodejs',
  nodejs: 'nodejs',
  go: 'go',
  golang: 'go',
  cpp: 'cpp',
  cs: 'cs',
};

function tokenizeParagraph(para) {
  if (!para) return [];

  // Strip any legacy explicit {{ICON_...}} tags so no uppercase letters leak into the DOM
  let cleaned = para.replace(/craft\s+\{\{(?:ICON_|icon:)?figma\}\}/gi, 'craft in Figma');
  cleaned = cleaned.replace(/\{\{(?:ICON_|icon:)?[A-Za-z0-9_-]+\}\}/gi, '');

  // Detect tech keywords and place icon token before the tech name
  const techRegex = /\b(Tailwind(?:\s+CSS)?|Next\.?js|TypeScript|Flutter|React|Figma|Python)\b([.,!?;:]*)/gi;
  const preprocessed = cleaned.replace(techRegex, (match, techName, punct) => {
    const key = techName.toLowerCase();
    const iconKey = TECH_ICON_MAP[key] || key;
    return `:::ICON:${iconKey}::: ${techName}${punct || ''}`;
  });

  const words = preprocessed.split(/\s+/).filter(Boolean);
  const tokens = [];

  for (const word of words) {
    const iconMatch = word.match(/^:::ICON:([a-z0-9_-]+):::$/i);
    if (iconMatch) {
      tokens.push({
        isIcon: true,
        iconName: iconMatch[1].toLowerCase(),
      });
    } else {
      tokens.push({ isIcon: false, text: word });
    }
  }

  return tokens;
}

export default function TextRevealParagraph({ paragraphs }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const words = Array.from(el.querySelectorAll('.tr-word'));
    if (!words.length) return undefined;

    words.forEach((w) => {
      w.style.opacity = '0.28';
      const s = w.querySelector('.tr-word-text');
      if (s) s.style.opacity = '0.28';
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

          const targetOpacity = 0.28 + wordProgress * 0.72;
          word.style.opacity = targetOpacity;

          if (wordText) {
            wordText.style.opacity = Math.max(0.28, wordProgress);
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
          const tokens = tokenizeParagraph(para);
          return (
            <p key={pIdx} className="tr-paragraph">
              {tokens.map((token, tIdx) => {
                if (token.isIcon) {
                  return (
                    <span key={tIdx} className="tr-word word inline-icon-wrapper">
                      <img
                        src={`https://skillicons.dev/icons?i=${token.iconName}`}
                        alt=""
                        aria-hidden="true"
                        className="about-skill-icon"
                        width={24}
                        height={24}
                        loading="lazy"
                      />
                    </span>
                  );
                }

                return (
                  <span key={tIdx} className="tr-word word">
                    <span className="tr-word-text">{token.text}</span>
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
