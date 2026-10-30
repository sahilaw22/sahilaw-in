import { useEffect, useState } from 'react';

// Hash-based router — reads window.location.hash and listens for changes.
// Returns: { route, navigate }
//   route    — e.g. '/', '/blog', '/blog/my-slug'
//   navigate — helper to push a new hash
export function useHashRouter() {
  function getRoute() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      return hash.replace(/^#/, '') || '/';
    }
    const path = window.location.pathname;
    if (path && path !== '/') {
      return path;
    }
    return hash ? hash.replace(/^#/, '') || '/' : '/';
  }

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    function onLocationChange() {
      setRoute(getRoute());
    }
    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  function navigate(path) {
    window.location.hash = '#' + path;
  }

  return { route, navigate };
}
