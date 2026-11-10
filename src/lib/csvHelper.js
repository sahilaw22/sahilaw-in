/**
 * RFC 4180 Compliant CSV Parser and Serializer
 * Handles quoted fields, escaped commas, escaped quotes (""), and multiline text.
 */

export function parseCSV(text) {
  if (!text || typeof text !== 'string') return [];
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \r\n
      }
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.length > 0 && currentRow.some((f) => f.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((f) => f.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => h.trim());
  const records = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const record = {};
    for (let c = 0; c < headers.length; c++) {
      record[headers[c]] = row[c] !== undefined ? row[c].trim() : '';
    }
    records.push(record);
  }

  return records;
}

export function serializeCSV(headers, records) {
  if (!Array.isArray(headers) || !Array.isArray(records)) return '';

  const escapeField = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const headerRow = headers.map((h) => escapeField(h)).join(',');
  const dataRows = records.map((record) => {
    return headers.map((h) => escapeField(record[h] || '')).join(',');
  });

  return [headerRow, ...dataRows].join('\n') + '\n';
}

/**
 * Convert resume data object into modular CSV strings.
 */
export function resumeDataToModularCSVs(resume) {
  // 1. Profile CSV
  const profileHeaders = ['name', 'title', 'location', 'email', 'linkedin', 'github', 'summary', 'skills'];
  const profileRecords = [
    {
      name: resume.name || '',
      title: resume.title || '',
      location: resume.location || '',
      email: resume.email || '',
      linkedin: resume.linkedin || '',
      github: resume.github || '',
      summary: resume.summary || '',
      skills: resume.skills || '',
    },
  ];

  // 2. Experience CSV
  const experienceHeaders = ['id', 'role', 'company', 'location', 'period', 'description', 'bullets'];
  const experienceRecords = [];
  if (typeof resume.experience === 'string') {
    const blocks = resume.experience.split('\n\n').filter(Boolean);
    blocks.forEach((b, idx) => {
      const lines = b.split('\n').filter(Boolean);
      const headerParts = lines[0]?.includes('|') ? lines[0].split('|').map((s) => s.trim()) : [lines[0]];
      const bullets = lines.slice(1).map((l) => l.replace(/^[-•*]\s*/, '').trim()).join('|');
      experienceRecords.push({
        id: `exp-${idx + 1}`,
        role: headerParts[0] || '',
        company: headerParts[1] || '',
        location: headerParts[2] || '',
        period: headerParts[3] || '',
        description: '',
        bullets,
      });
    });
  }

  // 3. Projects CSV
  const projectsHeaders = ['id', 'title', 'tech', 'period', 'description', 'bullets'];
  const projectsRecords = [];
  if (typeof resume.projects === 'string') {
    const blocks = resume.projects.split('\n\n').filter(Boolean);
    blocks.forEach((b, idx) => {
      const lines = b.split('\n').filter(Boolean);
      const headerParts = lines[0]?.includes('|') ? lines[0].split('|').map((s) => s.trim()) : [lines[0]];
      const bullets = lines.slice(1).map((l) => l.replace(/^[-•*]\s*/, '').trim()).join('|');
      projectsRecords.push({
        id: `proj-${idx + 1}`,
        title: headerParts[0] || '',
        tech: headerParts[1] || '',
        period: headerParts[2] || '',
        description: '',
        bullets,
      });
    });
  }

  // 4. Education CSV
  const educationHeaders = ['id', 'degree', 'institution', 'period', 'location', 'description'];
  const educationRecords = [];
  if (typeof resume.education === 'string') {
    const lines = resume.education.split('\n').filter(Boolean);
    lines.forEach((l, idx) => {
      const parts = l.includes('|') ? l.split('|').map((s) => s.trim()) : [l];
      educationRecords.push({
        id: `edu-${idx + 1}`,
        degree: parts[0] || '',
        institution: parts[1] || '',
        period: parts[2] || '',
        location: parts[3] || '',
        description: '',
      });
    });
  }

  // 5. Certifications CSV
  const certHeaders = ['id', 'title', 'issuer', 'date', 'url'];
  const certRecords = [];
  if (typeof resume.certifications === 'string') {
    const lines = resume.certifications.split('\n').filter(Boolean);
    lines.forEach((l, idx) => {
      const parts = l.includes('|') ? l.split('|').map((s) => s.trim()) : [l];
      certRecords.push({
        id: `cert-${idx + 1}`,
        title: parts[0] || '',
        issuer: parts[1] || '',
        date: parts[2] || '',
        url: parts[3] || '',
      });
    });
  }

  return {
    profileCSV: serializeCSV(profileHeaders, profileRecords),
    experienceCSV: serializeCSV(experienceHeaders, experienceRecords),
    projectsCSV: serializeCSV(projectsHeaders, projectsRecords),
    educationCSV: serializeCSV(educationHeaders, educationRecords),
    certificationsCSV: serializeCSV(certHeaders, certRecords),
  };
}

/**
 * Reconstruct resume object from modular parsed CSV records.
 */
export function modularCSVRecordsToResume(profileRecords, expRecords, projRecords, eduRecords, certRecords) {
  const p = profileRecords[0] || {};

  const expString = expRecords
    .map((e) => {
      const header = [e.role, e.company, e.location, e.period].filter(Boolean).join(' | ');
      const bullets = (e.bullets || '')
        .split('|')
        .filter(Boolean)
        .map((b) => `- ${b}`)
        .join('\n');
      return bullets ? `${header}\n${bullets}` : header;
    })
    .join('\n\n');

  const projString = projRecords
    .map((pr) => {
      const header = [pr.title, pr.tech, pr.period].filter(Boolean).join(' | ');
      const bullets = (pr.bullets || '')
        .split('|')
        .filter(Boolean)
        .map((b) => `- ${b}`)
        .join('\n');
      return bullets ? `${header}\n${bullets}` : header;
    })
    .join('\n\n');

  const eduString = eduRecords
    .map((ed) => [ed.degree, ed.institution, ed.period, ed.location].filter(Boolean).join(' | '))
    .join('\n');

  const certString = certRecords
    .map((c) => [c.title, c.issuer, c.date, c.url].filter(Boolean).join(' | '))
    .join('\n');

  return {
    name: p.name || 'Sahil Ahmed Wani',
    title: p.title || 'Creative Frontend AI Engineer',
    location: p.location || 'Srinagar, India',
    email: p.email || 'sahilaw502@gmail.com',
    linkedin: p.linkedin || 'linkedin.com/in/sahil-a-057a0231a',
    github: p.github || 'github.com/sahilaw22',
    summary: p.summary || '',
    skills: p.skills || '',
    experience: expString,
    projects: projString,
    education: eduString,
    certifications: certString,
  };
}

