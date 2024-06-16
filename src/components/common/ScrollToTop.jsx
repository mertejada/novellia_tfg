import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scroll to the top of the page when the route changes
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

export default ScrollToTop;