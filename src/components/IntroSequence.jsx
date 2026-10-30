import { useEffect, useState } from 'react';

/**
 * IntroSequence — First-time entrance preloader
 * Sequence:
 *   1. Screen shows "Hi" in center
 *   2. Morphs to "I'm Sahil" in center
 *   3. Fades away seamlessly to reveal all hero section content centered in place
 */
export default function IntroSequence({ onComplete }) {
  const [stage, setStage] = useState(0); // 0: "Hi", 1: "I'm Sahil", 2: fading out, 3: done
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Stage 0 -> Stage 1: Change text from "Hi" to "I'm Sahil"
    const timer1 = setTimeout(() => {
      setStage(1);
    }, 850);

    // Stage 1 -> Stage 2: Fade out overlay and reveal centered hero page content
    const timer2 = setTimeout(() => {
      setStage(2);
    }, 1850);

    // Stage 2 -> Stage 3: Unmount preloader
    const timer3 = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  // Click or touch anywhere to instantly skip
  const handleSkip = () => {
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`intro-sequence-overlay stage-${stage}`}
      onClick={handleSkip}
      title="Click anywhere to skip"
    >
      <div className="intro-bg-glow" />

      <div className={`intro-text-box stage-${stage}`}>
        <h1 className="intro-heading">
          {stage === 0 ? (
            <span className="intro-word word-hi">Hi</span>
          ) : (
            <span className="intro-word word-sahil">
              <span className="intro-prefix">Hi, </span>I'm Sahil
            </span>
          )}
        </h1>

        {stage < 2 && (
          <div className="intro-skip-hint">Click anywhere to skip</div>
        )}
      </div>
    </div>
  );
}
