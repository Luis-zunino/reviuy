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
import { Logo } from './components/Logo';
import { useNavBar } from './hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavBarItem } from './components/NavBarItem';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const NavBar = () => {
  const { isAuthenticated, opacity, signOut, sharedStyles, isOpen, setIsOpen } = useNavBar();

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        opacity > 0 && 'bg-background/80 border-b border-border/50'
      )}
      style={{
        backdropFilter: opacity > 0 && opacity < 1 ? 'blur(8px)' : 'none',
      }}
      data-opacity={opacity}
    >
      <div className="xl:mx-40 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <div className="hidden md:flex items-center gap-6">
            <Link href={PagesUrls.REAL_ESTATE} className={sharedStyles}>
              Inmobiliarias
            </Link>

            <Link href={PagesUrls.TIPS} className={sharedStyles}>
              Tips
            </Link>

            <Link href={PagesUrls.FAQ} className={sharedStyles}>
              FAQ
            </Link>
          </div>
          <div className="flex gap-2 items-center">
            <ThemeToggle />
            <Link href={PagesUrls.REVIEW_CREATE} className={cn(sharedStyles, 'hidden md:flex')}>
              <FilePenLine className="w-4 h-4" />
              Escribir reseña
            </Link>
            <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild className="h-8 hover:cursor-pointer">
                <Link href="#" className={sharedStyles}>
                  <Menu className="w-6 h-6" />
                </Link>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
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
