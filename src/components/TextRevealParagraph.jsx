import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioData } from '../data/usePortfolioData.js';

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
  git: 'git',
  docker: 'docker',
  vite: 'vite',
  html: 'html',
  css: 'css',
  firebase: 'firebase',
  supabase: 'supabase',
};

function tokenizeParagraph(para, customIconsMap = {}) {
  if (!para) return [];

  // Convert explicit {{ICON_...}} or {{icon:...}} to uniform tokens
  let preprocessed = para.replace(/\{\{(?:ICON_|icon:)([A-Za-z0-9_-]+)\}\}/gi, (match, iconName) => {
    return `:::ICON:${iconName.toLowerCase()}:::`;
  });

  // Detect tech keywords and place icon token before the tech name if not already preceded by an icon
  const techRegex = /\b(Tailwind(?:\s+CSS)?|Next\.?js|TypeScript|Flutter|React|Figma|Python)\b([.,!?;:]*)/gi;
  preprocessed = preprocessed.replace(techRegex, (match, techName, punct) => {
    const key = techName.toLowerCase();
    const iconKey = TECH_ICON_MAP[key] || key;
    return `:::ICON:${iconKey}::: ${techName}${punct || ''}`;
  });

  // Also support custom uploaded icons mentioned in text by name
  Object.keys(customIconsMap).forEach((customName) => {
    if (!customName || customName.length < 2) return;
    const escaped = customName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const customRegex = new RegExp(`(?<!:::ICON:[^:]*:::\\s*)\\b(${escaped})\\b([.,!?;:]*)`, 'gi');
    preprocessed = preprocessed.replace(customRegex, (match, word, punct) => {
      return `:::ICON:${customName.toLowerCase()}::: ${word}${punct || ''}`;
    });
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
  const { custom_icons } = usePortfolioData();

  // Create lookup dictionary for custom icons by lowercase name and token
  const customIconsMap = React.useMemo(() => {
    const map = {};
    if (Array.isArray(custom_icons)) {
      custom_icons.forEach((ic) => {
        if (!ic) return;
        const imgUrl = ic.image || ic.logo || ic.url;
        if (ic.name && imgUrl) {
          map[ic.name.toLowerCase().trim()] = imgUrl;
        }
        if (ic.token && imgUrl) {
          const cleanToken = ic.token.replace(/[{}]/g, '').replace(/^(?:ICON_|icon:)/i, '').toLowerCase().trim();
          map[cleanToken] = imgUrl;
        }
      });
    }
    return map;
  }, [custom_icons]);

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
          const tokens = tokenizeParagraph(para, customIconsMap);
          return (
            <p key={pIdx} className="tr-paragraph">
              {tokens.map((token, tIdx) => {
                if (token.isIcon) {
                  const customSrc = customIconsMap[token.iconName];
                  const resolvedIconName = TECH_ICON_MAP[token.iconName] || token.iconName;

                  return (
                    <span key={tIdx} className="tr-word word inline-icon-wrapper">
                      <img
                        src={customSrc || `https://skillicons.dev/icons?i=${resolvedIconName}`}
                        alt=""
                        aria-hidden="true"
                        className="about-skill-icon"
                        width={24}
                        height={24}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
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
