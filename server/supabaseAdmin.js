import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Automatically load local .env if present and environment variables are not yet injected
try {
  if (typeof process.loadEnvFile === 'function') {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      process.loadEnvFile(envPath);
    }
  }
} catch {
  // Ignore if already loaded or runtime has pre-injected variables
}

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';

const serviceRoleKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  '';

const anonKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const isServerSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(serviceRoleKey || anonKey) &&
    !supabaseUrl.includes('your-project-ref')
  );
};

// Use service role key if available for full administrative bypass, otherwise anon key
export const supabaseAdmin = isServerSupabaseConfigured()
  ? createClient(supabaseUrl, serviceRoleKey || anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

/**
 * Fetch all published portfolio content from Supabase.
 */
export async function getPortfolioContentFromSupabase() {
  if (!supabaseAdmin) return null;

  try {
    const [profileRes, projectsRes, experiencesRes, educationRes, skillsRes, certsRes] =
      await Promise.all([
        supabaseAdmin.from('profiles').select('*').limit(1).maybeSingle(),
        supabaseAdmin
          .from('projects')
          .select('*')
          .eq('is_published', true)
          .order('display_order', { ascending: true }),
        supabaseAdmin
          .from('experiences')
          .select('*')
          .eq('is_published', true)
          .order('display_order', { ascending: true }),
        supabaseAdmin
          .from('education')
          .select('*')
          .eq('is_published', true)
          .order('display_order', { ascending: true }),
        supabaseAdmin
          .from('skills')
          .select('*')
          .eq('is_published', true)
          .order('display_order', { ascending: true }),
        supabaseAdmin
          .from('certifications')
          .select('*')
          .eq('is_published', true)
          .order('display_order', { ascending: true }),
      ]);

    // Group skills by category to match portfolio expectations
    const skillsByCategoryMap = {};
    if (skillsRes.data) {
      for (const s of skillsRes.data) {
        if (!skillsByCategoryMap[s.category]) {
          skillsByCategoryMap[s.category] = [];
        }
        skillsByCategoryMap[s.category].push(s.name);
      }
    }
    const skillCategories = Object.entries(skillsByCategoryMap).map(([category, skills]) => ({
      category,
      skills,
    }));

    // Split certifications into certs and achievements
    const certifications = (certsRes.data || [])
      .filter((c) => !c.is_achievement)
      .map((c) => ({
        id: c.id,
        title: c.name,
        name: c.name,
        issuer: c.issuing_organization,
        issueDate: c.issue_date,
        year: c.issue_date ? c.issue_date.replace(/^Issued\s+/i, '') : '',
        link: c.credential_url,
        credId: c.credential_id,
        image: c.certificate_image_url,
        logo: c.certificate_image_url,
        certificateImage: c.certificate_image_url,
        description: c.description || '',
        photos: c.photos || [],
      }));

    const achievements = (certsRes.data || [])
      .filter((c) => Boolean(c.is_achievement))
      .map((c) => ({
        id: c.id,
        title: c.name,
        name: c.name,
        issuer: c.issuing_organization,
        year: c.issue_date,
        issueDate: c.issue_date,
        link: c.credential_url,
        description: c.description || '',
        image: c.certificate_image_url,
        logo: c.certificate_image_url,
        photos: Array.isArray(c.photos) && c.photos.length > 0
          ? c.photos
          : c.certificate_image_url
          ? [c.certificate_image_url]
          : [],
      }));

    // Transform projects to match public expectations
    const projects = (projectsRes.data || []).map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      year: p.year,
      details: p.short_description,
      longDetails: p.full_description,
      technologies: p.technologies || [],
      tech: p.technologies || [],
      techFull: p.technologies || [],
      image: p.project_image,
      videoThumb: p.video_thumb || p.project_image,
      videoUrl: p.video_url || p.video || (p.metrics?.videoUrl) || '',
      video: p.video_url || p.video || (p.metrics?.videoUrl) || '',
      link: p.live_demo_url || p.github_url,
      github: p.github_url,
      isFeatured: p.is_featured,
      isWorking: true,
      metrics: p.metrics || {},
    }));

    // Transform experiences to match public expectations
    const experiences = (experiencesRes.data || []).map((e) => ({
      id: e.id,
      company: e.company_name,
      role: e.job_title,
      position: e.job_title,
      period: `${e.start_date || ''} - ${e.end_date || ''}`.trim(),
      startDate: e.start_date,
      endDate: e.end_date,
      location: e.location,
      isCurrent: e.is_current,
      image: e.company_logo_url,
      website: e.company_links?.website || '',
      github: e.company_links?.github || '',
      linkedin: e.company_links?.linkedin || '',
      description: e.description_bullets || [],
      desc: e.description_paragraph || '',
      skills: e.skills || [],
    }));

    // Transform education to match public expectations
    const education = (educationRes.data || []).map((ed) => ({
      id: ed.id,
      institution: ed.institution_name,
      degree: ed.degree,
      branch: ed.field_of_study,
      period: `${ed.start_date || ''} - ${ed.end_date || ''}`.trim(),
      location: ed.location,
      isCurrent: ed.is_current,
      grade: ed.grade,
      image: ed.institution_logo_url,
      desc: ed.description_paragraph,
      courses: ed.highlights || [],
    }));

    const profile = profileRes.data || {};

    return {
      about: profile.about_paragraphs || [],
      experiences,
      projects,
      education,
      skills: skillCategories,
      certifications,
      achievements,
      custom_icons: [],
      meta: {
        name: profile.name || 'Sahil Wani',
        hero_roles: profile.hero_roles || [],
        email: profile.email || 'sahilaw502@gmail.com',
        github: profile.github_url || 'https://github.com/sahil-wani',
        linkedin: profile.linkedin_url || 'https://linkedin.com/in/sahil-wani',
        x: profile.x_url || 'https://x.com/sahilwani',
        threads: profile.threads_url || 'https://threads.net/@sahilwani',
        resume: profile.resume_url || '#/careers',
      },
    };
  } catch (err) {
    console.error('Failed to load portfolio content from Supabase:', err);
    return null;
  }
}

