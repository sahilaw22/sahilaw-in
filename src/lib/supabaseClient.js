import { createClient } from '@supabase/supabase-js';
import { parseCSV, resumeDataToModularCSVs, modularCSVRecordsToResume } from './csvHelper.js';

const env = typeof import.meta !== 'undefined' ? import.meta.env || {} : {};

const supabaseUrl =
  env.SUPABASE_URL ||
  env.VITE_SUPABASE_URL ||
  env.NEXT_PUBLIC_SUPABASE_URL ||
  '';

const supabaseAnonKey =
  env.SUPABASE_PUBLISHABLE_KEY ||
  env.SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.VITE_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseAnonKey.includes('your-anon-publishable-key')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Record a visitor analytics event in Supabase or via fallback API.
 * Never stores raw IP or sensitive data.
 */
export async function trackAnalyticsEvent(eventType, metadata = {}) {
  const path = typeof window !== 'undefined' ? window.location.hash || window.location.pathname || '/' : '/';
  const referrer = typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct';
  const sessionId = getOrCreateSessionId();
  const deviceType = getDeviceType();

  if (supabase) {
    try {
      const { error } = await supabase.from('analytics_events').insert([
        {
          event_type: eventType,
          path,
          project_id: metadata.project_id || null,
          referrer,
          session_id: sessionId,
          device_type: deviceType,
          metadata,
        },
      ]);
      if (!error) return;
    } catch {
      // Fall through to server API endpoint
    }
  }

  // Fallback to local server analytics ingestion
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        path,
        projectId: metadata.project_id || null,
        referrer,
        sessionId,
        deviceType,
        metadata,
      }),
    });
  } catch {
    // Analytics failures must never break the UI
  }
}

/**
 * Upload an image, logo, or video to Supabase Storage in portfolio-assets bucket.
 * Enforces folder prefixes and sanitized auto-renaming:
 * - Single item: <folder>/<slug>.<ext>
 * - Multi item:   <folder>/<slug>/<slug>_<timestamp>_<clean-name>.<ext>
 */
export async function uploadPortfolioAsset(file, options = {}) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file.');
  }

  const folder = typeof options === 'string' ? options : options.folder || 'misc';
  const slug = (options.slug || 'asset').toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
  const isMultiple = Boolean(options.multiple);

  const originalName = file.name || 'file';
  const ext = originalName.includes('.') ? originalName.split('.').pop().toLowerCase() : 'jpg';
  const cleanOriginal = originalName
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .slice(0, 30);

  let filePath = '';
  if (isMultiple) {
    filePath = `${folder}/${slug}/${slug}_${Date.now()}_${cleanOriginal}.${ext}`;
  } else {
    filePath = `${folder}/${slug}.${ext}`;
  }

  const { data, error } = await supabase.storage
    .from('portfolio-assets')
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: true,
      contentType: file.type || undefined,
    });

  if (error) {
    throw error;
  }

  const { data: publicData } = supabase.storage
    .from('portfolio-assets')
    .getPublicUrl(data.path);

  return {
    path: data.path,
    publicUrl: publicData?.publicUrl || '',
  };
}

/**
 * Remove an asset from Supabase Storage by public URL or relative path.
 */
export async function deletePortfolioAsset(fileUrlOrPath) {
  if (!supabase || !fileUrlOrPath) return false;

  try {
    let storagePath = fileUrlOrPath;
    if (fileUrlOrPath.includes('/portfolio-assets/')) {
      storagePath = fileUrlOrPath.split('/portfolio-assets/')[1].split('?')[0];
    } else if (fileUrlOrPath.startsWith('http')) {
      const parts = new URL(fileUrlOrPath).pathname.split('/');
      const bucketIdx = parts.indexOf('portfolio-assets');
      if (bucketIdx !== -1) {
        storagePath = parts.slice(bucketIdx + 1).join('/');
      }
    }

    const { error } = await supabase.storage
      .from('portfolio-assets')
      .remove([storagePath]);

    return !error;
  } catch (err) {
    console.warn('Failed to delete asset from storage:', err.message);
    return false;
  }
}

/**
 * Load resume data asynchronously from Supabase Storage resume/*.csv with fallback to local /data/resume/*.csv.
 */
