import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ALIAS_MAP = {
  typescript: 'ts',
  javascript: 'js',
  python: 'py',
  node: 'nodejs',
  nodejs: 'nodejs',
  tailwind: 'tailwind',
  next: 'nextjs',
  nextjs: 'nextjs',
  golang: 'go',
  cpp: 'cpp',
  cs: 'cs',
  cplusplus: 'cpp',
  csharp: 'cs',
};

function getSkillIconElement(rawName) {
  const raw = (rawName || '').toLowerCase();
  const iconId = ALIAS_MAP[raw] || raw;
  return (
    <img
      src={`https://skillicons.dev/icons?i=${iconId}`}
      alt={raw}
      title={raw.toUpperCase()}
      className="about-skill-icon"
      width={24}
      height={24}
      loading="lazy"
    />
  );
}

function tokenizeParagraph(para) {
  if (!para) return [];
  const iconPattern = /(\{\{(?:ICON_|icon:)[A-Za-z0-9_-]+\}\}|https:\/\/skillicons\.dev\/icons\?i=[A-Za-z0-9_,-]+)/gi;
  const parts = para.split(iconPattern);
  const result = [];

  for (const part of parts) {
    if (!part) continue;
    const match =
      part.match(/^\{\{(?:ICON_|icon:)([A-Za-z0-9_-]+)\}\}$/i) ||
      part.match(/^https:\/\/skillicons\.dev\/icons\?i=([A-Za-z0-9_,-]+)$/i);
    if (match) {
      result.push({ isIcon: true, iconName: match[1].toLowerCase() });
    } else {
      const words = part.split(/\s+/).filter(Boolean);
      for (const w of words) {
        result.push({ isIcon: false, text: w });
      }
    }
  }

  return result;
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
                    <span key={tIdx} className="tr-word word inline-icon-wrapper" title={token.iconName}>
                      {getSkillIconElement(token.iconName)}
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
