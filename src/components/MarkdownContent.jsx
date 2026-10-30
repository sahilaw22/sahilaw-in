import React from 'react';
import { openGmailDirect } from '../lib/emailHelper.js';
import './MarkdownContent.css';

function getLinkMetadata(url, label) {
  const target = (url + ' ' + label).toLowerCase();

  if (target.includes('github')) {
    return {
      type: 'is-github',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
      isExternal: true,
    };
  }

  if (target.includes('linkedin')) {
    return {
      type: 'is-linkedin',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      isExternal: true,
    };
  }

  if (target.includes('mail') || target.includes('@')) {
    let emailAddr = url.replace(/^mailto:/, '').split('?')[0];
    if (!emailAddr || !emailAddr.includes('@')) {
      emailAddr = 'sahilaw502@gmail.com';
    }
    return {
      type: 'is-email',
      emailAddr,
      resolvedUrl: `mailto:${emailAddr}`,
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
      isExternal: true,
    };
  }

  if (target.includes('project') || target.includes('synth') || target.includes('app')) {
    return {
      type: 'is-project',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
        </svg>
      ),
      isExternal: url.startsWith('http'),
    };
  }

  if (target.includes('resume') || target.includes('career') || target.includes('doc')) {
    return {
      type: 'is-resume',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
        </svg>
      ),
      isExternal: url.startsWith('http'),
    };
  }

  return {
    type: 'is-link',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    ),
    isExternal: url.startsWith('http'),
  };
}

/**
 * Parses inline formatting: **bold**, *italic*, `code`, [label](url)
 */
function parseInlineMarkdown(text) {
  if (!text) return null;

  // Pattern matches: [link](url) | **bold** | *italic* | `code`
  const tokenRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;
  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // [Label](url)
      const label = match[1];
      const url = match[2];
      const meta = getLinkMetadata(url, label);

      elements.push(
        <a
          key={`lnk-${match.index}`}
          href={meta.resolvedUrl || url}
          target={meta.isExternal ? '_blank' : '_self'}
          rel={meta.isExternal ? 'noreferrer noopener' : undefined}
          className={`markdown-inline-link ${meta.type}`}
          onClick={(e) => {
            if (meta.type === 'is-email') {
              e.preventDefault();
              openGmailDirect(meta.emailAddr || 'sahilaw502@gmail.com');
            }
          }}
        >
          {meta.icon}
          <span>{label}</span>
        </a>
      );
    } else if (match[3]) {
      // **bold**
      elements.push(
        <strong key={`b-${match.index}`} className="markdown-bold">
          {match[3]}
        </strong>
      );
    } else if (match[4]) {
      // *italic*
      elements.push(
        <em key={`i-${match.index}`} className="markdown-italic">
          {match[4]}
        </em>
      );
    } else if (match[5]) {
      // `code`
      elements.push(
        <code key={`c-${match.index}`} className="markdown-code">
          {match[5]}
        </code>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
}

/**
 * Clean Markdown Renderer
 * Structures responses with support for paragraphs, ordered/unordered lists,
 * blockquotes (>), symbols, and inline links without exposing raw markdown syntax.
 */
export default function MarkdownContent({ text, maxParagraphs, className = '' }) {
  if (!text) return null;

  // Split on double newlines
  const rawBlocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  let blocks = rawBlocks;
  if (maxParagraphs && rawBlocks.length > maxParagraphs) {
    const hasListOrQuote = rawBlocks.some((b) => /^\s*(\d+\.|[-*•✓→›]|>)\s+/m.test(b));
    if (!hasListOrQuote) {
      const first = rawBlocks[0];
      const rest = rawBlocks.slice(1).join(' ');
      blocks = [first, rest];
    }
  }

  return (
    <div className={`markdown-content ${className}`}>
      {blocks.map((block, idx) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);

        // Check if blockquote (> quote)
        if (lines.length > 0 && lines.every((l) => l.startsWith('>'))) {
          const quoteText = lines.map((l) => l.replace(/^>\s*/, '')).join(' ');
          return (
            <blockquote key={idx} className="markdown-blockquote">
              {parseInlineMarkdown(quoteText)}
            </blockquote>
          );
        }

        // Check if ordered list (1. item, 2. item)
        if (lines.length >= 1 && lines.every((l) => /^\d+\.\s+/.test(l))) {
          return (
            <ol key={idx} className="markdown-ol">
              {lines.map((l, lIdx) => {
                const itemText = l.replace(/^\d+\.\s+/, '');
                return (
                  <li key={lIdx} className="markdown-li">
                    {parseInlineMarkdown(itemText)}
                  </li>
                );
              })}
            </ol>
          );
        }

        // Check if unordered list (- item, * item, • item, ✓ item, → item, › item)
        if (lines.length >= 1 && lines.every((l) => /^[-*•✓→›]\s+/.test(l))) {
          return (
            <ul key={idx} className="markdown-ul">
              {lines.map((l, lIdx) => {
                const itemText = l.replace(/^[-*•✓→›]\s+/, '');
                return (
                  <li key={lIdx} className="markdown-li">
                    {parseInlineMarkdown(itemText)}
                  </li>
                );
              })}
            </ul>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="markdown-paragraph">
            {parseInlineMarkdown(block)}
          </p>
        );
      })}
    </div>
  );
}

