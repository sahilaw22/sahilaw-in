import { useEffect } from 'react';
import { useHashRouter } from './hooks/useHashRouter.js';
import { useSoundEngine } from './hooks/useSoundEngine.js';

import BottomNav from './components/BottomNav.jsx';
import RightScrollPills from './components/RightScrollPills.jsx';
import LetterGlitch from './components/LetterGlitch.jsx';
import HomePage from './pages/HomePage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import PostPage from './pages/PostPage.jsx';
import ResumePage from './pages/ResumePage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';

// Determine which "view name" maps to each route for the bottom nav active state
function routeToView(route) {
  if (route === '/') return 'home';
  if (route === '/blog') return 'blog';
  if (route.startsWith('/blog/')) return 'post';
  if (route.startsWith('/projects')) return 'projects';
  if (route === '/careers' || route === '/resume') return 'careers';
  if (route === '/chat') return 'chat';
  return 'home';
}

export default function App() {
  const { route } = useHashRouter();
  const sound = useSoundEngine();
  const activeView = routeToView(route);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);

  // Render the correct page based on the current hash route
  function renderPage() {
    if (route === '/') return <HomePage sound={sound} />;
    if (route === '/blog') return <BlogPage sound={sound} />;
    if (route.startsWith('/blog/')) {
      const slug = route.replace('/blog/', '');
      return <PostPage slug={slug} sound={sound} />;
    }
    if (route === '/careers' || route === '/resume') return <ResumePage />;
    if (route === '/chat') return <ChatPage />;
    if (route === '/projects') return <ProjectsPage />;
    if (route === '/projects/all') return <ProjectsPage showAll />;
    return <HomePage sound={sound} />;
  }

  return (
    <>
      {/* Fixed Matrix Code Background: Active across Hero and all bottom scroll pages */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <LetterGlitch
          glitchColors={['#ffffff', '#61dca3']}
          glitchAmount={0}
          speed={0}
          flow={0}
          interactive={false}
          clickEffect="none"
          fontSize={10}
          baseOpacity={0.12}
          characters="0123456789ABCDEF"
          intro={false}
        />
      </div>

      <div key={route} className="page-transition-wrapper">
        {renderPage()}
      </div>
      <RightScrollPills play={sound?.play} currentRoute={route} />
      <BottomNav activeView={activeView} />
    </>
  );
}
