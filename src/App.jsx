import { useEffect, useState, lazy, Suspense } from 'react';
import { useHashRouter } from './hooks/useHashRouter.js';
import { useVisitorTracking } from './hooks/useVisitorTracking.js';
import { useSoundEngine } from './hooks/useSoundEngine.js';
import { useSmoothScroll } from './hooks/useSmoothScroll.js';

import ErrorBoundary from './components/ErrorBoundary.jsx';
import BottomNav from './components/BottomNav.jsx';
import RightScrollPills from './components/RightScrollPills.jsx';
import Ribbons from './components/ui/Ribbons.jsx';
import Preloader from './components/ui/Preloader.jsx';
import PageLoader from './components/PageLoader.jsx';
import HomePage from './pages/HomePage.jsx';

// Code-split secondary routes for rapid initial page load
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const PostPage = lazy(() => import('./pages/PostPage.jsx'));
const ResumePage = lazy(() => import('./pages/ResumePage.jsx'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage.jsx'));
const ChatPage = lazy(() => import('./pages/ChatPage.jsx'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));

// Determine which "view name" maps to each route for the bottom nav active state
function routeToView(route) {
  if (route === '/') return 'home';
  if (route === '/blog') return 'blog';
  if (route.startsWith('/blog/')) return 'post';
  if (route.startsWith('/projects')) return 'projects';
  if (route === '/careers' || route === '/resume' || route === '/experience' || route === '/work-experience') return 'careers';
  if (route === '/chat') return 'chat';
  if (route === '/chatbot-response' || route === '/admin') return 'admin';
  return 'home';
}

export default function App() {
  const { route } = useHashRouter();
  const sound = useSoundEngine();
  const activeView = routeToView(route);
  const isHome = route === '/' || route === '';
  const isAdmin = route === '/chatbot-response' || route === '/admin';
  const isExperience = route === '/experience' || route === '/work-experience';

  // Initialize smooth inertial scrolling with Lenis synchronized with GSAP ScrollTrigger
  useSmoothScroll(route);
  useVisitorTracking(route);

  // Strictly detect desktop pointer devices to remove WebGL ribbon cursor from all mobile screens and touch devices
  const [isDesktopPointer, setIsDesktopPointer] = useState(false);

  useEffect(() => {
    function checkDesktop() {
      if (typeof window === 'undefined') return false;
      const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
      const isMobileWidth = window.innerWidth <= 820;
      return !isTouch && !isMobileWidth;
    }

    setIsDesktopPointer(checkDesktop());
    const onResize = () => setIsDesktopPointer(checkDesktop());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Preloader management:
  // - First visit in session: shows original first-time preloader (stairs).
  // - On reload / subsequent page load in session: shows dark loading animation.
  // - Client-side route changes: neither shows.
  const [loaderType, setLoaderType] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const hasOpened = sessionStorage.getItem('portfolio_opened_before');
      return hasOpened ? 'reload' : 'first-visit';
    } catch {
      return null;
    }
  });

  const handleLoaderComplete = () => {
    try {
      sessionStorage.setItem('portfolio_opened_before', 'true');
    } catch {}
    setLoaderType(null);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);

  // Render the correct page based on the current hash route
  function renderPage() {
    if (route === '/chatbot-response' || route === '/admin') return <AdminPage />;
    if (route === '/') return <HomePage sound={sound} />;
    if (route === '/blog') return <BlogPage sound={sound} />;
    if (route.startsWith('/blog/')) {
      const slug = route.replace('/blog/', '');
      return <PostPage slug={slug} sound={sound} />;
    }
    if (route === '/experience' || route === '/work-experience') return <ExperiencePage />;
    if (route === '/careers' || route === '/resume') return <ResumePage />;
    if (route === '/chat') return <ChatPage />;
    if (route === '/projects' || route === '/projects/all') return <ProjectsPage showAll />;
    return <HomePage sound={sound} />;
  }

  return (
    <>
      {loaderType === 'first-visit' && <Preloader onComplete={handleLoaderComplete} />}
      {loaderType === 'reload' && <PageLoader onComplete={handleLoaderComplete} />}
      {isDesktopPointer && (
        <div
          className="ribbons-cursor-container"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 99999,
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          <Ribbons
            colors={['#f43f5e']}
            thickness={15}
            length={1.4}
            shape="comet"
          />
        </div>
      )}
      <div key={route} className="page-transition-wrapper">
        <ErrorBoundary>
          <Suspense fallback={<div className="page-route-fallback" style={{ minHeight: '60vh' }} />}>
            {renderPage()}
          </Suspense>
        </ErrorBoundary>
      </div>
      {isHome && <RightScrollPills play={sound?.play} currentRoute={route} />}
      {!isAdmin && <BottomNav activeView={activeView} />}
    </>
  );
}
