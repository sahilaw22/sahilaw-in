import { useState, useEffect, useCallback } from 'react';
import {
  HERO_ROLES,
  ABOUT_PARAGRAPHS,
  EXPERIENCES,
  EDUCATION_ITEMS,
  SKILL_CATEGORIES,
  CERTIFICATIONS,
  ACHIEVEMENTS,
} from './portfolioData.jsx';

// Bump storage key to bust any previously corrupted/deserialized React element cache
const STORAGE_KEY = 'portfolio_content_cache_v12';

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

/**
 * Sanitize items loaded from JSON or cache to strip non-string / un-revived serialized JSX icons
 * which cause React "Objects are not valid as a React child" errors.
 */
function cleanCertOrAchieveItems(items, fallbackList) {
  if (!Array.isArray(items) || items.length === 0) return fallbackList;
  return items.map((item) => {
    if (!item) return item;
    const cleaned = { ...item };
    // If icon is an un-revived plain object from JSON, strip it so the component uses its built-in SVG
    if (cleaned.icon && typeof cleaned.icon === 'object' && !cleaned.icon.$$typeof) {
      delete cleaned.icon;
    }
    return cleaned;
  });
}

function cleanEducationItems(items) {
  if (!Array.isArray(items) || items.length === 0) return EDUCATION_ITEMS;
  return items.map((item) => {
    if (!item) return item;
    const cleaned = { ...item };
    if (cleaned.logo && typeof cleaned.logo === 'object' && !cleaned.logo.$$typeof) {
      delete cleaned.logo;
    }
    return cleaned;
  });
}

function getInitialState() {
  if (typeof window === 'undefined') {
    return {
      about: cleanAboutParagraphs(ABOUT_PARAGRAPHS),
      experiences: EXPERIENCES,
      education: EDUCATION_ITEMS,
      skills: cleanSkillCategories(SKILL_CATEGORIES),
      certifications: CERTIFICATIONS,
      achievements: ACHIEVEMENTS,
      custom_icons: [],
      meta: { hero_roles: HERO_ROLES },
    };
  }

  try {
    // Purge old corrupted v9 cache if present
    localStorage.removeItem('portfolio_content_cache_v9');
    localStorage.removeItem('portfolio_content_cache_v10');

    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        about: cleanAboutParagraphs(parsed.about || ABOUT_PARAGRAPHS),
        experiences: parsed.experiences || EXPERIENCES,
        education: cleanEducationItems(parsed.education),
        skills: cleanSkillCategories(parsed.skills || SKILL_CATEGORIES),
        certifications: cleanCertOrAchieveItems(parsed.certifications, CERTIFICATIONS),
        achievements: cleanCertOrAchieveItems(parsed.achievements, ACHIEVEMENTS),
        custom_icons: parsed.custom_icons || [],
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
    certifications: CERTIFICATIONS,
    achievements: ACHIEVEMENTS,
    custom_icons: [],
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
          education: cleanEducationItems(json.content.education),
          skills: cleanSkillCategories(json.content.skills || SKILL_CATEGORIES),
          certifications: cleanCertOrAchieveItems(json.content.certifications, CERTIFICATIONS),
          achievements: cleanCertOrAchieveItems(json.content.achievements, ACHIEVEMENTS),
          custom_icons: json.content.custom_icons || [],
          meta: json.content.meta || { hero_roles: HERO_ROLES },
        };
        setData(fresh);
        try {
          // Prepare clean clone without JSX objects for storage
          const serializable = {
            ...fresh,
            certifications: cleanCertOrAchieveItems(fresh.certifications, []),
            achievements: cleanCertOrAchieveItems(fresh.achievements, []),
            education: cleanEducationItems(fresh.education),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
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
    certifications: data.certifications || CERTIFICATIONS,
    achievements: data.achievements || ACHIEVEMENTS,
    custom_icons: data.custom_icons || [],
    meta: data.meta || { hero_roles: HERO_ROLES },
    refresh: fetchContent,
  };
}
