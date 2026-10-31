import { useEffect, useState } from 'react';
import { useHashRouter } from './hooks/useHashRouter.js';
import { useSoundEngine } from './hooks/useSoundEngine.js';

import BottomNav from './components/BottomNav.jsx';
import RightScrollPills from './components/RightScrollPills.jsx';
import HomePage from './pages/HomePage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import PostPage from './pages/PostPage.jsx';
import ResumePage from './pages/ResumePage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

// Determine which "view name" maps to each route for the bottom nav active state
function routeToView(route) {
  if (route === '/') return 'home';
  if (route === '/blog') return 'blog';
  if (route.startsWith('/blog/')) return 'post';
  if (route.startsWith('/projects')) return 'projects';
  if (route === '/careers' || route === '/resume') return 'careers';
  if (route === '/chat') return 'chat';
  if (route === '/chatbot-response') return 'admin';
  return 'home';
}

export default function App() {
  const { route } = useHashRouter();
  const sound = useSoundEngine();
  const activeView = routeToView(route);
  const isAdmin = route === '/chatbot-response';

  const [isPreloaderActive, setIsPreloaderActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const isHome = window.location.hash === '' || window.location.hash === '#/' || window.location.hash === '#';
      return isHome && !sessionStorage.getItem('portfolio_opened_before');
    } catch {
      return false;
    }
  });

  const handlePreloaderComplete = () => {
    setIsPreloaderActive(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);

  // Render the correct page based on the current hash route
  function renderPage() {
    if (route === '/chatbot-response') return <AdminPage />;
    if (route === '/') return <HomePage sound={sound} onIntroComplete={handlePreloaderComplete} />;
    if (route === '/blog') return <BlogPage sound={sound} />;
    if (route.startsWith('/blog/')) {
      const slug = route.replace('/blog/', '');
      return <PostPage slug={slug} sound={sound} />;
    }
    if (route === '/careers' || route === '/resume') return <ResumePage />;
    if (route === '/chat') return <ChatPage />;
    if (route === '/projects') return <ProjectsPage />;
    if (route === '/projects/all') return <ProjectsPage showAll />;
    return <HomePage sound={sound} onIntroComplete={handlePreloaderComplete} />;
  }

  return (
    <>
      <div key={route} className="page-transition-wrapper">
        {renderPage()}
      </div>
      {!isAdmin && !isPreloaderActive && <RightScrollPills play={sound?.play} currentRoute={route} />}
      {!isAdmin && !isPreloaderActive && <BottomNav activeView={activeView} />}
    </>
  );
}
