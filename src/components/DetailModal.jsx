import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { TechIcon } from './TechIcons.jsx';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/portfolioData.jsx';

export default function DetailModal({ project, projectsList, onClose, onNext, onPrev }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Manage body class so background scroll is locked and floating navbar is hidden
  useEffect(() => {
    if (project) {
      document.body.classList.add('project-detail-active');
    } else {
      document.body.classList.remove('project-detail-active');
    }
    return () => {
      document.body.classList.remove('project-detail-active');
    };
  }, [project]);

  // Reset video playback state when navigating projects
  useEffect(() => {
    setIsPlaying(false);
  }, [project?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!project) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose, onNext, onPrev]);

  if (!project) return null;

  const list = projectsList && projectsList.length > 0 ? projectsList : DEFAULT_PROJECTS;
  const techTags = Array.isArray(project.techFull) && project.techFull.length > 0
    ? project.techFull
    : (Array.isArray(project.tech) ? project.tech : (Array.isArray(project.technologies) ? project.technologies : []));
  const thumb = project.videoThumb || project.image || '/projects/sahil-recreation.jpg';
  const videoSrc = project.videoUrl || project.video || project.video_url || project.metrics?.videoUrl || '';
  const detailText = project.details || project.description || '';
  const longText = project.longDetails || project.details || project.description || '';
  const websiteLink = project.link || project.website || '#/projects';
  const sourceLink = project.github || (project.website?.includes('github.com') ? project.website : '');

  return createPortal(
    <div className="project-detail-backdrop" onClick={onClose} data-lenis-prevent="true">
      {/* Top Back Button (sticks to top on mobile with solid dark background) */}
      <button
        type="button"
        className="project-modal-top-back cursor-target" data-cursor-label="Back"
        onClick={onClose}
        aria-label="Back to projects"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to projects</span>
      </button>

      {/* Main card wrapper with external side navigation buttons */}
      <div className="project-modal-wrapper" onClick={(e) => e.stopPropagation()} data-lenis-prevent="true">
        {/* Previous Project Button (Outside card, Left side) */}
        <button
          type="button"
          className="project-nav-btn project-nav-prev cursor-target" data-cursor-label="Prev"
          onClick={onPrev}
          aria-label="Previous project"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Project Detail Card */}
        <article className="project-detail-panel" data-lenis-prevent="true">
          {/* Video / image preview banner with hover play button */}
          <div className={`project-detail-media ${videoSrc ? 'has-video' : ''} ${isPlaying ? 'is-playing' : ''}`}>
            {isPlaying && videoSrc ? (
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                autoPlay
                playsInline
                poster={thumb}
                className="project-detail-video-element"
              />
            ) : (
              <>
                <img src={thumb} alt={project.title} />
                <div
                  className="project-card-play-overlay"
                  onClick={() => {
                    if (videoSrc) setIsPlaying(true);
                  }}
                >
                  <button
                    type="button"
                    className="project-play-circle-btn cursor-target" data-cursor-label="Play"
                    aria-label="Play video demo"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoSrc) setIsPlaying(true);
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 256 256" fill="currentColor">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48.24-94.78-64-40A8,8,0,0,0,100,88v80a8,8,0,0,0,12.24,6.78l64-40a8,8,0,0,0,0-13.56ZM116,153.57V102.43L156.91,128Z" />
                    </svg>
                  </button>
                  {videoSrc ? (
                    <span className="project-play-badge">Play Video Demo</span>
                  ) : null}
                </div>
              </>
            )}
          </div>

          <div className="project-detail-body">
            <div className="project-detail-meta">
              {techTags.map((t) => (
                <span key={t} className="project-tech-dotted-chip">
                  <TechIcon name={t} size={13} />
                  <span>{t}</span>
                </span>
              ))}
            </div>

            <h2>{project.title}</h2>
            {detailText && <p className="project-detail-short">{detailText}</p>}
            {longText && <p className="project-detail-long">{longText}</p>}

            <div className="project-detail-actions">
              <a
                className="project-detail-cta cursor-target" data-cursor-label="Visit"
                href={websiteLink}
                target={websiteLink.startsWith('http') ? '_blank' : undefined}
                rel={websiteLink.startsWith('http') ? 'noreferrer' : undefined}
              >
                <span>Website</span>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>

              {sourceLink && (
                <a
                  className="project-detail-source-btn cursor-target" data-cursor-label="Code"
                  href={sourceLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>
        </article>

        {/* Next Project Button (Outside card, Right side) */}
        <button
          type="button"
          className="project-nav-btn project-nav-next cursor-target" data-cursor-label="Next"
          onClick={onNext}
          aria-label="Next project"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}

