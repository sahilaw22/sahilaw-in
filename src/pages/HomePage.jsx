import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlassDistortionSVG from '../components/GlassDistortionSVG.jsx';
import LetterGlitch from '../components/LetterGlitch.jsx';
import HeroHeader from '../components/HeroHeader.jsx';
import SocialIcons from '../components/SocialIcons.jsx';
import Preloader from '../components/Preloader.jsx';
import AboutSection from '../components/AboutSection.jsx';
import ExperienceSection from '../components/ExperienceSection.jsx';
import FeaturedProjectsSection from '../components/FeaturedProjectsSection.jsx';
import EducationSection from '../components/EducationSection.jsx';
import SkillsSection from '../components/SkillsSection.jsx';
import CertificationsSection from '../components/CertificationsSection.jsx';
import ContactSection from '../components/ContactSection.jsx';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Home page: full scrolling portfolio with 4-pill quick navigation
export default function HomePage({ sound }) {
  // Preloader only appears when opening portfolio for the first time in the session; normal reloads bypass it
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !sessionStorage.getItem('portfolio_opened_before');
    } catch {
      return false;
    }
  });

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('portfolio_opened_before', 'true');
    } catch {}
    setShowIntro(false);
  };

  useEffect(() => {
    if (showIntro) return;

    const ctx = gsap.context(() => {
      // Cinematic entrance reveal for hero section when preloader finishes
      gsap.fromTo(
        '#hero-greeting-heading',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.hero-role-wrapper',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.75, delay: 0.12, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.hero-pitch-statement',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.75, delay: 0.22, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.social-icons-wrapper',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.75, delay: 0.32, ease: 'power3.out' }
      );

      const sections = document.querySelectorAll('.portfolio-section:not(.hero-section)');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 86%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [showIntro]);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      sound?.play?.('click');
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="view-home" className="app-view active portfolio-scroll-view">
      <GlassDistortionSVG />

      {/* Restored Fixed Matrix Glitch Background on Home page */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <LetterGlitch
          glitchColors={['#ffffff', '#61dca3']}
          glitchAmount={0}
          speed={0}
          flow={0}
          interactive={false}
          clickEffect="none"
          fontSize={10}
          baseOpacity={0.12}
          characters="0123456789ABCDEF"
          intro={false}
        />
      </div>

      {/* Preloader: first-time entrance with plain #f0191a background and white Glad you're here text */}
      {showIntro && <Preloader onComplete={handleIntroComplete} />}

      <section id="section-hero" className="portfolio-section hero-section">
        <div className="hero-center-all-wrap">
          <HeroHeader />

          <p className="hero-pitch-statement">
            Design Engineer & Creative Developer focused on modern web experiences and AI-powered interfaces.
          </p>

          <SocialIcons />
        </div>
      </section>

      <AboutSection play={sound.play} />
      <ExperienceSection />
      <FeaturedProjectsSection play={sound.play} />
      <EducationSection />
      <SkillsSection />
      <CertificationsSection play={sound?.play} />
      <ContactSection play={sound.play} />
    </div>
  );
}
