import { useAuthContext } from '@/components/providers/AuthProvider';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useNavBar = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(0);

  const isActive = (route: string) => pathname === route || pathname.startsWith(route + '/');

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
    open,
    setOpen,
    scrolled,
    isActive,
  };
};
