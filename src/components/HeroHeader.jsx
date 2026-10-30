import { useEffect, useState } from 'react';
import RotatingText from './RotatingText';
import { usePortfolioData } from '../data/usePortfolioData.js';

// Centered hero header with rotating role text.
export default function HeroHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { meta } = usePortfolioData();
  const heroRoles = meta?.hero_roles && meta.hero_roles.length > 0 ? meta.hero_roles : ['Frontend AI Engineer', 'UI/UX Designer', 'App Developer'];

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 160);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={isScrolled ? 'hero-header-scrolled' : ''}
      id="general-footer"
    >
      <header className="hero-header-content">
        <h1 className="hero-greeting" id="hero-greeting-heading">
          Hi, I'm Sahil.
        </h1>

        {/* Rotating role badge with white text and glass background */}
        <div className="hero-role-wrapper">
          <span className="hero-role-intro">I am a</span>
          <RotatingText
            texts={heroRoles}
            splitBy="words"
            staggerFrom="last"
            staggerDuration={0.03}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-110%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 380 }}
            rotationInterval={2200}
            mainClassName="hero-rotating-role-badge"
            splitLevelClassName="overflow-hidden"
          />
        </div>
      </header>
    </div>
  );
}
