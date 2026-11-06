import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

export default function LottiePlayer({
  animationData,
  path,
  loop = true,
  autoplay = true,
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay,
      animationData,
      path,
    });

    return () => {
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [animationData, path, loop, autoplay]);

  return <div ref={containerRef} className={className} style={style} aria-hidden="true" />;
}

