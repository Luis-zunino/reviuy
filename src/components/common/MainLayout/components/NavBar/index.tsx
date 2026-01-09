'use client';

import Link from 'next/link';
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
import { useNavBar } from './hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const NavBar = () => {
  const { isAuthenticated, open, setOpen, scrolled, isActive } = useNavBar();

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${scrolled})`,
        borderBottom: `1px solid rgba(229, 231, 235, ${scrolled})`,
        backdropFilter: scrolled > 0 && scrolled < 1 ? 'blur(8px)' : 'none',
      }}
    >
      <div className="xl:mx-40 mx-auto px-4 sm:px-6 lg:px-8">
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
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition-colors h-8"
            >
              <FilePenLine className="w-4 h-4" />
              Escribir reseña
            </Link>
            {isAuthenticated ? (
              <Link
                href={PagesUrls.PROFILE}
                className="hidden md:flex items-center justify-center px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition-colors h-8"
              >
                <UserRoundCog className="w-4 h-4" />
              </Link>
            ) : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild className="h-8 hover:cursor-pointer">
                  <Button
                    variant="ghost"
                    className="min-h-8 hidden md:flex items-center justify-center px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition-colors h-8"
                  >
                    <UserRoundCog className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      href={PagesUrls.LOGIN}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 hover:cursor-pointer"
                    >
                      <UserRoundCog className="w-4 h-4" />
                      Iniciar sesión
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
              href={isAuthenticated ? PagesUrls.PROFILE : PagesUrls.LOGIN}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isActive(PagesUrls.PROFILE)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <UserRoundCog className="w-4 h-4" />
              {isAuthenticated ? 'Perfil' : 'Iniciar sesión'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
