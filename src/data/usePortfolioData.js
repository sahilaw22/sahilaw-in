import { useState, useEffect, useCallback } from 'react';
import { supabase, fetchPortfolioDirectFromSupabase } from '../lib/supabaseClient.js';
import {
  HERO_ROLES,
  ACTION_WORDS,
  ABOUT_PARAGRAPHS,
  EXPERIENCES,
  EDUCATION_ITEMS,
  SKILL_CATEGORIES,
  CERTIFICATIONS,
  ACHIEVEMENTS,
  PROJECTS,
  TESTIMONIALS,
} from './portfolioData.jsx';

// Bump storage key to bust any previously corrupted/deserialized React element cache
const STORAGE_KEY = 'portfolio_content_cache_v14';

function cleanAboutParagraphs(paragraphs) {
  if (!Array.isArray(paragraphs)) return paragraphs;
  return paragraphs.map((p) => {
    if (typeof p !== 'string') return p;
    let s = p.replace(/\s*(at\s+)?GCET\s+Jammu/gi, '');
    s = s.replace(/(:::ICON:[^:]*:::)+/gi, '');
    s = s.replace(/\{\{(?:ICON_|icon:)[A-Za-z0-9_-]+\}\}/gi, '');
    s = s.replace(/\b([a-z0-9_-]+):::\1:::/gi, '');
    s = s.replace(/:::[^:]*:::/g, '');
    s = s.replace(/\bith\b/g, 'with');
    s = s.replace(/\s{2,}/g, ' ').trim();
    return s;
  });
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
  if (!Array.isArray(items)) return fallbackList;
  if (items.length === 0) return [];
  return items.map((item) => {
    if (!item) return item;
    const cleaned = { ...item };
    // If icon is an un-revived plain object from JSON, strip it so the component uses its built-in SVG
    if (cleaned.icon && typeof cleaned.icon === 'object' && !cleaned.icon.$$typeof) {
      delete cleaned.icon;
    }
    // Filter demo / placeholder images (e.g. Unsplash stock)
    if (Array.isArray(cleaned.photos)) {
      cleaned.photos = cleaned.photos.filter(
        (p) => p && typeof p === 'string' && !p.includes('unsplash.com') && !p.includes('placeholder')
      );
    }
    if (typeof cleaned.certificateImage === 'string' && (cleaned.certificateImage.includes('unsplash.com') || cleaned.certificateImage.includes('placeholder'))) {
      cleaned.certificateImage = '';
    }
    if (typeof cleaned.certificate_image_url === 'string' && (cleaned.certificate_image_url.includes('unsplash.com') || cleaned.certificate_image_url.includes('placeholder'))) {
      cleaned.certificate_image_url = '';
    }
    return cleaned;
  });
}

function cleanEducationItems(items) {
  if (!Array.isArray(items)) return EDUCATION_ITEMS;
  if (items.length === 0) return [];
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
      projects: PROJECTS,
      testimonials: TESTIMONIALS,
      education: EDUCATION_ITEMS,
      skills: cleanSkillCategories(SKILL_CATEGORIES),
      certifications: CERTIFICATIONS,
      achievements: ACHIEVEMENTS,
      social_links: [],
      custom_icons: [],
      meta: { hero_roles: HERO_ROLES, action_words: ACTION_WORDS },
      action_words: ACTION_WORDS,
    };
  }

  try {
    // Purge old cache keys
    localStorage.removeItem('portfolio_content_cache_v9');
    localStorage.removeItem('portfolio_content_cache_v10');
    localStorage.removeItem('portfolio_content_cache_v12');

    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        about: cleanAboutParagraphs(parsed.about || ABOUT_PARAGRAPHS),
        experiences: parsed.experiences || EXPERIENCES,
        projects: parsed.projects || PROJECTS,
        testimonials: parsed.testimonials || TESTIMONIALS,
        education: cleanEducationItems(parsed.education),
        skills: cleanSkillCategories(parsed.skills || SKILL_CATEGORIES),
        certifications: cleanCertOrAchieveItems(parsed.certifications, CERTIFICATIONS),
        achievements: cleanCertOrAchieveItems(parsed.achievements, ACHIEVEMENTS),
        social_links: parsed.social_links || [],
        custom_icons: parsed.custom_icons || [],
        meta: parsed.meta || { hero_roles: HERO_ROLES, action_words: ACTION_WORDS },
        action_words: parsed.action_words || parsed.meta?.action_words || ACTION_WORDS,
      };
    }
  } catch {
    // Ignore JSON parse errors
  }

  return {
    about: cleanAboutParagraphs(ABOUT_PARAGRAPHS),
    experiences: EXPERIENCES,
    projects: PROJECTS,
    testimonials: TESTIMONIALS,
    education: EDUCATION_ITEMS,
    skills: cleanSkillCategories(SKILL_CATEGORIES),
    certifications: CERTIFICATIONS,
    achievements: ACHIEVEMENTS,
    social_links: [],
    custom_icons: [],
    meta: { hero_roles: HERO_ROLES, action_words: ACTION_WORDS },
    action_words: ACTION_WORDS,
  };
}

