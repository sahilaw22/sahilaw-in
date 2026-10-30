import { useEffect, useRef, useState } from 'react';

const initialResume = {
  name: 'Sahil Ahmed Wani',
  title: 'Creative Frontend AI Engineer',
  location: 'Srinagar, India',
  email: 'sahilwani.work@gmail.com',
  linkedin: 'linkedin.com/in/sahilaw',
  github: 'github.com/sahilaw22',
  summary: 'Frontend AI Engineer focused on building accessible, high-performance interfaces and practical AI-powered products. Skilled at turning complex ideas into clear user experiences with React, JavaScript, and modern web technologies.',
  skills: 'React, JavaScript, TypeScript, HTML, CSS, Node.js, REST APIs, Git, Responsive Design, Accessibility, AI Integrations',
  experience: 'Frontend Developer | Company Name | City, Country | 2023 - Present\n- Built responsive React interfaces used by customers across web and mobile breakpoints.\n- Improved usability and performance through reusable components, semantic HTML, and measured UI improvements.\n- Collaborated with design and engineering teams to ship reliable product experiences.',
  projects: 'Sahil Portfolio | React, GSAP, Web Audio API\n- Built a high-performance interactive portfolio with fluid animations and custom sound synthesis.\n- Hand-crafted microinteractions, draggable physics cards, and responsive UI components.\n\nConnectKit Theme & Web3 UI | React, TypeScript, Figma\n- Designed and built modular wallet connection flows and state management interfaces.',
  education: 'Bachelor of Technology in Computer Science | University Name | 2021 - 2025',
  certifications: 'Modern React & AI Integrations | Coursera / DeepLearning.AI | 2025',
};

function Field({ label, value, onChange, multiline = false }) {
  const Input = multiline ? 'textarea' : 'input';
  return (
    <label className="resume-field">
      <span>{label}</span>
      <Input value={value} onChange={(event) => onChange(event.target.value)} rows={multiline ? 7 : undefined} />
    </label>
  );
}

function ResumeSection({ title, children }) {
  return (
    <section className="resume-preview-section">
      <h2>{title}</h2>
      <div className="resume-preview-content">{children}</div>
    </section>
  );
}


