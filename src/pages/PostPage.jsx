import { useState } from 'react';
import { blogPosts } from '../data/blog.js';

// Single blog post view
export default function PostPage({ slug, sound }) {
  const post = blogPosts.find((p) => p.slug === slug);
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  function handleCopy() {
    const text = document.querySelector('.article-body')?.innerText || '';
    navigator.clipboard.writeText(text).then(() => {
      sound.play('click');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div id="view-post" className="app-view active">
      <button className="custom-back-btn" onClick={() => { sound.play('close'); window.location.hash = '#/blog'; }}>
        <svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.000488281 4.49707L6.40403 0.801753L6.40403 -2.36448e-05L0.000488246 3.6943L0.000488281 4.49707Z" fill="currentColor" />
          <path d="M6.40354 9L6.40354 8.19822L-1.96673e-07 4.50291L-1.61609e-07 5.30468L6.40354 9Z" fill="currentColor" />
        </svg>
        Return to Blog
      </button>

      <div className="subpage-container">
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
        <div className="article-downloads">
          <button onClick={handleCopy}>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.26953 9.88965H0.364702L3.80398 0.435103H4.72727L8.16655 9.88965H7.26172L4.29794 1.55691H4.23331L1.26953 9.88965Z" fill="currentColor" />
            </svg>
            Copy Text
          </button>
          {copied && (
            <span style={{ color: 'var(--green)', fontSize: '0.9rem', alignSelf: 'center', fontFamily: 'var(--font-secondary)' }}>
              Copied to Clipboard!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
