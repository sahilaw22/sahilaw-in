import { useState } from 'react';
import { blogPosts } from '../data/blog.js';

function BackButton({ href, label }) {
  return (
    <button className="custom-back-btn" onClick={() => { window.location.hash = href; }}>
      <svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.000488281 4.49707L6.40403 0.801753L6.40403 -2.36448e-05L0.000488246 3.6943L0.000488281 4.49707Z" fill="currentColor" />
        <path d="M6.40354 9L6.40354 8.19822L-1.96673e-07 4.50291L-1.61609e-07 5.30468L6.40354 9Z" fill="currentColor" />
      </svg>
      {label}
    </button>
  );
}

// Blog listing page with category filter
export default function BlogPage({ sound }) {
  const categories = [...new Set(blogPosts.map((p) => p.category))];
  const [activeCategory, setActiveCategory] = useState(null);

  const filtered = activeCategory
    ? blogPosts.filter((p) => p.category === activeCategory)
    : blogPosts;

  function handleCategoryClick(cat) {
    sound.play('click');
    setActiveCategory(activeCategory === cat ? null : cat);
  }

  return (
    <div id="view-blog" className="app-view active">
      <BackButton href="#/" label="Return Home" />
      <div className="subpage-container">
        <h1 className="subpage-title">Blog</h1>
        <nav>
          <ul className="blog-filters">
            <li>
              <button
                className={activeCategory === null ? 'active' : ''}
                onClick={() => { sound.play('click'); setActiveCategory(null); }}
              >
                All
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  className={activeCategory === cat ? 'active' : ''}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="blog-list">
          {filtered.map((post) => (
            <li key={post.slug} className="blog-item">
              <a
                href={`#/blog/${post.slug}`}
                onClick={() => sound.play('open')}
              >
                <h2>{post.title}</h2>
                <div className="blog-meta">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.category}</span>
                </div>
                <p style={{ marginTop: '1rem' }}>{post.description}</p>
                <span className="blog-read-more">
                  Read more
                  <svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
                    <path d="M0.000488281 4.49707L6.40403 0.801753L6.40403 -2.36448e-05L0.000488246 3.6943L0.000488281 4.49707Z" fill="currentColor" />
                    <path d="M6.40354 9L6.40354 8.19822L-1.96673e-07 4.50291L-1.61609e-07 5.30468L6.40354 9Z" fill="currentColor" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
