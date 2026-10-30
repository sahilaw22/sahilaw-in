import React, { useState, useEffect } from 'react';
import './SlidingSquareLoaderView.css';

/**
 * SlidingSquareLoaderView
 * Inspired by Vitaly Silkin's Uplabs design & SteelKiwi Android library
 * All squares share the continuous gradient which shifts based on position.
 */
export default function SlidingSquareLoaderView({
  cornerRadius = '6px',
  margin = '8px',
  squareSize = '26px',
  startGradientColor = '#8c65f7',
  endGradientColor = '#38bdf8',
  backgroundColor = '#060709',
  duration = 2400,
  onComplete,
}) {
  const [isVisible, setIsVisible] = useState(true);

  const hide = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete?.();
    }, 400);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, duration);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        hide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      className="sslv-overlay"
      style={{
        '--sslv-bg': backgroundColor,
        '--sslv-square-size': squareSize,
        '--sslv-margin': margin,
        '--sslv-corner-radius': cornerRadius,
        '--sslv-start-color': startGradientColor,
        '--sslv-end-color': endGradientColor,
      }}
      onClick={hide}
      role="dialog"
      aria-label="Loading"
    >
      <div className="sslv-container">
        <div className="sslv-square" id="sslv-square-1" />
        <div className="sslv-square" id="sslv-square-2" />
        <div className="sslv-square" id="sslv-square-3" />
        <div className="sslv-square" id="sslv-square-4" />
        <div className="sslv-square" id="sslv-square-5" />
      </div>

      <span className="sslv-caption">Loading portfolio</span>
      <span className="sslv-skip-hint">Click or press Esc to skip</span>
    </div>
  );
}

