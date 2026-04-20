import { PagesUrls } from '@/enums';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  { name: 'Instagram', href: '#', Icon: Instagram },
  { name: 'Facebook', href: '#', Icon: Facebook },
  { name: 'LinkedIn', href: '#', Icon: Linkedin },
  { name: 'YouTube', href: '#', Icon: Youtube },
];

/**
 * Componente que muestra el footer de la página
 * @returns {JSX.Element}
 */
export const Footer = () => {
  return (
    <footer className="relative mt-16 w-full overflow-hidden border-t border-reviuy-gray-800 bg-reviuy-gray-950 text-reviuy-gray-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.28),transparent_42%),radial-gradient(circle_at_85%_80%,rgba(249,115,22,0.22),transparent_38%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-18">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          <div className="space-y-4 md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-reviuy-primary-300">
              ReviUy
            </p>
            <p className="text-2xl font-extrabold leading-tight text-white lg:text-3xl">
              Encontrá tu lugar ideal con reseñas reales
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-reviuy-gray-300">
              Información útil para alquilar con más criterio, más tranquilidad y menos sorpresas.
            </p>

            <div className="pt-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-reviuy-secondary-300">
                Redes
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    title={name}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-reviuy-gray-700 bg-reviuy-gray-900/70 text-reviuy-gray-200 transition-colors hover:border-reviuy-primary-500 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-reviuy-gray-800/90 bg-reviuy-gray-900/60 p-5 backdrop-blur-xs">
            <ul className="flex flex-col gap-3 text-sm">
              <li className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-reviuy-secondary-300">
                Empresa
              </li>
              <li>
                <Link
                  href={PagesUrls.ABOUT}
                  title="Información sobre ReviUy"
                  className="text-reviuy-gray-200 transition-colors hover:text-white"
                >
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link
                  href={PagesUrls.CONTACT}
                  title="Contáctanos"
                  className="text-reviuy-gray-200 transition-colors hover:text-white"
                >
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-reviuy-gray-800/90 bg-reviuy-gray-900/60 p-5 backdrop-blur-xs">
            <ul className="flex flex-col gap-3 text-sm">
              <li className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-reviuy-secondary-300">
                Legal
              </li>
              <li>
                <Link
                  href={PagesUrls.PRIVACY_POLICY}
                  title="Política de privacidad"
                  className="text-reviuy-gray-200 transition-colors hover:text-white"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href={PagesUrls.TERMS_AND_CONDITIONS}
                  title="Términos y condiciones de uso"
                  className="text-reviuy-gray-200 transition-colors hover:text-white"
                >
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link
                  href={PagesUrls.GOOD_PRACTICES}
                  title="Buenas prácticas"
                  className="text-reviuy-gray-200 transition-colors hover:text-white"
                >
                  Buenas prácticas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-reviuy-gray-800 pt-6 text-xs text-reviuy-gray-400 md:flex-row">
          <p>ReviUy</p>
          <p>Comunidad de inquilinos de Uruguay</p>
        </div>
      </div>
    </footer>
  );
};
