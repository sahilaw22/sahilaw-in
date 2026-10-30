import { useCallback, useRef, useState } from 'react';

// Web Audio API sound engine: returns { muted, toggle, play }
export function useSoundEngine() {
  const ctxRef = useRef(null);
  const [muted, setMuted] = useState(
    () => localStorage.getItem('avara_muted') === 'true'
  );

  function getCtx() {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctxRef.current;
  }

  const play = useCallback(
    (type) => {
      if (muted) return;
      const ctx = getCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      const sounds = {
        click:   { type: 'sine',     freq: [1000, 100],  dur: 0.05, vol: 0.12 },
        tap:     { type: 'triangle', freq: [440, 200],   dur: 0.08, vol: 0.18 },
        release: { type: 'sine',     freq: [300, 600],   dur: 0.06, vol: 0.08 },
        open:    { type: 'sine',     freq: [220, 660],   dur: 0.28, vol: 0.08 },
        close:   { type: 'sine',     freq: [660, 220],   dur: 0.25, vol: 0.08 },
        error:   { type: 'sawtooth', freq: [130, 70],    dur: 0.18, vol: 0.08 },
      };

      const s = sounds[type];
      if (!s) return;
      osc.type = s.type;
      osc.frequency.setValueAtTime(s.freq[0], now);
      osc.frequency.exponentialRampToValueAtTime(s.freq[1], now + s.dur);
      gain.gain.setValueAtTime(s.vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + s.dur);
      osc.start(now);
      osc.stop(now + s.dur);
    },
    [muted]
  );

  const toggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem('avara_muted', next);
      return next;
    });
  }, []);

  return { muted, toggle, play };
}
