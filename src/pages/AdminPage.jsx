import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import MarkdownContent from '../components/MarkdownContent.jsx';
import AnswerTextEditor from '../components/AnswerTextEditor.jsx';
import { TechIcon } from '../components/TechIcons.jsx';
import './AdminPage.css';

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

function renderAboutParagraphPreview(text) {
  if (!text) return null;
  const parts = text.split(/(\{\{(?:ICON_|icon:)[A-Za-z0-9_-]+\}\}|https:\/\/skillicons\.dev\/icons\?i=[A-Za-z0-9_,-]+)/gi);
  return parts.map((part, pIdx) => {
    const match =
      part.match(/^\{\{(?:ICON_|icon:)([A-Za-z0-9_-]+)\}\}$/i) ||
      part.match(/^https:\/\/skillicons\.dev\/icons\?i=([A-Za-z0-9_,-]+)$/i);
    if (match) {
      const raw = match[1].toLowerCase();
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

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('portfolio_admin_token') || '');
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, portfolio, unanswered, knowledge, templates, sandbox, conversations, settings

  // Portfolio dynamic content management state
  const [portfolioContent, setPortfolioContent] = useState({
    about: [],
    experiences: [],
    education: [],
    skills: [],
    meta: { hero_roles: [] },
  });
  const [contentSubtab, setContentSubtab] = useState('experiences');
  const [contentSaveMsg, setContentSaveMsg] = useState('');

  // Experience modal/editing state
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState(null);
  const [expForm, setExpForm] = useState({
    id: '',
    company: '',
    role: '',
    period: '',
    location: '',
    isCurrent: false,
    desc: '',
    skills: '',
    logo: '',
  });

  // Education modal/editing state
  const [showEduModal, setShowEduModal] = useState(false);
  const [editingEduIndex, setEditingEduIndex] = useState(null);
  const [eduForm, setEduForm] = useState({
    id: '',
    degree: '',
    institution: '',
    period: '',
    isCurrent: false,
    desc: '',
    courses: '',
    logo: '',
  });

  // Skills & narrative state
  const [editingSkillsList, setEditingSkillsList] = useState([]);
  const [editingAboutList, setEditingAboutList] = useState([]);
  const [metaRolesText, setMetaRolesText] = useState('');
  const [metaEmailText, setMetaEmailText] = useState('');

  // Custom skill logo upload modal state
  const [customSkillModal, setCustomSkillModal] = useState({
    isOpen: false,
    categoryIdx: null,
    name: '',
    logoUrl: '',
    logoPreview: '',
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

  function loadDashboardData(authToken = token) {
    const headers = { Authorization: `Bearer ${authToken}` };

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

    fetch('/api/portfolio-content')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.success && d.content) {
          setPortfolioContent(d.content);
          if (Array.isArray(d.content.skills)) {
            const cleaned = d.content.skills
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
          if (Array.isArray(d.content.about)) setEditingAboutList(d.content.about);
          if (d.content.meta) {
            setMetaRolesText(Array.isArray(d.content.meta.hero_roles) ? d.content.meta.hero_roles.join(', ') : '');
            setMetaEmailText(d.content.meta.email || 'sahilaw502@gmail.com');
          }
        }
      })
      .catch(console.error);
  }

  function handleLogin(e) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

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
        setAdminUser(data.admin);
        loadDashboardData(data.token);
      })
      .catch((err) => {
        setLoginError(err.message);
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

  // --- Portfolio Content Handlers (Real-time updates) ---
  function handleSavePortfolioSection(section, data) {
    setContentSaveMsg('');
    return fetch(`/api/admin/portfolio-content/${section}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) throw new Error(res.error || 'Failed to update section');
        setPortfolioContent((prev) => ({ ...prev, [section]: data }));
        setContentSaveMsg(`Saved ${section} in real time!`);
        setTimeout(() => setContentSaveMsg(''), 3500);

        // Notify other windows/components
        window.dispatchEvent(new CustomEvent('portfolio-content-updated', { detail: { [section]: data } }));
        try {
          const cached = JSON.parse(localStorage.getItem('portfolio_content_cache') || '{}');
          cached[section] = data;
          localStorage.setItem('portfolio_content_cache', JSON.stringify(cached));
        } catch {}
      })
      .catch((err) => alert('Save failed: ' + err.message));
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
      dataFolder.file('meta.json', JSON.stringify(portfolioContent.meta || {}, null, 2));
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

  function handleOpenAddExp() {
    setEditingExpIndex(null);
    setExpForm({
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      period: 'JUL 2026 - PRESENT',
      location: 'India',
      isCurrent: true,
      desc: '',
      skills: '',
      logo: '',
    });
    setShowExpModal(true);
  }

  function handleOpenEditExp(exp, index) {
    setEditingExpIndex(index);
    setExpForm({
      id: exp.id || `exp-${Date.now()}`,
      company: exp.company || '',
      role: exp.role || '',
      period: exp.period || '',
      location: exp.location || '',
      isCurrent: !!exp.isCurrent,
      desc: exp.desc || '',
      skills: Array.isArray(exp.skills) ? exp.skills.join(', ') : (exp.skills || ''),
      logo: typeof exp.logo === 'string' ? exp.logo : '',
    });
    setShowExpModal(true);
  }

  function handleSaveExp(e) {
    e.preventDefault();
    const skillsArray = expForm.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedItem = {
      id: expForm.id || `exp-${Date.now()}`,
      company: expForm.company.trim(),
      role: expForm.role.trim(),
      period: expForm.period.trim(),
      location: expForm.location.trim(),
      isCurrent: expForm.isCurrent,
      desc: expForm.desc.trim(),
      skills: skillsArray,
      logo: expForm.logo.trim(),
    };

    let updatedExperiences = [...(portfolioContent.experiences || [])];
    if (editingExpIndex !== null && editingExpIndex >= 0) {
      updatedExperiences[editingExpIndex] = updatedItem;
    } else {
      updatedExperiences.unshift(updatedItem);
    }

    handleSavePortfolioSection('experiences', updatedExperiences).then(() => {
      setShowExpModal(false);
    });
  }

  function handleDeleteExp(index) {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    const updated = (portfolioContent.experiences || []).filter((_, idx) => idx !== index);
    handleSavePortfolioSection('experiences', updated);
  }

  function handleOpenAddEdu() {
    setEditingEduIndex(null);
    setEduForm({
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      period: '2024 - 2028',
      isCurrent: true,
      desc: '',
      courses: '',
      logo: '',
    });
    setShowEduModal(true);
  }

  function handleOpenEditEdu(edu, index) {
    setEditingEduIndex(index);
    setEduForm({
      id: edu.id || `edu-${Date.now()}`,
      degree: edu.degree || '',
      institution: edu.institution || '',
      period: edu.period || '',
      isCurrent: !!edu.isCurrent,
      desc: edu.desc || '',
      courses: Array.isArray(edu.courses) ? edu.courses.join(', ') : (edu.courses || ''),
      logo: typeof edu.logo === 'string' ? edu.logo : '',
    });
    setShowEduModal(true);
  }

  function handleSaveEdu(e) {
    e.preventDefault();
    const coursesArray = eduForm.courses
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const updatedItem = {
      id: eduForm.id || `edu-${Date.now()}`,
      degree: eduForm.degree.trim(),
      institution: eduForm.institution.trim(),
      period: eduForm.period.trim(),
      isCurrent: eduForm.isCurrent,
      desc: eduForm.desc.trim(),
      courses: coursesArray,
      logo: eduForm.logo.trim(),
    };

    let updatedEducation = [...(portfolioContent.education || [])];
    if (editingEduIndex !== null && editingEduIndex >= 0) {
      updatedEducation[editingEduIndex] = updatedItem;
    } else {
      updatedEducation.unshift(updatedItem);
    }

    handleSavePortfolioSection('education', updatedEducation).then(() => {
      setShowEduModal(false);
    });
  }

  function handleDeleteEdu(index) {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;
    const updated = (portfolioContent.education || []).filter((_, idx) => idx !== index);
    handleSavePortfolioSection('education', updated);
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
    handleSavePortfolioSection('skills', cleaned);
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
    handleSavePortfolioSection('about', editingAboutList);
  }

  function handleAddAboutParagraph() {
    setEditingAboutList([...editingAboutList, 'New portfolio narrative paragraph...']);
  }

  function handleDeleteAboutParagraph(index) {
    const updated = editingAboutList.filter((_, idx) => idx !== index);
    setEditingAboutList(updated);
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
    const updatedMeta = {
      ...(portfolioContent.meta || {}),
      hero_roles: rolesArray,
      email: metaEmailText.trim() || 'sahilaw502@gmail.com',
    };
    handleSavePortfolioSection('meta', updatedMeta);
  }

  // --- Filter Knowledge Entries ---
  const filteredKnowledge = knowledge.filter((item) => {
    const matchesSearch =
      kbSearch === '' ||
      item.canonical_question.toLowerCase().includes(kbSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(kbSearch.toLowerCase());
    const matchesCategory = kbCategoryFilter === 'all' || item.category === kbCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(knowledge.map((k) => k.category)))];

  // If unauthenticated, show minimal clean login view (zero animation, pure black theme, no top header)
  if (!adminUser) {
    return (
      <div className="admin-viewport">
        <div className="admin-login-wrapper">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <h1 className="admin-login-title">ADMIN ACCESS</h1>
              <p className="admin-login-desc">
                AUTHENTICATION CONSOLE // PORTFOLIO ENGINE
              </p>
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
                className="admin-btn admin-btn-accent"
                style={{ marginTop: '10px', justifyContent: 'center', height: '42px', width: '100%', fontFamily: "'Disket Mono', monospace", letterSpacing: '0.08em' }}
                disabled={loginLoading}
              >
                {loginLoading ? 'AUTHENTICATING...' : 'ENTER CONSOLE'}
              </button>
            </form>

            <a href="#/" className="admin-login-return-link">
              ← Return to Portfolio
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
          <div>
            <div className="admin-brand-title" style={{ fontFamily: "'Disket Mono', monospace", fontSize: '13px', letterSpacing: '0.12em', color: '#ffffff' }}>
              SAHIL WANI // DETERMINISTIC ENGINE
            </div>
            <div className="admin-brand-sub" style={{ fontFamily: "'Disket Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.45)', marginTop: '2px' }}>
              RULE ENGINE // 0 LLM RUNTIME
            </div>
          </div>
        </div>

        <div className="admin-nav-actions">
          <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)', fontFamily: "'Disket Mono', monospace" }}>
            USER: <strong style={{ color: '#ffffff' }}>{adminUser.username}</strong>
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

      {/* Main Dashboard Layout */}
      <div className="admin-layout">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>Overview & Analytics</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'portfolio' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            <span>Portfolio Content</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'unanswered' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('unanswered')}
          >
            <span>Unanswered Questions</span>
            {newUnansweredCount > 0 && <span className="admin-tab-count">{newUnansweredCount}</span>}
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'knowledge' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('knowledge')}
          >
            <span>Knowledge Base</span>
            <span style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'monospace' }}>{knowledge.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'templates' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <span>Response Templates</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'sandbox' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('sandbox')}
          >
            <span>Match Preview Sandbox</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'conversations' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('conversations')}
          >
            <span>Conversations Log</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'settings' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span>Settings & Security</span>
          </button>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="admin-content">
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
                          <td style={{ fontFamily: 'monospace', color: '#10b981' }}>{q.frequency}x</td>
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
                  className={`portfolio-subtab-btn ${contentSubtab === 'education' ? 'is-active' : ''}`}
                  onClick={() => setContentSubtab('education')}
                >
                  Education & Colleges ({portfolioContent.education?.length || 0})
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
                  className={`portfolio-subtab-btn ${contentSubtab === 'meta' ? 'is-active' : ''}`}
                  onClick={() => setContentSubtab('meta')}
                >
                  Roles & Metadata
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
                                </div>
                                <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                                  {exp.role} &bull; <span style={{ fontFamily: "'Disket Mono', monospace", fontSize: '11px' }}>{exp.period}</span> &bull; {exp.location}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
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
                                </div>
                                <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                                  {edu.institution} &bull; <span style={{ fontFamily: "'Disket Mono', monospace", fontSize: '11px' }}>{edu.period}</span>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
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
                                });
                              }}
                            >
                              + Add Custom Skill (with Logo)
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
                          {renderAboutParagraphPreview(para)}
                        </div>
                      </div>
                    ))}
                  </div>
                </form>
              )}

              {/* SUBTAB 5: METADATA & ROLES */}
              {contentSubtab === 'meta' && (
                <form onSubmit={handleSaveMetaRoles}>
                  <div className="admin-card" style={{ maxWidth: '640px', padding: '24px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
                      Site Metadata & Rotating Roles
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
                      <span style={{ fontSize: '11.5px', color: '#9ca3af' }}>
                        These titles rotate automatically on the home page hero badge.
                      </span>
                    </div>

                    <div className="admin-field-group" style={{ marginBottom: '16px' }}>
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

                    <button type="submit" className="admin-btn admin-btn-accent" style={{ marginTop: '8px' }}>
                      Save Metadata to Live Site
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
                            <td style={{ fontFamily: 'monospace', color: '#10b981' }}>{u.count}x</td>
                            <td>
                              <span
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: '999px',
                                  fontSize: '11px',
                                  fontFamily: 'monospace',
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
                            <span style={{ color: item.is_active ? '#10b981' : '#9ca3af', fontSize: '12px', fontFamily: 'monospace' }}>
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
                      <div style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace' }}>
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
                              <td style={{ fontFamily: 'monospace' }}>{c.total_messages}</td>
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
                            <div style={{ fontSize: '11px', marginTop: '6px', opacity: 0.8, fontFamily: 'monospace' }}>
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
              >
                ✕
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

      {/* MODAL: ADD / EDIT WORK EXPERIENCE */}
      {showExpModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowExpModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
              {editingExpIndex !== null ? 'Edit Work Experience' : 'Add New Work Experience'}
            </div>

            <form onSubmit={handleSaveExp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="admin-field-label">Company Name</label>
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
                  <label className="admin-field-label">Role Title</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="admin-field-label">Period</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={expForm.period}
                    onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                    placeholder="e.g. JUL 2026 - PRESENT"
                    required
                  />
                </div>
                <div>
                  <label className="admin-field-label">Location</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={expForm.location}
                    onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                    placeholder="e.g. India / Remote"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={expForm.isCurrent}
                    onChange={(e) => setExpForm({ ...expForm, isCurrent: e.target.checked })}
                  />
                  <span>Currently Active Role (displays NOW badge)</span>
                </label>
              </div>

              <div>
                <label className="admin-field-label">Company Logo (Image URL or Link)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={expForm.logo}
                    onChange={(e) => setExpForm({ ...expForm, logo: e.target.value })}
                    placeholder="https://... or /images/company.png"
                    style={{ flex: 1 }}
                  />
                  {expForm.logo && (
                    <div className="portfolio-logo-thumb">
                      <img src={expForm.logo} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
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

              <div>
                <label className="admin-field-label">Description & Contributions</label>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={expForm.desc}
                  onChange={(e) => setExpForm({ ...expForm, desc: e.target.value })}
                  placeholder="Detail your engineering contributions, key features, and impact..."
                  required
                />
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
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
              {editingEduIndex !== null ? 'Edit Education Milestone' : 'Add Education Milestone'}
            </div>

            <form onSubmit={handleSaveEdu} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="admin-field-label">Degree / Program</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={eduForm.degree}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                    placeholder="e.g. B.Tech, Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="admin-field-label">Institution / College Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={eduForm.institution}
                    onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                    placeholder="e.g. GCET Jammu"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="admin-field-label">Period</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={eduForm.period}
                    onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                    placeholder="e.g. 2024 - 2028"
                    required
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '22px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={eduForm.isCurrent}
                      onChange={(e) => setEduForm({ ...eduForm, isCurrent: e.target.checked })}
                    />
                    <span>Active Student (NOW badge)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="admin-field-label">College Logo (Image URL or Link)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={eduForm.logo}
                    onChange={(e) => setEduForm({ ...eduForm, logo: e.target.value })}
                    placeholder="https://... or /images/college.png"
                    style={{ flex: 1 }}
                  />
                  {eduForm.logo && (
                    <div className="portfolio-logo-thumb">
                      <img src={eduForm.logo} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="admin-field-label">Key Coursework (Comma-Separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={eduForm.courses}
                  onChange={(e) => setEduForm({ ...eduForm, courses: e.target.value })}
                  placeholder="Artificial Intelligence, DSA, Database Systems, Computer Networks"
                />
              </div>

              <div>
                <label className="admin-field-label">Description & Overview</label>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={eduForm.desc}
                  onChange={(e) => setEduForm({ ...eduForm, desc: e.target.value })}
                  placeholder="Summary of academic focus, projects, and coursework..."
                  required
                />
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
      {/* MODAL: ADD CUSTOM SKILL WITH LOGO */}
      {customSkillModal.isOpen && (
        <div className="admin-modal-backdrop" onClick={() => setCustomSkillModal({ ...customSkillModal, isOpen: false })}>
          <div className="admin-modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px' }}>
              Add Custom Skill & Logo
            </div>

            <form onSubmit={handleAddCustomSkillSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="admin-field-label">Skill Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={customSkillModal.name}
                  onChange={(e) => setCustomSkillModal({ ...customSkillModal, name: e.target.value })}
                  placeholder="e.g. PyTorch, Unreal Engine, LangChain"
                  required
                  autoFocus
                />
              </div>

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
                  {(customSkillModal.logoPreview || customSkillModal.logoUrl) && (
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={customSkillModal.logoPreview || customSkillModal.logoUrl}
                        alt="Logo preview"
                        style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginBottom: '4px' }}>
                  Or paste a logo Image URL:
                </div>
                <input
                  type="text"
                  className="admin-input"
                  value={customSkillModal.logoUrl}
                  onChange={(e) => setCustomSkillModal({ ...customSkillModal, logoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

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
      )}
    </div>
  );
}

