import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  '';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
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
 * Upload an image or logo to Supabase Storage in portfolio-assets bucket.
 */
export async function uploadPortfolioAsset(file, folder = 'misc') {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  const fileName = `${folder}/${Date.now()}_${cleanName}`;

  const { data, error } = await supabase.storage
    .from('portfolio-assets')
    .upload(fileName, file, {
      cacheControl: '31536000',
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data: publicData } = supabase.storage
    .from('portfolio-assets')
    .getPublicUrl(data.path);

  return publicData?.publicUrl || '';
}

/**
 * Direct client-side fetch from Supabase PostgreSQL tables using the anon key.
 * Ensures the portfolio stays dynamically connected even when hosted statically on Vercel.
 */
export async function fetchPortfolioDirectFromSupabase() {
  if (!supabase) return null;
  try {
    const [projRes, expRes, eduRes, skillRes, certRes, profileRes] = await Promise.all([
      supabase.from('projects').select('*').order('display_order', { ascending: true }),
      supabase.from('experiences').select('*').order('display_order', { ascending: true }),
      supabase.from('education').select('*').order('display_order', { ascending: true }),
      supabase.from('skills').select('*').order('display_order', { ascending: true }),
      supabase.from('certifications').select('*').order('display_order', { ascending: true }),
      supabase.from('profiles').select('*').eq('id', 'primary').maybeSingle(),
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
        photos: c.photos || [],
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
          ? c.photos
          : (c.certificate_image_url ? [c.certificate_image_url] : []),
      }));

    const profile = profileRes.data || {};

    return {
      about: Array.isArray(profile.about_paragraphs) ? profile.about_paragraphs : undefined,
      experiences: Array.isArray(experiences) ? experiences : undefined,
      projects: Array.isArray(projects) ? projects : undefined,
      education: Array.isArray(education) ? education : undefined,
      skills: Array.isArray(skills) ? skills : undefined,
      certifications: Array.isArray(certifications) ? certifications : undefined,
      achievements: Array.isArray(achievements) ? achievements : undefined,
      meta: {
        hero_roles: profile.hero_roles || [],
        email: profile.email || 'sahilaw502@gmail.com',
        location: profile.location || 'India',
        name: profile.name || 'Sahil Wani',
        github: profile.github_url || '',
        linkedin: profile.linkedin_url || '',
        x: profile.x_url || '',
        threads: profile.threads_url || '',
      },
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

