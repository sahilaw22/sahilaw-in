import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/utils.js';
import './expandable-tabs.css';

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: 'auto', opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { type: 'spring', bounce: 0, duration: 0.26 };

export function ExpandableTabs({
  tabs = [],
  className = '',
  activeColor = 'expandable-tab-active',
  onChange,
  activeKey = null,
}) {
  const [internalSelected, setInternalSelected] = React.useState(null);
  const containerRef = React.useRef(null);

  // Use activeKey from parent (e.g. current activeView route) or internal selection
  const selectedIndex = React.useMemo(() => {
    if (activeKey !== null && activeKey !== undefined) {
      const found = tabs.findIndex((t) => t.key === activeKey || t.id === activeKey);
      if (found !== -1) return found;
    }
    return internalSelected;
  }, [activeKey, internalSelected, tabs]);

  // Click outside to collapse
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setInternalSelected(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelect = (index, tab) => {
    setInternalSelected(index);
    onChange?.(index, tab);
    if (tab?.href) {
      window.location.hash = tab.href.replace(/^#/, '');
    }
  };

  return (
    <div className="expandable-tabs-wrapper">
      <nav
        ref={containerRef}
        className={cn('expandable-tabs-container', className)}
        role="navigation"
        aria-label="Main Navigation"
      >
        {tabs.map((tab, index) => {
          if (tab.type === 'separator') {
            return (
              <div
                key={`separator-${index}`}
                className="expandable-tab-separator"
                aria-hidden="true"
              />
            );
          }

          const Icon = tab.icon;
          const isSelected = selectedIndex === index;

          return (
            <button
              type="button"
              key={tab.key || tab.title || tab.label || `tab-${index}`}
              onClick={() => handleSelect(index, tab)}
              className={cn(
                'expandable-tab-btn',
                isSelected ? cn('is-selected', activeColor) : 'is-idle'
              )}
              aria-selected={isSelected}
              aria-label={tab.title || tab.label}
            >
              <span className="expandable-tab-icon">
                {React.isValidElement(Icon) ? (
                  Icon
                ) : typeof Icon === 'function' || typeof Icon === 'object' ? (
                  <Icon size={18} />
                ) : null}
              </span>
              <AnimatePresence initial={false}>
                {isSelected && (
                  <motion.span
                    variants={spanVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={transition}
                    className="expandable-tab-title"
                  >
                    {tab.title || tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
