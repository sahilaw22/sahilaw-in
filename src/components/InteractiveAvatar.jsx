import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AVATAR_HEAD_SRC } from './avatarHeadAsset.js';
import './InteractiveAvatar.css';

// Eye geometry constants measured from original reference image (1024 x 967)
// Identical eyeball and pupil sizes for consistent, symmetric look in both eyes
const EYE_RADIUS = 74;
const PUPIL_RADIUS = 28;

const LEFT_EYE = {
  cx: 536,
  cy: 620,
  rx: EYE_RADIUS,
  ry: EYE_RADIUS,
  maxDx: 32,
  maxDy: 32,
  pupilR: PUPIL_RADIUS,
};

const RIGHT_EYE = {
  cx: 774,
  cy: 544,
  rx: EYE_RADIUS,
  ry: EYE_RADIUS,
  maxDx: 32,
  maxDy: 32,
  pupilR: PUPIL_RADIUS,
};

export default function InteractiveAvatar({ className = '', onAvatarClick }) {
  const svgRef = useRef(null);
  const rafRef = useRef(null);
  const blinkTimerRef = useRef(null);

  // Pupil animated positions and velocities (for spring physics)
  const leftPos = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const rightPos = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const targetPos = useRef({ leftX: 0, leftY: 0, rightX: 0, rightY: 0 });

  // DOM node references for high performance direct transform updates
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const leftEyeGroupRef = useRef(null);
  const rightEyeGroupRef = useRef(null);
  const leftCreaseRef = useRef(null);
  const rightCreaseRef = useRef(null);

  const [isBlinking, setIsBlinking] = useState(false);
  const isReducedMotion = useRef(false);
  const isMouseActive = useRef(false);

  // Trigger natural blink animation
  const triggerBlink = useCallback(() => {
    if (isReducedMotion.current) return;
    setIsBlinking(true);

    const startTime = performance.now();
    const duration = 160; // 160ms total blink

    const animateBlink = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Symmetrical blink curve: 1 -> 0.05 -> 1
      let scale = 1;
      if (progress < 0.45) {
        scale = 1 - (progress / 0.45) * 0.95;
      } else {
        scale = 0.05 + ((progress - 0.45) / 0.55) * 0.95;
      }

      if (leftEyeGroupRef.current) {
        leftEyeGroupRef.current.setAttribute(
          'transform',
          `translate(0, ${(1 - scale) * LEFT_EYE.cy}) scale(1, ${scale})`
        );
      }
      if (rightEyeGroupRef.current) {
        rightEyeGroupRef.current.setAttribute(
          'transform',
          `translate(0, ${(1 - scale) * RIGHT_EYE.cy}) scale(1, ${scale})`
        );
      }

      const showCrease = scale < 0.28;
      if (leftCreaseRef.current) {
        leftCreaseRef.current.classList.toggle('is-visible', showCrease);
      }
      if (rightCreaseRef.current) {
        rightCreaseRef.current.classList.toggle('is-visible', showCrease);
      }

      if (progress < 1) {
        requestAnimationFrame(animateBlink);
      } else {
        setIsBlinking(false);
        // Reset scale
        if (leftEyeGroupRef.current) leftEyeGroupRef.current.removeAttribute('transform');
        if (rightEyeGroupRef.current) rightEyeGroupRef.current.removeAttribute('transform');
        if (leftCreaseRef.current) leftCreaseRef.current.classList.remove('is-visible');
        if (rightCreaseRef.current) rightCreaseRef.current.classList.remove('is-visible');

        // 18% chance of immediate playful double-blink
        if (Math.random() < 0.18) {
          setTimeout(triggerBlink, 120);
        }
      }
    };

    requestAnimationFrame(animateBlink);
  }, []);

  // Main animation loop: spring physics for googly eye movement
  useEffect(() => {
    isReducedMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Schedule periodic natural blinks every 3.2s to 6.5s
    const scheduleNextBlink = () => {
      const delay = 3200 + Math.random() * 3300;
      blinkTimerRef.current = setTimeout(() => {
        triggerBlink();
        scheduleNextBlink();
      }, delay);
    };
    scheduleNextBlink();

    // Physics step
    const stiffness = 0.16;
    const damping = 0.24;

    let lastTime = performance.now();

    const loop = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // If mouse is idle / on mobile, apply gentle organic wander
      if (!isMouseActive.current && !isReducedMotion.current) {
        const t = now * 0.0012;
        const wanderX = Math.sin(t * 0.9) * 8;
        const wanderY = Math.cos(t * 1.3) * 6;
        targetPos.current.leftX = wanderX;
        targetPos.current.leftY = wanderY;
        targetPos.current.rightX = wanderX;
        targetPos.current.rightY = wanderY;
      }

      // Spring step for left pupil
      const l = leftPos.current;
      const lt = targetPos.current;
      l.vx += (lt.leftX - l.x) * stiffness - l.vx * damping;
      l.x += l.vx;
      l.vy += (lt.leftY - l.y) * stiffness - l.vy * damping;
      l.y += l.vy;

      // Spring step for right pupil
      const r = rightPos.current;
      r.vx += (lt.rightX - r.x) * stiffness - r.vx * damping;
      r.x += r.vx;
      r.vy += (lt.rightY - r.y) * stiffness - r.vy * damping;
      r.y += r.vy;

      // Direct DOM update for 60fps / 120fps smooth performance
      if (leftPupilRef.current) {
        leftPupilRef.current.setAttribute('transform', `translate(${l.x.toFixed(2)}, ${l.y.toFixed(2)})`);
      }
      if (rightPupilRef.current) {
        rightPupilRef.current.setAttribute('transform', `translate(${r.x.toFixed(2)}, ${r.y.toFixed(2)})`);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    let isVisibleOnScreen = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleOnScreen = entry.isIntersecting;
        if (isVisibleOnScreen) {
          lastTime = performance.now();
          if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);
        } else {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
        }
      },
      { threshold: 0.05 }
    );

    if (svgRef.current) observer.observe(svgRef.current);

    const handleVisibility = () => {
      if (document.hidden || !isVisibleOnScreen) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
      } else {
        lastTime = performance.now();
        if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);
        scheduleNextBlink();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [triggerBlink]);

  // Track cursor position on screen
  useEffect(() => {
    let idleTimer = null;

    const handlePointerMove = (e) => {
      if (!svgRef.current) return;
      isMouseActive.current = true;

      // Reset to idle wandering after 3 seconds of cursor inactivity
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMouseActive.current = false;
      }, 3000);

      const rect = svgRef.current.getBoundingClientRect();
      if (!rect || rect.width === 0) return;

      const scaleX = rect.width / 772;
      const scaleY = rect.height / 784;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Calculate vector from left eye center to mouse (adjusted for tight viewBox offset 114, 110)
      const leftScreenX = rect.left + (LEFT_EYE.cx - 114) * scaleX;
      const leftScreenY = rect.top + (LEFT_EYE.cy - 110) * scaleY;
      const ldx = mouseX - leftScreenX;
      const ldy = mouseY - leftScreenY;
      const lDist = Math.hypot(ldx, ldy);
      const lAngle = Math.atan2(ldy, ldx);

      // Non-linear deflection: responsive close-up, smoothly saturating at ~320px
      const lIntensity = Math.min(1, Math.pow(lDist / 320, 0.72));

      // Calculate vector from right eye center to mouse (adjusted for tight viewBox offset 114, 110)
      const rightScreenX = rect.left + (RIGHT_EYE.cx - 114) * scaleX;
      const rightScreenY = rect.top + (RIGHT_EYE.cy - 110) * scaleY;
      const rdx = mouseX - rightScreenX;
      const rdy = mouseY - rightScreenY;
      const rDist = Math.hypot(rdx, rdy);
      const rAngle = Math.atan2(rdy, rdx);
      const rIntensity = Math.min(1, Math.pow(rDist / 320, 0.72));

      // Constrain deltas within lens ellipses
      targetPos.current.leftX = Math.cos(lAngle) * LEFT_EYE.maxDx * lIntensity;
      targetPos.current.leftY = Math.sin(lAngle) * LEFT_EYE.maxDy * lIntensity;

      targetPos.current.rightX = Math.cos(rAngle) * RIGHT_EYE.maxDx * rIntensity;
      targetPos.current.rightY = Math.sin(rAngle) * RIGHT_EYE.maxDy * rIntensity;
    };

    const handleLeave = () => {
      // Smoothly return eyes to default neutral position when mouse leaves the page
      isMouseActive.current = false;
      targetPos.current.leftX = 0;
      targetPos.current.leftY = 0;
      targetPos.current.rightX = 0;
      targetPos.current.rightY = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handleLeave);
    document.documentElement.addEventListener('mouseleave', handleLeave);
    window.addEventListener('blur', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handleLeave);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('blur', handleLeave);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    triggerBlink();
    onAvatarClick?.();
  };

  return (
    <span className={`hero-avatar-inline-wrap ${className}`}>
      <svg
        ref={svgRef}
        viewBox="114 110 772 784"
        className="hero-avatar-svg cursor-target"
        data-cursor-label="Hey!"
        onClick={handleClick}
        role="img"
        aria-label="Interactive animated avatar with googly eyes"
      >
        <defs>
          {/* Exact lens boundary clips */}
          <clipPath id="avatar-left-lens-clip">
            <ellipse cx="538" cy="620" rx="106" ry="116" />
          </clipPath>
          <clipPath id="avatar-right-lens-clip">
            <ellipse cx="774" cy="544" rx="78" ry="98" />
          </clipPath>
        </defs>

        {/* Left eye elements */}
        <g ref={leftEyeGroupRef} clipPath="url(#avatar-left-lens-clip)">
          <ellipse cx="538" cy="620" rx="106" ry="116" fill="#000000" />
          <circle cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r={LEFT_EYE.rx} className="avatar-sclera" />
          <g ref={leftPupilRef}>
            <circle cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r={LEFT_EYE.pupilR} className="avatar-pupil" />
            <circle cx={LEFT_EYE.cx - 9} cy={LEFT_EYE.cy - 9} r="8" className="avatar-highlight-primary" />
            <circle cx={LEFT_EYE.cx + 8} cy={LEFT_EYE.cy + 7} r="4" className="avatar-highlight-secondary" />
          </g>
        </g>

        {/* Right eye elements */}
        <g ref={rightEyeGroupRef} clipPath="url(#avatar-right-lens-clip)">
          <ellipse cx="774" cy="544" rx="78" ry="98" fill="#000000" />
          <circle cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r={RIGHT_EYE.rx} className="avatar-sclera" />
          <g ref={rightPupilRef}>
            <circle cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r={RIGHT_EYE.pupilR} className="avatar-pupil" />
            <circle cx={RIGHT_EYE.cx - 9} cy={RIGHT_EYE.cy - 9} r="8" className="avatar-highlight-primary" />
            <circle cx={RIGHT_EYE.cx + 8} cy={RIGHT_EYE.cy + 7} r="4" className="avatar-highlight-secondary" />
          </g>
        </g>

        {/* Eyelid creases visible during blinks */}
        <path
          ref={leftCreaseRef}
          d="M 460 620 Q 536 636 612 620"
          className="avatar-eyelid-crease"
        />
        <path
          ref={rightCreaseRef}
          d="M 700 544 Q 774 560 848 544"
          className="avatar-eyelid-crease"
        />

        {/* Head line art overlay (inlined for instant zero-delay render) */}
        <image
          href={AVATAR_HEAD_SRC}
          x="0"
          y="0"
          width="1024"
          height="967"
          preserveAspectRatio="xMidYMid meet"
          style={{ pointerEvents: 'none' }}
        />
      </svg>
    </span>
  );
}

