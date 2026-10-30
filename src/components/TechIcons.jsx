import React from 'react';

export function TechIcon({ name, size = 14 }) {
  const norm = (name || '').toLowerCase().trim();

  if (norm.includes('react')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="currentColor">
        <circle cx="64" cy="64" r="11.4" fill="#61DAFB" />
        <g fill="none" stroke="#61DAFB" strokeWidth="6">
          <ellipse cx="64" cy="64" rx="48" ry="18" transform="rotate(0 64 64)" />
          <ellipse cx="64" cy="64" rx="48" ry="18" transform="rotate(60 64 64)" />
          <ellipse cx="64" cy="64" rx="48" ry="18" transform="rotate(120 64 64)" />
        </g>
      </svg>
    );
  }

  if (norm.includes('javascript') || norm === 'js') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M7 17.5c.8.5 1.7.8 2.6.8 1.4 0 2.2-.7 2.2-1.9v-6.9h-1.9v6.9c0 .6-.3.9-.9.9-.5 0-.9-.2-1.4-.5l-.6 1.6zm7.2.1c1.3.7 2.7 1.1 4.1 1.1 2.4 0 3.7-1.3 3.7-3.1 0-1.7-1.1-2.6-3.2-3.4-1.3-.5-1.9-.9-1.9-1.6 0-.6.5-1.1 1.6-1.1.9 0 1.9.3 2.7.8l.7-1.7c-.9-.5-2-1-3.4-1-2.3 0-3.6 1.3-3.6 3 0 1.6 1.1 2.5 3 3.3 1.4.5 2.1 1 2.1 1.8 0 .8-.7 1.3-1.8 1.3-1.1 0-2.3-.4-3.3-1l-.7 1.6z" fill="#000" />
      </svg>
    );
  }

  if (norm.includes('typescript') || norm === 'ts') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M12.5 10.5h-5v2h1.5v6.5h2v-6.5h1.5v-2zm3.2 5.6c.7.4 1.5.6 2.3.6 1 0 1.6-.4 1.6-1.1 0-.6-.5-1-1.6-1.4-1.6-.6-2.6-1.2-2.6-2.5 0-1.5 1.2-2.4 2.8-2.4 1 0 1.9.3 2.6.7l-.6 1.5c-.6-.4-1.3-.6-2-.6-.8 0-1.2.4-1.2.9 0 .6.5.9 1.7 1.4 1.7.6 2.5 1.4 2.5 2.5 0 1.7-1.3 2.6-3.1 2.6-1.1 0-2.2-.3-3-.9l.6-1.4z" fill="#fff" />
      </svg>
    );
  }

  if (norm.includes('css')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M3 2l1.8 17.5L12 22l7.2-2.5L21 2H3z" fill="#1572B6" />
        <path d="M12 3.8v16.3l5.6-1.9 1.4-14.4H12z" fill="#33A9DC" />
        <path d="M7 7.5h10l-.3 3H9.8l.2 2.5h6.8l-.6 6-4.2 1.4-4.2-1.4-.3-3.2h2l.1 1.7 2.4.8 2.4-.8.3-2.6H7.3L7 7.5z" fill="#fff" />
      </svg>
    );
  }

  if (norm.includes('figma') || norm.includes('ui/ux') || norm.includes('ux')) {
    return (
      <svg width={size} height={size} viewBox="0 0 38 57" fill="none">
        <path d="M19 28.5A9.5 9.5 0 1 1 28.5 19 9.5 9.5 0 0 1 19 28.5z" fill="#1ABCFE" />
        <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
        <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
        <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
        <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
      </svg>
    );
  }

  if (norm.includes('gsap')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#0ae448" />
        <path d="M12 6l-4 7h4l-1 5 5-8h-4l1-4z" fill="#000" />
      </svg>
    );
  }

  if (norm.includes('audio') || norm.includes('sound') || norm.includes('synth')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round">
        <path d="M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 10v4" />
      </svg>
    );
  }

  if (norm.includes('canvas')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="#f59e0b" />
        <circle cx="17.5" cy="10.5" r=".5" fill="#f59e0b" />
        <circle cx="8.5" cy="7.5" r=".5" fill="#f59e0b" />
        <circle cx="6.5" cy="12.5" r=".5" fill="#f59e0b" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.8-.7 1.8-1.7 0-.5-.2-1-.5-1.3-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h2.4c3.8 0 6.8-3 6.8-6.8C24 5.7 18.6 2 12 2z" />
      </svg>
    );
  }

  if (norm.includes('ai') || norm.includes('engine') || norm.includes('llm') || norm.includes('lurian')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="4" fill="#c084fc" fillOpacity="0.3" />
      </svg>
    );
  }

  if (norm.includes('node')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#68A063">
        <path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2zm0 2.3L4.8 8.5v7l7.2 4.2 7.2-4.2v-7L12 4.3z" />
      </svg>
    );
  }

  if (norm.includes('next')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#000" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <path d="M14.5 9v6M9.5 9v6l5.5-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (norm.includes('tailwind')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#38bdf8">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" />
      </svg>
    );
  }

  if (norm.includes('html')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M3 2l1.8 17.5L12 22l7.2-2.5L21 2H3z" fill="#E44D26" />
        <path d="M12 3.8v16.3l5.6-1.9 1.4-14.4H12z" fill="#F16529" />
        <path d="M7 7.5h10l-.3 3H9.8l.2 2.5h6.8l-.6 6-4.2 1.4-4.2-1.4-.3-3.2h2l.1 1.7 2.4.8 2.4-.8.3-2.6H7.3L7 7.5z" fill="#fff" />
      </svg>
    );
  }

  if (norm.includes('git')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#F05032">
        <path d="M21.62 10.45l-8.07-8.07a2.53 2.53 0 0 0-3.58 0L8.03 4.32l2.48 2.48a2.12 2.12 0 0 1 2.69 2.69l2.4 2.4a2.13 2.13 0 0 1 2.7 2.7l3.32-3.32a2.53 2.53 0 0 0 0-3.58zM6.97 5.38L2.38 9.97a2.53 2.53 0 0 0 0 3.58l8.07 8.07a2.53 2.53 0 0 0 3.58 0l1.9-1.9-2.5-2.5a2.13 2.13 0 0 1-2.7-2.7L8.33 12.1a2.13 2.13 0 0 1-2.7-2.7L3.15 6.92l3.82-1.54z" />
      </svg>
    );
  }

  if (norm.includes('python')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M11.9 2c-3.1 0-5 .4-5 2.5v1.8h5.1v.6H5.2C3 6.9 2 8.3 2 11.2c0 2.5 1.5 3.8 3.8 3.8h1.2v-1.9c0-1.4 1.2-2.5 2.6-2.5h5.1c1.1 0 2-.9 2-2V4.5c0-1.4-1.2-2.5-4.8-2.5zm-1.4 1.3c.4 0 .7.3.7.7s-.3.7-.7.7-.7-.3-.7-.7.3-.7.7-.7z" fill="#387EB8"/>
        <path d="M12.1 22c3.1 0 5-.4 5-2.5v-1.8H12v-.6h6.8c2.2 0 3.2-1.4 3.2-4.3 0-2.5-1.5-3.8-3.8-3.8H17v1.9c0 1.4-1.2 2.5-2.6 2.5H9.3c-1.1 0-2 .9-2 2v4.1c0 1.4 1.2 2.5 4.8 2.5zm1.4-1.3c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7z" fill="#FFE052"/>
      </svg>
    );
  }

  if (norm.includes('vite')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M21.5 3.5l-9.1 17-9.4-17 11.2 2.2 7.3-2.2z" fill="url(#viteGradient)"/>
        <path d="M15.4 3.8l-7 1.3-1.6 3.6 3.5.7-4.1 6.5 7.6-9.1-3.2-.6 4.8-2.4z" fill="#FFD02F"/>
        <defs>
          <linearGradient id="viteGradient" x1="2" y1="3.5" x2="19" y2="20.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#41D1FF"/>
            <stop offset="1" stopColor="#BD34FE"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (norm.includes('cpp') || norm.includes('c++')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M11.5 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 7.8-5.1h-3.3a5.5 5.5 0 1 1 0-6.8h3.3A8.5 8.5 0 0 0 11.5 3.5z" fill="#00599C"/>
        <path d="M16 11h1.5v-1.5H19V11h1.5v1.5H19V14h-1.5v-1.5H16V11zm4.5 0H22v-1.5h1.5V11H25v1.5h-1.5V14H22v-1.5h-1.5V11z" fill="#004482"/>
      </svg>
    );
  }

  if (norm.includes('sql') || norm.includes('database')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    );
  }

  if (norm.includes('flutter')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M14.3 2.5L5 11.8l3.6 3.6L19.8 4.2l-5.5-1.7zm0 10.9l-4.7 4.7L13.2 21.7 20 14.9l-5.7-1.5z" fill="#42A5F5"/>
      </svg>
    );
  }

  if (norm.includes('dart')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M4.5 3.5l8.5-1.5 7.5 7.5-6.5 11-10.5-6.5 1-10.5z" fill="#0175C2"/>
      </svg>
    );
  }

  if (norm.includes('gemini')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2C12 7.52 7.52 12 2 12c5.48 0 9.9 4.48 10 10 .1-5.52 4.52-10 10-10-5.48 0-9.9-4.48-10-10z" fill="url(#geminiGrad)" />
        <defs>
          <linearGradient id="geminiGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1BA1E3" />
            <stop offset="0.5" stopColor="#5470FF" />
            <stop offset="1" stopColor="#9C6BFF" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Default fallback code tag icon
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
