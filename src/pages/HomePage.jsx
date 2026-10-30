import { useState } from 'react';
import GlassDistortionSVG from '../components/GlassDistortionSVG.jsx';
import HeroHeader from '../components/HeroHeader.jsx';
import SocialIcons from '../components/SocialIcons.jsx';
import IntroSequence from '../components/IntroSequence.jsx';
import AboutSection from '../components/AboutSection.jsx';
import ExperienceSection from '../components/ExperienceSection.jsx';
import EducationSection from '../components/EducationSection.jsx';
import SkillsSection from '../components/SkillsSection.jsx';
import CertificationsSection from '../components/CertificationsSection.jsx';
import ContactSection from '../components/ContactSection.jsx';

// Home page — full scrolling portfolio with 4-pill quick navigation
export default function HomePage({ sound }) {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !sessionStorage.getItem('sahil_has_seen_intro');
    } catch {
      return true;
    }
  });

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('sahil_has_seen_intro', 'true');
    } catch {
      // Ignore sessionStorage errors
    }
    setShowIntro(false);
  };

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

      {/* First-time opening entrance preloader: "Hi" -> "I'm Sahil" -> reveals centered hero content */}
      {showIntro && <IntroSequence onComplete={handleIntroComplete} />}

      {/* 1. HERO SECTION (ALL CONTENT CENTERED) */}
      <section id="section-hero" className="portfolio-section hero-section">
        <div className="hero-center-all-wrap">
          <HeroHeader />

          <p className="hero-pitch-statement">
            Design Engineer & Creative Developer focused on modern web experiences and AI-powered interfaces.
          </p>

          <SocialIcons />
        </div>

        {/* Hanging spider scroll indicator */}
        <div
          className="hero-spider-scroll-cue"
          onClick={() => handleScrollTo('section-about')}
          role="button"
          tabIndex={0}
          aria-label="Scroll to About section"
          title="Scroll down"
        >
          <img
            src="/spider.png"
            alt="Hanging spider scroll indicator"
            className="hero-spider-img"
            width={68}
            height={68}
            draggable={false}
          />
        </div>
      </section>

      {/* 2. ABOUT ME & CREATIVE DESCRIPTION */}
      <AboutSection play={sound.play} />

      {/* 3. EXPERIENCE SECTION */}
      <ExperienceSection />

      {/* 4. EDUCATION & ACADEMIC BACKGROUND */}
      <EducationSection />

      {/* 5. SKILLS & CORE CAPABILITIES */}
      <SkillsSection />

      {/* 6. CERTIFICATIONS & RECOGNITION */}
      <CertificationsSection />

      {/* 7. CONTACT & GET IN TOUCH */}
      <ContactSection play={sound.play} />
    </div>
  );
}
