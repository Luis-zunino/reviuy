import { useAuthContext } from '@/components/providers/AuthProvider';
import { useEffect, useState } from 'react';

export const useNavBar = () => {
  const { isAuthenticated, signOut } = useAuthContext();
  const [scrolled, setScrolled] = useState(0);
  useEffect(() => {
    const initialScroll = window.scrollY;

    const initialOpacity = Math.min(initialScroll / 100, 1);
    setScrolled(initialOpacity);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const opacity = Math.min(scrollPosition / 100, 1);
      setScrolled(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    isAuthenticated,
    scrolled,
    signOut,
  };
};
