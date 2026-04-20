import { useAuthContext } from '@/components/providers/AuthProvider';
import { useEffect, useState } from 'react';

export const useNavBar = () => {
  const { isAuthenticated, signOut } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const sharedStyles = 'flex items-center gap-2 transition-colors';

  useEffect(() => {
    const handleScroll = () => {
      const newOpacity = Math.min(window.scrollY / 100, 1);

      setOpacity((prev) => (prev !== newOpacity ? newOpacity : prev));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    isAuthenticated,
    opacity,
    signOut,
    sharedStyles,
    isOpen,
    setIsOpen,
  };
};