export async function fetchResumeFromStorageOrFallback() {
  const tryFetchCsvText = async (pathInStorage, fallbackUrl) => {
    // 1. Try Supabase Storage first if configured
    if (supabase) {
      try {
        const { data, error } = await supabase.storage.from('portfolio-assets').download(pathInStorage);
        if (!error && data) {
          return await data.text();
        }
      } catch {
        // Fall through to public fetch
      }
    }

    // 2. Fetch local public asset fallback
    try {
      const res = await fetch(fallbackUrl, { cache: 'no-store' });
      if (res.ok) {
        return await res.text();
      }
    } catch {
      // ignore
    }

    return null;
  };

  try {
    const [profileText, expText, projText, eduText, certText] = await Promise.all([
      tryFetchCsvText('resume/resume_profile.csv', './data/resume/resume_profile.csv'),
      tryFetchCsvText('resume/resume_experience.csv', './data/resume/resume_experience.csv'),
      tryFetchCsvText('resume/resume_projects.csv', './data/resume/resume_projects.csv'),
      tryFetchCsvText('resume/resume_education.csv', './data/resume/resume_education.csv'),
      tryFetchCsvText('resume/resume_certifications.csv', './data/resume/resume_certifications.csv'),
    ]);

    if (profileText && (expText || projText)) {
      const profileRecs = parseCSV(profileText);
      const expRecs = expText ? parseCSV(expText) : [];
      const projRecs = projText ? parseCSV(projText) : [];
      const eduRecs = eduText ? parseCSV(eduText) : [];
      const certRecs = certText ? parseCSV(certText) : [];
      return modularCSVRecordsToResume(profileRecs, expRecs, projRecs, eduRecs, certRecs);
    }

    // Secondary fallback: Unified single resume.csv
    const unifiedText = await tryFetchCsvText('resume/resume.csv', './data/resume/resume.csv');
    if (unifiedText) {
      const unifiedRecs = parseCSV(unifiedText);
      const profileRecs = unifiedRecs.filter((r) => r.section === 'profile');
      const expRecs = unifiedRecs.filter((r) => r.section === 'experience');
      const projRecs = unifiedRecs.filter((r) => r.section === 'projects');
      const eduRecs = unifiedRecs.filter((r) => r.section === 'education');
      const certRecs = unifiedRecs.filter((r) => r.section === 'certifications');
      return modularCSVRecordsToResume(profileRecs, expRecs, projRecs, eduRecs, certRecs);
    }
  } catch (err) {
    console.warn('Error reading resume CSVs:', err);
  }

  return null;
}

/**
 * Save resume edits to Supabase Storage as modular CSV files.
 */
export async function saveResumeToStorage(resumeData) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Unable to save resume CSV to cloud storage.');
  }

  const { profileCSV, experienceCSV, projectsCSV, educationCSV, certificationsCSV } =
    resumeDataToModularCSVs(resumeData);

  const uploads = [
    { path: 'resume/resume_profile.csv', content: profileCSV },
    { path: 'resume/resume_experience.csv', content: experienceCSV },
    { path: 'resume/resume_projects.csv', content: projectsCSV },
    { path: 'resume/resume_education.csv', content: educationCSV },
    { path: 'resume/resume_certifications.csv', content: certificationsCSV },
  ];

  for (const item of uploads) {
    const blob = new Blob([item.content], { type: 'text/csv;charset=utf-8;' });
    const { error } = await supabase.storage.from('portfolio-assets').upload(item.path, blob, {
      cacheControl: '60',
      upsert: true,
      contentType: 'text/csv',
    });
    if (error) {
      throw new Error(`Failed to upload ${item.path}: ${error.message}`);
    }
  }

  return true;
}

/**
 * Direct client-side fetch from Supabase PostgreSQL tables using the anon key.
 * Ensures the portfolio stays dynamically connected even when hosted statically on Vercel.
 */
