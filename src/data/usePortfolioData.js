import { useState, useEffect, useCallback } from 'react';
import {
  HERO_ROLES,
  ABOUT_PARAGRAPHS,
  EXPERIENCES,
  EDUCATION_ITEMS,
  SKILL_CATEGORIES,
} from './portfolioData.jsx';

const STORAGE_KEY = 'portfolio_content_cache_v8';

function cleanAboutParagraphs(paragraphs) {
  if (!Array.isArray(paragraphs)) return paragraphs;
  return paragraphs.map((p) => (typeof p === 'string' ? p.replace(/\s*(at\s+)?GCET\s+Jammu/gi, '') : p));
}

function cleanSkillCategories(categories) {
  if (!Array.isArray(categories)) return categories;
  return categories
    .filter((cat) => {
      if (!cat) return false;
      const catName = (cat.category || '').trim().toLowerCase();
      if (catName === 'new category' || catName === 'newcategory') return false;
      return true;
    })
    .map((cat) => {
      const skills = Array.isArray(cat.skills)
        ? cat.skills.filter((s) => {
            if (!s) return false;
            const sName = (typeof s === 'string' ? s : s.name || '').trim().toLowerCase();
            return sName !== 'newskill' && sName !== 'new skill';
          })
        : [];
      return { ...cat, skills };
    });
}

function getInitialState() {
  if (typeof window === 'undefined') {
    return {
      about: cleanAboutParagraphs(ABOUT_PARAGRAPHS),
      experiences: EXPERIENCES,
      education: EDUCATION_ITEMS,
      skills: cleanSkillCategories(SKILL_CATEGORIES),
      meta: { hero_roles: HERO_ROLES },
    };
  }

  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        about: cleanAboutParagraphs(parsed.about || ABOUT_PARAGRAPHS),
        experiences: parsed.experiences || EXPERIENCES,
        education: parsed.education || EDUCATION_ITEMS,
        skills: cleanSkillCategories(parsed.skills || SKILL_CATEGORIES),
        meta: parsed.meta || { hero_roles: HERO_ROLES },
      };
    }
  } catch {
    // Ignore JSON parse errors
  }

  return {
    about: cleanAboutParagraphs(ABOUT_PARAGRAPHS),
    experiences: EXPERIENCES,
    education: EDUCATION_ITEMS,
    skills: cleanSkillCategories(SKILL_CATEGORIES),
    meta: { hero_roles: HERO_ROLES },
  };
}

export function usePortfolioData() {
  const [data, setData] = useState(getInitialState);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio-content');
      if (!res.ok) return;
      const json = await res.json();
      if (json && json.success && json.content) {
        const fresh = {
          about: cleanAboutParagraphs(json.content.about || ABOUT_PARAGRAPHS),
          experiences: json.content.experiences || EXPERIENCES,
          education: json.content.education || EDUCATION_ITEMS,
          skills: cleanSkillCategories(json.content.skills || SKILL_CATEGORIES),
          meta: json.content.meta || { hero_roles: HERO_ROLES },
        };
        setData(fresh);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        } catch {
          // Ignore storage quota
        }
      }
    } catch {
      // Offline or backend restarting, silently use local fallback
    }
  }, []);

  useEffect(() => {
    fetchContent();

    function handleUpdate(e) {
      if (e?.detail) {
        setData((prev) => {
          const next = { ...prev, ...e.detail };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch {}
          return next;
        });
      } else {
        fetchContent();
      }
    }

    window.addEventListener('portfolio-content-updated', handleUpdate);
    window.addEventListener('storage', fetchContent);

    return () => {
      window.removeEventListener('portfolio-content-updated', handleUpdate);
      window.removeEventListener('storage', fetchContent);
    };
  }, [fetchContent]);

  return {
    about: data.about || ABOUT_PARAGRAPHS,
    experiences: data.experiences || EXPERIENCES,
    education: data.education || EDUCATION_ITEMS,
    skills: data.skills || SKILL_CATEGORIES,
    meta: data.meta || { hero_roles: HERO_ROLES },
    refresh: fetchContent,
  };
}