function FormattedSectionContent({ value }) {
  if (!value) return null;
  const blocks = value.split('\n\n').filter(Boolean);

  return (
    <div className="resume-section-body">
      {blocks.map((block, bIdx) => {
        const lines = block.split('\n').filter(Boolean);
        if (lines.length === 0) return null;

        const firstLine = lines[0];
        const headerParts = firstLine.includes('|') ? firstLine.split('|').map(s => s.trim()) : null;
        const bulletLines = headerParts ? lines.slice(1) : lines;

        return (
          <div key={bIdx} className="resume-entry-block">
            {headerParts ? (
              <div className="resume-entry-header">
                <div className="resume-entry-main">
                  <span className="resume-entry-role">{headerParts[0]}</span>
                  {headerParts[1] && (
                    <span className="resume-entry-company">
                      {' — '}{headerParts[1]}
                      {headerParts[2] && headerParts.length > 3 ? ` · ${headerParts[2]}` : ''}
                    </span>
                  )}
                </div>
                {headerParts.length >= 3 && (
                  <span className="resume-entry-date">
                    {headerParts[headerParts.length - 1]}
                  </span>
                )}
              </div>
            ) : null}

            {bulletLines.length > 0 && (
              <ul className="resume-entry-list">
                {bulletLines.map((line, lIdx) => {
                  const cleanText = line.replace(/^[-•*]\s*/, '');
                  return <li key={lIdx}>{cleanText}</li>;
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Lines({ value }) {
  if (!value) return null;
  const lines = value.split('\n');
  return lines.map((line, index) => {
    if (/^[-•*]\s+/.test(line)) {
      return (
        <ul key={`${line}-${index}`} className="resume-entry-list">
          <li>{line.replace(/^[-•*]\s+/, '')}</li>
        </ul>
      );
    }
    return <p key={`${line}-${index}`}>{line || '\u00a0'}</p>;
  });
}

export default function ResumePage() {
  const [resume, setResume] = useState(initialResume);
  const [savedHtml, setSavedHtml] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertUnorderedList: false,
    insertOrderedList: false,
  });

  const resumeRef = useRef(null);
  const toolbarRef = useRef(null);
  const backupHtmlRef = useRef(null);
  const savedSelectionRef = useRef(null);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  // Update active formatting states for current selection
  const updateActiveFormats = () => {
    if (!isEditing) return;
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
      });
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!isEditing) return;
    const handleSelectionUpdate = () => {
      saveCurrentSelection();
      updateActiveFormats();
    };

    document.addEventListener('selectionchange', handleSelectionUpdate);
    document.addEventListener('keyup', handleSelectionUpdate);
    document.addEventListener('mouseup', handleSelectionUpdate);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionUpdate);
      document.removeEventListener('keyup', handleSelectionUpdate);
      document.removeEventListener('mouseup', handleSelectionUpdate);
    };
  }, [isEditing]);

  // Auto close editor when clicking outside resume & toolbar, and revert unfinalized edits
  useEffect(() => {
    if (!isEditing) return;

    const handleOutsideClick = (event) => {
      if (
        (resumeRef.current && resumeRef.current.contains(event.target)) ||
        (toolbarRef.current && toolbarRef.current.contains(event.target))
      ) {
        return;
      }

      // Revert changes back to backup because Done was not clicked
      if (backupHtmlRef.current && resumeRef.current) {
        resumeRef.current.innerHTML = backupHtmlRef.current;
      }
      setIsEditing(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isEditing]);

  function handleNameClick(e) {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 5 || e?.detail >= 5) {
      if (resumeRef.current) {
        backupHtmlRef.current = resumeRef.current.innerHTML;
      }
      setIsEditing(true);
      clickCountRef.current = 0;
      setTimeout(() => {
        if (resumeRef.current) {
          resumeRef.current.focus();
        }
      }, 50);
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1600);
    }
  }

  function handleSaveDone() {
    // Only finalize and persist changes when Done button is explicitly clicked
    if (resumeRef.current) {
      const finalized = resumeRef.current.innerHTML;
      backupHtmlRef.current = finalized;
      setSavedHtml(finalized);
    }
    setIsEditing(false);
  }

  function saveCurrentSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (resumeRef.current && (resumeRef.current === range.commonAncestorContainer || resumeRef.current.contains(range.commonAncestorContainer))) {
        savedSelectionRef.current = range.cloneRange();
      }
    }
  }

  function restoreCurrentSelection() {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  }

  function executeFormat(command, value = null) {
    restoreCurrentSelection();
    try {
      document.execCommand(command, false, value);
    } catch {
      // ignore
    }
    saveCurrentSelection();
    updateActiveFormats();
  }

  function updateField(field, value) {
    setResume((current) => ({ ...current, [field]: value }));
  }

  function handleDownloadPdf() {
    const originalTitle = document.title;
    document.title = `${(resume.name || 'Resume').trim().replace(/\s+/g, '_')}_Resume`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  }

  return (
    <main className="resume-page">
      <div className="resume-toolbar">
        <div>
          <p className="resume-eyebrow">Resume builder</p>
          <h1>ATS-friendly resume</h1>
          <p>Edit the fields and print or save the finished resume as a PDF.</p>
        </div>
        <button type="button" className="resume-print-button" onClick={handleDownloadPdf}>
          Print / Save PDF
        </button>
      </div>

      <div className="resume-workspace">
        <form className="resume-editor" onSubmit={(event) => event.preventDefault()}>
          <h2>Edit content</h2>
          <Field label="Full name" value={resume.name} onChange={(value) => updateField('name', value)} />
          <Field label="Target role" value={resume.title} onChange={(value) => updateField('title', value)} />
          <Field label="Location" value={resume.location} onChange={(value) => updateField('location', value)} />
          <Field label="Email" value={resume.email} onChange={(value) => updateField('email', value)} />
          <Field label="LinkedIn" value={resume.linkedin} onChange={(value) => updateField('linkedin', value)} />
          <Field label="GitHub" value={resume.github} onChange={(value) => updateField('github', value)} />
          <Field label="Professional summary" value={resume.summary} onChange={(value) => updateField('summary', value)} multiline />
          <Field label="Skills (comma separated)" value={resume.skills} onChange={(value) => updateField('skills', value)} multiline />
          <Field label="Experience" value={resume.experience} onChange={(value) => updateField('experience', value)} multiline />
          <Field label="Projects" value={resume.projects} onChange={(value) => updateField('projects', value)} multiline />
          <Field label="Education" value={resume.education} onChange={(value) => updateField('education', value)} multiline />
          <Field label="Certifications" value={resume.certifications} onChange={(value) => updateField('certifications', value)} multiline />
        </form>

        {/* Floating Edit Toolbar when editing is active */}
        {isEditing && (
          <div ref={toolbarRef} className="resume-edit-toolbar" role="toolbar" aria-label="Formatting tools">
            <div className="resume-tool-group">
              <button
                type="button"
                className={`resume-tool-btn ${activeFormats.bold ? 'is-active' : ''}`}
                title="Bold (Ctrl+B)"
                onMouseDown={(e) => { e.preventDefault(); saveCurrentSelection(); }}
                onClick={() => executeFormat('bold')}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 12h9a4 4 0 0 1 0 8H6v-8zm0 0h8a3.5 3.5 0 0 0 0-7H6v7z" />
                </svg>
              </button>

              <button
                type="button"
                className={`resume-tool-btn ${activeFormats.italic ? 'is-active' : ''}`}
                title="Italic (Ctrl+I)"
                onMouseDown={(e) => { e.preventDefault(); saveCurrentSelection(); }}
                onClick={() => executeFormat('italic')}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="4" x2="10" y2="4" />
                  <line x1="14" y1="20" x2="5" y2="20" />
                  <line x1="15" y1="4" x2="9" y2="20" />
                </svg>
              </button>

              <button
                type="button"
                className={`resume-tool-btn ${activeFormats.underline ? 'is-active' : ''}`}
                title="Underline (Ctrl+U)"
                onMouseDown={(e) => { e.preventDefault(); saveCurrentSelection(); }}
                onClick={() => executeFormat('underline')}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3v7a6 6 0 0 0 12 0V3" />
                  <line x1="4" y1="21" x2="20" y2="21" />
                </svg>
              </button>

              <button
                type="button"
                className={`resume-tool-btn ${activeFormats.strikeThrough ? 'is-active' : ''}`}
                title="Strikethrough"
                onMouseDown={(e) => { e.preventDefault(); saveCurrentSelection(); }}
                onClick={() => executeFormat('strikeThrough')}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4H9a3 3 0 0 0-2.83 4" />
                  <path d="M14 12a4 4 0 0 1 0 8H6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                </svg>
              </button>
            </div>

            <div className="resume-tool-divider" />

            <div className="resume-tool-group">
              <button
                type="button"
                className={`resume-tool-btn ${activeFormats.insertUnorderedList ? 'is-active' : ''}`}
                title="Bullet List"
                onMouseDown={(e) => { e.preventDefault(); saveCurrentSelection(); }}
                onClick={() => executeFormat('insertUnorderedList')}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>

              <button
                type="button"
                className={`resume-tool-btn ${activeFormats.insertOrderedList ? 'is-active' : ''}`}
                title="Numbered List"
                onMouseDown={(e) => { e.preventDefault(); saveCurrentSelection(); }}
                onClick={() => executeFormat('insertOrderedList')}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="10" y1="6" x2="21" y2="6" />
                  <line x1="10" y1="12" x2="21" y2="12" />
                  <line x1="10" y1="18" x2="21" y2="18" />
                  <path d="M4 6h1v4" />
                  <path d="M4 10h2" />
                  <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                </svg>
              </button>
            </div>

            <div className="resume-tool-divider" />

            <div className="resume-tool-group">
              <button
                type="button"
                className="resume-tool-btn"
                title="Undo (Ctrl+Z)"
                onMouseDown={(e) => { e.preventDefault(); saveCurrentSelection(); }}
                onClick={() => executeFormat('undo')}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7v6h6" />
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                </svg>
              </button>

              <button
                type="button"
                className="resume-tool-btn"
                title="Redo (Ctrl+Y)"
                onMouseDown={(e) => { e.preventDefault(); saveCurrentSelection(); }}
                onClick={() => executeFormat('redo')}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 7v6h-6" />
                  <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
                </svg>
              </button>
            </div>

            <div className="resume-tool-actions">
              <button
                type="button"
                className="resume-tool-done-btn"
                onClick={handleSaveDone}
                title="Save and apply all changes"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Done</span>
              </button>
            </div>
          </div>
        )}

        
        {savedHtml ? (
          <article
            ref={resumeRef}
            className={`resume-preview${isEditing ? ' is-editing' : ''}`}
            aria-label="Resume preview"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onMouseUp={saveCurrentSelection}
            onKeyUp={saveCurrentSelection}
            onClick={(e) => {
              const downloadBtn = e.target.closest('.resume-download-action button, .resume-download-btn');
              if (downloadBtn) {
                handleDownloadPdf();
                return;
              }
              if (!isEditing) {
                const h1 = e.target.closest('h1');
                if (h1) {
                  handleNameClick(e);
                }
              }
            }}
            dangerouslySetInnerHTML={{ __html: savedHtml }}
          />
        ) : (
          <article
            ref={resumeRef}
            className={`resume-preview${isEditing ? ' is-editing' : ''}`}
            aria-label="Resume preview"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onMouseUp={saveCurrentSelection}
            onKeyUp={saveCurrentSelection}
            onClick={(e) => {
              const downloadBtn = e.target.closest('.resume-download-action button, .resume-download-btn');
              if (downloadBtn) {
                handleDownloadPdf();
                return;
              }
              if (!isEditing) {
                const h1 = e.target.closest('h1');
                if (h1) {
                  handleNameClick(e);
                }
              }
            }}
          >
            <header className="resume-preview-header">
              <h1 onClick={handleNameClick} title="Click 5 times on your name to edit the resume">
                {resume.name || 'Your Name'}
              </h1>
              <p className="resume-preview-title">{resume.title}</p>
              
              {/* Contact row with exact Lucide icons */}
              <div className="resume-contact-row">
                <div className="resume-contact-subrow">
                  {resume.location && (
                  <span className="resume-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin">
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{resume.location}</span>
                  </span>
                )}

                {resume.email && (
                  <a href={`mailto:${resume.email}`} className="resume-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>{resume.email}</span>
                  </a>
                )}
                </div>
                <div className="resume-contact-subrow">
                  {resume.linkedin && (
                  <a href={`https://${resume.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="resume-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin-icon lucide-linkedin">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span>{resume.linkedin}</span>
                  </a>
                )}

                {resume.github && (
                  <a href={`https://${resume.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="resume-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github-icon lucide-github">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                    <span>{resume.github}</span>
                  </a>
                )}
                </div>
              </div>
            </header>

            <ResumeSection title="Professional Summary"><p>{resume.summary}</p></ResumeSection>
            <ResumeSection title="Skills"><p>{resume.skills}</p></ResumeSection>
            <ResumeSection title="Professional Experience"><FormattedSectionContent value={resume.experience} /></ResumeSection>
            <ResumeSection title="Projects"><FormattedSectionContent value={resume.projects} /></ResumeSection>
            <ResumeSection title="Education"><FormattedSectionContent value={resume.education} /></ResumeSection>
            <ResumeSection title="Certifications"><Lines value={resume.certifications} /></ResumeSection>
            
            <div className="resume-download-action" contentEditable="false">
              <button
                type="button"
                onClick={handleDownloadPdf}
                aria-label="Grab my resume as PDF"
                className="resume-download-btn"
              >
                <span className="resume-download-text">Grab My Resume</span>
                <span className="resume-download-arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </button>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}