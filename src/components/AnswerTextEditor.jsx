import React, { useRef } from 'react';
import MarkdownContent from './MarkdownContent.jsx';
import './AnswerTextEditor.css';

const QUICK_SYMBOLS = ['>', '•', '→', '✓', '›', '—', '|'];

export default function AnswerTextEditor({
  value = '',
  onChange,
  placeholder = 'Write answer content...',
  rows = 5,
  label = 'Answer Content',
  showPreview = true,
}) {
  const textareaRef = useRef(null);

  // Helper to wrap selected text or insert markers
  function wrapSelection(prefix, suffix = '') {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;
    const selected = current.slice(start, end);

    let nextValue = '';
    let newCursorPos = 0;

    if (selected) {
      nextValue = current.slice(0, start) + prefix + selected + suffix + current.slice(end);
      newCursorPos = start + prefix.length + selected.length + suffix.length;
    } else {
      nextValue = current.slice(0, start) + prefix + suffix + current.slice(end);
      newCursorPos = start + prefix.length;
    }

    onChange(nextValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  // Helper to insert symbols or text at cursor
  function insertAtCursor(textToInsert) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;

    const nextValue = current.slice(0, start) + textToInsert + current.slice(end);
    const newCursorPos = start + textToInsert.length;

    onChange(nextValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  // Helper to prefix lines (e.g. for numbered lists, bullet lists, blockquotes)
  function prefixLines(prefix, isNumbered = false) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;

    // Expand selection to include full lines
    const lineStart = current.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = current.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = current.length;

    const selectedLines = current.slice(lineStart, lineEnd).split('\n');

    let counter = 1;
    const transformedLines = selectedLines.map((line) => {
      if (isNumbered) {
        const item = `${counter}. ${line.replace(/^\d+\.\s*/, '')}`;
        counter += 1;
        return item;
      }
      return `${prefix}${line.replace(/^([>*•✓→›-]\s*)/, '')}`;
    });

    const nextValue =
      current.slice(0, lineStart) +
      transformedLines.join('\n') +
      current.slice(lineEnd);

    onChange(nextValue);

    setTimeout(() => {
      textarea.focus();
      const newEnd = lineStart + transformedLines.join('\n').length;
      textarea.setSelectionRange(lineStart, newEnd);
    }, 0);
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      wrapSelection('**', '**');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      wrapSelection('*', '*');
    }
  }

  return (
    <div className="answer-editor-wrapper">
      {label && <label className="answer-editor-label">{label}</label>}

      {/* Editor Formatting Toolbar */}
      <div className="answer-editor-toolbar" role="toolbar" aria-label="Formatting options">
        <div className="editor-tool-group">
          <button
            type="button"
            className="editor-tool-btn"
            title="Bold (Ctrl+B)"
            onClick={() => wrapSelection('**', '**')}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="editor-tool-btn"
            title="Italic (Ctrl+I)"
            onClick={() => wrapSelection('*', '*')}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className="editor-tool-btn"
            title="Inline Code"
            onClick={() => wrapSelection('`', '`')}
          >
            &lt;/&gt;
          </button>
        </div>

        <div className="editor-tool-separator" />

        <div className="editor-tool-group">
          <button
            type="button"
            className="editor-tool-btn"
            title="Numbered List"
            onClick={() => prefixLines('1. ', true)}
          >
            1. List
          </button>
          <button
            type="button"
            className="editor-tool-btn"
            title="Bullet List (- item)"
            onClick={() => prefixLines('- ')}
          >
            &bull; List
          </button>
          <button
            type="button"
            className="editor-tool-btn"
            title="Blockquote / Callout (> quote)"
            onClick={() => prefixLines('> ')}
          >
            &gt; Quote
          </button>
          <button
            type="button"
            className="editor-tool-btn"
            title="Markdown Link [Title](url)"
            onClick={() => wrapSelection('[Link Text](', '#/projects)')}
          >
            [Link]
          </button>
        </div>

        <div className="editor-tool-separator" />

        {/* Quick Symbols Palette */}
        <div className="editor-symbols-group">
          <span className="editor-symbols-label">Symbols:</span>
          {QUICK_SYMBOLS.map((sym) => (
            <button
              key={sym}
              type="button"
              className="editor-symbol-btn"
              title={`Insert ${sym}`}
              onClick={() => insertAtCursor(`${sym} `)}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <textarea
        ref={textareaRef}
        className="admin-textarea answer-editor-textarea"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required
      />

      {/* Live Markdown Preview */}
      {showPreview && value && (
        <div className="answer-editor-preview">
          <div className="answer-preview-header">
            <span>LIVE MARKDOWN PREVIEW</span>
          </div>
          <div className="answer-preview-body">
            <MarkdownContent text={value} />
          </div>
        </div>
      )}
    </div>
  );
}

