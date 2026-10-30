import { useEffect, useState } from 'react';

// Hash-based router — reads window.location.hash and listens for changes.
// Returns: { route, navigate }
//   route    — e.g. '/', '/blog', '/blog/my-slug'
//   navigate — helper to push a new hash
export function useHashRouter() {
  function getRoute() {
    const hash = window.location.hash || '#/';
    return hash.replace(/^#/, '') || '/';
  }

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    function onHashChange() {
      setRoute(getRoute());
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function navigate(path) {
    window.location.hash = '#' + path;
  }

  return { route, navigate };
}