export async function fetchPortfolioDirectFromSupabase() {
  if (!supabase) return null;
  try {
    const [projRes, expRes, eduRes, skillRes, certRes, profileRes, socialRes] = await Promise.all([
      supabase.from('projects').select('*').order('display_order', { ascending: true }),
      supabase.from('experiences').select('*').order('display_order', { ascending: true }),
      supabase.from('education').select('*').order('display_order', { ascending: true }),
      supabase.from('skills').select('*').order('display_order', { ascending: true }),
      supabase.from('certifications').select('*').order('display_order', { ascending: true }),
      supabase.from('profiles').select('*').limit(1).maybeSingle(),
      supabase.from('social_links').select('*').eq('is_published', true).order('display_order', { ascending: true }),
    ]);

    if (projRes.error && expRes.error) {
      return null;
    }

    const projects = (projRes.data || []).map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      year: p.year,
      details: p.short_description || p.full_description,
      description: p.short_description || p.full_description,
      longDetails: p.full_description || p.short_description,
      image: p.project_image,
      videoThumb: p.video_thumb || p.project_image,
      videoUrl: p.video_url || '',
      video: p.video_url || '',
      video_url: p.video_url || '',
      tech: p.technologies || [],
      technologies: p.technologies || [],
      techFull: p.technologies || [],
      github: p.github_url || '',
      link: p.live_demo_url || '',
      website: p.live_demo_url || '',
      isFeatured: Boolean(p.is_featured),
      isPublished: Boolean(p.is_published),
    }));

    const experiences = (expRes.data || []).map((e) => ({
      id: e.id,
      company: e.company_name,
      role: e.job_title,
      employmentType: e.employment_type || 'Internship',
      period: e.start_date ? `${e.start_date} - ${e.is_current ? 'Present' : e.end_date || 'Present'}` : '',
      startDate: e.start_date || '',
      endDate: e.end_date || '',
      isCurrent: Boolean(e.is_current),
      location: e.location || '',
      logo: e.company_logo_url || '',
      logoText: (e.company_name || 'CO').slice(0, 2).toUpperCase(),
      paragraph: e.description_paragraph || '',
      bullets: e.description_bullets || [],
      skills: e.technologies || [],
      technologies: e.technologies || [],
      displayOrder: e.display_order,
    }));

    const education = (eduRes.data || []).map((ed) => ({
      id: ed.id,
      institution: ed.institution_name,
      degree: ed.degree,
      fieldOfStudy: ed.field_of_study || '',
      period: ed.start_date ? `${ed.start_date} - ${ed.is_current ? 'Present' : ed.end_date || 'Present'}` : '',
      startDate: ed.start_date || '',
      endDate: ed.end_date || '',
      location: ed.location || '',
      logo: ed.institution_logo_url || '',
      highlights: ed.highlights || [],
      description: ed.description || '',
    }));

    const skillCategoryMap = {};
    for (const s of (skillRes.data || [])) {
      const cat = s.category || 'General';
      if (!skillCategoryMap[cat]) skillCategoryMap[cat] = [];
      skillCategoryMap[cat].push(s.name);
    }
    const skills = Object.entries(skillCategoryMap).map(([category, skillList]) => ({
      category,
      skills: skillList,
    }));

    const allCerts = certRes.data || [];
    const certifications = allCerts
      .filter((c) => !c.is_achievement)
      .map((c) => ({
        id: c.id,
        name: c.name,
        title: c.name,
        issuer: c.issuing_organization,
        issueDate: c.issue_date,
        year: c.issue_date ? c.issue_date.replace(/^Issued\s+/i, '') : '',
        credentialUrl: c.credential_url,
        link: c.credential_url,
        image: c.certificate_image_url || c.certificate_image || '',
        logo: c.certificate_image_url || c.certificate_image || '',
        certificateImage: c.certificate_image_url || c.certificate_image || '',
        description: c.description || '',
        photos: Array.isArray(c.photos) ? c.photos.filter((p) => p && typeof p === 'string' && !p.includes('unsplash.com')) : [],
      }));

    const achievements = allCerts
      .filter((c) => Boolean(c.is_achievement))
      .map((c) => ({
        id: c.id,
        name: c.name,
        title: c.name,
        issuer: c.issuing_organization,
        year: c.issue_date,
        issueDate: c.issue_date,
        credentialUrl: c.credential_url,
        link: c.credential_url,
        description: c.description || '',
        image: c.certificate_image_url || c.certificate_image || '',
        logo: c.certificate_image_url || c.certificate_image || '',
        photos: Array.isArray(c.photos) && c.photos.length > 0
          ? c.photos.filter((p) => p && typeof p === 'string' && !p.includes('unsplash.com'))
          : (c.certificate_image_url && !c.certificate_image_url.includes('unsplash.com') ? [c.certificate_image_url] : []),
      }));

    const profile = profileRes.data || {};
    const socialLinks = socialRes.data || [];

    return {
      about: Array.isArray(profile.about_paragraphs) ? profile.about_paragraphs : undefined,
      experiences: Array.isArray(experiences) ? experiences : undefined,
      projects: Array.isArray(projects) ? projects : undefined,
      education: Array.isArray(education) ? education : undefined,
      skills: Array.isArray(skills) ? skills : undefined,
      certifications: Array.isArray(certifications) ? certifications : undefined,
      achievements: Array.isArray(achievements) ? achievements : undefined,
      social_links: Array.isArray(socialLinks) ? socialLinks : undefined,
      meta: {
        hero_roles: profile.hero_roles || [],
        action_words: profile.action_words || [],
        introduction: profile.introduction || '',
        pitch: profile.introduction || '',
        email: profile.email || 'sahilaw502@gmail.com',
        location: profile.location || 'India',
        name: profile.name || 'Sahil Wani',
        github: profile.github_url || '',
        linkedin: profile.linkedin_url || '',
        x:
          profile.x_url ||
          socialLinks.find((s) => s.platform === 'X' || s.platform === 'Twitter')?.url ||
          '',
        threads: profile.threads_url || '',
      },
      action_words: profile.action_words || [],
    };
  } catch (err) {
    console.warn('Direct Supabase fetch fallback warning:', err);
    return null;
  }
}

function getOrCreateSessionId() {
  if (typeof window === 'undefined') return 'server_session';
  try {
    let sid = sessionStorage.getItem('portfolio_session_id');
    if (!sid) {
      sid = 'ses_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      sessionStorage.setItem('portfolio_session_id', sid);
    }
    return sid;
  } catch {
    return 'fallback_session';
  }
}

function getDeviceType() {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w <= 640) return 'mobile';
  if (w <= 1024) return 'tablet';
  return 'desktop';
}
