import { Home, FolderSymlink, BookText, MessageSquare } from 'lucide-react';
import { ExpandableTabs } from './ui/expandable-tabs.jsx';

export default function BottomNav({ activeView }) {
  // Normalize active view key for tabs
  const currentKey = (() => {
    if (activeView === 'home' || activeView === 'post' || activeView === 'blog') return 'home';
    if (activeView === 'projects') return 'projects';
    if (activeView === 'careers') return 'resume';
    if (activeView === 'chat') return 'chat';
    return 'home';
  })();

  const navTabs = [
    {
      key: 'home',
      title: 'Home',
      icon: Home,
      href: '#/',
    },
    {
      key: 'projects',
      title: 'Projects',
      icon: FolderSymlink,
      href: '#/projects',
    },
    {
      type: 'separator',
    },
    {
      key: 'resume',
      title: 'Resume',
      icon: BookText,
      href: '#/careers',
    },
    {
      key: 'chat',
      title: 'Chat',
      icon: MessageSquare,
      href: '#/chat',
    },
  ];

  return (
    <ExpandableTabs
      tabs={navTabs}
      activeKey={currentKey}
    />
  );
}