/**
 * Health check querying Supabase with a lightweight read.
 */
export async function healthCheckSupabase() {
  if (!supabaseAdmin) {
    return { configured: false, ok: false, message: 'Supabase credentials are not configured.' };
  }
  try {
    const startTime = Date.now();
    const { count, error } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return { configured: true, ok: false, error: error.message };
    }
    const latency = Date.now() - startTime;
    return {
      configured: true,
      ok: true,
      latencyMs: latency,
      message: 'Supabase connection healthy.',
    };
  } catch (err) {
    return { configured: true, ok: false, error: err.message };
  }
}

/**
 * Aggregate analytics metrics over a time window.
 */
export async function getAnalyticsFromSupabase(range = '7d') {
  if (!supabaseAdmin) return null;

  try {
    let days = 7;
    if (range === '30d') days = 30;
    else if (range === '90d') days = 90;
    else if (range === 'all') days = 3650;

    const sinceDate = new Date(Date.now() - days * 86400000).toISOString();

    const { data: events, error } = await supabaseAdmin
      .from('analytics_events')
      .select('event_type, path, project_id, referrer, session_id, device_type, created_at')
      .gte('created_at', sinceDate)
      .order('created_at', { ascending: false })
      .limit(5000);

    if (error || !events) return null;

    const totalViews = events.filter((e) => e.event_type === 'page_view').length;
    const uniqueSessions = new Set(events.map((e) => e.session_id)).size;
    const projectClicks = events.filter((e) => e.event_type === 'project_click' || e.event_type === 'project_view').length;
    const githubClicks = events.filter((e) => e.event_type === 'github_click').length;
    const resumeDownloads = events.filter((e) => e.event_type === 'resume_download').length;
    const contactInteractions = events.filter((e) => e.event_type === 'contact_click').length;

    // Top projects
    const projectCounts = {};
    for (const e of events) {
      if (e.project_id) {
        projectCounts[e.project_id] = (projectCounts[e.project_id] || 0) + 1;
      }
    }
    const topProjects = Object.entries(projectCounts)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top pages
    const pageCounts = {};
    for (const e of events) {
      if (e.event_type === 'page_view') {
        const p = e.path || '/';
        pageCounts[p] = (pageCounts[p] || 0) + 1;
      }
    }
    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Traffic sources
    const refCounts = {};
    for (const e of events) {
      let host = 'Direct';
      if (e.referrer && e.referrer !== 'direct') {
        try {
          host = new URL(e.referrer).hostname || e.referrer;
        } catch {
          host = e.referrer;
        }
      }
      refCounts[host] = (refCounts[host] || 0) + 1;
    }
    const trafficSources = Object.entries(refCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalViews,
      uniqueSessions,
      projectClicks,
      githubClicks,
      resumeDownloads,
      contactInteractions,
      topProjects,
      topPages,
      trafficSources,
      totalEvents: events.length,
      range,
    };
  } catch (err) {
    console.error('Failed to compute Supabase analytics:', err);
    return null;
  }
}

/**
 * Explicitly delete an item by ID from a specific Supabase table.
 */
export async function deleteItemFromSupabase(section, id) {
  if (!supabaseAdmin || !id) return false;
  try {
    let tableName = section;
    if (section === 'experiences') tableName = 'experiences';
    else if (section === 'projects') tableName = 'projects';
    else if (section === 'education') tableName = 'education';
    else if (section === 'certifications' || section === 'achievements') tableName = 'certifications';
    else if (section === 'skills') tableName = 'skills';
    else return false;

    const { error } = await supabaseAdmin.from(tableName).delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`Failed to delete item ${id} from table ${section} in Supabase:`, err.message);
    return false;
  }
}

