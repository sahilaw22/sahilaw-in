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

  // Strip all corrupted tokens, legacy tags, and repeated token artifacts
  let cleaned = String(para)
    .replace(/(:::ICON:[^:]*:::)+/gi, '')
    .replace(/\{\{(?:ICON_|icon:)[A-Za-z0-9_-]+\}\}/gi, '')
    .replace(/\b([a-z0-9_-]+):::\1:::/gi, '')
    .replace(/:::[^:]*:::/g, '')
    .replace(/\bith\b/g, 'with')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  const tokens = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Check two-word combo (e.g. "Tailwind CSS")
    const nextWord = words[i + 1] || '';
    const twoWordCandidate = `${word} ${nextWord}`.replace(/[.,!?;:]*$/, '');
    const twoWordMatch = twoWordCandidate.match(/^(Tailwind\s+CSS)$/i);

    if (twoWordMatch) {
      const punct = nextWord.match(/[.,!?;:]*$/)?.[0] || '';
      tokens.push({
        isIcon: true,
        iconName: 'tailwind',
      });
      tokens.push({
        isIcon: false,
        text: 'Tailwind',
      });
      tokens.push({
        isIcon: false,
        text: `CSS${punct}`,
      });
      i++;
      continue;
    }

    // Check single-word tech keywords
    const match = word.match(/^([A-Za-z0-9.]+)([.,!?;:]*)$/);
    if (match) {
      const core = match[1];
      const punct = match[2];
      const lower = core.toLowerCase();

      // Check if custom or standard tech icon
      const customSrc = customIconsMap[lower];
      const standardIcon = TECH_ICON_MAP[lower];

      if (standardIcon || customSrc) {
        tokens.push({
          isIcon: true,
          iconName: standardIcon || lower,
          customSrc,
        });
        tokens.push({
          isIcon: false,
          text: `${core}${punct}`,
        });
        continue;
      }
    }

    tokens.push({
      isIcon: false,
      text: word.replace(/\*\*/g, ''),
    });
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

    // Reset styles
    words.forEach((word) => {
      word.style.opacity = '0.28';
      const wordText = word.querySelector('.tr-word-text');
      if (wordText) wordText.style.opacity = '0.28';
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