export function usePortfolioData() {
  const [data, setData] = useState(getInitialState);

  const fetchContent = useCallback(async () => {
    let resolvedContent = null;

    try {
      const res = await fetch('/api/portfolio-content');
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.content) {
          resolvedContent = json.content;
        }
      }
    } catch {
      // Local API unavailable or running static on Vercel
    }

    // Direct Supabase fallback: when running on static Vercel or if server API gave no content
    if (!resolvedContent && supabase) {
      try {
        const directSupa = await fetchPortfolioDirectFromSupabase();
        if (directSupa) {
          resolvedContent = directSupa;
        }
      } catch {
        // Fall back to initial state
      }
    }

    if (resolvedContent) {
      const fresh = {
        about: cleanAboutParagraphs(Array.isArray(resolvedContent.about) ? resolvedContent.about : ABOUT_PARAGRAPHS),
        experiences: Array.isArray(resolvedContent.experiences) ? resolvedContent.experiences : EXPERIENCES,
        projects: Array.isArray(resolvedContent.projects) ? resolvedContent.projects : PROJECTS,
        testimonials: Array.isArray(resolvedContent.testimonials) ? resolvedContent.testimonials : TESTIMONIALS,
        education: cleanEducationItems(Array.isArray(resolvedContent.education) ? resolvedContent.education : EDUCATION_ITEMS),
        skills: cleanSkillCategories(Array.isArray(resolvedContent.skills) ? resolvedContent.skills : SKILL_CATEGORIES),
        certifications: cleanCertOrAchieveItems(Array.isArray(resolvedContent.certifications) ? resolvedContent.certifications : CERTIFICATIONS, CERTIFICATIONS),
        achievements: cleanCertOrAchieveItems(Array.isArray(resolvedContent.achievements) ? resolvedContent.achievements : ACHIEVEMENTS, ACHIEVEMENTS),
        social_links: Array.isArray(resolvedContent.social_links) ? resolvedContent.social_links : [],
        custom_icons: Array.isArray(resolvedContent.custom_icons) ? resolvedContent.custom_icons : [],
        meta: resolvedContent.meta || { hero_roles: HERO_ROLES, action_words: ACTION_WORDS },
        action_words: Array.isArray(resolvedContent.action_words)
          ? resolvedContent.action_words
          : (Array.isArray(resolvedContent.meta?.action_words) ? resolvedContent.meta.action_words : ACTION_WORDS),
      };
      setData(fresh);
      try {
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
  }, []);

  useEffect(() => {
    fetchContent();

    // Supabase Realtime subscription for live instant updates
    let channel = null;
    if (supabase) {
      try {
        channel = supabase
          .channel('public_portfolio_sync')
          .on('postgres_changes', { event: '*', schema: 'public' }, () => {
            fetchContent();
          })
          .subscribe();
      } catch {
        // Fallback silently
      }
    }

    function handleUpdate(e) {
      if (e?.detail) {
        setData((prev) => {
          const next = { ...prev, ...e.detail };
          if (e.detail.meta && Array.isArray(e.detail.meta.action_words)) {
            next.action_words = e.detail.meta.action_words;
          }
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
      if (channel && supabase) {
        try {
          supabase.removeChannel(channel);
        } catch {}
      }
    };
  }, [fetchContent]);

  return {
    about: data.about || ABOUT_PARAGRAPHS,
    experiences: data.experiences || EXPERIENCES,
    projects: data.projects || PROJECTS,
    testimonials: data.testimonials || TESTIMONIALS,
    education: data.education || EDUCATION_ITEMS,
    skills: data.skills || SKILL_CATEGORIES,
    certifications: data.certifications || CERTIFICATIONS,
    achievements: data.achievements || ACHIEVEMENTS,
    custom_icons: data.custom_icons || [],
    meta: data.meta || { hero_roles: HERO_ROLES, action_words: ACTION_WORDS },
    action_words: data.meta?.action_words || data.action_words || ACTION_WORDS,
    refresh: fetchContent,
  };
}