/**
 * Synchronize modified portfolio section data to Supabase PostgreSQL.
 * Prunes removed records so that deletes in Admin Dashboard permanently remove rows from Supabase.
 */
export async function syncSectionToSupabase(section, data) {
  if (!supabaseAdmin) return false;

  try {
    if (section === 'projects' && Array.isArray(data)) {
      const validIds = data.map((item, idx) => item.id || `proj-${idx}-${Date.now()}`);
      const rows = data.map((item, idx) => ({
        id: validIds[idx],
        title: item.title || '',
        category: item.category || 'Web App',
        year: item.year || '2026',
        short_description: item.details || item.description || '',
        full_description: item.longDetails || item.details || item.description || '',
        project_image: item.image || item.videoThumb || '',
        video_url: item.videoUrl || item.video || item.video_url || '',
        video_thumb: item.videoThumb || item.image || '',
        technologies: Array.isArray(item.tech) ? item.tech : (Array.isArray(item.technologies) ? item.technologies : []),
        live_demo_url: item.link || item.website || '',
        github_url: item.github || '',
        is_featured: item.isFeatured !== false,
        is_published: item.isPublished !== false,
        display_order: idx,
        metrics: {
          ...(item.metrics || {}),
          videoUrl: item.videoUrl || item.video || item.video_url || '',
        },
        updated_at: new Date().toISOString(),
      }));

      // Prune deleted projects from Supabase
      const { data: existingRows } = await supabaseAdmin.from('projects').select('id');
      const existingIds = (existingRows || []).map((r) => r.id);
      const toDelete = existingIds.filter((id) => !validIds.includes(id));
      if (toDelete.length > 0) {
        const { error: delErr } = await supabaseAdmin.from('projects').delete().in('id', toDelete);
        if (delErr) console.warn('Supabase projects pruning warning:', delErr.message);
      }

      if (rows.length > 0) {
        const { error } = await supabaseAdmin.from('projects').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
      }
      return true;
    }

    if (section === 'experiences' && Array.isArray(data)) {
      const validIds = data.map((item, idx) => item.id || `exp-${idx}-${Date.now()}`);
      const rows = data.map((item, idx) => ({
        id: validIds[idx],
        company_name: item.company || item.company_name || 'Company',
        job_title: item.role || item.position || 'Developer',
        employment_type: item.employmentType || 'Internship',
        location: item.location || '',
        company_logo_url: item.image || item.logo || '',
        start_date: item.startDate || '',
        end_date: item.endDate || '',
        is_current: Boolean(item.isCurrent),
        description_paragraph: item.description_paragraph || item.paragraph || item.desc || '',
        description_bullets: Array.isArray(item.description_bullets)
          ? item.description_bullets
          : Array.isArray(item.description)
          ? item.description
          : Array.isArray(item.bullets)
          ? item.bullets
          : [],
        skills: Array.isArray(item.skills) ? item.skills : (Array.isArray(item.technologies) ? item.technologies : []),
        company_links: {
          website: item.website || '',
          github: item.github || '',
          linkedin: item.linkedin || '',
          x: item.x || '',
        },
        display_order: idx,
        is_published: item.isPublished !== false,
        updated_at: new Date().toISOString(),
      }));

      // Prune deleted experiences from Supabase
      const { data: existingRows } = await supabaseAdmin.from('experiences').select('id');
      const existingIds = (existingRows || []).map((r) => r.id);
      const toDelete = existingIds.filter((id) => !validIds.includes(id));
      if (toDelete.length > 0) {
        const { error: delErr } = await supabaseAdmin.from('experiences').delete().in('id', toDelete);
        if (delErr) console.warn('Supabase experiences pruning warning:', delErr.message);
      }

      if (rows.length > 0) {
        const { error } = await supabaseAdmin.from('experiences').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
      }
      return true;
    }

    if (section === 'education' && Array.isArray(data)) {
      const validIds = data.map((item, idx) => item.id || `edu-${idx}-${Date.now()}`);
      const rows = data.map((item, idx) => ({
        id: validIds[idx],
        institution_name: item.institution || item.institution_name || '',
        degree: item.degree || '',
        branch: item.branch || item.fieldOfStudy || '',
        location: item.location || '',
        institution_logo_url: item.image || item.logo || '',
        start_date: item.startDate || '',
        end_date: item.endDate || '',
        is_current: Boolean(item.isCurrent),
        description_paragraph: item.description_paragraph || item.paragraph || item.desc || item.description || '',
        highlights: Array.isArray(item.highlights) ? item.highlights : (Array.isArray(item.courses) ? item.courses : []),
        display_order: idx,
        is_published: item.isPublished !== false,
        updated_at: new Date().toISOString(),
      }));

      // Prune deleted education entries from Supabase
      const { data: existingRows } = await supabaseAdmin.from('education').select('id');
      const existingIds = (existingRows || []).map((r) => r.id);
      const toDelete = existingIds.filter((id) => !validIds.includes(id));
      if (toDelete.length > 0) {
        const { error: delErr } = await supabaseAdmin.from('education').delete().in('id', toDelete);
        if (delErr) console.warn('Supabase education pruning warning:', delErr.message);
      }

      if (rows.length > 0) {
        const { error } = await supabaseAdmin.from('education').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
      }
      return true;
    }

    if ((section === 'certifications' || section === 'achievements') && Array.isArray(data)) {
      const isAchievement = section === 'achievements';
      const validIds = data.map((item, idx) => item.id || `${isAchievement ? 'achieve' : 'cert'}-${idx}-${Date.now()}`);
      const rows = data.map((item, idx) => ({
        id: validIds[idx],
        name: item.title || item.name || '',
        issuing_organization: item.issuer || item.issuing_organization || '',
        issue_date: item.issueDate || item.year || '',
        credential_id: item.credentialId || item.credential_id || '',
        credential_url: item.link || item.credential_url || item.credentialUrl || '',
        certificate_image_url: item.certificateImage || item.certificate_image_url || item.image || item.logo || '',
        description: item.description || '',
        photos: Array.isArray(item.photos)
          ? item.photos
          : item.photos
          ? [item.photos]
          : item.photo
          ? [item.photo]
          : item.image
          ? [item.image]
          : [],
        is_achievement: isAchievement,
        display_order: idx,
        is_published: item.isPublished !== false,
        created_at: new Date().toISOString(),
      }));

      // Prune deleted items specifically from the matching category (certifications vs achievements)
      const { data: existingRows } = await supabaseAdmin
        .from('certifications')
        .select('id')
        .eq('is_achievement', isAchievement);
      const existingIds = (existingRows || []).map((r) => r.id);
      const toDelete = existingIds.filter((id) => !validIds.includes(id));
      if (toDelete.length > 0) {
        const { error: delErr } = await supabaseAdmin.from('certifications').delete().in('id', toDelete);
        if (delErr) console.warn(`Supabase ${section} pruning warning:`, delErr.message);
      }

      if (rows.length > 0) {
        const { error } = await supabaseAdmin.from('certifications').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
      }
      return true;
    }

    if (section === 'skills' && Array.isArray(data)) {
      const rows = [];
      data.forEach((cat, catIdx) => {
        const categoryName = cat.category || 'General';
        (cat.skills || []).forEach((s, sIdx) => {
          const sName = typeof s === 'string' ? s : s?.name || '';
          const sLogo = typeof s === 'object' ? (s.logo || s.iconUrl || '') : '';
          if (sName) {
            rows.push({
              id: `skill-${catIdx}-${sIdx}-${sName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              name: sName,
              category: categoryName,
              icon_url: sLogo,
              display_order: catIdx * 100 + sIdx,
              created_at: new Date().toISOString(),
            });
          }
        });
      });

      const validSkillIds = rows.map((r) => r.id);
      const { data: existingRows } = await supabaseAdmin.from('skills').select('id');
      const existingIds = (existingRows || []).map((r) => r.id);
      const toDelete = existingIds.filter((id) => !validSkillIds.includes(id));
      if (toDelete.length > 0) {
        const { error: delErr } = await supabaseAdmin.from('skills').delete().in('id', toDelete);
        if (delErr) console.warn('Supabase skills pruning warning:', delErr.message);
      }

      if (rows.length > 0) {
        const { error } = await supabaseAdmin.from('skills').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
      }
      return true;
    }

    if (section === 'about' && Array.isArray(data)) {
      const { error } = await supabaseAdmin.from('profiles').upsert(
        {
          id: 'primary',
          about_paragraphs: data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
      if (error) throw error;
      return true;
    }

    if (section === 'meta' && data && typeof data === 'object') {
      const { error } = await supabaseAdmin.from('profiles').upsert(
        {
          id: 'primary',
          name: data.name || 'Sahil Wani',
          email: data.email || 'sahilaw502@gmail.com',
          hero_roles: Array.isArray(data.hero_roles) ? data.hero_roles : [],
          location: data.location || 'India',
          github_url: data.github || data.github_url || '',
          linkedin_url: data.linkedin || data.linkedin_url || '',
          x_url: data.x || data.x_url || data.twitter || '',
          threads_url: data.threads || data.threads_url || '',
          resume_url: data.resume || data.resume_url || '',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
      if (error) throw error;
      return true;
    }

    return false;
  } catch (err) {
    console.error(`Failed to sync section ${section} to Supabase:`, err.message);
    return false;
  }
}

