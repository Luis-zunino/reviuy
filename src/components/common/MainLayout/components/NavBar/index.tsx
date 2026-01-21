'use client';

import Link from 'next/link';
import {
  Home,
  Building2,
  HelpCircle,
  Lightbulb,
  Menu,
  UserRoundCog,
  FilePenLine,
  LogOut,
  Contact,
} from 'lucide-react';
import { PagesUrls } from '@/enums';
import { Button } from '@/components/ui/button';
import { Logo } from './components/Logo';
import { useNavBar } from './hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavBarItem } from './components/NavBarItem';

export const NavBar = () => {
  const { isAuthenticated, opacity, signOut } = useNavBar();

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        borderBottom: `1px solid rgba(229, 231, 235, ${opacity})`,
        backdropFilter: opacity > 0 && opacity < 1 ? 'blur(8px)' : 'none',
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
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-600 transition-colors h-8"
            >
              <FilePenLine className="w-4 h-4" />
              Escribir reseña
            </Link>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild className="h-8 hover:cursor-pointer">
                <Button
                  variant="ghost"
                  className="min-h-8 items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-600 transition-colors h-8"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <NavBarItem pageUrl={PagesUrls.HOME} Icon={Home} label="Inicio" />
                <NavBarItem
                  pageUrl={PagesUrls.REAL_ESTATE}
                  Icon={Building2}
                  label="Inmobiliarias"
                />
                <NavBarItem pageUrl={PagesUrls.TIPS} Icon={Lightbulb} label="Tips" />
                <NavBarItem pageUrl={PagesUrls.FAQ} Icon={HelpCircle} label="FAQ" />
                <NavBarItem
                  pageUrl={PagesUrls.REVIEW_CREATE}
                  Icon={FilePenLine}
                  label="Escribir reseña"
                />
                {isAuthenticated ? (
                  <>
                    <NavBarItem
                      pageUrl={PagesUrls.CONTACT}
                      Icon={Contact}
                      label="Contáctanos"
                      showInDesktop={true}
                    />
                    <NavBarItem
                      pageUrl={PagesUrls.PROFILE}
                      Icon={UserRoundCog}
                      label="Perfil"
                      showInDesktop={true}
                    />
                    <NavBarItem
                      variant="destructive"
                      Icon={LogOut}
                      onClick={signOut}
                      label="Cerrar sesión"
                      showInDesktop={true}
                    />
                  </>
                ) : (
                  <NavBarItem
                    pageUrl={PagesUrls.LOGIN}
                    Icon={UserRoundCog}
                    label="Iniciar sesión"
                    showInDesktop={true}
                  />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
