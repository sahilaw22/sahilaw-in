import { useState, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import MarkdownContent from '../components/MarkdownContent.jsx';
import AnswerTextEditor from '../components/AnswerTextEditor.jsx';
import { TechIcon } from '../components/TechIcons.jsx';
import { ExperienceCard } from '../components/ExperienceCard.jsx';
import {
  supabase,
  isSupabaseConfigured,
  uploadPortfolioAsset,
  deletePortfolioAsset,
  fetchPortfolioDirectFromSupabase,
} from '../lib/supabaseClient.js';
import { getSocialIconSvg } from '../components/SocialIcons.jsx';
import {
  HERO_ROLES,
  ABOUT_PARAGRAPHS,
  EXPERIENCES,
  PROJECTS,
  EDUCATION_ITEMS,
  SKILL_CATEGORIES,
  CERTIFICATIONS,
  ACHIEVEMENTS,
} from '../data/portfolioData.jsx';
import './AdminPage.css';

function sanitizeAdminParagraphs(paragraphs) {
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

const QUICK_ABOUT_ICONS = [
  { label: 'React', token: '{{ICON_REACT}}', id: 'react' },
  { label: 'Figma', token: '{{ICON_FIGMA}}', id: 'figma' },
  { label: 'Flutter', token: '{{ICON_FLUTTER}}', id: 'flutter' },
  { label: 'TypeScript', token: '{{ICON_TYPESCRIPT}}', id: 'ts' },
  { label: 'Next.js', token: '{{ICON_NEXTJS}}', id: 'nextjs' },
  { label: 'Tailwind', token: '{{ICON_TAILWIND}}', id: 'tailwind' },
  { label: 'Python', token: '{{ICON_PYTHON}}', id: 'py' },
  { label: 'Node.js', token: '{{ICON_NODEJS}}', id: 'nodejs' },
  { label: 'Git', token: '{{ICON_GIT}}', id: 'git' },
  { label: 'Docker', token: '{{ICON_DOCKER}}', id: 'docker' },
  { label: 'Vite', token: '{{ICON_VITE}}', id: 'vite' },
  { label: 'HTML', token: '{{ICON_HTML}}', id: 'html' },
  { label: 'CSS', token: '{{ICON_CSS}}', id: 'css' },
  { label: 'C++', token: '{{ICON_CPP}}', id: 'cpp' },
  { label: 'Firebase', token: '{{ICON_FIREBASE}}', id: 'firebase' },
  { label: 'Supabase', token: '{{ICON_SUPABASE}}', id: 'supabase' },
];


function compressImage(file, maxDimension = 360, quality = 0.88) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        const isPng = file.type === 'image/png';
        const mimeType = isPng ? 'image/png' : 'image/webp';
        try {
          const dataUrl = canvas.toDataURL(mimeType, quality);
          resolve(dataUrl);
        } catch {
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const ONLINE_SKILL_ICONS = [
  { name: 'React', slug: 'react' },
  { name: 'TypeScript', slug: 'ts' },
  { name: 'JavaScript', slug: 'js' },
  { name: 'Next.js', slug: 'nextjs' },
  { name: 'Node.js', slug: 'nodejs' },
  { name: 'Python', slug: 'py' },
  { name: 'Tailwind CSS', slug: 'tailwind' },
  { name: 'Supabase', slug: 'supabase' },
  { name: 'PostgreSQL', slug: 'postgres' },
  { name: 'MongoDB', slug: 'mongodb' },
  { name: 'Redis', slug: 'redis' },
  { name: 'Docker', slug: 'docker' },
  { name: 'AWS', slug: 'aws' },
  { name: 'GCP', slug: 'gcp' },
  { name: 'Figma', slug: 'figma' },
  { name: 'Git', slug: 'git' },
  { name: 'GitHub', slug: 'github' },
  { name: 'GraphQL', slug: 'graphql' },
  { name: 'Vue.js', slug: 'vue' },
  { name: 'Angular', slug: 'angular' },
  { name: 'Svelte', slug: 'svelte' },
  { name: 'HTML5', slug: 'html' },
  { name: 'CSS3', slug: 'css' },
  { name: 'C++', slug: 'cpp' },
  { name: 'Java', slug: 'java' },
  { name: 'Kotlin', slug: 'kotlin' },
  { name: 'Swift', slug: 'swift' },
  { name: 'Flutter', slug: 'flutter' },
  { name: 'Dart', slug: 'dart' },
  { name: 'Rust', slug: 'rust' },
  { name: 'Go', slug: 'go' },
  { name: 'Linux', slug: 'linux' },
  { name: 'Postman', slug: 'postman' },
  { name: 'Vercel', slug: 'vercel' },
  { name: 'Firebase', slug: 'firebase' },
  { name: 'Vite', slug: 'vite' },
  { name: 'Sass', slug: 'sass' },
  { name: 'Express', slug: 'express' },
  { name: 'VS Code', slug: 'vscode' },
  { name: 'Bun', slug: 'bun' },
  { name: 'Redux', slug: 'redux' },
  { name: 'Kafka', slug: 'kafka' },
  { name: 'Kubernetes', slug: 'kubernetes' },
  { name: 'Django', slug: 'django' },
  { name: 'FastAPI', slug: 'fastapi' },
  { name: 'Spring', slug: 'spring' },
  { name: 'MySQL', slug: 'mysql' },
  { name: 'Electron', slug: 'electron' }
];

function slugify(text) {
  return (text || 'item')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 40) || 'item';
}

function isDemoItem(item) {
  if (!item) return false;
  if (item.is_demo === true || item.isDemo === true) return true;
  const idStr = String(item.id || '').toLowerCase();
  if (idStr.startsWith('demo-') || idStr.includes('sample-')) return true;
  const title = String(item.title || item.company || item.institution || item.name || item.degree || '').toLowerCase();
  return title.includes('[demo]') || title.includes('demo sample') || title.includes('sample company') || title.includes('sample project');
}

const SOCIAL_PRESETS = [
  { platform: 'GitHub', label: 'GitHub', icon: 'github', defaultUrl: 'https://github.com/' },
  { platform: 'LinkedIn', label: 'LinkedIn', icon: 'linkedin', defaultUrl: 'https://linkedin.com/in/' },
  { platform: 'Threads', label: 'Threads', icon: 'threads', defaultUrl: 'https://threads.net/@' },
  { platform: 'X', label: 'X (Twitter)', icon: 'x', defaultUrl: 'https://x.com/' },
  { platform: 'Instagram', label: 'Instagram', icon: 'instagram', defaultUrl: 'https://instagram.com/' },
  { platform: 'YouTube', label: 'YouTube', icon: 'youtube', defaultUrl: 'https://youtube.com/@' },
  { platform: 'Discord', label: 'Discord', icon: 'discord', defaultUrl: 'https://discord.com/users/' },
  { platform: 'LeetCode', label: 'LeetCode', icon: 'leetcode', defaultUrl: 'https://leetcode.com/' },
  { platform: 'Kaggle', label: 'Kaggle', icon: 'kaggle', defaultUrl: 'https://kaggle.com/' },
  { platform: 'Website', label: 'Personal Website', icon: 'website', defaultUrl: 'https://' },
  { platform: 'Custom', label: 'Custom Link', icon: 'link', defaultUrl: 'https://' },
];

function AdminImageUploadField({
  label,
  value,
  onChange,
  placeholder = 'Paste image URL or browse image...',
  idPrefix = 'img-field',
  helperText = '',
  isLogo = false,
  storageFolder = 'logos',
  slug = '',
  requireExplicitDelete = false,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const inputId = `${idPrefix}-file`;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (requireExplicitDelete && value) {
      alert('This logo requires explicit deletion before uploading a replacement. Please click "Clear" to remove the current logo first.');
      e.target.value = '';
      return;
    }

    setIsProcessing(true);
    try {
      if (isSupabaseConfigured()) {
        if (!requireExplicitDelete && value && typeof value === 'string' && value.includes('supabase.co')) {
          try {
            await deletePortfolioAsset(value);
          } catch (delErr) {
            console.warn('Auto-replace cleanup notice:', delErr.message);
          }
        }
        const cleanSlug = slug || 'asset';
        const uploadRes = await uploadPortfolioAsset(file, { folder: storageFolder, slug: cleanSlug, multiple: false });
        const publicUrl = typeof uploadRes === 'string' ? uploadRes : (uploadRes?.publicUrl || '');
        onChange(publicUrl);
      } else {
        const dataUrl = await compressImage(file, 400, 0.9);
        onChange(dataUrl);
      }
    } catch (err) {
      alert('Failed to process image: ' + (err.message || 'Error occurred'));
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleClear = async () => {
    if (value && typeof value === 'string' && value.includes('supabase.co')) {
      try {
        await deletePortfolioAsset(value);
      } catch (err) {
        console.warn('Clear asset notice:', err.message);
      }
    }
    onChange('');
  };

  const isDataUrl = typeof value === 'string' && value.startsWith('data:image/');
  const isHttpUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/'));

  return (
    <div className="admin-image-upload-control">
      {label && <label className="admin-field-label">{label}</label>}
      <div className="admin-image-upload-inputs">
        <input
          type="text"
          className="admin-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1 }}
        />
        <label
          htmlFor={inputId}
          className={`admin-btn admin-btn-secondary admin-btn-upload ${requireExplicitDelete && value ? 'is-disabled' : ''}`}
          style={requireExplicitDelete && value ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>{isProcessing ? 'Uploading...' : requireExplicitDelete && value ? 'Clear Logo First' : 'Upload Image'}</span>
          <input
            id={inputId}
            type="file"
            accept="image/*,.svg"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={isProcessing || (requireExplicitDelete && !!value)}
          />
        </label>
        {value ? (
          <button
            type="button"
            className="admin-btn admin-btn-danger admin-upload-clear-btn"
            onClick={handleClear}
            title="Remove image from storage"
          >
            Clear
          </button>
        ) : null}
      </div>

      {helperText && <span className="admin-field-helper">{helperText}</span>}

      {(isDataUrl || isHttpUrl) && (
        <div className="admin-upload-preview-box">
          <div
            className="admin-upload-thumb"
            style={
              isLogo
                ? {
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    overflow: 'hidden',
                  }
                : undefined
            }
          >
            <img
              src={value}
              alt="Logo Preview"
              style={
                isLogo
                  ? {
                      width: '100%',
                      height: '100%',
                      borderRadius: '14px',
                      objectFit: 'cover',
                      display: 'block',
                    }
                  : undefined
              }
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="admin-upload-meta">
            <span className="admin-upload-status">
              {isSupabaseConfigured() && typeof value === 'string' && value.includes('supabase.co')
                ? 'Supabase Storage CDN'
                : isDataUrl
                ? 'Local Compressed Image'
                : 'External Image Link'}
            </span>
            <span className="admin-upload-sub">
              {isLogo ? 'Rounded-square logo (14px radius, no border)' : value.slice(0, 42) + '...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminMultiImageUploadField({
  label,
  values = [],
  onChange,
  placeholder = 'Add image URLs or upload multiple files...',
  idPrefix = 'multi-img',
  helperText = '',
  storageFolder = 'achievements/photos',
  slug = '',
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const inputId = `${idPrefix}-multi-file`;

  const items = Array.isArray(values)
    ? values.filter(Boolean)
    : (typeof values === 'string' ? values.split(',').map((s) => s.trim()).filter(Boolean) : []);

  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsProcessing(true);
    try {
      const cleanSlug = slug || 'asset';
      const newUrls = [];
      for (const file of files) {
        if (isSupabaseConfigured()) {
          const uploadRes = await uploadPortfolioAsset(file, { folder: storageFolder, slug: cleanSlug, multiple: true });
          const url = typeof uploadRes === 'string' ? uploadRes : (uploadRes?.publicUrl || '');
          if (url) newUrls.push(url);
        } else {
          const dataUrl = await compressImage(file, 600, 0.9);
          if (dataUrl) newUrls.push(dataUrl);
        }
      }
      const combined = [...items, ...newUrls];
      onChange(combined);
    } catch (err) {
      alert('Failed to upload photos: ' + (err.message || 'Error occurred'));
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleRemoveOne = async (indexToRemove) => {
    const urlToRemove = items[indexToRemove];
    if (urlToRemove && typeof urlToRemove === 'string' && urlToRemove.includes('supabase.co')) {
      try {
        await deletePortfolioAsset(urlToRemove);
      } catch (err) {
        console.warn('Asset deletion notice:', err.message);
      }
    }
    const updated = items.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="admin-image-upload-control">
      {label && <label className="admin-field-label">{label}</label>}
      <div className="admin-image-upload-inputs">
        <input
          type="text"
          className="admin-input"
          value={items.join(', ')}
          onChange={(e) => {
            const parsed = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
            onChange(parsed);
          }}
          placeholder={placeholder}
          style={{ flex: 1 }}
        />
        <label htmlFor={inputId} className="admin-btn admin-btn-secondary admin-btn-upload">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>{isProcessing ? 'Uploading...' : 'Upload Photos'}</span>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFilesChange}
            disabled={isProcessing}
          />
        </label>
      </div>

      {helperText && <span className="admin-field-helper">{helperText}</span>}

      {items.length > 0 && (
        <div className="admin-multi-upload-grid">
          {items.map((url, i) => (
            <div key={`${url}-${i}`} className="admin-multi-upload-item">
              <img src={url} alt={`Upload ${i + 1}`} />
              <button
                type="button"
                className="admin-multi-remove-btn"
                onClick={() => handleRemoveOne(i)}
                title="Remove photo"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminVideoUploadField({
  label = 'Project Demo Video (MP4 / WebM / QuickTime)',
  value,
  onChange,
  placeholder = 'Paste video URL or upload MP4 / WebM...',
  idPrefix = 'video-field',
  helperText = 'Stored in Supabase Storage under portfolio-assets/projects/project-video or paste an external video link',
  storageFolder = 'projects/project-video',
  slug = 'video',
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const inputId = `${idPrefix}-file`;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      if (isSupabaseConfigured()) {
        if (value && typeof value === 'string' && value.includes('supabase.co')) {
          try {
            await deletePortfolioAsset(value);
          } catch (delErr) {
            console.warn('Video replacement cleanup notice:', delErr.message);
          }
        }
        const cleanSlug = slug || 'video';
        const uploadRes = await uploadPortfolioAsset(file, { folder: storageFolder, slug: cleanSlug, multiple: false });
        const publicUrl = typeof uploadRes === 'string' ? uploadRes : (uploadRes?.publicUrl || '');
        onChange(publicUrl);
      } else {
        alert('Supabase is not configured for video file storage. Please enter a public video URL.');
      }
    } catch (err) {
      alert('Failed to upload video: ' + (err.message || 'Error occurred'));
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleClear = async () => {
    if (value && typeof value === 'string' && value.includes('supabase.co')) {
      try {
        await deletePortfolioAsset(value);
      } catch (err) {
        console.warn('Video deletion notice:', err.message);
      }
    }
    onChange('');
  };

  const hasVideo = typeof value === 'string' && value.trim().length > 0;

  return (
    <div className="admin-image-upload-control">
      {label && <label className="admin-field-label">{label}</label>}
      <div className="admin-image-upload-inputs">
        <input
          type="text"
          className="admin-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1 }}
        />
        <label htmlFor={inputId} className="admin-btn admin-btn-secondary admin-btn-upload">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>{isProcessing ? 'Uploading...' : 'Upload Video'}</span>
          <input
            id={inputId}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </label>
        {hasVideo ? (
          <button
            type="button"
            className="admin-btn admin-btn-danger admin-upload-clear-btn"
            onClick={handleClear}
            title="Remove video"
          >
            Clear
          </button>
        ) : null}
      </div>

      {helperText && <span className="admin-field-helper">{helperText}</span>}

      {hasVideo && (
        <div className="admin-upload-preview-box" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ position: 'relative', width: '100%', borderRadius: '10px', overflow: 'hidden', background: '#000' }}>
            <video
              src={value}
              controls
              playsInline
              preload="metadata"
              style={{ width: '100%', maxHeight: '200px', display: 'block' }}
            />
          </div>
          <div className="admin-upload-meta" style={{ marginTop: '6px' }}>
            <span className="admin-upload-status">
              {isSupabaseConfigured() && value.includes('supabase.co')
                ? 'Supabase Storage Video'
                : 'Project Demo Video Link'}
            </span>
            <span className="admin-upload-sub">{value.slice(0, 60)}{value.length > 60 ? '...' : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function renderAboutParagraphPreview(text, customIcons = []) {
  if (!text) return null;
  const parts = text.split(/(\{\{(?:ICON_|icon:)[A-Za-z0-9_-]+\}\}|https:\/\/skillicons\.dev\/icons\?i=[A-Za-z0-9_,-]+)/gi);
  return parts.map((part, pIdx) => {
    const match =
      part.match(/^\{\{(?:ICON_|icon:)([A-Za-z0-9_-]+)\}\}$/i) ||
      part.match(/^https:\/\/skillicons\.dev\/icons\?i=([A-Za-z0-9_,-]+)$/i);
    if (match) {
      const raw = match[1].toLowerCase();
      const customMatch = (customIcons || []).find(
        (c) => (c.name || '').toLowerCase() === raw || (c.token || '').toLowerCase().includes(raw)
      );
      if (customMatch && customMatch.image) {
        return (
          <span key={pIdx} style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', margin: '0 4px' }}>
            <img
              src={customMatch.image}
              alt={customMatch.name}
              title={customMatch.name}
              width={22}
              height={22}
              style={{ borderRadius: '5px', verticalAlign: 'middle', objectFit: 'contain', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }}
            />
          </span>
        );
      }
      const aliasMap = {
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
      };
      const iconKey = aliasMap[raw] || raw;
      return (
        <span key={pIdx} style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', margin: '0 4px' }}>
          <img
            src={`https://skillicons.dev/icons?i=${iconKey}`}
            alt={raw}
            title={raw.toUpperCase()}
            width={22}
            height={22}
            style={{ borderRadius: '5px', verticalAlign: 'middle', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }}
          />
        </span>
      );
    }
    return part;
  });
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Just now';
  const diff = Date.now() - Number(timestamp);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 86400000);
  return `${days}d ago`;
}

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('portfolio_admin_token') || '');
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('visitor-analytics'); // visitor-analytics, overview, portfolio, unanswered, knowledge, templates, sandbox, conversations, settings
  const [visitorAnalytics, setVisitorAnalytics] = useState(null);
  const [analyticsRange, setAnalyticsRange] = useState('7d');
  const [visitorLoading, setVisitorLoading] = useState(false);

  // Portfolio dynamic content management state
  const [portfolioContent, setPortfolioContent] = useState({
    about: [],
    experiences: [],
    projects: [],
    education: [],
    skills: [],
    certifications: [],
    achievements: [],
    social_links: [],
    custom_icons: [],
    meta: {
      hero_roles: [],
      name: 'Sahil Wani',
      pitch: '',
      introduction: '',
      email: 'sahilaw502@gmail.com',
      github: 'https://github.com/sahil-wani',
      linkedin: 'https://linkedin.com/in/sahil-wani',
      threads: 'https://threads.net/@sahilwani',
      x: 'https://x.com/sahilwani',
    },
  });
  const [contentSubtab, setContentSubtab] = useState('experiences');
  const [contentSaveMsg, setContentSaveMsg] = useState('');

  // Social Links modal/editing state
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [editingSocialIndex, setEditingSocialIndex] = useState(null);
  const [socialForm, setSocialForm] = useState({
    id: '',
    platform: 'GitHub',
    label: 'GitHub',
    url: '',
    icon_name: 'github',
    icon_svg: '',
    is_published: true,
    display_order: 0,
    is_demo: false,
  });
  const [metaIntroText, setMetaIntroText] = useState(
    'Hey, I am Sahil Wani, a 20yo guy building things for the web. Crafting sleek digital experiences, experimenting with code, design, and ideas that feel right.'
  );

  // Projects modal/editing state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);
  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    category: 'Web App',
    year: '2026',
    details: '',
    longDetails: '',
    tech: '',
    image: '',
    videoUrl: '',
    link: '',
    github: '',
    isFeatured: true,
    isPublished: true,
  });

  // Experience modal/editing state
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState(null);
  const [expForm, setExpForm] = useState({
    id: '',
    company: '',
    role: '',
    employmentType: 'Internship',
    period: '',
    startDate: '',
    endDate: '',
    location: '',
    isCurrent: false,
    paragraph: '',
    bullets: [''],
    desc: '',
    skills: '',
    logo: '',
    image: '',
    website: '',
    github: '',
    linkedin: '',
    x: '',
    showSkillIcons: true,
    isPublished: true,
  });

  // Education modal/editing state
  const [showEduModal, setShowEduModal] = useState(false);
  const [editingEduIndex, setEditingEduIndex] = useState(null);
  const [eduForm, setEduForm] = useState({
    id: '',
    degree: '',
    institution: '',
    branch: '',
    location: '',
    period: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    paragraph: '',
    bullets: [''],
    desc: '',
    courses: '',
    logo: '',
    image: '',
    isPublished: true,
  });

  // Certifications & Achievements modal/editing state
  const [showCertModal, setShowCertModal] = useState(false);
  const [editingCertIndex, setEditingCertIndex] = useState(null);
  const [certModalType, setCertModalType] = useState('certification');
  const [certFilterTab, setCertFilterTab] = useState('all');
  const [certForm, setCertForm] = useState({
    id: '',
    title: '',
    issuer: '',
    year: '',
    issueDate: '',
    link: '',
    description: '',
    image: '',
    certificateImage: '',
    photos: '',
  });

  // Skills & narrative state
  const [editingSkillsList, setEditingSkillsList] = useState([]);
  const [editingAboutList, setEditingAboutList] = useState([]);
  const [metaRolesText, setMetaRolesText] = useState('');
  const [metaActionWordsText, setMetaActionWordsText] = useState('');
  const [metaEmailText, setMetaEmailText] = useState('sahilaw502@gmail.com');
  const [metaContactStatusText, setMetaContactStatusText] = useState('OPEN TO PRODUCT DESIGN ROLES');
  const [metaLocationText, setMetaLocationText] = useState('JAMMU, INDIA');
  const [metaNameText, setMetaNameText] = useState('Sahil Wani');
  const [metaPitchText, setMetaPitchText] = useState(
    'Hey, I am Sahil Wani, a 20yo guy building things for the web. Crafting sleek digital experiences, experimenting with code, design, and ideas that feel right.'
  );
  const [metaGithubText, setMetaGithubText] = useState('https://github.com/sahil-wani');
  const [metaLinkedinText, setMetaLinkedinText] = useState('https://linkedin.com/in/sahil-wani');
  const [metaThreadsText, setMetaThreadsText] = useState('https://threads.net/@sahilwani');
  const [metaXText, setMetaXText] = useState('https://x.com/sahilwani');

  // Custom icon creator state
  const [newCustomIconName, setNewCustomIconName] = useState('');
  const [newCustomIconImg, setNewCustomIconImg] = useState('');

  // Custom skill logo upload modal state
  const [customSkillModal, setCustomSkillModal] = useState({
    isOpen: false,
    categoryIdx: null,
    name: '',
    logoUrl: '',
    logoPreview: '',
    tab: 'online',
    filterQuery: '',
  });

  const [isExportingZip, setIsExportingZip] = useState(false);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [unanswered, setUnanswered] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [settings, setSettings] = useState({});

  // Modals & form states
  const [showKbModal, setShowKbModal] = useState(false);
  const [kbForm, setKbForm] = useState({
    id: '',
    canonical_question: '',
    answer: '',
    category: 'Projects',
    aliases: '',
    keywords: '',
    links: '',
    is_active: true,
  });

  const [convertTarget, setConvertTarget] = useState(null);
  const [convertAnswer, setConvertAnswer] = useState('');

  // Sandbox state
  const [sandboxQuery, setSandboxQuery] = useState('');
  const [sandboxResult, setSandboxResult] = useState(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);

  // Settings password change state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  const [kbSearch, setKbSearch] = useState('');
  const [kbCategoryFilter, setKbCategoryFilter] = useState('all');

  // Supabase live connectivity status
  const [supabaseStatus, setSupabaseStatus] = useState({
    state: 'checking',
    latencyMs: null,
    error: null,
    lastChecked: null,
  });

  // Real backend operation active state and feedback notifications
  const [backendOp, setBackendOp] = useState({
    active: false,
    action: '',
    sectionName: '',
    itemTitle: '',
    message: '',
  });
  const [opToast, setOpToast] = useState(null);

  const checkSupabaseHealth = useCallback(async (isUserTriggered = false) => {
    if (isUserTriggered) {
      setSupabaseStatus((prev) => ({ ...prev, state: 'checking' }));
    }
    const startTime = Date.now();
    try {
      const res = await fetch('/api/health/supabase');
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSupabaseStatus({
          state: 'connected',
          latencyMs: data.latencyMs || (Date.now() - startTime),
          error: null,
          lastChecked: new Date().toLocaleTimeString(),
        });
        return;
      }
      if (supabase) {
        const { error: supaErr } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
        if (!supaErr) {
          setSupabaseStatus({
            state: 'connected',
            latencyMs: Date.now() - startTime,
            error: null,
            lastChecked: new Date().toLocaleTimeString(),
          });
          return;
        }
      }
      setSupabaseStatus({
        state: 'disconnected',
        latencyMs: null,
        error: data.error || 'Connection failed',
        lastChecked: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      if (supabase) {
        try {
          const { error: supaErr } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
          if (!supaErr) {
            setSupabaseStatus({
              state: 'connected',
              latencyMs: Date.now() - startTime,
              error: null,
              lastChecked: new Date().toLocaleTimeString(),
            });
            return;
          }
        } catch {}
      }
      setSupabaseStatus({
        state: 'disconnected',
        latencyMs: null,
        error: err.message,
        lastChecked: new Date().toLocaleTimeString(),
      });
    }
  }, []);

  // Periodic heartbeat for Supabase status
  useEffect(() => {
    checkSupabaseHealth();
    const interval = setInterval(() => {
      checkSupabaseHealth();
    }, 45000);
    return () => clearInterval(interval);
  }, [checkSupabaseHealth]);

  // Auto-dismiss operation toast after 5 seconds
  useEffect(() => {
    if (!opToast) return;
    const t = setTimeout(() => {
      setOpToast(null);
    }, 5000);
    return () => clearTimeout(t);
  }, [opToast]);

  // Verify token on mount
  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => {
        setAdminUser(data.admin);
        loadDashboardData(token);
      })
      .catch(() => {
        setToken('');
        localStorage.removeItem('portfolio_admin_token');
      });
  }, [token]);

  function loadVisitorAnalytics(range = analyticsRange, authToken = token) {
    if (!authToken) return;
    setVisitorLoading(true);
    fetch(`/api/admin/visitor-analytics?range=${range}`, {
      headers: { Authorization: `Bearer ${authToken}`, 'x-admin-device': 'true' },
    })
      .then((r) => r.json())
      .then((data) => {
        setVisitorAnalytics(data);
      })
      .catch((err) => {
        console.error('Failed to load visitor analytics:', err);
      })
      .finally(() => {
        setVisitorLoading(false);
      });
  }

  function handleRangeChange(newRange) {
    setAnalyticsRange(newRange);
    loadVisitorAnalytics(newRange);
  }

  function loadDashboardData(authToken = token) {
    const headers = { Authorization: `Bearer ${authToken}` };

    loadVisitorAnalytics(analyticsRange, authToken);

    fetch('/api/admin/analytics', { headers })
      .then((r) => r.json())
      .then(setAnalytics)
      .catch(console.error);

    fetch('/api/admin/unanswered?limit=50', { headers })
      .then((r) => r.json())
      .then((d) => setUnanswered(d.items || []))
      .catch(console.error);

    fetch('/api/admin/knowledge', { headers })
      .then((r) => r.json())
      .then((d) => setKnowledge(d.items || []))
      .catch(console.error);

    fetch('/api/admin/templates', { headers })
      .then((r) => r.json())
      .then((d) => setTemplates(d.items || []))
      .catch(console.error);

    fetch('/api/admin/conversations?limit=30', { headers })
      .then((r) => r.json())
      .then((d) => setConversations(d.items || []))
      .catch(console.error);

    fetch('/api/admin/settings', { headers })
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || {}))
      .catch(console.error);

    const applyFreshPortfolioData = (content) => {
      const fresh = {
        about: Array.isArray(content.about) ? content.about : (ABOUT_PARAGRAPHS || []),
        experiences: Array.isArray(content.experiences) ? content.experiences : (EXPERIENCES || []),
        projects: Array.isArray(content.projects) ? content.projects : (PROJECTS || []),
        education: Array.isArray(content.education) ? content.education : (EDUCATION_ITEMS || []),
        skills: Array.isArray(content.skills) ? content.skills : (SKILL_CATEGORIES || []),
        certifications: Array.isArray(content.certifications) ? content.certifications : (CERTIFICATIONS || []),
        achievements: Array.isArray(content.achievements) ? content.achievements : (ACHIEVEMENTS || []),
        social_links: Array.isArray(content.social_links) ? content.social_links : [],
        custom_icons: Array.isArray(content.custom_icons) ? content.custom_icons : [],
        meta: content.meta || { hero_roles: HERO_ROLES },
      };
      setPortfolioContent(fresh);
      if (Array.isArray(fresh.skills)) {
        const cleaned = fresh.skills
          .filter((cat) => cat && (cat.category || '').trim().toLowerCase() !== 'new category')
          .map((cat) => {
            const filteredSkills = (cat.skills || []).filter((s) => {
              const sName = (typeof s === 'string' ? s : s?.name || '').trim().toLowerCase();
              return sName !== 'newskill' && sName !== 'new skill';
            });
            return {
              ...cat,
              skills: filteredSkills,
              _rawSkills: filteredSkills.map((s) => (typeof s === 'string' ? s : s?.name || '')).filter(Boolean).join(', '),
            };
          });
        setEditingSkillsList(cleaned);
      }
      if (Array.isArray(fresh.about)) setEditingAboutList(sanitizeAdminParagraphs(fresh.about));
      if (fresh.meta) {
        setMetaRolesText(Array.isArray(fresh.meta.hero_roles) ? fresh.meta.hero_roles.join(', ') : '');
        setMetaActionWordsText(
          Array.isArray(fresh.meta.action_words)
            ? fresh.meta.action_words.join(', ')
            : (Array.isArray(fresh.action_words) ? fresh.action_words.join(', ') : 'design., prototype., solve., build., develop., debug., ship., optimize., scale., do it.')
        );
        setMetaEmailText(fresh.meta.email || 'sahilaw502@gmail.com');
        if (fresh.meta.contact_status) setMetaContactStatusText(fresh.meta.contact_status);
        if (fresh.meta.location) setMetaLocationText(fresh.meta.location);
        if (fresh.meta.name) setMetaNameText(fresh.meta.name);
        if (fresh.meta.introduction) setMetaIntroText(fresh.meta.introduction);
        else if (fresh.meta.pitch) setMetaIntroText(fresh.meta.pitch);
        if (fresh.meta.pitch) setMetaPitchText(fresh.meta.pitch);
        if (fresh.meta.github) setMetaGithubText(fresh.meta.github);
        if (fresh.meta.linkedin) setMetaLinkedinText(fresh.meta.linkedin);
        if (fresh.meta.threads) setMetaThreadsText(fresh.meta.threads);
        if (fresh.meta.x || fresh.meta.twitter) setMetaXText(fresh.meta.x || fresh.meta.twitter);
      }
    };

    fetch('/api/portfolio-content')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.success && d.content) {
          applyFreshPortfolioData(d.content);
        } else if (isSupabaseConfigured()) {
          fetchPortfolioDirectFromSupabase().then(applyFreshPortfolioData).catch(console.error);
        }
      })
      .catch((err) => {
        console.warn('API content fetch failed, attempting direct Supabase query:', err);
        if (isSupabaseConfigured()) {
          fetchPortfolioDirectFromSupabase().then(applyFreshPortfolioData).catch(console.error);
        }
      });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    // If Supabase is configured and username resembles an email, attempt Supabase Auth
    if (isSupabaseConfigured() && supabase && loginUsername.includes('@')) {
      try {
        const { data: supaAuth, error: supaErr } = await supabase.auth.signInWithPassword({
          email: loginUsername.trim(),
          password: loginPassword,
        });

        if (!supaErr && supaAuth?.user) {
          // Check admin allowlist
          const { data: allowed, error: allowErr } = await supabase
            .from('admin_allowlist')
            .select('email, role')
            .eq('email', supaAuth.user.email)
            .maybeSingle();

          if (!allowErr && allowed) {
            let tokenVal = supaAuth.session?.access_token || `supa-${Date.now()}`;
            try {
              const verifyRes = await fetch('/api/admin/supabase-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: supaAuth.user.email, accessToken: tokenVal }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData && verifyData.token) {
                tokenVal = verifyData.token;
              }
            } catch {
              // Use Supabase access token directly
            }

            setToken(tokenVal);
            localStorage.setItem('portfolio_admin_token', tokenVal);
            localStorage.setItem('portfolio_admin_device', 'true');
            setAdminUser({
              username: supaAuth.user.email,
              role: allowed.role || 'admin',
              provider: 'supabase',
            });
            loadDashboardData(tokenVal);
            setLoginLoading(false);
            return;
          }
        }
      } catch (err) {
        // Fall back to server login
      }
    }

    // Server-side admin verification with SQLite fallback
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginUsername, password: loginPassword }),
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Login failed');
        return d;
      })
      .then((data) => {
        setToken(data.token);
        localStorage.setItem('portfolio_admin_token', data.token);
        localStorage.setItem('portfolio_admin_device', 'true');
        setAdminUser(data.admin);
        loadDashboardData(data.token);
      })
      .catch((err) => {
        setLoginError(err.message || 'Invalid credentials');
      })
      .finally(() => setLoginLoading(false));
  }

  function handleLogout() {
    fetch('/api/admin/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).finally(() => {
      setToken('');
      setAdminUser(null);
      localStorage.removeItem('portfolio_admin_token');
    });
  }

  function handleSaveKb(e) {
    e.preventDefault();
    const payload = {
      canonical_question: kbForm.canonical_question.trim(),
      answer: kbForm.answer.trim(),
      category: kbForm.category.trim() || 'General',
      aliases: kbForm.aliases
        .split('\n')
        .map((a) => a.trim())
        .filter(Boolean),
      keywords: kbForm.keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      links: kbForm.links
        ? kbForm.links.split('\n').map((l) => {
            const [label, url] = l.split('|').map((s) => s.trim());
            return { label: label || 'Link', url: url || label };
          })
        : [],
      is_active: kbForm.is_active,
    };

    const isEdit = Boolean(kbForm.id);
    const url = isEdit ? `/api/admin/knowledge/${kbForm.id}` : '/api/admin/knowledge';
    const method = isEdit ? 'PATCH' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((saved) => {
        setShowKbModal(false);
        if (isEdit) {
          setKnowledge((prev) => prev.map((k) => (k.id === kbForm.id ? { ...k, ...payload } : k)));
        } else if (saved?.entry) {
          setKnowledge((prev) => [saved.entry, ...prev]);
        }
        loadDashboardData();
      })
      .catch((err) => alert('Failed to save: ' + err.message));
  }

  function handleDeleteKb(id) {
    if (!window.confirm('Delete this knowledge entry permanently?')) return;
    fetch(`/api/admin/knowledge/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => loadDashboardData())
      .catch((err) => alert('Delete error: ' + err.message));
  }

  function handleConvertUnanswered(e) {
    e.preventDefault();
    if (!convertTarget) return;

    fetch(`/api/admin/unanswered/${convertTarget.id}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        canonical_question: convertTarget.raw_question,
        answer: convertAnswer.trim(),
        category: 'FAQ',
        aliases: [convertTarget.normalized_question],
        keywords: convertTarget.normalized_question.split(' ').filter((w) => w.length > 2),
      }),
    })
      .then((r) => r.json())
      .then(() => {
        setConvertTarget(null);
        setConvertAnswer('');
        loadDashboardData();
      })
      .catch((err) => alert('Conversion failed: ' + err.message));
  }

  function handleIgnoreUnanswered(id) {
    fetch(`/api/admin/unanswered/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'ignored' }),
    }).then(() => loadDashboardData());
  }

  function handleSaveTemplate(key, templateText) {
    fetch(`/api/admin/templates/${key}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ template: templateText }),
    })
      .then((r) => r.json())
      .then(() => {
        setTemplates((prev) =>
          prev.map((t) => (t.key === key ? { ...t, template: templateText } : t))
        );
        loadDashboardData();
      })
      .catch((err) => alert('Update failed: ' + err.message));
  }

  function handleTestMatch(e) {
    e.preventDefault();
    if (!sandboxQuery.trim()) return;
    setSandboxLoading(true);

    fetch('/api/admin/test-match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: sandboxQuery }),
    })
      .then((r) => r.json())
      .then((data) => {
        setSandboxResult(data.result);
      })
      .catch((err) => alert('Sandbox error: ' + err.message))
      .finally(() => setSandboxLoading(false));
  }

  function handleSaveSettings(e) {
    e.preventDefault();
    fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    })
      .then((r) => r.json())
      .then(() => alert('Settings saved successfully!'))
      .catch((err) => alert('Save failed: ' + err.message));
  }

  function handleChangePassword(e) {
    e.preventDefault();
    setPwdMsg('');
    fetch('/api/admin/password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Failed');
        return d;
      })
      .then(() => {
        setPwdMsg('Password updated successfully!');
        setCurrentPwd('');
        setNewPwd('');
      })
      .catch((err) => setPwdMsg('Error: ' + err.message));
  }

  // Portfolio content handlers
  async function handleSavePortfolioSection(section, data, opMeta = {}) {
    setContentSaveMsg('');
    const activeToken = token || localStorage.getItem('portfolio_admin_token') || '';
    if (!activeToken) {
      alert('You must be logged in as admin to save changes. Please log in.');
      throw new Error('Not authenticated');
    }

    const action = opMeta.action || 'save';
    const sectionName = opMeta.sectionName || section;
    const itemTitle = opMeta.itemTitle || '';

    let actionVerb = 'Saving';
    if (action === 'delete') actionVerb = 'Deleting';
    else if (action === 'create') actionVerb = 'Creating';
    else if (action === 'update') actionVerb = 'Updating';
    else if (action === 'reorder') actionVerb = 'Reordering';

    const busyMessage = `${actionVerb} ${itemTitle ? `"${itemTitle}"` : sectionName} in Supabase and database...`;

    setBackendOp({
      active: true,
      action,
      sectionName,
      itemTitle,
      message: busyMessage,
    });

    try {
      // If an explicit deleteId was provided, also call DELETE endpoint
      if (action === 'delete' && opMeta.deleteId) {
        try {
          await fetch(`/api/admin/portfolio-content/${section}/${encodeURIComponent(opMeta.deleteId)}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${activeToken}`,
            },
          });
        } catch (e) {
          console.warn(`Direct delete endpoint notice: ${e.message}`);
        }
      }

      const r = await fetch(`/api/admin/portfolio-content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ data }),
      });

      const res = await r.json().catch(() => ({}));
      if (!r.ok || !res.success) {
        throw new Error(res.error || `HTTP ${r.status}: Failed to update section`);
      }

      setPortfolioContent((prev) => ({ ...prev, [section]: data }));

      let successMsg = '';
      if (action === 'delete') {
        successMsg = `Deleted ${itemTitle ? `"${itemTitle}"` : sectionName} permanently from Supabase and database.`;
      } else if (action === 'create') {
        successMsg = `Added ${itemTitle ? `"${itemTitle}"` : sectionName} to Supabase and database successfully.`;
      } else if (action === 'update') {
        successMsg = `Updated ${itemTitle ? `"${itemTitle}"` : sectionName} in Supabase and database successfully.`;
      } else if (action === 'reorder') {
        successMsg = `Reordered ${sectionName} in Supabase and database successfully.`;
      } else {
        successMsg = `${sectionName} saved to Supabase and database successfully.`;
      }

      setContentSaveMsg(successMsg);
      setOpToast({
        type: 'success',
        message: successMsg,
        timestamp: Date.now(),
      });
      setTimeout(() => setContentSaveMsg(''), 4000);

      // Notify other windows/components
      window.dispatchEvent(new CustomEvent('portfolio-content-updated', { detail: { [section]: data } }));
      try {
        const cached = JSON.parse(localStorage.getItem('portfolio_content_cache') || '{}');
        cached[section] = data;
        localStorage.setItem('portfolio_content_cache', JSON.stringify(cached));
      } catch {}
      try {
        const cached13 = JSON.parse(localStorage.getItem('portfolio_content_cache_v13') || '{}');
        cached13[section] = data;
        localStorage.setItem('portfolio_content_cache_v13', JSON.stringify(cached13));
      } catch {}

      // Refresh live Supabase status
      checkSupabaseHealth();

      return res;
    } catch (err) {
      setOpToast({
        type: 'error',
        message: `Operation failed: ${err.message}`,
        timestamp: Date.now(),
      });
      checkSupabaseHealth();
      alert('Save failed: ' + err.message);
      throw err;
    } finally {
      setBackendOp({ active: false, action: '', sectionName: '', itemTitle: '', message: '' });
    }
  }

  async function handleExportZip() {
    setIsExportingZip(true);
    try {
      const zip = new JSZip();

      // 1. Root Consolidated JSON
      zip.file('portfolio-data.json', JSON.stringify(portfolioContent, null, 2));

      // 2. Data directory with modular structured JSON files
      const dataFolder = zip.folder('data');
      dataFolder.file('about.json', JSON.stringify(portfolioContent.about || [], null, 2));
      dataFolder.file('experiences.json', JSON.stringify(portfolioContent.experiences || [], null, 2));
      dataFolder.file('education.json', JSON.stringify(portfolioContent.education || [], null, 2));
      dataFolder.file('skills.json', JSON.stringify(portfolioContent.skills || [], null, 2));
      dataFolder.file('social_links.json', JSON.stringify(portfolioContent.social_links || [], null, 2));
      dataFolder.file('meta.json', JSON.stringify(portfolioContent.meta || {}, null, 2));
      dataFolder.file('certifications.json', JSON.stringify(portfolioContent.certifications || CERTIFICATIONS, null, 2));
      dataFolder.file('achievements.json', JSON.stringify(portfolioContent.achievements || ACHIEVEMENTS, null, 2));
      dataFolder.file('custom-icons.json', JSON.stringify(portfolioContent.custom_icons || [], null, 2));
      dataFolder.file('knowledge-base.json', JSON.stringify(knowledge || [], null, 2));

      // 3. Extract and save uploaded custom logos into assets/logos/
      const logosFolder = zip.folder('assets/logos');
      let extractedLogosCount = 0;

      if (Array.isArray(portfolioContent.skills)) {
        portfolioContent.skills.forEach((category) => {
          if (Array.isArray(category.skills)) {
            category.skills.forEach((skill) => {
              if (typeof skill === 'object' && skill?.logoUrl && skill.logoUrl.startsWith('data:image/')) {
                const mimeMatch = skill.logoUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
                const ext = mimeMatch ? (mimeMatch[1] === 'svg+xml' ? 'svg' : mimeMatch[1]) : 'png';
                const base64Data = skill.logoUrl.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
                const cleanName = (skill.name || 'skill').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
                logosFolder.file(`${cleanName}.${ext}`, base64Data, { base64: true });
                extractedLogosCount++;
              }
            });
          }
        });
      }

      if (Array.isArray(portfolioContent.experiences)) {
        portfolioContent.experiences.forEach((exp) => {
          if (typeof exp.logo === 'string' && exp.logo.startsWith('data:image/')) {
            const mimeMatch = exp.logo.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
            const ext = mimeMatch ? (mimeMatch[1] === 'svg+xml' ? 'svg' : mimeMatch[1]) : 'png';
            const base64Data = exp.logo.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
            const cleanName = (exp.company || 'exp').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
            logosFolder.file(`exp-${cleanName}.${ext}`, base64Data, { base64: true });
            extractedLogosCount++;
          }
        });
      }

      // 4. Manifest
      const manifest = {
        name: 'Sahil Portfolio Export Package',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        stats: {
          experiences: (portfolioContent.experiences || []).length,
          education: (portfolioContent.education || []).length,
          skillsCategories: (portfolioContent.skills || []).length,
          knowledgeEntries: (knowledge || []).length,
          extractedCustomLogos: extractedLogosCount,
        },
      };
      zip.file('manifest.json', JSON.stringify(manifest, null, 2));

      // 5. Documentation
      zip.file(
        'README.md',
        `# Portfolio Export Archive\n\nGenerated on ${new Date().toUTCString()}\n\n## Structure\n- \`portfolio-data.json\`: Consolidated full portfolio state\n- \`data/\`: Modular JSON documents for each section\n- \`assets/logos/\`: All custom uploaded skill logos and company icons saved as image files\n- \`manifest.json\`: Export metadata and structure metrics\n`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setContentSaveMsg(`Portfolio ZIP exported successfully with ${extractedLogosCount} custom logos!`);
      setTimeout(() => setContentSaveMsg(''), 4500);
    } catch (err) {
      alert('Failed to export ZIP: ' + err.message);
    } finally {
      setIsExportingZip(false);
    }
  }

  function handleOpenAddProject() {
    setEditingProjectIndex(null);
    setProjectForm({
      id: `project-${Date.now()}`,
      title: '',
      category: 'Web App',
      year: '2026',
      details: '',
      longDetails: '',
      tech: '',
      image: '',
      videoUrl: '',
      link: '',
      github: '',
      isFeatured: true,
      isPublished: true,
    });
    setShowProjectModal(true);
  }

  function handleOpenEditProject(item, index) {
    setEditingProjectIndex(index);
    const techStr = Array.isArray(item.tech)
      ? item.tech.join(', ')
      : (Array.isArray(item.technologies) ? item.technologies.join(', ') : (item.tech || ''));
    setProjectForm({
      id: item.id || `project-${Date.now()}`,
      title: item.title || '',
      category: item.category || 'Web App',
      year: item.year || '2026',
      details: item.details || item.description || '',
      longDetails: item.longDetails || item.details || item.description || '',
      tech: techStr,
      image: item.image || item.videoThumb || '',
      videoUrl: item.videoUrl || item.video || item.video_url || item.metrics?.videoUrl || '',
      link: item.link || item.website || '',
      github: item.github || '',
      isFeatured: item.isFeatured !== false,
      isPublished: item.isPublished !== false,
    });
    setShowProjectModal(true);
  }

  function handleSaveProject(e) {
    e.preventDefault();
    const techArray = projectForm.tech
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const videoVal = (projectForm.videoUrl || '').trim();
    const updatedItem = {
      id: projectForm.id || `project-${Date.now()}`,
      title: projectForm.title.trim(),
      category: projectForm.category.trim() || 'Web App',
      year: projectForm.year.trim() || '2026',
      details: projectForm.details.trim(),
      description: projectForm.details.trim(),
      longDetails: projectForm.longDetails.trim() || projectForm.details.trim(),
      tech: techArray,
      technologies: techArray,
      techFull: techArray,
      image: projectForm.image.trim(),
      videoThumb: projectForm.image.trim(),
      videoUrl: videoVal,
      video: videoVal,
      video_url: videoVal,
      link: projectForm.link.trim(),
      website: projectForm.link.trim(),
      github: projectForm.github.trim(),
      isFeatured: projectForm.isFeatured,
      isPublished: projectForm.isPublished !== false,
      isWorking: true,
      metrics: {
        ...(editingProjectIndex !== null && portfolioContent.projects?.[editingProjectIndex]?.metrics
          ? portfolioContent.projects[editingProjectIndex].metrics
          : {}),
        videoUrl: videoVal,
      },
    };

    let updatedList = [...(portfolioContent.projects || [])];
    const isEditing = editingProjectIndex !== null && editingProjectIndex >= 0;
    if (isEditing) {
      updatedList[editingProjectIndex] = updatedItem;
    } else {
      updatedList.unshift(updatedItem);
    }

    handleSavePortfolioSection('projects', updatedList, {
      action: isEditing ? 'update' : 'create',
      sectionName: 'Project',
      itemTitle: updatedItem.title || 'Project entry',
    }).then(() => {
      setShowProjectModal(false);
    }).catch(() => {});
  }

  function handleDeleteProject(index) {
    const target = (portfolioContent.projects || [])[index];
    if (!target) return;
    const confirmTitle = target.title || 'this project';
    const isDemo = isDemoItem(target);
    const confirmMsg = isDemo
      ? `Delete sample demo project "${confirmTitle}"? This record will be safely removed.`
      : `Are you sure you want to delete ${confirmTitle}? This will permanently remove it from Supabase and the portfolio.`;
    if (!window.confirm(confirmMsg)) return;
    const updated = (portfolioContent.projects || []).filter((_, idx) => idx !== index);
    handleSavePortfolioSection('projects', updated, {
      action: 'delete',
      sectionName: 'Project',
      itemTitle: confirmTitle,
      deleteId: target.id,
    });
  }

  function handleMoveProject(index, direction) {
    const list = [...(portfolioContent.projects || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    handleSavePortfolioSection('projects', list, {
      action: 'reorder',
      sectionName: 'Projects',
      itemTitle: temp?.title || 'Projects',
    });
  }

  function handleOpenAddExp() {
    setEditingExpIndex(null);
    setExpForm({
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      employmentType: 'Internship',
      period: '',
      startDate: '',
      endDate: '',
      location: '',
      isCurrent: false,
      paragraph: '',
      bullets: [''],
      desc: '',
      skills: '',
      logo: '',
      image: '',
      website: '',
      github: '',
      linkedin: '',
      x: '',
      showSkillIcons: true,
      isPublished: true,
    });
    setShowExpModal(true);
  }

  function handleOpenEditExp(exp, index) {
    setEditingExpIndex(index);
    const logoVal = typeof exp.image === 'string' && exp.image ? exp.image : (typeof exp.logo === 'string' ? exp.logo : '');
    const isCurrent = Boolean(
      exp.isCurrent ||
      (typeof exp.period === 'string' && /present/i.test(exp.period)) ||
      (typeof exp.endDate === 'string' && /present/i.test(exp.endDate))
    );

    let start = exp.startDate || '';
    let end = exp.endDate || '';
    if (!start && exp.period) {
      const parts = exp.period.split(/[-–—]/);
      start = parts[0]?.trim() || '';
      end = parts[1]?.trim() || '';
    }
    if (isCurrent && (!end || !/present/i.test(end))) {
      end = 'Present';
    }

    const initialPeriod = exp.period || (start && end ? `${start} - ${end}` : (start || ''));

    const rawParagraph = exp.description_paragraph || (typeof exp.desc === 'string' && !Array.isArray(exp.description) ? exp.desc : '');
    let rawBullets = [];
    if (Array.isArray(exp.description_bullets) && exp.description_bullets.length > 0) {
      rawBullets = [...exp.description_bullets];
    } else if (Array.isArray(exp.description) && exp.description.length > 0) {
      rawBullets = [...exp.description];
    } else if (typeof exp.desc === 'string' && exp.desc) {
      rawBullets = exp.desc.split('\n').map((s) => s.trim()).filter(Boolean);
    }
    if (rawBullets.length === 0) rawBullets = [''];

    setExpForm({
      id: exp.id || `exp-${Date.now()}`,
      company: exp.company || '',
      role: exp.role || exp.position || '',
      employmentType: exp.employmentType || exp.type || 'Internship',
      period: initialPeriod,
      startDate: start,
      endDate: end,
      location: exp.location || '',
      isCurrent,
      paragraph: rawParagraph,
      bullets: rawBullets,
      desc: rawParagraph || rawBullets.join('\n'),
      skills: Array.isArray(exp.skills) ? exp.skills.join(', ') : (Array.isArray(exp.technologies) ? exp.technologies.join(', ') : (exp.skills || '')),
      logo: logoVal,
      image: logoVal,
      website: exp.website || '',
      github: exp.github || '',
      linkedin: exp.linkedin || '',
      x: exp.x || '',
      showSkillIcons: exp.showSkillIcons !== false,
      isPublished: exp.isPublished !== false,
    });
    setShowExpModal(true);
  }

  function addExpBullet() {
    setExpForm((prev) => ({ ...prev, bullets: [...(prev.bullets || []), ''] }));
  }

  function updateExpBullet(bIndex, val) {
    setExpForm((prev) => {
      const next = [...(prev.bullets || [])];
      next[bIndex] = val;
      return { ...prev, bullets: next };
    });
  }

  function removeExpBullet(bIndex) {
    setExpForm((prev) => {
      const next = (prev.bullets || []).filter((_, i) => i !== bIndex);
      return { ...prev, bullets: next.length > 0 ? next : [''] };
    });
  }

  function moveExpBullet(bIndex, dir) {
    setExpForm((prev) => {
      const list = [...(prev.bullets || [])];
      const target = dir === 'up' ? bIndex - 1 : bIndex + 1;
      if (target < 0 || target >= list.length) return prev;
      const tmp = list[bIndex];
      list[bIndex] = list[target];
      list[target] = tmp;
      return { ...prev, bullets: list };
    });
  }

  function handleSaveExp(e) {
    e.preventDefault();
    const skillsArray = expForm.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const cleanedBullets = (Array.isArray(expForm.bullets) ? expForm.bullets : [])
      .map((s) => (typeof s === 'string' ? s.trim() : ''))
      .filter(Boolean);

    const logoImg = (expForm.image || expForm.logo || '').trim();

    let finalPeriod = expForm.period.trim();
    if (!finalPeriod) {
      const startPart = expForm.startDate.trim();
      const endPart = expForm.isCurrent ? 'Present' : expForm.endDate.trim();
      if (startPart && endPart) {
        finalPeriod = `${startPart} - ${endPart}`;
      } else {
        finalPeriod = startPart || endPart;
      }
    }

    const paragraphText = (expForm.paragraph || '').trim();

    const updatedItem = {
      id: expForm.id || `exp-${Date.now()}`,
      company: expForm.company.trim(),
      role: expForm.role.trim(),
      position: expForm.role.trim(),
      employmentType: expForm.employmentType || 'Internship',
      period: finalPeriod,
      startDate: expForm.startDate.trim(),
      endDate: expForm.isCurrent ? 'Present' : expForm.endDate.trim(),
      location: expForm.location.trim(),
      isCurrent: Boolean(expForm.isCurrent),
      description_paragraph: paragraphText,
      description_bullets: cleanedBullets,
      desc: paragraphText || cleanedBullets.join('\n'),
      description: cleanedBullets.length > 0 ? cleanedBullets : (paragraphText ? [paragraphText] : []),
      skills: skillsArray,
      technologies: skillsArray,
      logo: logoImg,
      image: logoImg,
      website: expForm.website.trim(),
      github: expForm.github.trim(),
      linkedin: expForm.linkedin.trim(),
      x: expForm.x.trim(),
      showSkillIcons: expForm.showSkillIcons !== false,
      isPublished: expForm.isPublished !== false,
    };

    let updatedExperiences = [...(portfolioContent.experiences || [])];
    const isEditing = editingExpIndex !== null && editingExpIndex >= 0 && editingExpIndex < updatedExperiences.length;
    if (isEditing) {
      updatedExperiences[editingExpIndex] = updatedItem;
    } else {
      updatedExperiences.unshift(updatedItem);
    }

    handleSavePortfolioSection('experiences', updatedExperiences, {
      action: isEditing ? 'update' : 'create',
      sectionName: 'Experience',
      itemTitle: updatedItem.company || updatedItem.role || 'Experience entry',
    })
      .then(() => {
        setShowExpModal(false);
      })
      .catch(() => {});
  }

  function handleDeleteExp(index) {
    const target = (portfolioContent.experiences || [])[index];
    if (!target) return;
    const confirmName = target.company || target.role || 'this experience';
    const isDemo = isDemoItem(target);
    const confirmMsg = isDemo
      ? `Delete sample demo experience "${confirmName}"? This record will be safely removed.`
      : `Are you sure you want to delete ${confirmName}? This will permanently remove it from Supabase and the portfolio.`;
    if (!window.confirm(confirmMsg)) return;
    const updated = (portfolioContent.experiences || []).filter((_, idx) => idx !== index);
    handleSavePortfolioSection('experiences', updated, {
      action: 'delete',
      sectionName: 'Experience',
      itemTitle: confirmName,
      deleteId: target.id,
    });
  }

  function handleMoveExp(index, direction) {
    const list = [...(portfolioContent.experiences || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    handleSavePortfolioSection('experiences', list, {
      action: 'reorder',
      sectionName: 'Experiences',
      itemTitle: temp?.company || 'Experiences',
    });
  }

  function handleOpenAddEdu() {
    setEditingEduIndex(null);
    setEduForm({
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      branch: '',
      location: '',
      period: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      paragraph: '',
      bullets: [''],
      desc: '',
      courses: '',
      logo: '',
      image: '',
      isPublished: true,
    });
    setShowEduModal(true);
  }

  function handleOpenEditEdu(edu, index) {
    setEditingEduIndex(index);
    const logoVal = typeof edu.image === 'string' && edu.image ? edu.image : (typeof edu.logo === 'string' ? edu.logo : '');
    const rawParagraph = edu.description_paragraph || edu.desc || (typeof edu.description === 'string' ? edu.description : '');
    let rawBullets = [];
    if (Array.isArray(edu.highlights) && edu.highlights.length > 0) {
      rawBullets = [...edu.highlights];
    } else if (Array.isArray(edu.courses) && edu.courses.length > 0) {
      rawBullets = [...edu.courses];
    } else if (Array.isArray(edu.description) && edu.description.length > 0) {
      rawBullets = [...edu.description];
    }
    if (rawBullets.length === 0) rawBullets = [''];

    setEduForm({
      id: edu.id || `edu-${Date.now()}`,
      degree: edu.degree || '',
      institution: edu.institution || '',
      branch: edu.branch || edu.specialization || '',
      location: edu.location || '',
      period: edu.period || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      isCurrent: !!edu.isCurrent,
      paragraph: rawParagraph,
      bullets: rawBullets,
      desc: rawParagraph,
      courses: Array.isArray(edu.courses) ? edu.courses.join(', ') : (edu.courses || ''),
      logo: logoVal,
      image: logoVal,
      isPublished: edu.isPublished !== false,
    });
    setShowEduModal(true);
  }

  function addEduBullet() {
    setEduForm((prev) => ({ ...prev, bullets: [...(prev.bullets || []), ''] }));
  }

  function updateEduBullet(bIndex, val) {
    setEduForm((prev) => {
      const next = [...(prev.bullets || [])];
      next[bIndex] = val;
      return { ...prev, bullets: next };
    });
  }

  function removeEduBullet(bIndex) {
    setEduForm((prev) => {
      const next = (prev.bullets || []).filter((_, i) => i !== bIndex);
      return { ...prev, bullets: next.length > 0 ? next : [''] };
    });
  }

  function moveEduBullet(bIndex, dir) {
    setEduForm((prev) => {
      const list = [...(prev.bullets || [])];
      const target = dir === 'up' ? bIndex - 1 : bIndex + 1;
      if (target < 0 || target >= list.length) return prev;
      const tmp = list[bIndex];
      list[bIndex] = list[target];
      list[target] = tmp;
      return { ...prev, bullets: list };
    });
  }

  function handleSaveEdu(e) {
    e.preventDefault();
    const coursesArray = eduForm.courses
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const cleanedBullets = (Array.isArray(eduForm.bullets) ? eduForm.bullets : [])
      .map((b) => (typeof b === 'string' ? b.trim() : ''))
      .filter(Boolean);

    const logoImg = (eduForm.image || eduForm.logo || '').trim();
    const paragraphText = (eduForm.paragraph || '').trim() || (eduForm.desc || '').trim();

    const updatedItem = {
      id: eduForm.id || `edu-${Date.now()}`,
      degree: eduForm.degree.trim(),
      institution: eduForm.institution.trim(),
      branch: (eduForm.branch || '').trim(),
      location: (eduForm.location || '').trim(),
      period: eduForm.period.trim(),
      startDate: (eduForm.startDate || '').trim(),
      endDate: (eduForm.endDate || '').trim(),
      isCurrent: Boolean(eduForm.isCurrent),
      description_paragraph: paragraphText,
      desc: paragraphText,
      description: paragraphText,
      courses: coursesArray.length > 0 ? coursesArray : cleanedBullets,
      highlights: cleanedBullets,
      logo: logoImg,
      image: logoImg,
      isPublished: eduForm.isPublished !== false,
    };

    let updatedEducation = [...(portfolioContent.education || [])];
    const isEditing = editingEduIndex !== null && editingEduIndex >= 0 && editingEduIndex < updatedEducation.length;
    if (isEditing) {
      updatedEducation[editingEduIndex] = updatedItem;
    } else {
      updatedEducation.unshift(updatedItem);
    }

    handleSavePortfolioSection('education', updatedEducation, {
      action: isEditing ? 'update' : 'create',
      sectionName: 'Education',
      itemTitle: updatedItem.institution || updatedItem.degree || 'Education entry',
    })
      .then(() => {
        setShowEduModal(false);
      })
      .catch(() => {});
  }

  function handleDeleteEdu(index) {
    const target = (portfolioContent.education || [])[index];
    if (!target) return;
    const confirmName = target.institution || target.degree || 'this education entry';
    const isDemo = isDemoItem(target);
    const confirmMsg = isDemo
      ? `Delete sample demo education "${confirmName}"? This record will be safely removed.`
      : `Are you sure you want to delete ${confirmName}? This will permanently remove it from Supabase and the portfolio.`;
    if (!window.confirm(confirmMsg)) return;
    const updated = (portfolioContent.education || []).filter((_, idx) => idx !== index);
    handleSavePortfolioSection('education', updated, {
      action: 'delete',
      sectionName: 'Education',
      itemTitle: confirmName,
      deleteId: target.id,
    });
  }

  function handleMoveEdu(index, direction) {
    const list = [...(portfolioContent.education || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    handleSavePortfolioSection('education', list, {
      action: 'reorder',
      sectionName: 'Education',
      itemTitle: temp?.institution || 'Education',
    });
  }

  // Certifications and achievements handlers
  function handleOpenAddCert(type = 'certification') {
    setCertModalType(type);
    setEditingCertIndex(null);
    const curYear = new Date().getFullYear().toString();
    setCertForm({
      id: `${type}-${Date.now()}`,
      title: '',
      issuer: '',
      year: curYear,
      issueDate: `Issued ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
      link: '',
      description: '',
      image: '',
      certificateImage: '',
      photos: '',
    });
    setShowCertModal(true);
  }

  function handleOpenEditCert(item, index, type = 'certification') {
    setCertModalType(type);
    setEditingCertIndex(index);
    const logoVal = item.image || item.logo || '';
    const certImgVal = item.certificateImage || item.certificate_image_url || '';
    const photosVal = Array.isArray(item.photos)
      ? item.photos.join(', ')
      : (typeof item.photos === 'string' ? item.photos : '');
    setCertForm({
      id: item.id || `${type}-${Date.now()}`,
      title: item.title || item.name || '',
      issuer: item.issuer || item.issuing_organization || '',
      year: item.year || (item.issueDate ? item.issueDate.replace(/^Issued\s+/i, '') : ''),
      issueDate: item.issueDate || `Issued ${item.year || ''}`,
      link: item.link || item.credentialUrl || '',
      description: item.description || '',
      image: typeof logoVal === 'string' ? logoVal : '',
      certificateImage: typeof certImgVal === 'string' ? certImgVal : '',
      photos: photosVal,
    });
    setShowCertModal(true);
  }

  function handleSaveCert(e) {
    e.preventDefault();
    const isCert = certModalType === 'certification';
    const sectionName = isCert ? 'certifications' : 'achievements';
    const fallbackList = isCert ? CERTIFICATIONS : ACHIEVEMENTS;
    const existingList = Array.isArray(portfolioContent[sectionName]) && portfolioContent[sectionName].length > 0
      ? portfolioContent[sectionName]
      : fallbackList;

    const logoImg = certForm.image.trim();
    const certDocImg = (certForm.certificateImage || '').trim();
    const photosArr = (certForm.photos || '')
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const updatedItem = {
      id: certForm.id || `${certModalType}-${Date.now()}`,
      title: certForm.title.trim(),
      issuer: certForm.issuer.trim(),
      year: certForm.year.trim(),
      issueDate: certForm.issueDate.trim() || `Issued ${certForm.year.trim()}`,
      link: certForm.link.trim(),
      credentialUrl: certForm.link.trim(),
      description: certForm.description.trim(),
      image: logoImg,
      logo: logoImg,
      certificateImage: certDocImg,
      certificate_image_url: certDocImg,
      photos: photosArr.length > 0 ? photosArr : (certDocImg ? [certDocImg] : []),
    };

    let updatedList = [...existingList];
    const isEditing = editingCertIndex !== null && editingCertIndex >= 0 && editingCertIndex < updatedList.length;
    if (isEditing) {
      updatedList[editingCertIndex] = updatedItem;
    } else {
      updatedList.unshift(updatedItem);
    }

    handleSavePortfolioSection(sectionName, updatedList, {
      action: isEditing ? 'update' : 'create',
      sectionName: isCert ? 'Certification' : 'Achievement',
      itemTitle: updatedItem.title || `${certModalType} entry`,
    })
      .then(() => {
        setShowCertModal(false);
      })
      .catch(() => {});
  }

  function handleDeleteCert(index, type = 'certification') {
    const isCert = type === 'certification';
    const label = isCert ? 'certification' : 'achievement';
    const sectionName = isCert ? 'certifications' : 'achievements';
    const fallbackList = isCert ? CERTIFICATIONS : ACHIEVEMENTS;
    const existingList = Array.isArray(portfolioContent[sectionName]) && portfolioContent[sectionName].length > 0
      ? portfolioContent[sectionName]
      : fallbackList;

    const target = existingList[index];
    if (!target) return;
    const confirmName = target.title || target.name || `this ${label}`;
    const isDemo = isDemoItem(target);
    const confirmMsg = isDemo
      ? `Delete sample demo ${label} "${confirmName}"? This record will be safely removed.`
      : `Are you sure you want to delete ${confirmName}? This will permanently remove it from Supabase and the portfolio.`;
    if (!window.confirm(confirmMsg)) return;

    const updated = existingList.filter((_, idx) => idx !== index);
    handleSavePortfolioSection(sectionName, updated, {
      action: 'delete',
      sectionName: isCert ? 'Certification' : 'Achievement',
      itemTitle: confirmName,
      deleteId: target.id,
    });
  }

  function handleMoveCert(index, direction, type = 'certification') {
    const isCert = type === 'certification';
    const sectionName = isCert ? 'certifications' : 'achievements';
    const fallbackList = isCert ? CERTIFICATIONS : ACHIEVEMENTS;
    const existingList = Array.isArray(portfolioContent[sectionName]) && portfolioContent[sectionName].length > 0
      ? portfolioContent[sectionName]
      : fallbackList;
    const list = [...existingList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    handleSavePortfolioSection(sectionName, list, {
      action: 'reorder',
      sectionName: isCert ? 'Certifications' : 'Achievements',
      itemTitle: temp?.title || (isCert ? 'Certifications' : 'Achievements'),
    });
  }

  // Custom icon handlers
  function handleAddCustomIcon(e) {
    e.preventDefault();
    const name = newCustomIconName.trim();
    if (!name || !newCustomIconImg) {
      alert('Please provide both an icon name and upload an image.');
      return;
    }
    const token = `{{ICON_${name.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}}}`;
    const newIcon = {
      id: `custom-icon-${Date.now()}`,
      name,
      token,
      image: newCustomIconImg,
      logo: newCustomIconImg,
    };
    const updatedCustomIcons = [...(portfolioContent.custom_icons || []), newIcon];
    handleSavePortfolioSection('custom_icons', updatedCustomIcons).then(() => {
      setNewCustomIconName('');
      setNewCustomIconImg('');
    });
  }

  function handleDeleteCustomIcon(iconId) {
    if (!window.confirm('Delete this custom icon?')) return;
    const updated = (portfolioContent.custom_icons || []).filter((ic) => ic.id !== iconId);
    handleSavePortfolioSection('custom_icons', updated);
  }

  function handleSaveAllSkills(e) {
    e.preventDefault();
    const cleaned = editingSkillsList
      .filter((cat) => cat && (cat.category || '').trim() && (cat.category || '').trim().toLowerCase() !== 'new category')
      .map((cat) => ({
        id: cat.id || `cat-${Date.now()}`,
        category: cat.category.trim(),
        skills: (cat.skills || []).map((s) => {
          if (typeof s === 'string') return s.trim();
          return { name: (s.name || '').trim(), logo: s.logo || s.iconUrl || '' };
        }).filter((s) => (typeof s === 'string' ? Boolean(s) : Boolean(s.name))),
      }));
    handleSavePortfolioSection('skills', cleaned, {
      action: 'save',
      sectionName: 'Skills',
      itemTitle: 'Skill Categories',
    });
  }

  function handleAddSkillCategory() {
    const newCat = {
      id: `cat-${Date.now()}`,
      category: '',
      skills: [],
      _rawSkills: '',
    };
    setEditingSkillsList([...editingSkillsList, newCat]);
  }

  function handleDeleteSkillCategory(index) {
    const updated = editingSkillsList.filter((_, idx) => idx !== index);
    setEditingSkillsList(updated);
  }

  function handleRemoveSkillFromCategory(catIdx, skillIdx) {
    const updated = [...editingSkillsList];
    const cat = updated[catIdx];
    const currentSkills = (cat.skills || []).filter((_, i) => i !== skillIdx);
    const rawStr = currentSkills.map((s) => (typeof s === 'string' ? s : s?.name || '')).filter(Boolean).join(', ');
    updated[catIdx] = {
      ...cat,
      skills: currentSkills,
      _rawSkills: rawStr,
    };
    setEditingSkillsList(updated);
  }

  function handleCustomSkillLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomSkillModal((prev) => ({
        ...prev,
        logoPreview: reader.result,
        logoUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }

  function handleAddCustomSkillSubmit(e) {
    e.preventDefault();
    const { categoryIdx, name, logoUrl, logoPreview } = customSkillModal;
    const skillName = (name || '').trim();
    if (!skillName || categoryIdx === null) return;

    const logo = logoPreview || logoUrl;
    const newSkillObj = logo ? { name: skillName, logo } : skillName;

    const updated = [...editingSkillsList];
    const cat = updated[categoryIdx];
    const currentSkills = Array.isArray(cat.skills) ? [...cat.skills] : [];

    const existingIdx = currentSkills.findIndex((s) => {
      const sName = typeof s === 'string' ? s : s?.name || '';
      return sName.toLowerCase() === skillName.toLowerCase();
    });
    if (existingIdx >= 0) {
      currentSkills[existingIdx] = newSkillObj;
    } else {
      currentSkills.push(newSkillObj);
    }

    const rawStr = currentSkills.map((s) => (typeof s === 'string' ? s : s?.name || '')).filter(Boolean).join(', ');
    updated[categoryIdx] = {
      ...cat,
      skills: currentSkills,
      _rawSkills: rawStr,
    };

    setEditingSkillsList(updated);
    setCustomSkillModal({ isOpen: false, categoryIdx: null, name: '', logoUrl: '', logoPreview: '' });
  }

  function handleSaveAllAbout(e) {
    e.preventDefault();
    const sanitized = sanitizeAdminParagraphs(editingAboutList);
    setEditingAboutList(sanitized);
    handleSavePortfolioSection('about', sanitized, {
      action: 'save',
      sectionName: 'About',
      itemTitle: 'Narrative Paragraphs',
    });
  }

  function handleAddAboutParagraph() {
    setEditingAboutList([...editingAboutList, 'New portfolio narrative paragraph...']);
  }

  function handleDeleteAboutParagraph(index) {
    const updated = editingAboutList.filter((_, idx) => idx !== index);
    setEditingAboutList(updated);
  }

  function handleMoveAboutParagraph(index, dir) {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= editingAboutList.length) return;
    const list = [...editingAboutList];
    const [removed] = list.splice(index, 1);
    list.splice(target, 0, removed);
    setEditingAboutList(list);
  }

  function insertIconIntoParagraph(paraIdx, iconToken) {
    const textarea = document.getElementById(`about-para-textarea-${paraIdx}`);
    const currentText = editingAboutList[paraIdx] || '';
    if (!textarea) {
      const updated = [...editingAboutList];
      updated[paraIdx] = currentText ? `${currentText} ${iconToken}` : iconToken;
      setEditingAboutList(updated);
      return;
    }

    const start = textarea.selectionStart ?? currentText.length;
    const end = textarea.selectionEnd ?? currentText.length;
    const before = currentText.substring(0, start);
    const after = currentText.substring(end);

    const needsLeadingSpace = before.length > 0 && !/\s$/.test(before);
    const needsTrailingSpace = after.length > 0 && !/^\s/.test(after);
    const insertion = `${needsLeadingSpace ? ' ' : ''}${iconToken}${needsTrailingSpace ? ' ' : ''}`;

    const newText = before + insertion + after;
    const updated = [...editingAboutList];
    updated[paraIdx] = newText;
    setEditingAboutList(updated);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + insertion.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  }

  function handleSaveMetaRoles(e) {
    e.preventDefault();
    const rolesArray = metaRolesText
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);
    const actionWordsArray = metaActionWordsText
      .split(',')
      .map((w) => w.trim())
      .filter(Boolean);
    const updatedMeta = {
      ...(portfolioContent.meta || {}),
      hero_roles: rolesArray,
      action_words: actionWordsArray.length > 0 ? actionWordsArray : undefined,
      name: metaNameText.trim() || 'Sahil Wani',
      introduction: (metaIntroText || metaPitchText).trim(),
      pitch: metaPitchText.trim(),
      email: metaEmailText.trim() || 'sahilaw502@gmail.com',
      contact_status: metaContactStatusText.trim() || 'OPEN TO PRODUCT DESIGN ROLES',
      location: metaLocationText.trim() || 'JAMMU, INDIA',
      github: metaGithubText.trim() || 'https://github.com/sahil-wani',
      linkedin: metaLinkedinText.trim() || 'https://linkedin.com/in/sahil-wani',
      threads: metaThreadsText.trim() || 'https://threads.net/@sahilwani',
      x: metaXText.trim() || 'https://x.com/sahilwani',
      twitter: metaXText.trim() || 'https://x.com/sahilwani',
    };
    handleSavePortfolioSection('meta', updatedMeta, {
      action: 'update',
      sectionName: 'Profile Meta',
      itemTitle: 'Roles & Contact Info',
    });
  }

  // Social Links Handlers
  function handleOpenAddSocial() {
    setEditingSocialIndex(null);
    const count = portfolioContent.social_links?.length || 0;
    setSocialForm({
      id: `social-${Date.now()}`,
      platform: 'GitHub',
      label: 'GitHub',
      url: 'https://github.com/',
      icon_name: 'github',
      icon_svg: '',
      is_published: true,
      display_order: count,
      is_demo: false,
    });
    setShowSocialModal(true);
  }

  function handleOpenEditSocial(link, index) {
    setEditingSocialIndex(index);
    setSocialForm({
      id: link.id || `social-${Date.now()}`,
      platform: link.platform || 'Custom',
      label: link.label || link.platform || '',
      url: link.url || '',
      icon_name: link.icon_name || (link.platform || '').toLowerCase(),
      icon_svg: link.icon_svg || '',
      is_published: link.is_published !== false && link.isPublished !== false,
      display_order: link.display_order ?? index,
      is_demo: Boolean(link.is_demo || link.isDemo),
    });
    setShowSocialModal(true);
  }

  function handleSaveSocial(e) {
    e.preventDefault();
    const url = (socialForm.url || '').trim();
    if (!url) {
      alert('Please enter a valid URL for this social link.');
      return;
    }

    const updatedItem = {
      id: socialForm.id || `social-${Date.now()}`,
      platform: socialForm.platform,
      label: (socialForm.label || socialForm.platform).trim(),
      url,
      icon_name: (socialForm.icon_name || socialForm.platform).toLowerCase(),
      icon_svg: (socialForm.icon_svg || '').trim(),
      is_published: Boolean(socialForm.is_published),
      display_order: Number(socialForm.display_order) || 0,
      is_demo: Boolean(socialForm.is_demo),
    };

    let updatedList = [...(portfolioContent.social_links || [])];
    const isEditing = editingSocialIndex !== null && editingSocialIndex >= 0 && editingSocialIndex < updatedList.length;
    if (isEditing) {
      updatedList[editingSocialIndex] = updatedItem;
    } else {
      updatedList.push(updatedItem);
    }

    handleSavePortfolioSection('social_links', updatedList, {
      action: isEditing ? 'update' : 'create',
      sectionName: 'Social Links',
      itemTitle: updatedItem.label || updatedItem.platform,
    })
      .then(() => {
        setShowSocialModal(false);
      })
      .catch(() => {});
  }

  function handleDeleteSocial(index) {
    const target = (portfolioContent.social_links || [])[index];
    if (!target) return;
    const confirmName = target.label || target.platform || 'this social link';
    const isDemo = isDemoItem(target);
    const confirmMsg = isDemo
      ? `Delete sample social link "${confirmName}"? This record will be safely removed.`
      : `Are you sure you want to delete ${confirmName}? This will permanently remove it from Supabase and the portfolio.`;
    if (!window.confirm(confirmMsg)) return;

    const updated = (portfolioContent.social_links || []).filter((_, idx) => idx !== index);
    handleSavePortfolioSection('social_links', updated, {
      action: 'delete',
      sectionName: 'Social Links',
      itemTitle: confirmName,
      deleteId: target.id,
    });
  }

  function handleMoveSocial(index, direction) {
    const list = [...(portfolioContent.social_links || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    const reordered = list.map((item, idx) => ({ ...item, display_order: idx }));
    handleSavePortfolioSection('social_links', reordered, {
      action: 'reorder',
      sectionName: 'Social Links',
      itemTitle: temp?.label || temp?.platform || 'Social Link',
    });
  }

  function handleTogglePublishSocial(index) {
    const list = [...(portfolioContent.social_links || [])];
    const target = list[index];
    if (!target) return;
    const isPublished = !(target.is_published !== false && target.isPublished !== false);
    list[index] = { ...target, is_published: isPublished, isPublished };
    handleSavePortfolioSection('social_links', list, {
      action: 'update',
      sectionName: 'Social Links',
      itemTitle: target.label || target.platform,
    });
  }

  // Filter knowledge entries
  const filteredKnowledge = knowledge.filter((item) => {
    const matchesSearch =
      kbSearch === '' ||
      item.canonical_question.toLowerCase().includes(kbSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(kbSearch.toLowerCase());
    const matchesCategory = kbCategoryFilter === 'all' || item.category === kbCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(knowledge.map((k) => k.category)))];

  // If unauthenticated, show minimal clean login view
  if (!adminUser) {
    return (
      <div className="admin-viewport">
        <div className="admin-login-wrapper">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <h1 className="admin-login-title">Admin Access</h1>
              <div
                className={`admin-supabase-status-badge is-${supabaseStatus.state} admin-login-status-pill`}
                title={`Supabase: ${supabaseStatus.state === 'connected' ? `Connected (${supabaseStatus.latencyMs ? `${supabaseStatus.latencyMs}ms` : 'healthy'})` : supabaseStatus.state === 'checking' ? 'Checking connection...' : `Disconnected: ${supabaseStatus.error || 'Check credentials'}`}`}
                onClick={() => checkSupabaseHealth(true)}
              >
                <span className="admin-status-dot" />
                <span className="admin-status-label">
                  {supabaseStatus.state === 'connected'
                    ? `Supabase Connected${supabaseStatus.latencyMs ? ` (${supabaseStatus.latencyMs}ms)` : ''}`
                    : supabaseStatus.state === 'checking'
                    ? 'Checking Supabase...'
                    : 'Supabase Disconnected'}
                </span>
              </div>
            </div>

            {loginError && (
              <div className="admin-error-banner">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="admin-field-group">
                <label className="admin-field-label">Username</label>
                <input
                  type="text"
                  className="admin-input"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Username"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label">Password</label>
                <input
                  type="password"
                  className="admin-input"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="admin-btn admin-btn-accent admin-login-submit-btn"
                disabled={loginLoading}
              >
                {loginLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <a href="#/" className="admin-login-return-link">
              Return to Portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  const newUnansweredCount = unanswered.filter((u) => u.status === 'new').length;

  return (
    <div className="admin-viewport">
      {/* Top Navbar */}
      <header className="admin-navbar">
        <div className="admin-brand">
          <div className="admin-brand-title">Admin Dashboard</div>
          <div
            className={`admin-supabase-status-badge is-${supabaseStatus.state}`}
            title={`Supabase: ${supabaseStatus.state === 'connected' ? `Connected (${supabaseStatus.latencyMs ? `${supabaseStatus.latencyMs}ms` : 'healthy'})` : supabaseStatus.state === 'checking' ? 'Checking connection...' : `Disconnected: ${supabaseStatus.error || 'Check credentials'}`}`}
            onClick={() => checkSupabaseHealth(true)}
          >
            <span className="admin-status-dot" />
            <span className="admin-status-label">
              {supabaseStatus.state === 'connected'
                ? `Supabase Connected${supabaseStatus.latencyMs ? ` (${supabaseStatus.latencyMs}ms)` : ''}`
                : supabaseStatus.state === 'checking'
                ? 'Checking Supabase...'
                : 'Supabase Disconnected'}
            </span>
            {supabaseStatus.state === 'disconnected' && (
              <button
                type="button"
                className="admin-status-retry-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  checkSupabaseHealth(true);
                }}
              >
                Retry
              </button>
            )}
          </div>
        </div>

        <div className="admin-nav-actions">
          <span className="admin-user-pill">
            USER: <strong>{adminUser.username}</strong>
          </span>
          <button
            type="button"
            className="admin-btn-export-top"
            onClick={handleExportZip}
            disabled={isExportingZip}
            title="Download full portfolio backup as ZIP"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{isExportingZip ? 'Exporting...' : 'Export ZIP'}</span>
          </button>
          <a href="#/" className="admin-back-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>Live Site</span>
          </a>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Real Backend Operation Active Floating Banner */}
      {backendOp.active && (
        <div className="admin-backend-op-banner" role="status" aria-live="polite">
          <div className="admin-op-spinner" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="admin-spin-svg">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
          </div>
          <div className="admin-op-details">
            <span className="admin-op-title">Backend Operation In Progress</span>
            <span className="admin-op-msg">{backendOp.message}</span>
          </div>
        </div>
      )}

      {/* Backend Operation Toast Notification */}
      {opToast && (
        <div className={`admin-op-toast is-${opToast.type}`} role="alert">
          <div className="admin-toast-icon">
            {opToast.type === 'success' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </div>
          <div className="admin-toast-text">{opToast.message}</div>
          <button
            type="button"
            className="admin-toast-close"
            onClick={() => setOpToast(null)}
            aria-label="Dismiss notification"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="admin-layout">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'visitor-analytics' ? 'is-active' : ''}`}
            onClick={() => {
              setActiveTab('visitor-analytics');
              loadVisitorAnalytics(analyticsRange);
            }}
          >
            <div className="admin-tab-btn-content">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>Visitor Analytics</span>
            </div>
            {visitorAnalytics?.uniqueVisitors > 0 && (
              <span className="admin-tab-count admin-tab-count-active">{visitorAnalytics.uniqueVisitors}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'portfolio' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            <div className="admin-tab-btn-content">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              <span>Portfolio Content</span>
            </div>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <div className="admin-tab-btn-content">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Assistant Metrics</span>
            </div>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'unanswered' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('unanswered')}
          >
            <div className="admin-tab-btn-content">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Unanswered</span>
            </div>
            {newUnansweredCount > 0 && <span className="admin-tab-count">{newUnansweredCount}</span>}
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'knowledge' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('knowledge')}
          >
            <div className="admin-tab-btn-content">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Knowledge Base</span>
            </div>
            <span style={{ fontSize: '11px', color: '#6b7280', fontFamily: "'Disket Mono', monospace" }}>{knowledge.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'templates' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <div className="admin-tab-btn-content">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              <span>Templates</span>
            </div>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'sandbox' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('sandbox')}
          >
            <div className="admin-tab-btn-content">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Sandbox</span>
            </div>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'conversations' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('conversations')}
          >
            <div className="admin-tab-btn-content">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Conversations</span>
            </div>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'settings' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <div className="admin-tab-btn-content">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Settings</span>
            </div>
          </button>

          <div className={`admin-sidebar-db-status is-${supabaseStatus.state}`}>
            <div className="admin-sidebar-db-header">
              <span className="admin-sidebar-db-dot" />
              <span className="admin-sidebar-db-title">Database Sync</span>
            </div>
            <div className="admin-sidebar-db-body">
              <div className="admin-sidebar-db-item">
                <span>Supabase</span>
                <span className="admin-sidebar-db-val">
                  {supabaseStatus.state === 'connected' ? 'Connected' : supabaseStatus.state === 'checking' ? 'Checking' : 'Offline'}
                </span>
              </div>
              {supabaseStatus.latencyMs && (
                <div className="admin-sidebar-db-item">
                  <span>Latency</span>
                  <span className="admin-sidebar-db-val">{supabaseStatus.latencyMs}ms</span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="admin-content">
          {/* VISITOR ANALYTICS */}
          {activeTab === 'visitor-analytics' && (
            <div className="admin-analytics-view">
              <div className="admin-analytics-header">
                <div>
                  <h1 className="admin-page-title">Visitor Analytics</h1>
                  <p className="admin-page-desc">
                    Live visitor traffic, geographic locations, devices, and session paths.
                  </p>
                </div>

                <div className="admin-analytics-controls">
                  <div className="admin-range-selector" role="group" aria-label="Time range">
                    {[
                      { label: '24h', value: '24h' },
                      { label: '7d', value: '7d' },
                      { label: '30d', value: '30d' },
                      { label: '90d', value: '90d' },
                      { label: 'All', value: 'all' },
                    ].map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        className={`admin-range-btn ${analyticsRange === r.value ? 'is-active' : ''}`}
                        onClick={() => handleRangeChange(r.value)}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-refresh-btn"
                    onClick={() => loadVisitorAnalytics(analyticsRange)}
                    disabled={visitorLoading}
                    title="Refresh visitor analytics"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={visitorLoading ? 'admin-spin' : ''}
                      aria-hidden="true"
                    >
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    <span>{visitorLoading ? 'Refreshing...' : 'Refresh'}</span>
                  </button>
                </div>
              </div>

              {/* Supabase Observability & Keep-Alive Banner */}
              <div className="admin-supabase-banner" style={{
                background: 'rgba(97, 220, 163, 0.05)',
                border: '1px solid rgba(97, 220, 163, 0.2)',
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: isSupabaseConfigured() ? '#34d399' : '#f59e0b',
                    boxShadow: isSupabaseConfigured() ? '0 0 10px #34d399' : '0 0 10px #f59e0b'
                  }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                      {isSupabaseConfigured() ? 'Supabase PostgreSQL & Realtime Connected' : 'Local SQLite Fallback Active'}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#9ca3af' }}>
                      {isSupabaseConfigured()
                        ? 'Realtime subscriptions active. Analytics and portfolio edits stream live to visitors.'
                        : 'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to switch to Supabase.'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                  >
                    <span>Supabase Dashboard</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/health/supabase');
                        const data = await res.json();
                        alert(`Keep-alive Ping Status: ${data.status} | Latency: ${data.latencyMs}ms | Engine: ${data.engine}`);
                      } catch (err) {
                        alert('Keep-alive ping failed: ' + err.message);
                      }
                    }}
                  >
                    Ping Database
                  </button>
                </div>
              </div>

              {/* Metric Summary Cards */}
              <div className="admin-metrics-grid">
                <div className="admin-metric-card">
                  <div className="admin-metric-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div className="admin-metric-val">{visitorAnalytics?.totalViews ?? 0}</div>
                  <div className="admin-metric-label">Total Pageviews</div>
                  <div className="admin-metric-sub">Across all routes and tabs</div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="admin-metric-val">{visitorAnalytics?.uniqueVisitors ?? 0}</div>
                  <div className="admin-metric-label">Unique Visitors</div>
                  <div className="admin-metric-sub">Distinct anonymous devices</div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div className="admin-metric-val">{visitorAnalytics?.totalSessions ?? 0}</div>
                  <div className="admin-metric-label">Active Sessions</div>
                  <div className="admin-metric-sub">Browsing sessions initiated</div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="admin-metric-val" style={{ fontSize: '18px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {visitorAnalytics?.topLocations?.[0]
                      ? `${visitorAnalytics.topLocations[0].city || 'Unknown'}, ${visitorAnalytics.topLocations[0].country || ''}`
                      : 'No data yet'}
                  </div>
                  <div className="admin-metric-label">Top Location</div>
                  <div className="admin-metric-sub">
                    {visitorAnalytics?.topLocations?.[0]
                      ? `${visitorAnalytics.topLocations[0].visits} visits recorded`
                      : 'Awaiting visitor requests'}
                  </div>
                </div>
              </div>

              {/* Locations & Pages Row */}
              <div className="admin-analytics-row">
                <div className="admin-card admin-analytics-card">
                  <div className="admin-card-header">
                    <div>
                      <h2 className="admin-card-title">Visitor Locations</h2>
                      <p className="admin-card-subtitle">Geographic distribution of your audience</p>
                    </div>
                  </div>

                  {(!visitorAnalytics?.topLocations || visitorAnalytics.topLocations.length === 0) ? (
                    <div className="admin-empty-state">
                      <p>No geographic visitor data recorded for this time range.</p>
                    </div>
                  ) : (
                    <div className="admin-locations-list">
                      {visitorAnalytics.topLocations.map((loc, idx) => {
                        const maxVisits = visitorAnalytics.topLocations[0]?.visits || 1;
                        const pct = Math.max(8, Math.round((loc.visits / maxVisits) * 100));
                        const locationLabel = loc.city && loc.country
                          ? `${loc.city}, ${loc.country}`
                          : (loc.city || loc.country || 'Unknown location');
                        return (
                          <div key={`${loc.country}-${loc.city}-${idx}`} className="admin-location-row">
                            <div className="admin-location-info">
                              <span className="admin-location-rank">#{idx + 1}</span>
                              <span className="admin-location-name">{locationLabel}</span>
                            </div>
                            <div className="admin-location-stats">
                              <div className="admin-location-bar-track">
                                <div className="admin-location-bar-fill" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="admin-location-badge">{loc.visits} visits</span>
                              <span className="admin-location-visitors">{loc.visitors} unique</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="admin-card admin-analytics-card">
                  <div className="admin-card-header">
                    <div>
                      <h2 className="admin-card-title">Most Visited Pages</h2>
                      <p className="admin-card-subtitle">Popular portfolio routes and views</p>
                    </div>
                  </div>

                  {(!visitorAnalytics?.topPages || visitorAnalytics.topPages.length === 0) ? (
                    <div className="admin-empty-state">
                      <p>No pageview records found for this period.</p>
                    </div>
                  ) : (
                    <div className="admin-pages-list">
                      {visitorAnalytics.topPages.map((p) => {
                        const maxViews = visitorAnalytics.topPages[0]?.views || 1;
                        const pct = Math.max(8, Math.round((p.views / maxViews) * 100));
                        return (
                          <div key={p.path} className="admin-page-row">
                            <div className="admin-page-info">
                              <span className="admin-page-path">{p.path === '/' ? 'Home (/)' : p.path}</span>
                            </div>
                            <div className="admin-page-stats">
                              <div className="admin-location-bar-track">
                                <div className="admin-location-bar-fill admin-bar-page" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="admin-location-badge">{p.views} views</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Devices, Browsers, OS Triplet */}
              <div className="admin-analytics-triplet">
                <div className="admin-card admin-analytics-subcard">
                  <h3 className="admin-subcard-title">Devices</h3>
                  {(!visitorAnalytics?.devices || visitorAnalytics.devices.length === 0) ? (
                    <div className="admin-empty-mini">No device data</div>
                  ) : (
                    <div className="admin-pill-breakdown">
                      {visitorAnalytics.devices.map((d) => (
                        <div key={d.name} className="admin-breakdown-row">
                          <span className="admin-breakdown-label">{d.name}</span>
                          <span className="admin-breakdown-count">{d.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-card admin-analytics-subcard">
                  <h3 className="admin-subcard-title">Browsers</h3>
                  {(!visitorAnalytics?.browsers || visitorAnalytics.browsers.length === 0) ? (
                    <div className="admin-empty-mini">No browser data</div>
                  ) : (
                    <div className="admin-pill-breakdown">
                      {visitorAnalytics.browsers.map((b) => (
                        <div key={b.name} className="admin-breakdown-row">
                          <span className="admin-breakdown-label">{b.name}</span>
                          <span className="admin-breakdown-count">{b.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-card admin-analytics-subcard">
                  <h3 className="admin-subcard-title">Operating Systems</h3>
                  {(!visitorAnalytics?.osList || visitorAnalytics.osList.length === 0) ? (
                    <div className="admin-empty-mini">No OS data</div>
                  ) : (
                    <div className="admin-pill-breakdown">
                      {visitorAnalytics.osList.map((o) => (
                        <div key={o.name} className="admin-breakdown-row">
                          <span className="admin-breakdown-label">{o.name}</span>
                          <span className="admin-breakdown-count">{o.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Visitor Sessions */}
              <div className="admin-card admin-analytics-card">
                <div className="admin-card-header">
                  <div>
                    <h2 className="admin-card-title">Recent Visitor Sessions</h2>
                    <p className="admin-card-subtitle">Who visited your website and their browsing journeys</p>
                  </div>
                </div>

                {(!visitorAnalytics?.recentVisitors || visitorAnalytics.recentVisitors.length === 0) ? (
                  <div className="admin-empty-state">
                    <p>No recent visitor sessions recorded yet.</p>
                  </div>
                ) : (
                  <div className="admin-recent-visitors-list">
                    {visitorAnalytics.recentVisitors
                      .filter((v) => !((v.city || '') + ' ' + (v.country || '')).toLowerCase().includes('local'))
                      .map((v, idx) => {
                      const locText = v.city && v.country ? `${v.city}, ${v.country}` : (v.city || v.country || 'Location Unknown');
                      const timeAgo = formatRelativeTime(v.last_active);
                      return (
                        <div key={v.session_id || idx} className="admin-visitor-session-card">
                          <div className="admin-visitor-header">
                            <div className="admin-visitor-identity">
                              <span className="admin-visitor-pin-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {locText}
                              </span>
                              <span className="admin-visitor-time">{timeAgo}</span>
                            </div>
                            <div className="admin-visitor-meta-pills">
                              <span className="admin-pill-subtle">{v.device_type}</span>
                              <span className="admin-pill-subtle">{v.browser} · {v.os}</span>
                              {v.referrer && v.referrer !== 'direct' && (
                                <span className="admin-pill-subtle admin-pill-ref">via {v.referrer}</span>
                              )}
                            </div>
                          </div>

                          <div className="admin-visitor-path-box">
                            <div className="admin-visitor-path-title">
                              <span>Navigation Path ({v.pages_viewed} {v.pages_viewed === 1 ? 'page' : 'pages'})</span>
                            </div>
                            <div className="admin-visitor-path-flow">
                              {v.path_history ? (
                                v.path_history.split(' -> ').map((step, sIdx, arr) => (
                                  <span key={sIdx} className="admin-path-step">
                                    <span className="admin-path-tag">{step === '/' ? 'Home (/)' : step}</span>
                                    {sIdx < arr.length - 1 && <span className="admin-path-arrow">→</span>}
                                  </span>
                                ))
                              ) : (
                                <span className="admin-path-step">
                                  <span className="admin-path-tag">Home (/)</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 1. OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0' }}>Assistant Overview</h1>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                  Real-time operational metrics generated entirely from persistent local database records.
                </p>
              </div>

              {analytics && (
                <div className="admin-metrics-grid">
                  <div className="admin-metric-card">
                    <div className="admin-metric-label">Total Conversations</div>
                    <div className="admin-metric-val">{analytics.totalConversations}</div>
                    <div className="admin-metric-sub">Unique visitor sessions</div>
                  </div>

                  <div className="admin-metric-card">
                    <div className="admin-metric-label">Visitor Questions</div>
                    <div className="admin-metric-val">{analytics.totalMessages}</div>
                    <div className="admin-metric-sub">Queries asked by users</div>
                  </div>

                  <div className="admin-metric-card">
                    <div className="admin-metric-label">Answered Rate</div>
                    <div className="admin-metric-val" style={{ color: '#10b981' }}>
                      {analytics.totalMessages > 0
                        ? `${(((analytics.totalMessages - analytics.fallbackMessages) / analytics.totalMessages) * 100).toFixed(1)}%`
                        : '100%'}
                    </div>
                    <div className="admin-metric-sub">{analytics.answeredMessages} confident answers</div>
                  </div>

                  <div className="admin-metric-card">
                    <div className="admin-metric-label">Unanswered Queue</div>
                    <div className="admin-metric-val" style={{ color: analytics.newUnanswered > 0 ? '#f87171' : '#ffffff' }}>
                      {analytics.newUnanswered}
                    </div>
                    <div className="admin-metric-sub">Pending admin review</div>
                  </div>

                  <div className="admin-metric-card">
                    <div className="admin-metric-label">Active Knowledge Entries</div>
                    <div className="admin-metric-val">{analytics.totalKnowledge}</div>
                    <div className="admin-metric-sub">Deterministic portfolio facts</div>
                  </div>

                  <div className="admin-metric-card">
                    <div className="admin-metric-label">Visitor Feedback</div>
                    <div className="admin-metric-val" style={{ display: 'flex', gap: '16px', fontSize: '22px' }}>
                      <span style={{ color: '#10b981' }}>+{analytics.feedback.positive}</span>
                      <span style={{ color: '#f87171' }}>-{analytics.feedback.negative}</span>
                    </div>
                    <div className="admin-metric-sub">Helpfulness ratings</div>
                  </div>
                </div>
              )}

              {/* Frequently Asked Questions */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <div className="admin-card-title">Top Asked Questions</div>
                    <div className="admin-card-desc">Most frequent queries entered by visitors</div>
                  </div>
                </div>

                {analytics?.topQuestions?.length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Visitor Query</th>
                        <th>Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topQuestions.map((q, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: '600' }}>"{q.text}"</td>
                          <td style={{ fontFamily: "'Disket Mono', monospace", color: '#10b981' }}>{q.frequency}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ color: '#6b7280', fontSize: '13.5px', padding: '12px 0' }}>
                    No visitor queries logged yet. Test the assistant in the sandbox or on the live site!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PORTFOLIO CONTENT REAL-TIME MANAGEMENT */}
          {activeTab === 'portfolio' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0' }}>Portfolio Content Management</h1>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                  Update live bio narratives, work experience, college details, logos, and skills in real time. Changes persist permanently in SQLite across page refreshes.
                </p>
              </div>

              {/* ZIP Export Banner */}
              <div className="admin-export-zip-banner">
                <div className="admin-export-zip-left">
                  <div className="admin-export-zip-badge">STRUCTURED BACKUP</div>
                  <h3 className="admin-export-zip-title">Export All Portfolio Data & Uploaded Logos (.ZIP)</h3>
                  <p className="admin-export-zip-desc">
                    Generates an organized ZIP archive with modular JSON files and extracts all uploaded custom logos into an assets/logos/ folder for backup or manual editing.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn-export-zip"
                  onClick={handleExportZip}
                  disabled={isExportingZip}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>{isExportingZip ? 'Compiling ZIP...' : 'Export Portfolio ZIP'}</span>
                </button>
              </div>

              {contentSaveMsg && (
                <div className="portfolio-status-save-banner">
                  {contentSaveMsg}
                </div>
              )}

              {/* Subtabs bar */}
              <div className="portfolio-subtabs-bar">
                <button
                  type="button"
                  className={`portfolio-subtab-btn ${contentSubtab === 'experiences' ? 'is-active' : ''}`}
                  onClick={() => setContentSubtab('experiences')}
                >
                  Work Experience ({portfolioContent.experiences?.length || 0})
                </button>
                <button
                  type="button"
                  className={`portfolio-subtab-btn ${contentSubtab === 'projects' ? 'is-active' : ''}`}
                  onClick={() => setContentSubtab('projects')}
                >
                  Projects & Work ({portfolioContent.projects?.length || 0})
                </button>
                <button
                  type="button"
                  className={`portfolio-subtab-btn ${contentSubtab === 'education' ? 'is-active' : ''}`}
                  onClick={() => setContentSubtab('education')}
                >
                  Education & Colleges ({portfolioContent.education?.length || 0})
                </button>
                <button
                  type="button"
                  className={`portfolio-subtab-btn ${contentSubtab === 'certifications' ? 'is-active' : ''}`}
                  onClick={() => setContentSubtab('certifications')}
                >
                  Certifications & Honors ({
                    (Array.isArray(portfolioContent.certifications) && portfolioContent.certifications.length > 0 ? portfolioContent.certifications.length : CERTIFICATIONS.length) +
                    (Array.isArray(portfolioContent.achievements) && portfolioContent.achievements.length > 0 ? portfolioContent.achievements.length : ACHIEVEMENTS.length)
                  })
                </button>
                <button
                  type="button"
                  className={`portfolio-subtab-btn ${contentSubtab === 'skills' ? 'is-active' : ''}`}
                  onClick={() => setContentSubtab('skills')}
                >
                  Skills & Categories ({editingSkillsList?.length || 0})
                </button>
                <button
                  type="button"
                  className={`portfolio-subtab-btn ${contentSubtab === 'about' ? 'is-active' : ''}`}
                  onClick={() => setContentSubtab('about')}
                >
                  About Narrative ({editingAboutList?.length || 0})
                </button>
                <button
                  type="button"
                  className={`portfolio-subtab-btn ${contentSubtab === 'social_links' ? 'is-active' : ''}`}
                  onClick={() => setContentSubtab('social_links')}
                >
                  Social Links ({portfolioContent.social_links?.length || 0})
                </button>
                <button
                  type="button"
                  className={`portfolio-subtab-btn ${contentSubtab === 'meta' ? 'is-active' : ''}`}
                  onClick={() => setContentSubtab('meta')}
                >
                  Profile & Meta
                </button>
              </div>

              {/* SUBTAB 1: EXPERIENCES */}
              {contentSubtab === 'experiences' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                      Positions, companies, dates, skill tags, and company logos.
                    </div>
                    <button type="button" className="admin-btn admin-btn-accent" onClick={handleOpenAddExp}>
                      + Add New Experience
                    </button>
                  </div>

                  <div className="portfolio-items-list">
                    {(!portfolioContent.experiences || portfolioContent.experiences.length === 0) ? (
                      <div className="admin-card" style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                        No work experience entries configured yet.
                      </div>
                    ) : (
                      portfolioContent.experiences.map((exp, idx) => (
                        <div key={exp.id || idx} className="portfolio-item-card">
                          <div className="portfolio-item-header">
                            <div className="portfolio-item-title-col">
                              <div className="portfolio-logo-thumb">
                                {typeof exp.logo === 'string' && (exp.logo.startsWith('http') || exp.logo.startsWith('/') || exp.logo.startsWith('data:')) ? (
                                  <img src={exp.logo} alt={exp.company} />
                                ) : (
                                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect width="20" height="14" x="2" y="7" rx="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                                  {exp.company}
                                  {exp.isCurrent && (
                                    <span style={{ marginLeft: '8px', fontSize: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontFamily: "'Disket Mono', monospace" }}>
                                      NOW
                                    </span>
                                  )}
                                  {isDemoItem(exp) && (
                                    <span className="admin-demo-badge">Demo Sample</span>
                                  )}
                                </div>
                                <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                                  {exp.role} &bull; <span style={{ fontFamily: "'Disket Mono', monospace", fontSize: '11px' }}>{exp.period}</span> &bull; {exp.location}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => handleMoveExp(idx, 'up')}
                                disabled={idx === 0}
                                title="Move Up"
                                aria-label="Move experience up"
                              >
                                &uarr;
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => handleMoveExp(idx, 'down')}
                                disabled={idx === (portfolioContent.experiences.length - 1)}
                                title="Move Down"
                                aria-label="Move experience down"
                              >
                                &darr;
                              </button>
                              <button type="button" className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleOpenEditExp(exp, idx)}>
                                Edit
                              </button>
                              <button type="button" className="admin-btn admin-btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleDeleteExp(idx)}>
                                Delete
                              </button>
                            </div>
                          </div>

                          <p style={{ margin: '6px 0 0 0', fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.5' }}>
                            {exp.desc}
                          </p>

                          {Array.isArray(exp.skills) && exp.skills.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                              {exp.skills.map((s) => (
                                <span key={s} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.8)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: "'Disket Mono', monospace" }}>
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SUBTAB: PROJECTS */}
              {contentSubtab === 'projects' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                      Add, edit, reorder, or feature projects shown in your portfolio showcase and cascading deck.
                    </div>
                    <button type="button" className="admin-btn admin-btn-accent" onClick={handleOpenAddProject}>
                      + Add New Project
                    </button>
                  </div>

                  <div className="portfolio-items-list">
                    {(!portfolioContent.projects || portfolioContent.projects.length === 0) ? (
                      <div className="admin-card" style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                        No projects added yet. Click &quot;+ Add New Project&quot; to showcase your work.
                      </div>
                    ) : (
                      portfolioContent.projects.map((proj, idx) => {
                        const projTech = Array.isArray(proj.tech) ? proj.tech : (Array.isArray(proj.technologies) ? proj.technologies : []);
                        const projImg = proj.image || proj.videoThumb || '';
                        return (
                          <div key={proj.id || idx} className="portfolio-item-card">
                            <div className="portfolio-item-header">
                              <div className="portfolio-item-title-col">
                                <div className="portfolio-logo-thumb" style={{ width: '52px', height: '52px', borderRadius: '8px', overflow: 'hidden' }}>
                                  {projImg ? (
                                    <img src={projImg} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect width="18" height="18" x="3" y="3" rx="2" />
                                      <path d="m3 9 2.45-3" />
                                      <path d="M11 3v6" />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{proj.title}</span>
                                    {proj.isFeatured && (
                                      <span style={{ fontSize: '10px', background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6', padding: '2px 6px', borderRadius: '4px', fontFamily: "'Disket Mono', monospace" }}>
                                        FEATURED
                                      </span>
                                    )}
                                    {(proj.videoUrl || proj.video || proj.video_url || proj.metrics?.videoUrl) && (
                                      <span style={{ fontSize: '10px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '2px 6px', borderRadius: '4px', fontFamily: "'Disket Mono', monospace" }}>
                                        VIDEO DEMO
                                      </span>
                                    )}
                                    {isDemoItem(proj) && (
                                      <span className="admin-demo-badge">Demo Sample</span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                                    {proj.category || 'Project'} &bull; <span style={{ fontFamily: "'Disket Mono', monospace", fontSize: '11px' }}>{proj.year || '2026'}</span>
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '4px 8px', fontSize: '11px' }}
                                  onClick={() => handleMoveProject(idx, 'up')}
                                  disabled={idx === 0}
                                  title="Move Up"
                                  aria-label="Move project up"
                                >
                                  &uarr;
                                </button>
                                <button
                                  type="button"
                                  className="admin-btn admin-btn-secondary"
                                  style={{ padding: '4px 8px', fontSize: '11px' }}
                                  onClick={() => handleMoveProject(idx, 'down')}
                                  disabled={idx === (portfolioContent.projects.length - 1)}
                                  title="Move Down"
                                  aria-label="Move project down"
                                >
                                  &darr;
                                </button>
                                <button type="button" className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleOpenEditProject(proj, idx)}>
                                  Edit
                                </button>
                                <button type="button" className="admin-btn admin-btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleDeleteProject(idx)}>
                                  Delete
                                </button>
                              </div>
                            </div>

                            <p style={{ margin: '8px 0 0 0', fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.5' }}>
                              {proj.details || proj.description}
                            </p>

                            {projTech.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                {projTech.map((t) => (
                                  <span key={t} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.8)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: "'Disket Mono', monospace" }}>
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* SUBTAB 2: EDUCATION */}
              {contentSubtab === 'education' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                      University degrees, institutions, coursework, and college logos.
                    </div>
                    <button type="button" className="admin-btn admin-btn-accent" onClick={handleOpenAddEdu}>
                      + Add Education Milestone
                    </button>
                  </div>

                  <div className="portfolio-items-list">
                    {(!portfolioContent.education || portfolioContent.education.length === 0) ? (
                      <div className="admin-card" style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                        No education items configured yet.
                      </div>
                    ) : (
                      portfolioContent.education.map((edu, idx) => (
                        <div key={edu.id || idx} className="portfolio-item-card">
                          <div className="portfolio-item-header">
                            <div className="portfolio-item-title-col">
                              <div className="portfolio-logo-thumb">
                                {typeof edu.logo === 'string' && (edu.logo.startsWith('http') || edu.logo.startsWith('/') || edu.logo.startsWith('data:')) ? (
                                  <img src={edu.logo} alt={edu.institution} />
                                ) : (
                                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#38bdf8" strokeWidth="2">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                                  {edu.degree}
                                  {edu.isCurrent && (
                                    <span style={{ marginLeft: '8px', fontSize: '10px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontFamily: "'Disket Mono', monospace" }}>
                                      NOW
                                    </span>
                                  )}
                                  {isDemoItem(edu) && (
                                    <span className="admin-demo-badge">Demo Sample</span>
                                  )}
                                </div>
                                <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                                  {edu.institution} &bull; <span style={{ fontFamily: "'Disket Mono', monospace", fontSize: '11px' }}>{edu.period}</span>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => handleMoveEdu(idx, 'up')}
                                disabled={idx === 0}
                                title="Move Up"
                                aria-label="Move education up"
                              >
                                &uarr;
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => handleMoveEdu(idx, 'down')}
                                disabled={idx === (portfolioContent.education.length - 1)}
                                title="Move Down"
                                aria-label="Move education down"
                              >
                                &darr;
                              </button>
                              <button type="button" className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleOpenEditEdu(edu, idx)}>
                                Edit
                              </button>
                              <button type="button" className="admin-btn admin-btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleDeleteEdu(idx)}>
                                Delete
                              </button>
                            </div>
                          </div>

                          <p style={{ margin: '6px 0 0 0', fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.5' }}>
                            {edu.desc}
                          </p>

                          {Array.isArray(edu.courses) && edu.courses.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                              {edu.courses.map((c) => (
                                <span key={c} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.8)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: "'Disket Mono', monospace" }}>
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SUBTAB: CERTIFICATIONS & ACHIEVEMENTS */}
              {contentSubtab === 'certifications' && (() => {
                const certList = Array.isArray(portfolioContent.certifications) && portfolioContent.certifications.length > 0
                  ? portfolioContent.certifications
                  : CERTIFICATIONS;
                const achieveList = Array.isArray(portfolioContent.achievements) && portfolioContent.achievements.length > 0
                  ? portfolioContent.achievements
                  : ACHIEVEMENTS;

                return (
                  <div>
                    <div className="portfolio-section-action-header">
                      <div>
                        <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                          Verified credentials, certifications, hackathon wins, and honors.
                        </div>
                        {/* Filter pills */}
                        <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                          <button
                            type="button"
                            className={`admin-subfilter-pill ${certFilterTab === 'all' ? 'is-active' : ''}`}
                            onClick={() => setCertFilterTab('all')}
                          >
                            All ({certList.length + achieveList.length})
                          </button>
                          <button
                            type="button"
                            className={`admin-subfilter-pill ${certFilterTab === 'certifications' ? 'is-active' : ''}`}
                            onClick={() => setCertFilterTab('certifications')}
                          >
                            Certifications ({certList.length})
                          </button>
                          <button
                            type="button"
                            className={`admin-subfilter-pill ${certFilterTab === 'achievements' ? 'is-active' : ''}`}
                            onClick={() => setCertFilterTab('achievements')}
                          >
                            Achievements ({achieveList.length})
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn-accent"
                          onClick={() => handleOpenAddCert('certification')}
                        >
                          + Add Certification
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary"
                          onClick={() => handleOpenAddCert('achievement')}
                        >
                          + Add Achievement
                        </button>
                      </div>
                    </div>

                    <div className="portfolio-items-list" style={{ marginTop: '16px' }}>
                      {/* Certifications List */}
                      {(certFilterTab === 'all' || certFilterTab === 'certifications') && (
                        <div>
                          <div style={{ fontSize: '12px', fontFamily: "'Disket Mono', monospace", color: '#4ade80', letterSpacing: '0.08em', marginBottom: '8px', textTransform: 'uppercase' }}>
                            Certifications ({certList.length})
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                            {certList.map((c, idx) => {
                              const logoSrc = c.image || c.logo;
                              return (
                                <div key={c.id || idx} className="portfolio-item-card">
                                  <div className="portfolio-item-header">
                                    <div className="portfolio-item-title-col">
                                      <div className="portfolio-logo-thumb">
                                        {typeof logoSrc === 'string' && logoSrc ? (
                                          <img src={logoSrc} alt={c.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                        ) : (
                                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#22c55e" strokeWidth="2">
                                            <circle cx="12" cy="8" r="7" />
                                            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                                          </svg>
                                        )}
                                      </div>
                                      <div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                          <span>{c.title}</span>
                                          {(c.certificateImage || c.certificate_image_url) && (
                                            <span style={{ fontSize: '10px', background: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', padding: '2px 6px', borderRadius: '4px', fontFamily: "'Disket Mono', monospace" }}>
                                              LINKEDIN PREVIEW
                                            </span>
                                          )}
                                          {isDemoItem(c) && (
                                            <span className="admin-demo-badge">Demo Sample</span>
                                          )}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                                          {c.issuer} &bull; <span style={{ fontFamily: "'Disket Mono', monospace", fontSize: '11px' }}>{c.issueDate || c.year}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                      <button
                                        type="button"
                                        className="admin-btn admin-btn-secondary"
                                        style={{ padding: '4px 8px', fontSize: '11px' }}
                                        onClick={() => handleMoveCert(idx, 'up', 'certification')}
                                        disabled={idx === 0}
                                        title="Move Up"
                                        aria-label="Move certification up"
                                      >
                                        &uarr;
                                      </button>
                                      <button
                                        type="button"
                                        className="admin-btn admin-btn-secondary"
                                        style={{ padding: '4px 8px', fontSize: '11px' }}
                                        onClick={() => handleMoveCert(idx, 'down', 'certification')}
                                        disabled={idx === (certList.length - 1)}
                                        title="Move Down"
                                        aria-label="Move certification down"
                                      >
                                        &darr;
                                      </button>
                                      {c.link && (
                                        <a
                                          href={c.link}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="admin-btn admin-btn-secondary"
                                          style={{ padding: '6px 10px', fontSize: '11px' }}
                                        >
                                          View Link ↗
                                        </a>
                                      )}
                                      <button
                                        type="button"
                                        className="admin-btn admin-btn-secondary"
                                        style={{ padding: '6px 12px', fontSize: '12px' }}
                                        onClick={() => handleOpenEditCert(c, idx, 'certification')}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        className="admin-btn admin-btn-danger"
                                        style={{ padding: '6px 12px', fontSize: '12px' }}
                                        onClick={() => handleDeleteCert(idx, 'certification')}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>

                                  {c.description && (
                                    <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.5' }}>
                                      {c.description}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Achievements List */}
                      {(certFilterTab === 'all' || certFilterTab === 'achievements') && (
                        <div>
                          <div style={{ fontSize: '12px', fontFamily: "'Disket Mono', monospace", color: '#fbbf24', letterSpacing: '0.08em', marginBottom: '8px', textTransform: 'uppercase' }}>
                            Achievements & Honors ({achieveList.length})
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {achieveList.map((a, idx) => {
                              const logoSrc = a.image || a.logo;
                              return (
                                <div key={a.id || idx} className="portfolio-item-card">
                                  <div className="portfolio-item-header">
                                    <div className="portfolio-item-title-col">
                                      <div className="portfolio-logo-thumb">
                                        {typeof logoSrc === 'string' && logoSrc ? (
                                          <img src={logoSrc} alt={a.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                        ) : (
                                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f59e0b" strokeWidth="2">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                          </svg>
                                        )}
                                      </div>
                                      <div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                          <span>{a.title}</span>
                                          {((Array.isArray(a.photos) && a.photos.length > 0) || a.photo || a.certificateImage) && (
                                            <span style={{ fontSize: '10px', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', padding: '2px 6px', borderRadius: '4px', fontFamily: "'Disket Mono', monospace" }}>
                                              PHOTOS
                                            </span>
                                          )}
                                          {isDemoItem(a) && (
                                            <span className="admin-demo-badge">Demo Sample</span>
                                          )}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                                          {a.issuer} &bull; <span style={{ fontFamily: "'Disket Mono', monospace", fontSize: '11px' }}>{a.year}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                      <button
                                        type="button"
                                        className="admin-btn admin-btn-secondary"
                                        style={{ padding: '4px 8px', fontSize: '11px' }}
                                        onClick={() => handleMoveCert(idx, 'up', 'achievement')}
                                        disabled={idx === 0}
                                        title="Move Up"
                                        aria-label="Move achievement up"
                                      >
                                        &uarr;
                                      </button>
                                      <button
                                        type="button"
                                        className="admin-btn admin-btn-secondary"
                                        style={{ padding: '4px 8px', fontSize: '11px' }}
                                        onClick={() => handleMoveCert(idx, 'down', 'achievement')}
                                        disabled={idx === (achieveList.length - 1)}
                                        title="Move Down"
                                        aria-label="Move achievement down"
                                      >
                                        &darr;
                                      </button>
                                      {a.link && (
                                        <a
                                          href={a.link}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="admin-btn admin-btn-secondary"
                                          style={{ padding: '6px 10px', fontSize: '11px' }}
                                        >
                                          View Link ↗
                                        </a>
                                      )}
                                      <button
                                        type="button"
                                        className="admin-btn admin-btn-secondary"
                                        style={{ padding: '6px 12px', fontSize: '12px' }}
                                        onClick={() => handleOpenEditCert(a, idx, 'achievement')}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        className="admin-btn admin-btn-danger"
                                        style={{ padding: '6px 12px', fontSize: '12px' }}
                                        onClick={() => handleDeleteCert(idx, 'achievement')}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>

                                  {a.description && (
                                    <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.5' }}>
                                      {a.description}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* SUBTAB 3: SKILLS */}
              {contentSubtab === 'skills' && (
                <form onSubmit={handleSaveAllSkills}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                      Skill categories and technical skill pills displayed across the portfolio.
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="button" className="admin-btn admin-btn-secondary" onClick={handleAddSkillCategory}>
                        + Add Skill Category
                      </button>
                      <button type="submit" className="admin-btn admin-btn-accent">
                        Save Skills to Live Site
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {editingSkillsList.map((cat, idx) => (
                      <div key={cat.id || idx} className="admin-card" style={{ padding: '18px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ fontWeight: '700', fontSize: '15px', maxWidth: '300px' }}
                            value={cat.category}
                            onChange={(e) => {
                              const updated = [...editingSkillsList];
                              updated[idx] = { ...updated[idx], category: e.target.value };
                              setEditingSkillsList(updated);
                            }}
                            placeholder="Category Name"
                            required
                          />
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger"
                            style={{ padding: '4px 10px', fontSize: '11px' }}
                            onClick={() => handleDeleteSkillCategory(idx)}
                          >
                            Remove Category
                          </button>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <label style={{ fontSize: '11.5px', fontFamily: "'Disket Mono', monospace", color: 'rgba(255, 255, 255, 0.45)' }}>
                              SKILLS (COMMA-SEPARATED)
                            </label>
                            <button
                              type="button"
                              className="admin-btn admin-btn-secondary"
                              style={{ padding: '3px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => {
                                setCustomSkillModal({
                                  isOpen: true,
                                  categoryIdx: idx,
                                  name: '',
                                  logoUrl: '',
                                  logoPreview: '',
                                  tab: 'online',
                                  filterQuery: '',
                                });
                              }}
                            >
                              + Add Skill Icon (Online Library or Upload)
                            </button>
                          </div>
                          <input
                            type="text"
                            className="admin-input"
                            value={
                              cat._rawSkills !== undefined
                                ? cat._rawSkills
                                : Array.isArray(cat.skills)
                                ? cat.skills.map((s) => (typeof s === 'string' ? s : s?.name || '')).filter(Boolean).join(', ')
                                : ''
                            }
                            onChange={(e) => {
                              const rawVal = e.target.value;
                              const tokens = rawVal.split(',').map((s) => s.trim()).filter(Boolean);
                              const existingObjects = (cat.skills || []).filter((s) => typeof s === 'object' && s?.name);
                              const updatedSkills = tokens.map((token) => {
                                const match = existingObjects.find((obj) => obj.name.toLowerCase() === token.toLowerCase());
                                return match || token;
                              });
                              const updated = [...editingSkillsList];
                              updated[idx] = { ...updated[idx], skills: updatedSkills, _rawSkills: rawVal };
                              setEditingSkillsList(updated);
                            }}
                            placeholder="React, Next.js, TypeScript, Tailwind CSS"
                          />
                        </div>

                        {/* Live icon preview with custom logo support and delete option */}
                        {Array.isArray(cat.skills) && cat.skills.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                            {cat.skills.map((s, sIdx) => {
                              const sName = typeof s === 'string' ? s : s?.name || '';
                              const customLogo = typeof s === 'object' ? (s?.logo || s?.iconUrl) : null;
                              if (!sName) return null;
                              return (
                                <span
                                  key={sName + sIdx}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    fontSize: '11.5px',
                                  }}
                                >
                                  {customLogo ? (
                                    <img
                                      src={customLogo}
                                      alt={sName}
                                      style={{ width: 14, height: 14, objectFit: 'contain', borderRadius: 2 }}
                                    />
                                  ) : (
                                    <TechIcon name={sName} size={13} />
                                  )}
                                  <span>{sName}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSkillFromCategory(idx, sIdx)}
                                    title={`Remove ${sName}`}
                                    style={{
                                      background: 'transparent',
                                      border: 'none',
                                      color: 'rgba(255, 255, 255, 0.4)',
                                      cursor: 'pointer',
                                      fontSize: '13px',
                                      lineHeight: 1,
                                      padding: '0 2px',
                                      marginLeft: '2px',
                                    }}
                                  >
                                    ×
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </form>
              )}

              {/* SUBTAB 4: ABOUT NARRATIVE */}
              {contentSubtab === 'about' && (
                <form onSubmit={handleSaveAllAbout}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                      Paragraphs displayed in the animated text-reveal narrative of the About Me section.
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="button" className="admin-btn admin-btn-secondary" onClick={handleAddAboutParagraph}>
                        + Add Paragraph
                      </button>
                      <button type="submit" className="admin-btn admin-btn-accent">
                        Save About Narrative
                      </button>
                    </div>
                  </div>

                  {/* Custom Icon Uploader Card */}
                  <div className="admin-card" style={{ padding: '18px 20px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                      Custom Icons & Badges Uploader
                    </div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 12px 0' }}>
                      Upload custom technology, brand, or internship logos to insert directly into your About narrative.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) 2fr auto', gap: '10px', alignItems: 'flex-start' }} className="admin-modal-grid">
                      <div>
                        <label className="admin-field-label">Icon Name / Tool</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={newCustomIconName}
                          onChange={(e) => setNewCustomIconName(e.target.value)}
                          placeholder="e.g. LangChain, Solana, AWS"
                        />
                      </div>
                      <div>
                        <AdminImageUploadField
                          label="Icon Image (PNG, SVG, WebP)"
                          value={newCustomIconImg}
                          onChange={setNewCustomIconImg}
                          placeholder="Upload image or paste URL..."
                          idPrefix="custom-about-icon"
                          storageFolder="skills"
                          slug={slugify(newCustomIconName || 'skill')}
                          isLogo={true}
                        />
                      </div>
                      <div style={{ alignSelf: 'center', paddingTop: '18px' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn-accent"
                          onClick={handleAddCustomIcon}
                        >
                          + Save Icon
                        </button>
                      </div>
                    </div>

                    {/* Display existing custom icons */}
                    {Array.isArray(portfolioContent.custom_icons) && portfolioContent.custom_icons.length > 0 && (
                      <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <span style={{ fontSize: '11px', fontFamily: "'Disket Mono', monospace", color: 'rgba(255, 255, 255, 0.45)', display: 'block', marginBottom: '8px' }}>
                          SAVED CUSTOM ICONS ({portfolioContent.custom_icons.length}):
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {portfolioContent.custom_icons.map((ic) => (
                            <span
                              key={ic.id || ic.name}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                              }}
                            >
                              <img src={ic.image || ic.logo} alt={ic.name} style={{ width: 16, height: 16, objectFit: 'contain', borderRadius: 2 }} />
                              <span style={{ fontWeight: '600' }}>{ic.name}</span>
                              <span style={{ fontSize: '10px', color: '#9ca3af', fontFamily: "'Disket Mono', monospace" }}>{ic.token}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomIcon(ic.id)}
                                style={{ background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.4)', cursor: 'pointer', marginLeft: 4 }}
                                title={`Delete ${ic.name}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {editingAboutList.map((para, idx) => (
                      <div key={idx} className="admin-card" style={{ padding: '18px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontFamily: "'Disket Mono', monospace", color: 'rgba(255, 255, 255, 0.45)' }}>
                            PARAGRAPH {idx + 1}
                          </span>
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger"
                            style={{ padding: '4px 10px', fontSize: '11px' }}
                            onClick={() => handleDeleteAboutParagraph(idx)}
                          >
                            Remove
                          </button>
                        </div>

                        {/* Visual SkillIcon Inserter Buttons */}
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '11px', fontFamily: "'Disket Mono', monospace", color: 'rgba(255, 255, 255, 0.45)' }}>
                              CLICK TO INSERT SKILL ICON AT CURSOR:
                            </span>
                            <a
                              href="https://skillicons.dev"
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: '10.5px', color: '#38bdf8', textDecoration: 'none' }}
                            >
                              Browse skillicons.dev ↗
                            </a>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            {QUICK_ABOUT_ICONS.map((ic) => (
                              <button
                                key={ic.token}
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                style={{
                                  padding: '3px 8px',
                                  fontSize: '11.5px',
                                  borderRadius: '5px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  background: 'rgba(255, 255, 255, 0.06)',
                                }}
                                onClick={() => insertIconIntoParagraph(idx, ic.token)}
                                title={`Insert ${ic.label} icon`}
                              >
                                <img
                                  src={`https://skillicons.dev/icons?i=${ic.id}`}
                                  alt={ic.label}
                                  width={14}
                                  height={14}
                                  style={{ borderRadius: '3px' }}
                                />
                                <span>{ic.label}</span>
                              </button>
                            ))}
                          </div>

                          {/* User custom icons palette */}
                          {Array.isArray(portfolioContent.custom_icons) && portfolioContent.custom_icons.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                              {portfolioContent.custom_icons.map((ic) => (
                                <button
                                  key={ic.id || ic.name}
                                  type="button"
                                  className="admin-btn admin-btn-secondary"
                                  style={{
                                    padding: '3px 8px',
                                    fontSize: '11.5px',
                                    borderRadius: '5px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    background: 'rgba(34, 197, 94, 0.08)',
                                    borderColor: 'rgba(34, 197, 94, 0.25)',
                                    color: '#4ade80',
                                  }}
                                  onClick={() => insertIconIntoParagraph(idx, ic.token || `{{ICON_${ic.name}}}`)}
                                  title={`Insert ${ic.name} icon`}
                                >
                                  <img
                                    src={ic.image || ic.logo}
                                    alt={ic.name}
                                    width={14}
                                    height={14}
                                    style={{ borderRadius: '3px', objectFit: 'contain' }}
                                  />
                                  <span>{ic.name}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Custom SkillIcon Inserter from skillicons.dev */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="text"
                              id={`custom-icon-input-${idx}`}
                              placeholder="Type any skillicons.dev icon ID (e.g. rust, threejs, vue, graphql)..."
                              className="admin-input"
                              style={{ padding: '4px 8px', fontSize: '11.5px', maxWidth: '360px' }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const val = e.target.value.trim().toLowerCase();
                                  if (val) {
                                    insertIconIntoParagraph(idx, `{{ICON_${val}}}`);
                                    e.target.value = '';
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="admin-btn admin-btn-primary"
                              style={{ padding: '4px 10px', fontSize: '11px', whiteSpace: 'nowrap' }}
                              onClick={() => {
                                const inputEl = document.getElementById(`custom-icon-input-${idx}`);
                                const val = inputEl?.value.trim().toLowerCase();
                                if (val) {
                                  insertIconIntoParagraph(idx, `{{ICON_${val}}}`);
                                  inputEl.value = '';
                                }
                              }}
                            >
                              + Insert Icon
                            </button>
                          </div>
                        </div>

                        <textarea
                          id={`about-para-textarea-${idx}`}
                          className="admin-textarea"
                          rows={3}
                          value={para}
                          onChange={(e) => {
                            const updated = [...editingAboutList];
                            updated[idx] = e.target.value;
                            setEditingAboutList(updated);
                          }}
                          placeholder="Write your portfolio narrative paragraph here..."
                          required
                        />

                        <div style={{ marginTop: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.85)' }}>
                          <div style={{ fontSize: '10px', fontFamily: "'Disket Mono', monospace", color: 'rgba(255, 255, 255, 0.35)', marginBottom: '6px' }}>
                            LIVE PREVIEW (WITH SKILLICONS.DEV):
                          </div>
                          {renderAboutParagraphPreview(para, portfolioContent.custom_icons)}
                        </div>
                      </div>
                    ))}
                  </div>
                </form>
              )}

              {/* SUBTAB: SOCIAL LINKS */}
              {contentSubtab === 'social_links' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '17px', fontWeight: '800', color: '#ffffff' }}>
                        Social & Platform Profiles
                      </div>
                      <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                        Dedicated CRUD management for your social handles (GitHub, LinkedIn, Threads, X, Instagram, YouTube, Discord, LeetCode, Kaggle, Website).
                      </div>
                    </div>
                    <button type="button" className="admin-btn admin-btn-accent" onClick={handleOpenAddSocial}>
                      + Add Social Link
                    </button>
                  </div>

                  <div className="portfolio-items-list">
                    {(!portfolioContent.social_links || portfolioContent.social_links.length === 0) ? (
                      <div className="admin-card" style={{ textAlign: 'center', padding: '36px', color: '#6b7280' }}>
                        No social links configured yet. Click "+ Add Social Link" to configure your verified profiles.
                      </div>
                    ) : (
                      portfolioContent.social_links.map((link, idx) => (
                        <div key={link.id || idx} className="portfolio-item-card">
                          <div className="portfolio-item-header">
                            <div className="portfolio-item-title-col">
                              <div
                                className="portfolio-logo-thumb"
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '14px',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {getSocialIconSvg(link.platform || link.icon_name, 22)}
                              </div>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                                    {link.label || link.platform}
                                  </span>
                                  <span style={{ fontSize: '11px', fontFamily: "'Disket Mono', monospace", color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '2px 7px', borderRadius: '4px' }}>
                                    {link.platform}
                                  </span>
                                  {isDemoItem(link) && (
                                    <span className="admin-demo-badge">Demo Sample</span>
                                  )}
                                  {(link.is_published === false || link.isPublished === false) && (
                                    <span style={{ fontSize: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '2px 6px', borderRadius: '4px', fontFamily: "'Disket Mono', monospace" }}>
                                      DRAFT
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '3px' }}>
                                  <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                                    {link.url}
                                  </a>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => handleMoveSocial(idx, 'up')}
                                disabled={idx === 0}
                                title="Move Up"
                                aria-label="Move link up"
                              >
                                &uarr;
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => handleMoveSocial(idx, 'down')}
                                disabled={idx === portfolioContent.social_links.length - 1}
                                title="Move Down"
                                aria-label="Move link down"
                              >
                                &darr;
                              </button>
                              <button
                                type="button"
                                className={`admin-btn ${(link.is_published !== false && link.isPublished !== false) ? 'admin-btn-secondary' : 'admin-btn-accent'}`}
                                style={{ padding: '6px 10px', fontSize: '11.5px' }}
                                onClick={() => handleTogglePublishSocial(idx)}
                              >
                                {(link.is_published !== false && link.isPublished !== false) ? 'Unpublish' : 'Publish'}
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                onClick={() => handleOpenEditSocial(link, idx)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn-danger"
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                onClick={() => handleDeleteSocial(idx)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SUBTAB 5: PROFILE, METADATA & LINKS */}
              {contentSubtab === 'meta' && (
                <form onSubmit={handleSaveMetaRoles}>
                  <div className="admin-card" style={{ maxWidth: '720px', padding: '24px' }}>
                    <div style={{ fontSize: '17px', fontWeight: '800', marginBottom: '4px' }}>
                      Profile Identity & Verified Links
                    </div>
                    <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 20px 0' }}>
                      Update your name, bio pitch, hero badge titles, and all verified social handles.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }} className="admin-modal-grid">
                      <div className="admin-field-group">
                        <label className="admin-field-label">Full Name</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={metaNameText}
                          onChange={(e) => setMetaNameText(e.target.value)}
                          placeholder="Sahil Wani"
                          required
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Primary Verified Email</label>
                        <input
                          type="email"
                          className="admin-input"
                          value={metaEmailText}
                          onChange={(e) => setMetaEmailText(e.target.value)}
                          placeholder="sahilaw502@gmail.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="admin-field-group" style={{ marginBottom: '16px' }}>
                      <label className="admin-field-label">Rotating Hero Header Roles (Comma-Separated)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={metaRolesText}
                        onChange={(e) => setMetaRolesText(e.target.value)}
                        placeholder="Frontend AI Engineer, UI/UX Designer, App Developer"
                        required
                      />
                      <span className="admin-field-helper">
                        These titles rotate with 3D animation inside the hero pill badge on the home page.
                      </span>
                    </div>

                    <div className="admin-field-group" style={{ marginBottom: '16px' }}>
                      <label className="admin-field-label">Action Words Wheel List (Comma-Separated)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={metaActionWordsText}
                        onChange={(e) => setMetaActionWordsText(e.target.value)}
                        placeholder="design., prototype., solve., build., develop., debug., ship., optimize., scale., do it."
                      />
                      <span className="admin-field-helper">
                        These action words animate through the 5-slot vertical wheel in the &quot;I can ...&quot; section on the home page.
                      </span>
                    </div>

                    <div className="admin-field-group" style={{ marginBottom: '16px' }}>
                      <label className="admin-field-label">Hero Headline Pitch Statement</label>
                      <textarea
                        className="admin-textarea"
                        rows={3}
                        value={metaPitchText}
                        onChange={(e) => setMetaPitchText(e.target.value)}
                        placeholder="Hey, I am Sahil Wani, a 20yo guy building things for the web..."
                      />
                      <span className="admin-field-helper">
                        The primary introductory narrative displayed directly beneath your name on the home page.
                      </span>
                    </div>

                    <div className="admin-field-group" style={{ marginBottom: '16px' }}>
                      <label className="admin-field-label">Introduction Overview (profiles.introduction)</label>
                      <textarea
                        className="admin-textarea"
                        rows={3}
                        value={metaIntroText}
                        onChange={(e) => setMetaIntroText(e.target.value)}
                        placeholder="Crafting sleek digital experiences, experimenting with code, design, and ideas that feel right."
                      />
                      <span className="admin-field-helper">
                        Persisted directly into profiles.introduction in Supabase. Displays as the primary profile introduction.
                      </span>
                    </div>

                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: '20px 0 12px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
                      Verified Social & Platform Links
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }} className="admin-modal-grid">
                      <div className="admin-field-group">
                        <label className="admin-field-label">Contact Status Availability</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={metaContactStatusText}
                          onChange={(e) => setMetaContactStatusText(e.target.value)}
                          placeholder="OPEN TO PRODUCT DESIGN ROLES"
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Current City & Country</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={metaLocationText}
                          onChange={(e) => setMetaLocationText(e.target.value)}
                          placeholder="JAMMU, INDIA"
                        />
                      </div>
                      <div className="admin-field-group">
                        <label className="admin-field-label">GitHub Profile URL</label>
                        <input
                          type="url"
                          className="admin-input"
                          value={metaGithubText}
                          onChange={(e) => setMetaGithubText(e.target.value)}
                          placeholder="https://github.com/sahil-wani"
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">LinkedIn Profile URL</label>
                        <input
                          type="url"
                          className="admin-input"
                          value={metaLinkedinText}
                          onChange={(e) => setMetaLinkedinText(e.target.value)}
                          placeholder="https://linkedin.com/in/sahil-wani"
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">Threads Profile URL</label>
                        <input
                          type="url"
                          className="admin-input"
                          value={metaThreadsText}
                          onChange={(e) => setMetaThreadsText(e.target.value)}
                          placeholder="https://threads.net/@sahilwani"
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">X / Twitter Profile URL</label>
                        <input
                          type="url"
                          className="admin-input"
                          value={metaXText}
                          onChange={(e) => setMetaXText(e.target.value)}
                          placeholder="https://x.com/sahilwani"
                        />
                      </div>
                    </div>

                    <button type="submit" className="admin-btn admin-btn-accent" style={{ marginTop: '12px' }}>
                      Save Profile & Links to Live Site
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 2. UNANSWERED QUESTIONS REVIEW QUEUE */}
          {activeTab === 'unanswered' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0' }}>Unanswered Questions</h1>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                  Substantive visitor questions that fell below the confidence threshold. Convert them into active knowledge entries with one click.
                </p>
              </div>

              <div className="admin-card">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Visitor Question</th>
                        <th>Times Asked</th>
                        <th>Status</th>
                        <th>Match Reason</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unanswered.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', color: '#6b7280', padding: '24px' }}>
                            Zero unanswered questions! All visitor queries are being answered confidently.
                          </td>
                        </tr>
                      ) : (
                        unanswered.map((u) => (
                          <tr key={u.id}>
                            <td style={{ fontWeight: '600', maxWidth: '340px' }}>
                              "{u.raw_question}"
                              {u.admin_notes && (
                                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Note: {u.admin_notes}</div>
                              )}
                            </td>
                            <td style={{ fontFamily: "'Disket Mono', monospace", color: '#10b981' }}>{u.count}x</td>
                            <td>
                              <span
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: '999px',
                                  fontSize: '11px',
                                  fontFamily: "'Disket Mono', monospace",
                                  background: u.status === 'new' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                  color: u.status === 'new' ? '#f87171' : '#10b981',
                                }}
                              >
                                {u.status}
                              </span>
                            </td>
                            <td style={{ fontSize: '12px', color: '#9ca3af' }}>{u.match_reason}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                {u.status !== 'answered' && (
                                  <button
                                    type="button"
                                    className="admin-btn admin-btn-primary"
                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                    onClick={() => {
                                      setConvertTarget(u);
                                      setConvertAnswer('');
                                    }}
                                  >
                                    Answer & Add to KB
                                  </button>
                                )}
                                {u.status === 'new' && (
                                  <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                    onClick={() => handleIgnoreUnanswered(u.id)}
                                  >
                                    Ignore
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. KNOWLEDGE BASE MANAGER */}
          {activeTab === 'knowledge' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0' }}>Knowledge Base Manager</h1>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                    Create, edit, and organize verified portfolio answers. Updates take effect immediately with zero server rebuild.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={() => {
                    setKbForm({
                      id: '',
                      canonical_question: '',
                      answer: '',
                      category: 'Projects',
                      aliases: '',
                      keywords: '',
                      links: '',
                      is_active: true,
                    });
                    setShowKbModal(true);
                  }}
                >
                  + New Knowledge Entry
                </button>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Search questions or answers..."
                  className="admin-input"
                  style={{ maxWidth: '380px' }}
                  value={kbSearch}
                  onChange={(e) => setKbSearch(e.target.value)}
                />
                <select
                  className="admin-select"
                  style={{ maxWidth: '200px' }}
                  value={kbCategoryFilter}
                  onChange={(e) => setKbCategoryFilter(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      Category: {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Knowledge Table */}
              <div className="admin-card">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Canonical Question & Aliases</th>
                        <th>Stored Answer (Verified Data)</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredKnowledge.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', fontSize: '12px', fontWeight: '600' }}>
                              {item.category}
                            </span>
                          </td>
                          <td style={{ maxWidth: '280px' }}>
                            <div style={{ fontWeight: '700', color: '#ffffff' }}>{item.canonical_question}</div>
                            {item.aliases?.length > 0 && (
                              <div style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '4px' }}>
                                Aliases: {item.aliases.slice(0, 3).join(', ')}
                                {item.aliases.length > 3 ? ` +${item.aliases.length - 3} more` : ''}
                              </div>
                            )}
                          </td>
                          <td style={{ maxWidth: '340px' }}>
                            <div style={{ fontSize: '13px', lineHeight: '1.45', maxHeight: '110px', overflowY: 'auto' }}>
                              <MarkdownContent text={item.answer} maxParagraphs={2} />
                            </div>
                          </td>
                          <td>
                            <span style={{ color: item.is_active ? '#10b981' : '#9ca3af', fontSize: '12px', fontFamily: "'Disket Mono', monospace" }}>
                              {item.is_active ? '● Active' : '○ Inactive'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '5px 10px', fontSize: '12px' }}
                                onClick={() => {
                                  setKbForm({
                                    id: item.id,
                                    canonical_question: item.canonical_question,
                                    answer: item.answer,
                                    category: item.category,
                                    aliases: (item.aliases || []).join('\n'),
                                    keywords: (item.keywords || []).join(', '),
                                    links: (item.links || []).map((l) => `${l.label}|${l.url}`).join('\n'),
                                    is_active: item.is_active,
                                  });
                                  setShowKbModal(true);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn-danger"
                                style={{ padding: '5px 10px', fontSize: '12px' }}
                                onClick={() => handleDeleteKb(item.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. RESPONSE TEMPLATES */}
          {activeTab === 'templates' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0' }}>Response Templates</h1>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                  Manage conversational responses for greetings, thanks, acknowledgements, farewells, and fallbacks.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {templates.map((tpl) => (
                  <div key={tpl.key} className="admin-card" style={{ marginBottom: '0' }}>
                    <div className="admin-card-header">
                      <div>
                        <div className="admin-card-title">{tpl.name}</div>
                        <div className="admin-card-desc">Key: <code>{tpl.key}</code></div>
                      </div>
                      <button
                        type="button"
                        className="admin-btn admin-btn-primary"
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                        onClick={() => {
                          handleSaveTemplate(tpl.key, tpl.template);
                        }}
                      >
                        Save Template
                      </button>
                    </div>
                    <AnswerTextEditor
                      label=""
                      rows={3}
                      value={tpl.template}
                      onChange={(val) => {
                        setTemplates((prev) =>
                          prev.map((t) => (t.key === tpl.key ? { ...t, template: val } : t))
                        );
                      }}
                      placeholder="Template response text..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. MATCH PREVIEW SANDBOX */}
          {activeTab === 'sandbox' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0' }}>Match Preview Sandbox</h1>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                  Stress-test the deterministic question-matching algorithm with sample visitor phrasing. Inspect confidence scores, matched keywords, and fallback reasons in real time.
                </p>
              </div>

              <div className="admin-card">
                <form onSubmit={handleTestMatch}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
                    Test Visitor Question
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Which technologies did you use for the synthesizer?"
                      value={sandboxQuery}
                      onChange={(e) => setSandboxQuery(e.target.value)}
                    />
                    <button type="submit" className="admin-btn admin-btn-primary" disabled={sandboxLoading}>
                      {sandboxLoading ? 'Testing...' : 'Execute Match'}
                    </button>
                  </div>
                </form>

                {sandboxResult && (
                  <div className="admin-sandbox-box">
                    <div className="admin-sandbox-score">
                      <span>Intent: <strong>{sandboxResult.intent}</strong></span>
                      <span>
                        Confidence:{' '}
                        <span
                          className={`admin-score-badge ${
                            sandboxResult.confidence >= 0.62 ? 'high' : sandboxResult.confidence >= 0.38 ? 'mid' : 'low'
                          }`}
                        >
                          {(sandboxResult.confidence * 100).toFixed(1)}%
                        </span>
                      </span>
                      <span>Matched ID: <code>{sandboxResult.matchedKnowledgeId || 'None'}</code></span>
                    </div>

                    <div style={{ fontSize: '13.5px', marginBottom: '14px', lineHeight: '1.5' }}>
                      <strong style={{ color: '#ffffff' }}>Selected Output (Rendered Markdown):</strong>
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '14px 16px', borderRadius: '8px', marginTop: '6px' }}>
                        <MarkdownContent text={sandboxResult.answer} maxParagraphs={2} />
                      </div>
                    </div>

                    {sandboxResult.metadata && (
                      <div style={{ fontSize: '12px', color: '#9ca3af', fontFamily: "'Disket Mono', monospace" }}>
                        Matching Diagnostics: {JSON.stringify(sandboxResult.metadata, null, 2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. CONVERSATIONS TRANSCRIPT LOG */}
          {activeTab === 'conversations' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0' }}>Visitor Conversations</h1>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                  Inspect full conversation transcripts and answer selections with privacy-safe metadata.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: selectedConversation ? '380px 1fr' : '1fr', gap: '20px' }}>
                <div className="admin-card">
                  <div className="admin-card-title" style={{ marginBottom: '14px' }}>Recent Sessions</div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Conversation</th>
                          <th>Messages</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conversations.length === 0 ? (
                          <tr>
                            <td colSpan="3" style={{ textAlign: 'center', color: '#6b7280', padding: '16px' }}>
                              No conversations logged yet.
                            </td>
                          </tr>
                        ) : (
                          conversations.map((c) => (
                            <tr
                              key={c.id}
                              style={{ cursor: 'pointer', background: selectedConversation?.id === c.id ? 'rgba(16, 185, 129, 0.1)' : '' }}
                              onClick={() => {
                                fetch(`/api/admin/conversations/${c.id}`, {
                                  headers: { Authorization: `Bearer ${token}` },
                                })
                                  .then((r) => r.json())
                                  .then(setSelectedConversation);
                              }}
                            >
                              <td>
                                <div style={{ fontWeight: '600', fontSize: '12.5px' }}>{c.id}</div>
                                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                  {new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </td>
                              <td style={{ fontFamily: "'Disket Mono', monospace" }}>{c.total_messages}</td>
                              <td>
                                <span style={{ fontSize: '11px', color: '#10b981' }}>{c.status}</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedConversation && (
                  <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div className="admin-card-title">Session: {selectedConversation.id}</div>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => setSelectedConversation(null)}
                      >
                        Close
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto', paddingRight: '8px' }}>
                      {selectedConversation.messages?.map((m) => (
                        <div
                          key={m.id}
                          style={{
                            alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '82%',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            background: m.sender === 'user' ? '#10b981' : 'rgba(255, 255, 255, 0.07)',
                            color: m.sender === 'user' ? '#000000' : '#ffffff',
                            fontSize: '13.5px',
                            lineHeight: '1.45',
                          }}
                        >
                          <div style={{ fontSize: '10.5px', opacity: 0.7, marginBottom: '4px', textTransform: 'uppercase', fontWeight: '700' }}>
                            {m.sender} • {new Date(m.created_at).toLocaleTimeString()}
                          </div>
                          <div>
                            {m.sender === 'assistant' ? (
                              <MarkdownContent text={m.text} maxParagraphs={2} />
                            ) : (
                              m.text
                            )}
                          </div>
                          {m.matched_knowledge_id && (
                            <div style={{ fontSize: '11px', marginTop: '6px', opacity: 0.8, fontFamily: "'Disket Mono', monospace" }}>
                              KB: {m.matched_knowledge_id} ({(m.confidence * 100).toFixed(0)}%)
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. SETTINGS & SECURITY */}
          {activeTab === 'settings' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0' }}>Chatbot Settings & Security</h1>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                  Tune deterministic matching thresholds and manage administrator credentials.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                {/* Threshold Configuration */}
                <div className="admin-card">
                  <div className="admin-card-title" style={{ marginBottom: '16px' }}>Matching Engine Thresholds</div>
                  <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px' }}>
                        Confidence Threshold (Default: 0.62)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.1"
                        max="1.0"
                        className="admin-input"
                        value={settings.confidenceThreshold || '0.62'}
                        onChange={(e) => setSettings({ ...settings, confidenceThreshold: e.target.value })}
                      />
                      <span style={{ fontSize: '11.5px', color: '#6b7280' }}>
                        Minimum score to return a direct verified answer.
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px' }}>
                        Ambiguity Threshold (Default: 0.38)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.1"
                        max="1.0"
                        className="admin-input"
                        value={settings.ambiguityThreshold || '0.38'}
                        onChange={(e) => setSettings({ ...settings, ambiguityThreshold: e.target.value })}
                      />
                      <span style={{ fontSize: '11.5px', color: '#6b7280' }}>
                        Questions below this threshold trigger fallback and are logged to unanswered questions.
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px' }}>
                        Rate Limit Per Minute
                      </label>
                      <input
                        type="number"
                        className="admin-input"
                        value={settings.rateLimitPerMin || '30'}
                        onChange={(e) => setSettings({ ...settings, rateLimitPerMin: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: '8px' }}>
                      Save Thresholds
                    </button>
                  </form>
                </div>

                {/* Password Change */}
                <div className="admin-card">
                  <div className="admin-card-title" style={{ marginBottom: '16px' }}>Change Admin Password</div>
                  {pwdMsg && (
                    <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '13px', marginBottom: '14px' }}>
                      {pwdMsg}
                    </div>
                  )}
                  <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px' }}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="admin-input"
                        value={currentPwd}
                        onChange={(e) => setCurrentPwd(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px' }}>
                        New Password (min 8 chars)
                      </label>
                      <input
                        type="password"
                        className="admin-input"
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                        required
                        minLength={8}
                      />
                    </div>

                    <button type="submit" className="admin-btn admin-btn-secondary" style={{ marginTop: '8px' }}>
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT KNOWLEDGE ENTRY */}
      {showKbModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowKbModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>
                {kbForm.id ? 'Edit Knowledge Entry' : 'Create Knowledge Entry'}
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '12px' }}
                onClick={() => setShowKbModal(false)}
                aria-label="Close modal"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveKb} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                  Canonical Question
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. What is the Web Audio Synth project?"
                  value={kbForm.canonical_question}
                  onChange={(e) => setKbForm({ ...kbForm, canonical_question: e.target.value })}
                  required
                />
              </div>

              <div>
                <AnswerTextEditor
                  label="Answer Text (Verified Facts Only)"
                  value={kbForm.answer}
                  onChange={(val) => setKbForm({ ...kbForm, answer: val })}
                  placeholder="Detailed answer text using verified portfolio records..."
                  rows={5}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    className="admin-select"
                    value={kbForm.category}
                    onChange={(e) => setKbForm({ ...kbForm, category: e.target.value })}
                  >
                    <option value="Projects">Projects</option>
                    <option value="Skills">Skills</option>
                    <option value="Experience">Experience</option>
                    <option value="Education">Education</option>
                    <option value="Certifications">Certifications</option>
                    <option value="Contact">Contact</option>
                    <option value="Introduction">Introduction</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    Active Status
                  </label>
                  <select
                    className="admin-select"
                    value={kbForm.is_active ? '1' : '0'}
                    onChange={(e) => setKbForm({ ...kbForm, is_active: e.target.value === '1' })}
                  >
                    <option value="1">Active (Matchable)</option>
                    <option value="0">Inactive (Disabled)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                  Alternative Questions / Aliases (One per line)
                </label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="how does the synth work&#10;audio project details&#10;what audio features exist"
                  value={kbForm.aliases}
                  onChange={(e) => setKbForm({ ...kbForm, aliases: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                  Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="synth, audio, oscillator, web audio, music"
                  value={kbForm.keywords}
                  onChange={(e) => setKbForm({ ...kbForm, keywords: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                  Verified Links (Format: Label|URL, one per line)
                </label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  placeholder="View Projects|#/projects&#10;GitHub Repo|https://github.com/sahilaw22"
                  value={kbForm.links}
                  onChange={(e) => setKbForm({ ...kbForm, links: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowKbModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONVERT UNANSWERED QUESTION */}
      {convertTarget && (
        <div className="admin-modal-backdrop" onClick={() => setConvertTarget(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>
              Answer Question & Add to Knowledge Base
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: '8px', marginBottom: '18px' }}>
              <div style={{ fontSize: '11.5px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '700' }}>
                Visitor Question Asked {convertTarget.count}x
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff', marginTop: '4px' }}>
                "{convertTarget.raw_question}"
              </div>
            </div>

            <form onSubmit={handleConvertUnanswered} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <AnswerTextEditor
                  label="Write Verified Answer"
                  value={convertAnswer}
                  onChange={setConvertAnswer}
                  placeholder="Write the exact factual response to answer this visitor question..."
                  rows={4}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setConvertTarget(null)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Publish Answer to Chatbot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PROJECT */}
      {showProjectModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowProjectModal(false)}>
          <div className="admin-modal-card" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
              {editingProjectIndex !== null ? 'Edit Project' : 'Add New Project'}
            </div>

            <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }} className="admin-modal-grid">
                <div>
                  <label className="admin-field-label">Project Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. Modern Web Engine"
                    required
                  />
                </div>
                <div>
                  <label className="admin-field-label">Category</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    placeholder="e.g. Web App"
                  />
                </div>
                <div>
                  <label className="admin-field-label">Year</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={projectForm.year}
                    onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                    placeholder="e.g. 2026"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={projectForm.isPublished !== false}
                    onChange={(e) => setProjectForm({ ...projectForm, isPublished: e.target.checked })}
                  />
                  <span style={{ fontWeight: '600', color: projectForm.isPublished !== false ? '#34d399' : '#9ca3af' }}>
                    {projectForm.isPublished !== false ? 'Published (Visible publicly)' : 'Draft (Hidden from public)'}
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={projectForm.isFeatured}
                    onChange={(e) => setProjectForm({ ...projectForm, isFeatured: e.target.checked })}
                  />
                  <span>Feature on Home Page Cascading Deck</span>
                </label>
              </div>

              <div>
                <label className="admin-field-label">Summary Details (Shown on cards & previews)</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={projectForm.details}
                  onChange={(e) => setProjectForm({ ...projectForm, details: e.target.value })}
                  placeholder="Short summary highlighting purpose and key technical achievements..."
                  required
                />
              </div>

              <div>
                <label className="admin-field-label">In-Depth Case Study / Long Details (Modal view)</label>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={projectForm.longDetails}
                  onChange={(e) => setProjectForm({ ...projectForm, longDetails: e.target.value })}
                  placeholder="Full project description, architecture overview, and design choices..."
                />
              </div>

              <div>
                <label className="admin-field-label">Tech Stack Tags (Comma-Separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={projectForm.tech}
                  onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                  placeholder="React, TypeScript, CSS3, GSAP, Node.js"
                />
                <span className="admin-field-helper">
                  Matched icons will automatically display in the tag preview.
                </span>
              </div>

              <AdminImageUploadField
                label="Project Screenshot / Cover Image"
                value={projectForm.image}
                onChange={(img) => setProjectForm({ ...projectForm, image: img })}
                placeholder="/projects/my-project.jpg or upload below"
                idPrefix="project-cover"
                helperText="Stored in Supabase Storage under projects/project-banner/. Auto-replaces old file."
                storageFolder="projects/project-banner"
                slug={slugify(projectForm.title || 'project')}
              />

              <AdminVideoUploadField
                label="Project Demo Video (Playable in Details Modal)"
                value={projectForm.videoUrl}
                onChange={(vid) => setProjectForm({ ...projectForm, videoUrl: vid })}
                placeholder="Paste direct MP4/WebM URL or upload to Supabase..."
                idPrefix="project-video"
                helperText="Stored in Supabase Storage under projects/project-video/. Visitors can play this video directly in the project details modal."
                storageFolder="projects/project-video"
                slug={slugify(projectForm.title || 'project')}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="admin-modal-grid">
                <div>
                  <label className="admin-field-label">Live Demo / Website URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={projectForm.link}
                    onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                    placeholder="https://example.com or #/chat"
                  />
                </div>
                <div>
                  <label className="admin-field-label">GitHub Repository URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={projectForm.github}
                    onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              {/* LIVE COMPONENT PREVIEW FOR PROJECTS */}
              <div className="admin-live-preview-section">
                <div className="admin-preview-title">Live Project Showcase Preview</div>
                <div className="admin-preview-wrapper" style={{ padding: '16px' }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {projectForm.videoUrl ? (
                      <div style={{ position: 'relative', width: '100%', borderRadius: '10px', overflow: 'hidden', background: '#000' }}>
                        <video
                          src={projectForm.videoUrl}
                          controls
                          playsInline
                          preload="metadata"
                          poster={projectForm.image || undefined}
                          style={{ width: '100%', maxHeight: '180px', display: 'block', objectFit: 'cover' }}
                        />
                      </div>
                    ) : projectForm.image ? (
                      <img
                        src={projectForm.image}
                        alt={projectForm.title || 'Project'}
                        style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px' }}
                      />
                    ) : null}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#61dca3' }}>
                        {projectForm.category || 'Web App'} &bull; {projectForm.year || '2026'}
                      </span>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {projectForm.videoUrl ? (
                          <span style={{ fontSize: '10px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '2px 8px', borderRadius: '999px' }}>
                            Video Demo
                          </span>
                        ) : null}
                        {projectForm.isFeatured && (
                          <span style={{ fontSize: '10px', background: 'rgba(97, 220, 163, 0.15)', color: '#61dca3', padding: '2px 8px', borderRadius: '999px' }}>
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                      {projectForm.title || 'Project Title'}
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', lineHeight: 1.5 }}>
                      {projectForm.details || 'Short project summary and technical highlights...'}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(projectForm.tech ? projectForm.tech.split(',').map((s) => s.trim()).filter(Boolean) : ['React', 'CSS3']).map((t, idx) => (
                        <span key={idx} className="exp-skill-chip" style={{ fontSize: '11px' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowProjectModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-accent">
                  {editingProjectIndex !== null ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT WORK EXPERIENCE */}
      {showExpModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowExpModal(false)}>
          <div className="admin-modal-card" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
              {editingExpIndex !== null ? 'Edit Work Experience' : 'Add New Work Experience'}
            </div>

            <form onSubmit={handleSaveExp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }} className="admin-modal-grid">
                <div>
                  <label className="admin-field-label">Company / Organization</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    placeholder="e.g. Big Block Theory"
                    required
                  />
                </div>
                <div>
                  <label className="admin-field-label">Role / Position</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    placeholder="e.g. Frontend AI Intern"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="admin-modal-grid">
                <div>
                  <label className="admin-field-label">Employment Type</label>
                  <select
                    className="admin-input"
                    value={expForm.employmentType || 'Internship'}
                    onChange={(e) => setExpForm({ ...expForm, employmentType: e.target.value })}
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="admin-field-label">Location</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={expForm.location}
                    onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                    placeholder="e.g. Remote or India"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={expForm.isCurrent}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const endVal = isChecked ? 'Present' : (expForm.endDate === 'Present' ? '' : expForm.endDate);
                      const periodVal = expForm.startDate
                        ? (isChecked ? `${expForm.startDate} - Present` : (endVal ? `${expForm.startDate} - ${endVal}` : expForm.startDate))
                        : (isChecked ? 'Present' : endVal);
                      setExpForm({
                        ...expForm,
                        isCurrent: isChecked,
                        endDate: endVal,
                        period: periodVal,
                      });
                    }}
                  />
                  <span style={{ fontWeight: '600', color: expForm.isCurrent ? '#34d399' : '#e5e7eb' }}>
                    Currently working here (shows &quot;Working&quot; badge and sets End Date to &quot;Present&quot;)
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={expForm.isPublished !== false}
                    onChange={(e) => setExpForm({ ...expForm, isPublished: e.target.checked })}
                  />
                  <span style={{ fontWeight: '600', color: expForm.isPublished !== false ? '#34d399' : '#9ca3af' }}>
                    {expForm.isPublished !== false ? 'Published (Live on portfolio)' : 'Draft (Hidden from public)'}
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={expForm.showSkillIcons !== false}
                    onChange={(e) => setExpForm({ ...expForm, showSkillIcons: e.target.checked })}
                  />
                  <span style={{ fontWeight: '600', color: expForm.showSkillIcons !== false ? '#34d399' : '#9ca3af' }}>
                    Show tech icons beside skills on experience cards
                  </span>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }} className="admin-modal-grid">
                <div>
                  <label className="admin-field-label">Start Date</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={expForm.startDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      const endPart = expForm.isCurrent ? 'Present' : (expForm.endDate || '');
                      const newPeriod = val && endPart ? `${val} - ${endPart}` : (val || endPart);
                      setExpForm({ ...expForm, startDate: val, period: newPeriod });
                    }}
                    placeholder="e.g. DEC 2025"
                  />
                </div>
                <div>
                  <label className="admin-field-label">End Date</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={expForm.isCurrent ? 'Present' : expForm.endDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      const newPeriod = expForm.startDate && val ? `${expForm.startDate} - ${val}` : (val || expForm.startDate || '');
                      setExpForm({ ...expForm, endDate: val, period: newPeriod });
                    }}
                    placeholder={expForm.isCurrent ? 'Present' : 'e.g. MAR 2025'}
                    disabled={expForm.isCurrent}
                  />
                </div>
                <div>
                  <label className="admin-field-label">Time Period / Timeline</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={expForm.period}
                    onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                    placeholder="e.g. DEC 2025 - PRESENT"
                  />
                </div>
              </div>

              <AdminImageUploadField
                label="Company / Internship Logo"
                value={expForm.image || expForm.logo}
                onChange={(val) => setExpForm({ ...expForm, logo: val, image: val })}
                placeholder="Paste logo URL or upload image file..."
                idPrefix="exp-logo"
                helperText="Clean rounded-square logo (14px border radius, no border). Uploads to Supabase Storage under logos/. Auto-replaces old file."
                isLogo={true}
                storageFolder="logos"
                slug={slugify(expForm.company || 'company')}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="admin-modal-grid">
                <div>
                  <label className="admin-field-label">Website URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={expForm.website}
                    onChange={(e) => setExpForm({ ...expForm, website: e.target.value })}
                    placeholder="https://company.com"
                  />
                </div>
                <div>
                  <label className="admin-field-label">LinkedIn URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={expForm.linkedin}
                    onChange={(e) => setExpForm({ ...expForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="admin-modal-grid">
                <div>
                  <label className="admin-field-label">GitHub URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={expForm.github}
                    onChange={(e) => setExpForm({ ...expForm, github: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="admin-field-label">X / Twitter URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={expForm.x}
                    onChange={(e) => setExpForm({ ...expForm, x: e.target.value })}
                    placeholder="https://x.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="admin-field-label">Skills & Tech (Comma-Separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={expForm.skills}
                  onChange={(e) => setExpForm({ ...expForm, skills: e.target.value })}
                  placeholder="React, Next.js, TypeScript, Tailwind CSS"
                />
              </div>

              {/* DESCRIPTION EDITOR: 1. PARAGRAPH DESCRIPTION */}
              <div>
                <label className="admin-field-label">Description: Paragraph Overview</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={expForm.paragraph}
                  onChange={(e) => setExpForm({ ...expForm, paragraph: e.target.value })}
                  placeholder="General paragraph summarizing your role, mission, and scope..."
                />
                <span className="admin-field-helper">
                  High-level summary paragraph rendered before bullet points on the public portfolio.
                </span>
              </div>

              {/* DESCRIPTION EDITOR: 2. INTERACTIVE BULLET-POINT LIST */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="admin-field-label" style={{ margin: 0 }}>
                    Description: Bullet Points (Responsibilities, achievements, work performed)
                  </label>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '3px 10px', fontSize: '11px' }}
                    onClick={addExpBullet}
                  >
                    + Add Bullet
                  </button>
                </div>

                <div className="admin-bullets-editor">
                  {(expForm.bullets || []).map((bullet, bIdx) => (
                    <div key={bIdx} className="admin-bullet-row">
                      <span style={{ fontSize: '11px', color: '#61dca3', fontWeight: '700', minWidth: '18px' }}>
                        {bIdx + 1}.
                      </span>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ flex: 1 }}
                        value={bullet}
                        onChange={(e) => updateExpBullet(bIdx, e.target.value)}
                        placeholder="e.g. Developed responsive frontend interfaces..."
                      />
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        disabled={bIdx === 0}
                        onClick={() => moveExpBullet(bIdx, 'up')}
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        disabled={bIdx === (expForm.bullets || []).length - 1}
                        onClick={() => moveExpBullet(bIdx, 'down')}
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => removeExpBullet(bIdx)}
                        title="Remove Bullet"
                        aria-label="Remove Bullet"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE COMPONENT PREVIEW FOR EXPERIENCE */}
              <div className="admin-live-preview-section">
                <div className="admin-preview-title">Live Portfolio Component Preview</div>
                <div className="admin-preview-wrapper">
                  <ExperienceCard
                    experience={{
                      id: expForm.id || 'preview-exp',
                      company: expForm.company || 'Company Name',
                      role: expForm.role || 'Job Role',
                      position: expForm.role || 'Job Role',
                      employmentType: expForm.employmentType,
                      period: expForm.period || 'JAN 2026 - PRESENT',
                      startDate: expForm.startDate,
                      endDate: expForm.endDate,
                      location: expForm.location || 'Remote',
                      isCurrent: expForm.isCurrent,
                      description_paragraph: expForm.paragraph,
                      description_bullets: (expForm.bullets || []).filter(Boolean),
                      description: (expForm.bullets || []).filter(Boolean),
                      desc: expForm.paragraph,
                      skills: expForm.skills ? expForm.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
                      technologies: expForm.skills ? expForm.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
                      logo: expForm.image || expForm.logo,
                      image: expForm.image || expForm.logo,
                      website: expForm.website,
                      github: expForm.github,
                      linkedin: expForm.linkedin,
                      x: expForm.x,
                    }}
                    alwaysOpen={true}
                    isFeatured={true}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowExpModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT EDUCATION */}
      {showEduModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowEduModal(false)}>
          <div className="admin-modal-card" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
              {editingEduIndex !== null ? 'Edit Education Milestone' : 'Add Education Milestone'}
            </div>

            <form onSubmit={handleSaveEdu} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="admin-modal-grid">
                <div>
                  <label className="admin-field-label">Degree / Program</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={eduForm.degree}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                    placeholder="e.g. Bachelor of Technology"
                    required
                  />
                </div>
                <div>
                  <label className="admin-field-label">Branch / Specialization</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={eduForm.branch}
                    onChange={(e) => setEduForm({ ...eduForm, branch: e.target.value })}
                    placeholder="e.g. Computer Science and Engineering"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }} className="admin-modal-grid">
                <div>
                  <label className="admin-field-label">Institution / College / University</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={eduForm.institution}
                    onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                    placeholder="e.g. GCET Jammu"
                    required
                  />
                </div>
                <div>
                  <label className="admin-field-label">Location</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={eduForm.location}
                    onChange={(e) => setEduForm({ ...eduForm, location: e.target.value })}
                    placeholder="e.g. Jammu, J&K"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="admin-modal-grid">
                <div>
                  <label className="admin-field-label">Period / Duration</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={eduForm.period}
                    onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                    placeholder="e.g. 2024 - 2028"
                    required
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '22px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={eduForm.isCurrent}
                      onChange={(e) => setEduForm({ ...eduForm, isCurrent: e.target.checked })}
                    />
                    <span>Active Student (NOW badge)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={eduForm.isPublished !== false}
                      onChange={(e) => setEduForm({ ...eduForm, isPublished: e.target.checked })}
                    />
                    <span style={{ fontWeight: '600', color: eduForm.isPublished !== false ? '#34d399' : '#9ca3af' }}>
                      {eduForm.isPublished !== false ? 'Published' : 'Draft'}
                    </span>
                  </label>
                </div>
              </div>

              <AdminImageUploadField
                label="College / School / Institution Logo"
                value={eduForm.image || eduForm.logo}
                onChange={(val) => setEduForm({ ...eduForm, logo: val, image: val })}
                placeholder="Paste logo URL or upload image file..."
                idPrefix="edu-logo"
                helperText="Clean rounded-square logo (14px border radius, no border). Uploads to Supabase Storage under education/college-logos/. Re-upload requires explicit deletion."
                isLogo={true}
                storageFolder="education/college-logos"
                slug={slugify(eduForm.institution || eduForm.degree || 'edu')}
                requireExplicitDelete={true}
              />

              <div>
                <label className="admin-field-label">Description Paragraph</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={eduForm.paragraph}
                  onChange={(e) => setEduForm({ ...eduForm, paragraph: e.target.value })}
                  placeholder="Summary of academic focus, core curriculum, and honors..."
                />
              </div>

              {/* HIGHLIGHTS / COURSEWORK BULLET POINTS */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="admin-field-label" style={{ margin: 0 }}>
                    Highlights & Core Coursework (Chips / Bullets)
                  </label>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '3px 10px', fontSize: '11px' }}
                    onClick={addEduBullet}
                  >
                    + Add Item
                  </button>
                </div>

                <div className="admin-bullets-editor">
                  {(eduForm.bullets || []).map((highlight, hIdx) => (
                    <div key={hIdx} className="admin-bullet-row">
                      <span style={{ fontSize: '11px', color: '#61dca3', fontWeight: '700', minWidth: '18px' }}>
                        {hIdx + 1}.
                      </span>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ flex: 1 }}
                        value={highlight}
                        onChange={(e) => updateEduBullet(hIdx, e.target.value)}
                        placeholder="e.g. Artificial Intelligence, Data Structures..."
                      />
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        disabled={hIdx === 0}
                        onClick={() => moveEduBullet(hIdx, 'up')}
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        disabled={hIdx === (eduForm.bullets || []).length - 1}
                        onClick={() => moveEduBullet(hIdx, 'down')}
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => removeEduBullet(hIdx)}
                        title="Remove"
                        aria-label="Remove"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE COMPONENT PREVIEW FOR EDUCATION */}
              <div className="admin-live-preview-section">
                <div className="admin-preview-title">Live Education Component Preview</div>
                <div className="admin-preview-wrapper" style={{ padding: '16px' }}>
                  <div className="timeline-connected-item" style={{ marginBottom: 0 }}>
                    <div className="timeline-logo-col">
                      <div className={`timeline-logo-node ${eduForm.image || eduForm.logo ? 'has-clean-logo' : ''}`}>
                        {(eduForm.image || eduForm.logo) ? (
                          <img
                            src={eduForm.image || eduForm.logo}
                            alt={eduForm.institution || 'Logo'}
                            className="timeline-logo-img-clean"
                          />
                        ) : (
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="timeline-content-col">
                      <div className="exp-top-row">
                        <div className="exp-company-block">
                          <h3 className="exp-company-name">{eduForm.degree || 'Degree / Program'}</h3>
                          <span className="exp-role-title">
                            {eduForm.institution || 'Institution Name'}
                            {eduForm.branch ? ` (${eduForm.branch})` : ''}
                          </span>
                        </div>
                        <div className="exp-period-badge">
                          {eduForm.isCurrent && <span className="edu-now-tag">NOW</span>}
                          <span className="exp-period-text">{eduForm.period || '2024 - 2028'}</span>
                        </div>
                      </div>
                      {eduForm.paragraph && <p className="exp-clean-desc">{eduForm.paragraph}</p>}
                      {(eduForm.bullets || []).filter(Boolean).length > 0 && (
                        <div className="exp-skills-row">
                          {(eduForm.bullets || []).filter(Boolean).map((c, i) => (
                            <span key={i} className="exp-skill-chip">{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowEduModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CERTIFICATION OR ACHIEVEMENT */}
      {showCertModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowCertModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
              {editingCertIndex !== null ? `Edit ${certModalType === 'certification' ? 'Certification' : 'Achievement'}` : `Add New ${certModalType === 'certification' ? 'Certification' : 'Achievement'}`}
            </div>

            <form onSubmit={handleSaveCert} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="admin-field-label">Entry Type</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className={`admin-subfilter-pill ${certModalType === 'certification' ? 'is-active' : ''}`}
                    onClick={() => setCertModalType('certification')}
                    style={{ flex: 1, textAlign: 'center', height: '36px' }}
                  >
                    Certification
                  </button>
                  <button
                    type="button"
                    className={`admin-subfilter-pill ${certModalType === 'achievement' ? 'is-active' : ''}`}
                    onClick={() => setCertModalType('achievement')}
                    style={{ flex: 1, textAlign: 'center', height: '36px' }}
                  >
                    Achievement
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="admin-modal-grid">
                <div>
                  <label className="admin-field-label">Title / Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    placeholder={certModalType === 'certification' ? 'e.g. AI Agents Intensive with Google' : 'e.g. Top 1000 Innovator – Youth Ideathon'}
                    required
                  />
                </div>
                <div>
                  <label className="admin-field-label">Issuer / Organization</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="e.g. Google, IBM, IIT Delhi, Kaggle"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="admin-modal-grid">
                <div>
                  <label className="admin-field-label">Year / Date Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={certForm.year}
                    onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                    placeholder="e.g. 2025 or Oct 2025"
                    required
                  />
                </div>
                <div>
                  <label className="admin-field-label">Issue Date (Optional)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    placeholder="e.g. Issued Nov 2025"
                  />
                </div>
              </div>

              <AdminImageUploadField
                label={certModalType === 'certification' ? 'Issuer / Organization Logo (Icon)' : 'Organization / Event Badge (Icon)'}
                value={certForm.image}
                onChange={(val) => setCertForm({ ...certForm, image: val })}
                placeholder="Upload logo/badge image or paste URL..."
                idPrefix="cert-logo"
                helperText="Square/circle logo displayed on the left side of the row. Single upload, auto-replaces existing file."
                storageFolder={certModalType === 'certification' ? 'certifications/logos' : 'achievements/logos'}
                slug={slugify(certForm.title || certForm.issuer || 'cert')}
                isLogo={true}
              />

              {certModalType === 'certification' ? (
                <AdminImageUploadField
                  label="Certificate Document Image (LinkedIn-style preview card)"
                  value={certForm.certificateImage}
                  onChange={(val) => setCertForm({ ...certForm, certificateImage: val })}
                  placeholder="Upload certificate image/PDF render or paste URL..."
                  idPrefix="cert-doc"
                  helperText="Stored in Supabase Storage under portfolio-assets/certifications/certificates/. Displays verified credential card."
                  storageFolder="certifications/certificates"
                  slug={slugify(certForm.title || 'cert')}
                />
              ) : (
                <AdminMultiImageUploadField
                  label="Award / Event Photos (Multi-Upload Allowed)"
                  values={certForm.photos ? (Array.isArray(certForm.photos) ? certForm.photos : certForm.photos.split(',').map((s) => s.trim()).filter(Boolean)) : (certForm.certificateImage ? [certForm.certificateImage] : [])}
                  onChange={(vals) => setCertForm({ ...certForm, photos: vals, certificateImage: vals[0] || '' })}
                  placeholder="Upload event ceremony, podium, or trophy photos..."
                  idPrefix="achieve-photos"
                  helperText="Stored in Supabase Storage under portfolio-assets/achievements/photos/<slug>/. Multiple photos organized by achievement."
                  storageFolder="achievements/photos"
                  slug={slugify(certForm.title || 'achieve')}
                />
              )}

              <div>
                <label className="admin-field-label">Credential / Verification Link</label>
                <input
                  type="url"
                  className="admin-input"
                  value={certForm.link}
                  onChange={(e) => setCertForm({ ...certForm, link: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="admin-field-label">Description / Summary (Optional)</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={certForm.description}
                  onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                  placeholder="Summary of skills verified, project impact, or criteria..."
                />
              </div>

              {/* LIVE COMPONENT PREVIEW FOR CERTIFICATION / ACHIEVEMENT */}
              <div className="admin-live-preview-section">
                <div className="admin-preview-title">Live Portfolio Single-Row Preview</div>
                <div className="admin-preview-wrapper" style={{ padding: '14px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', minWidth: 0, flex: 1 }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, padding: '4px', boxSizing: 'border-box' }}>
                        {certForm.image ? (
                          <img src={certForm.image} alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '7px', objectFit: 'contain' }} />
                        ) : (
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#60a5fa" strokeWidth="2">
                            <circle cx="12" cy="8" r="7" />
                            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                          </svg>
                        )}
                      </div>
                      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '14.5px', fontWeight: '600', color: '#ffffff' }}>
                          {certForm.title || 'Entry Title'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          {certForm.issuer || 'Issuing Organization'} &bull; {certForm.issueDate || certForm.year || '2026'}
                        </span>

                        {certModalType === 'certification' && certForm.certificateImage ? (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '4px 10px 4px 4px',
                            marginTop: '5px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            width: 'fit-content'
                          }}>
                            <div style={{ width: '48px', height: '32px', borderRadius: '5px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                              <img src={certForm.certificateImage} alt="Cert" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#60a5fa' }}>Certificate</span>
                              <span style={{ fontSize: '11px', color: '#fff', fontWeight: '500' }}>Show credential ↗</span>
                            </div>
                          </div>
                        ) : null}

                        {certModalType === 'achievement' && certForm.certificateImage ? (
                          <div style={{ display: 'flex', gap: '6px', marginTop: '5px' }}>
                            <div style={{ width: '58px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                              <img src={certForm.certificateImage} alt="Achievement" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          </div>
                        ) : null}

                        {certForm.description ? (
                          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.4 }}>
                            {certForm.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', fontFamily: "'Disket Mono', monospace", color: '#9ca3af' }}>
                      {certForm.year || '2026'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowCertModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save {certModalType === 'certification' ? 'Certification' : 'Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SOCIAL LINK */}
      {showSocialModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowSocialModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                {editingSocialIndex !== null ? 'Edit Social Link' : 'Add New Social Link'}
              </div>
              <button type="button" className="admin-btn admin-btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setShowSocialModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveSocial} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="admin-field-group">
                <label className="admin-field-label">Platform Preset</label>
                <select
                  className="admin-input"
                  value={socialForm.platform}
                  onChange={(e) => {
                    const selectedPlatform = e.target.value;
                    const preset = SOCIAL_PRESETS.find((p) => p.platform === selectedPlatform);
                    setSocialForm({
                      ...socialForm,
                      platform: selectedPlatform,
                      label: preset?.label || selectedPlatform,
                      url: socialForm.url || preset?.defaultUrl || '',
                      icon_name: preset?.icon || selectedPlatform.toLowerCase(),
                    });
                  }}
                >
                  {SOCIAL_PRESETS.map((p) => (
                    <option key={p.platform} value={p.platform}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label">Display Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={socialForm.label}
                  onChange={(e) => setSocialForm({ ...socialForm, label: e.target.value })}
                  placeholder="e.g. GitHub"
                  required
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label">Profile / Destination URL</label>
                <input
                  type="url"
                  className="admin-input"
                  value={socialForm.url}
                  onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>

              {socialForm.platform === 'Custom' && (
                <div className="admin-field-group">
                  <label className="admin-field-label">Custom SVG Markup (Optional)</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={socialForm.icon_svg}
                    onChange={(e) => setSocialForm({ ...socialForm, icon_svg: e.target.value })}
                    placeholder="<svg viewBox='0 0 24 24'>...</svg>"
                  />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="social-is-published"
                  checked={socialForm.is_published}
                  onChange={(e) => setSocialForm({ ...socialForm, is_published: e.target.checked })}
                />
                <label htmlFor="social-is-published" className="admin-field-label" style={{ margin: 0, cursor: 'pointer' }}>
                  Visible and active on live portfolio
                </label>
              </div>

              {/* Live preview */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getSocialIconSvg(socialForm.platform || socialForm.icon_name, 20)}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                    {socialForm.label || socialForm.platform}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {socialForm.url || 'https://...'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowSocialModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Social Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM SKILL WITH LOGO / ONLINE ICON LIBRARY */}
      {customSkillModal.isOpen && (() => {
        const query = (customSkillModal.filterQuery || '').toLowerCase().trim();
        const filteredIcons = ONLINE_SKILL_ICONS.filter(
          (i) => i.name.toLowerCase().includes(query) || i.slug.toLowerCase().includes(query)
        );

        return (
          <div className="admin-modal-backdrop" onClick={() => setCustomSkillModal({ ...customSkillModal, isOpen: false })}>
            <div className="admin-modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px' }}>
                Add Skill Icon (Online Library or Upload)
              </div>

              {/* Mode Switcher */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <button
                  type="button"
                  className={`admin-subfilter-pill ${customSkillModal.tab === 'online' ? 'is-active' : ''}`}
                  onClick={() => setCustomSkillModal({ ...customSkillModal, tab: 'online' })}
                  style={{ flex: 1, textAlign: 'center', height: '36px' }}
                >
                  Online Icon Library
                </button>
                <button
                  type="button"
                  className={`admin-subfilter-pill ${customSkillModal.tab === 'upload' ? 'is-active' : ''}`}
                  onClick={() => setCustomSkillModal({ ...customSkillModal, tab: 'upload' })}
                  style={{ flex: 1, textAlign: 'center', height: '36px' }}
                >
                  Upload File / URL
                </button>
              </div>

              <form onSubmit={handleAddCustomSkillSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="admin-field-label">Skill Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={customSkillModal.name}
                    onChange={(e) => setCustomSkillModal({ ...customSkillModal, name: e.target.value })}
                    placeholder="e.g. React, Supabase, Python, Docker"
                    required
                    autoFocus
                  />
                </div>

                {customSkillModal.tab === 'online' ? (
                  <div>
                    <label className="admin-field-label">Search Online Icon Library (SkillIcons / Devicons)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={customSkillModal.filterQuery}
                      onChange={(e) => setCustomSkillModal({ ...customSkillModal, filterQuery: e.target.value })}
                      placeholder="Type to filter (e.g. react, ts, python, supabase, figma)..."
                      style={{ marginBottom: '10px' }}
                    />

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(78px, 1fr))',
                      gap: '8px',
                      maxHeight: '190px',
                      overflowY: 'auto',
                      padding: '8px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px'
                    }}>
                      {filteredIcons.map((item) => {
                        const iconUrl = `https://skillicons.dev/icons?i=${item.slug}`;
                        const isSelected = customSkillModal.logoUrl === iconUrl;
                        return (
                          <button
                            key={item.slug}
                            type="button"
                            onClick={() => {
                              setCustomSkillModal({
                                ...customSkillModal,
                                name: customSkillModal.name ? customSkillModal.name : item.name,
                                logoUrl: iconUrl,
                                logoPreview: iconUrl,
                              });
                            }}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              padding: '8px 4px',
                              background: isSelected ? 'rgba(96, 165, 250, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                              border: isSelected ? '1px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <img src={iconUrl} alt={item.name} width={22} height={22} style={{ objectFit: 'contain' }} />
                            <span style={{ fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                              {item.name}
                            </span>
                          </button>
                        );
                      })}

                      {query && !filteredIcons.some((i) => i.slug === query) ? (
                        <button
                          type="button"
                          onClick={() => {
                            const customUrl = `https://skillicons.dev/icons?i=${query}`;
                            setCustomSkillModal({
                              ...customSkillModal,
                              name: customSkillModal.name || query,
                              logoUrl: customUrl,
                              logoPreview: customUrl,
                            });
                          }}
                          style={{
                            gridColumn: '1 / -1',
                            padding: '8px',
                            background: 'rgba(96, 165, 250, 0.15)',
                            border: '1px dashed #60a5fa',
                            borderRadius: '6px',
                            color: '#93c5fd',
                            fontSize: '11.5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          <img src={`https://skillicons.dev/icons?i=${query}`} alt={query} width={20} height={20} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <span>Use online icon slug: &quot;{query}&quot;</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="admin-field-label">Upload Skill Logo / Icon</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                      <label
                        className="admin-btn admin-btn-secondary"
                        style={{
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 12px',
                        }}
                      >
                        <span>Browse Image / SVG</span>
                        <input
                          type="file"
                          accept="image/*,.svg"
                          style={{ display: 'none' }}
                          onChange={handleCustomSkillLogoUpload}
                        />
                      </label>
                    </div>

                    <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '4px' }}>
                      Or paste a logo Image URL:
                    </div>
                    <input
                      type="text"
                      className="admin-input"
                      value={customSkillModal.logoUrl}
                      onChange={(e) => setCustomSkillModal({ ...customSkillModal, logoUrl: e.target.value, logoPreview: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                )}

                {/* Selected Icon & Skill Chip Live Preview */}
                {(customSkillModal.logoPreview || customSkillModal.logoUrl || customSkillModal.name) && (
                  <div style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '6px' }}>Live Skill Chip Preview:</div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12.5px',
                        color: '#ffffff',
                        fontWeight: '500'
                      }}
                    >
                      {(customSkillModal.logoPreview || customSkillModal.logoUrl) ? (
                        <img
                          src={customSkillModal.logoPreview || customSkillModal.logoUrl}
                          alt="preview"
                          style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                        />
                      ) : null}
                      <span>{customSkillModal.name || 'Skill Name'}</span>
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setCustomSkillModal({ ...customSkillModal, isOpen: false })}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    Add to Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Floating Save Notification Toast */}
      {contentSaveMsg && (
        <div className="admin-toast-notification" role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>{contentSaveMsg}</span>
        </div>
      )}
    </div>
  );
}

