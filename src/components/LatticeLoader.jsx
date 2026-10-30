import React, { useEffect, useState, useRef } from 'react';

/**
 * LatticeLoader — Matrix grid loader with orbital/wave patterns and timing metrics
 */
export default function LatticeLoader({
  status = 'working',
  label = 'Answering...',
  doneLabel = 'Answered',
  errorLabel = 'Failed',
  pattern = 'orbit',
  grid = 3,
  shape = 'round',
  doneColor = 'rgba(255, 255, 255, 0.75)',
  errorColor = '#ef4444',
  cellSize = 3.5,
  gap = 1.5,
  fontSize = 13,
  step = 90,
  idleOpacity = 0.15,
  glow = false,
  glowColor = '',
  showTimer = false,
  className = '',
  style = {},
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(Date.now());
  const finalTimeRef = useRef(null);

  // Define orbital indices for a 3x3 grid
  const orbitSequence = [0, 1, 2, 5, 8, 7, 6, 3];
  const totalCells = grid * grid;

  // Animation step interval
  useEffect(() => {
    if (status !== 'working') return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % orbitSequence.length);
    }, step);

    return () => clearInterval(interval);
  }, [status, step, orbitSequence.length]);

  // Timer interval
  useEffect(() => {
    if (status === 'working') {
      startTimeRef.current = Date.now();
      finalTimeRef.current = null;
      const timer = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current);
      }, 50);
      return () => clearInterval(timer);
    } else {
      if (finalTimeRef.current === null) {
        finalTimeRef.current = elapsed || (Date.now() - startTimeRef.current);
      }
    }
  }, [status]);

  const activeIndex = orbitSequence[activeStep % orbitSequence.length];
  const prevIndex1 = orbitSequence[(activeStep - 1 + orbitSequence.length) % orbitSequence.length];
  const prevIndex2 = orbitSequence[(activeStep - 2 + orbitSequence.length) % orbitSequence.length];

  const seconds = ((finalTimeRef.current ?? elapsed) / 1000).toFixed(1);

  // Status text determination
  let currentLabel = label;
  let labelColor = 'rgba(255, 255, 255, 0.75)';

  if (status === 'done') {
    currentLabel = doneLabel;
    labelColor = doneColor;
  } else if (status === 'error') {
    currentLabel = errorLabel;
    labelColor = errorColor;
  }

  return (
    <div
      className={`lattice-loader-root ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.2rem 0',
        borderRadius: '0.6rem',
        background: 'transparent',
        border: 'none',
        fontSize: `${fontSize}px`,
        fontFamily: "'Plus Jakarta Sans', var(--font-secondary), -apple-system, sans-serif",
        color: '#fff',
        userSelect: 'none',
        lineHeight: 1,
        ...style,
      }}
    >
      {/* Grid cells */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${grid}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${grid}, ${cellSize}px)`,
          gap: `${gap}px`,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {Array.from({ length: totalCells }).map((_, i) => {
          let cellColor = '#ffffff';
          let opacity = idleOpacity;

          if (status === 'done') {
            cellColor = doneColor;
            opacity = 0.75;
          } else if (status === 'error') {
            cellColor = errorColor;
            opacity = 0.8;
          } else {
            if (i === activeIndex) {
              opacity = 1;
              cellColor = '#ffffff';
            } else if (i === prevIndex1) {
              opacity = 0.65;
            } else if (i === prevIndex2) {
              opacity = 0.35;
            }
          }

          return (
            <div
              key={i}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                borderRadius: shape === 'round' ? '50%' : '2px',
                backgroundColor: cellColor,
                opacity,
                transition: 'opacity 0.12s ease, background-color 0.2s ease',
                boxShadow: glow ? `0 0 6px ${glowColor || cellColor}` : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Label and Timer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          color: labelColor,
          fontWeight: 450,
          letterSpacing: '-0.01em',
        }}
      >
        <span>{currentLabel}</span>
        {showTimer && (
          <span
            style={{
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 500,
              color: status === 'done' ? doneColor : 'rgba(255, 255, 255, 0.45)',
              marginLeft: '0.1rem',
            }}
          >
            {seconds}s
          </span>
        )}
      </div>
    </div>
  );
}
