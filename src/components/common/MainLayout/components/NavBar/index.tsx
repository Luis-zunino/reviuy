'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Building2,
  HelpCircle,
  Lightbulb,
  Menu,
  X,
  UserRoundCog,
  FilePenLine,
} from 'lucide-react';
import { PagesUrls } from '@/enums';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';

export const NavBar = () => {
  const pathname = usePathname();
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

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${scrolled})`,
        borderBottom: `1px solid rgba(229, 231, 235, ${scrolled})`,
        backdropFilter: scrolled > 0 && scrolled < 1 ? 'blur(8px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <div className="hidden md:flex items-center gap-6">
            <Link
              href={PagesUrls.REAL_ESTATE}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-gray-900`}
            >
              Inmobiliarias
            </Link>

            <Link
              href={PagesUrls.TIPS}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-gray-900`}
            >
              Tips
            </Link>

            <Link
              href={PagesUrls.FAQ}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-gray-900`}
            >
              FAQ
            </Link>
          </div>
          <div className="flex gap-2 items-center">
            <Link
              href={PagesUrls.REVIEW_CREATE}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FilePenLine className="w-4 h-4" />
              Escribir reseña
            </Link>
            <Link
              href={PagesUrls.PROFILE}
              className="hidden md:flex flex-1 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <UserRoundCog className="w-4 h-4" />
            </Link>
          </div>

          <Button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            variant="ghost"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm animate-slide-down">
          <div className="flex flex-col p-4 gap-2">
            <Link
              href={PagesUrls.HOME}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isActive(PagesUrls.HOME)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4" />
              Inicio
            </Link>

            <Link
              href={PagesUrls.REAL_ESTATE}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isActive(PagesUrls.REAL_ESTATE)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Inmobiliarias
            </Link>

            <Link
              href={PagesUrls.TIPS}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isActive(PagesUrls.TIPS)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              Tips
            </Link>

            <Link
              href={PagesUrls.FAQ}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isActive(PagesUrls.FAQ)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </Link>

            <Link
              href={PagesUrls.REVIEW_CREATE}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isActive(PagesUrls.REVIEW_CREATE)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <FilePenLine className="w-4 h-4" />
              Escribir reseña
            </Link>
            <Link
              href={PagesUrls.PROFILE}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isActive(PagesUrls.PROFILE)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <UserRoundCog className="w-4 h-4" />
              Perfil
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
