import { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import darkLoadingData from '../assets/darkLoading.json';
import './PageLoader.css';

/**
 * PageLoader
 * Fullscreen loading animation displaying the Dark Loading Lottie animation.
 * Appears only on initial page load / full browser reload, then smoothly fades out.
 */
export default function PageLoader({ onComplete, minDuration = 1800 }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Lock body scroll during initial load
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('preloader-active');
    document.body.setAttribute('data-preloader-active', 'true');

    if (containerRef.current) {
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: darkLoadingData,
      });
    }

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const exitTimer = setTimeout(() => {
        setIsMounted(false);
        onComplete?.();
      }, 380);
      return () => clearTimeout(exitTimer);
    }, minDuration);

    // Allow user to skip with Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFadingOut(true);
        setTimeout(() => {
          setIsMounted(false);
          onComplete?.();
        }, 150);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove('preloader-active');
      document.body.removeAttribute('data-preloader-active');
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [minDuration, onComplete]);

  if (!isMounted) return null;

  return (
    <div
      className={`page-loader-overlay ${isFadingOut ? 'page-loader-fade-out' : ''}`}
      aria-label="Loading portfolio"
      role="status"
    >
      <div className="page-loader-animation-wrap">
        <div ref={containerRef} className="page-loader-lottie" aria-hidden="true" />
      </div>
    </div>
  );
}

