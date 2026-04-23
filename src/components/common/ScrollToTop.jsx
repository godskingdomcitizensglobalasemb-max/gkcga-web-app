import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Handles scrolling on route changes with proper error handling
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Function to scroll to top
    const scrollToTop = () => {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } catch (error) {
        // Fallback for browsers that don't support smooth scrolling
        window.scrollTo(0, 0);
      }
    };

    // Handle hash links (e.g., /about#team)
    if (hash) {
      const elementId = hash.replace('#', '');
      const element = document.getElementById(elementId);
      
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        return;
      }
    }

    // Use setTimeout to ensure DOM is fully rendered
    // This prevents scrolling issues with async-loaded content
    const timeoutId = setTimeout(scrollToTop, 100);

    // Cleanup timeout on unmount or route change
    return () => clearTimeout(timeoutId);
  }, [pathname, search, hash]); // React to all URL changes

  return null;
};

export default ScrollToTop;