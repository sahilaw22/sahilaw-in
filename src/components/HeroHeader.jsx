import { useEffect, useState } from 'react';
import RotatingText from './RotatingText';
import { HERO_ROLES } from '../data/portfolioData.jsx';

// Centered hero header with rotating role text.
export default function HeroHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

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
        <h1 className="hero-greeting">Hi, I'm Sahil</h1>

        {/* Rotating role badge with white text and glass background */}
        <div className="hero-role-wrapper">
          <span className="hero-role-intro">I am a</span>
          <RotatingText
            texts={HERO_ROLES}
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
