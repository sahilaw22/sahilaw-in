import { useRef } from 'react';
import RotatingText from './RotatingText';
import InteractiveAvatar from './InteractiveAvatar';
import { usePortfolioData } from '../data/usePortfolioData.js';

// Centered hero header with seamless X-axis aligned rotating role text.
export default function HeroHeader() {
  const { meta } = usePortfolioData();
  const rotatingRef = useRef(null);

  const heroRoles =
    meta?.hero_roles && meta.hero_roles.length > 0
      ? meta.hero_roles
      : ['Frontend AI Engineer', 'UI/UX Designer', 'App Developer'];

  const greetingName = meta?.name
    ? meta.name.includes(' ')
      ? meta.name.split(' ')[0]
      : meta.name
    : 'Sahil';

  return (
    <div id="general-footer">
      <header className="hero-header-content">
        <h1 className="hero-greeting" id="hero-greeting-heading">
          <span className="hero-greeting-text">Hi, I'm</span>
          <InteractiveAvatar />
          <span className="hero-greeting-text">{greetingName}.</span>
        </h1>

        {/* Role with normal font A and reddish rotating badge pill */}
        <div className="hero-role-wrapper">
          <span className="hero-role-intro">{meta?.hero_role_intro || 'A'}</span>
          <div
            className="hero-role-rotating-box cursor-target"
            data-cursor-label="Next"
            onClick={() => rotatingRef.current?.next?.()}
          >
            <RotatingText
              ref={rotatingRef}
              texts={heroRoles}
              splitBy="words"
              staggerFrom="first"
              staggerDuration={0.025}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              rotationInterval={5000}
              mainClassName="hero-rotating-role-badge"
              splitLevelClassName="overflow-hidden"
            />
          </div>
        </div>
      </header>
    </div>
  );
}
