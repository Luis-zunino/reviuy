'use client';

import { LazyMotion, m, domAnimation, Variants } from 'framer-motion';
import { MapPin, Star, MessageSquareText, ArrowRight, Users } from 'lucide-react';
import { manrope, playfair } from '@/constants/fonts.constant';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

/**
 * Zonas más comentadas - Reemplaza el viejo carrusel de edificios
 * En lugar de mostrar "propiedades destacadas" (marketplace),
 * muestra zonas geográficas con métricas de reseñas (review platform).
 */
const zones = [
  {
    name: 'Pocitos',
    region: 'Montevideo',
    reviewCount: 342,
    avgRating: 4.2,
    tenantCount: 890,
    topComment: 'Uno de los barrios con mejor iluminación y más servicios',
    color:
      'from-reviuy-primary-50 to-reviuy-secondary-50/30 dark:from-reviuy-primary-950/30 dark:to-reviuy-secondary-950/20',
    borderColor: 'border-reviuy-primary-100/50 dark:border-reviuy-primary-800/30',
  },
  {
    name: 'Cordón',
    region: 'Montevideo',
    reviewCount: 218,
    avgRating: 3.9,
    tenantCount: 567,
    topComment: 'Buena conexión de transporte, edificios con historia',
    color:
      'from-reviuy-primary-50/50 to-reviuy-gray-100/30 dark:from-reviuy-primary-950/20 dark:to-reviuy-gray-800/30',
    borderColor: 'border-reviuy-gray-200/50 dark:border-reviuy-gray-700/30',
  },
  {
    name: 'Punta Carretas',
    region: 'Montevideo',
    reviewCount: 189,
    avgRating: 4.5,
    tenantCount: 423,
    topComment: 'Zona residencial tranquila, ideal para familias',
    color:
      'from-reviuy-success-50/40 to-reviuy-primary-50/30 dark:from-reviuy-success-950/20 dark:to-reviuy-primary-950/20',
    borderColor: 'border-reviuy-success-100/40 dark:border-reviuy-success-900/30',
  },
  {
    name: 'Centro',
    region: 'Montevideo',
    reviewCount: 267,
    avgRating: 3.6,
    tenantCount: 712,
    topComment: 'Todo cerca, pero puede ser ruidoso según la cuadra',
    color:
      'from-reviuy-secondary-50/30 to-reviuy-primary-50/20 dark:from-reviuy-secondary-950/20 dark:to-reviuy-primary-950/20',
    borderColor: 'border-reviuy-secondary-100/40 dark:border-reviuy-secondary-900/30',
  },
  {
    name: 'Malvín',
    region: 'Montevideo',
    reviewCount: 156,
    avgRating: 4.1,
    tenantCount: 398,
    topComment: 'Playa cerca, barrio tranquilo y buena comunidad',
    color:
      'from-reviuy-primary-50/40 to-reviuy-success-50/20 dark:from-reviuy-primary-950/20 dark:to-reviuy-success-950/20',
    borderColor: 'border-reviuy-primary-100/40 dark:border-reviuy-primary-800/30',
  },
  {
    name: 'Carrasco',
    region: 'Montevideo',
    reviewCount: 134,
    avgRating: 4.4,
    tenantCount: 312,
    topComment: 'Barrio premium, edificios cuidados y buena seguridad',
    color:
      'from-reviuy-primary-50/30 to-reviuy-gray-100/30 dark:from-reviuy-primary-950/20 dark:to-reviuy-gray-800/30',
    borderColor: 'border-reviuy-gray-200/40 dark:border-reviuy-gray-700/30',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/**
 * ReviewedZones - Muestra las zonas más comentadas
 * Enfocado en opiniones y métricas de reseñas, no en propiedades
 */
export const ReviewedZones = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <h2
                className={`${playfair.className} text-3xl font-bold text-reviuy-gray-900 dark:text-white md:text-4xl`}
              >
                Barrios más comentados
              </h2>
              <p
                className={`${manrope.className} mt-3 max-w-xl text-base leading-relaxed text-reviuy-gray-600 dark:text-reviuy-gray-400`}
              >
                Descubrí lo que dicen los inquilinos sobre cada zona antes de decidir
              </p>
            </div>
            <Link
              href="/explorar"
              className={cn(
                manrope.className,
                'group hidden items-center gap-2 text-sm font-semibold text-reviuy-primary-600 dark:text-reviuy-primary-400 transition-colors hover:text-reviuy-primary-700 dark:hover:text-reviuy-primary-300 md:inline-flex'
              )}
            >
              Explorar todas las zonas
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </m.div>

          {/* Zone grid */}
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* Primer card más grande - doble columna en lg */}
            <m.div
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={cn(
                'group relative flex flex-col rounded-2xl border bg-linear-to-br p-6 shadow-sm transition-all duration-300 hover:shadow-lg sm:col-span-2 lg:col-span-1 lg:row-span-2',
                zones[0].color,
                zones[0].borderColor
              )}
            >
              {/* Rating grande */}
              <div className="mb-4 flex items-center gap-2">
                <span
                  className={`${playfair.className} text-5xl font-bold text-reviuy-primary-700 dark:text-reviuy-primary-300`}
                >
                  {zones[0].avgRating}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'size-3.5',
                          i < Math.round(zones[0].avgRating)
                            ? 'fill-reviuy-secondary-400 text-reviuy-secondary-400'
                            : 'fill-reviuy-gray-200 dark:fill-reviuy-gray-700 text-reviuy-gray-200 dark:text-reviuy-gray-600'
                        )}
                      />
                    ))}
                  </div>
                  <span
                    className={`${manrope.className} text-xs text-reviuy-gray-500 dark:text-reviuy-gray-400`}
                  >
                    calificación general
                  </span>
                </div>
              </div>

              <h3
                className={`${manrope.className} mb-1 text-xl font-bold text-reviuy-gray-900 dark:text-white`}
              >
                {zones[0].name}
              </h3>
              <p
                className={`${manrope.className} mb-4 flex items-center gap-1 text-sm text-reviuy-gray-500 dark:text-reviuy-gray-400`}
              >
                <MapPin className="size-3.5" />
                {zones[0].region}
              </p>

              {/* Stats */}
              <div className="mb-4 flex items-center gap-4">
                <span
                  className={`${manrope.className} flex items-center gap-1.5 text-sm font-medium text-reviuy-gray-700 dark:text-reviuy-gray-300`}
                >
                  <MessageSquareText className="size-4 text-reviuy-primary-500" />
                  {zones[0].reviewCount} reseñas
                </span>
                <span
                  className={`${manrope.className} flex items-center gap-1.5 text-sm font-medium text-reviuy-gray-700 dark:text-reviuy-gray-300`}
                >
                  <Users className="size-4 text-reviuy-secondary-500" />
                  {zones[0].tenantCount} inquilinos
                </span>
              </div>

              {/* Quote */}
              <div className="mt-auto rounded-xl border border-reviuy-primary-100/40 dark:border-reviuy-primary-800/30 bg-white/40 dark:bg-reviuy-gray-800/40 px-4 py-3 backdrop-blur-sm">
                <p
                  className={`${manrope.className} text-sm italic leading-relaxed text-reviuy-gray-600 dark:text-reviuy-gray-400`}
                >
                  &ldquo;{zones[0].topComment}&rdquo;
                </p>
              </div>
            </m.div>

            {/* Cards regulares */}
            {zones.slice(1).map((zone) => (
              <m.div
                key={zone.name}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={cn(
                  'group relative flex flex-col rounded-2xl border bg-linear-to-br p-5 shadow-sm transition-all duration-300 hover:shadow-lg',
                  zone.color,
                  zone.borderColor
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3
                      className={`${manrope.className} text-base font-bold text-reviuy-gray-900 dark:text-white`}
                    >
                      {zone.name}
                    </h3>
                    <p
                      className={`${manrope.className} flex items-center gap-1 text-xs text-reviuy-gray-500 dark:text-reviuy-gray-400`}
                    >
                      <MapPin className="size-3" />
                      {zone.region}
                    </p>
                  </div>
                  {/* Rating badge */}
                  <div className="flex items-center gap-1 rounded-full bg-white/60 dark:bg-reviuy-gray-800/60 px-2.5 py-1 shadow-xs backdrop-blur-sm">
                    <Star className="size-3 fill-reviuy-secondary-400 text-reviuy-secondary-400" />
                    <span
                      className={`${manrope.className} text-sm font-bold text-reviuy-gray-800 dark:text-reviuy-gray-200`}
                    >
                      {zone.avgRating}
                    </span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="mb-3 flex items-center gap-3 text-xs text-reviuy-gray-500 dark:text-reviuy-gray-400">
                  <span className="flex items-center gap-1">
                    <MessageSquareText className="size-3.5" />
                    {zone.reviewCount} reseñas
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" />
                    {zone.tenantCount} inquilinos
                  </span>
                </div>

                {/* Top comment */}
                <p
                  className={`${manrope.className} text-sm italic leading-relaxed text-reviuy-gray-600 dark:text-reviuy-gray-400 line-clamp-2`}
                >
                  &ldquo;{zone.topComment}&rdquo;
                </p>
              </m.div>
            ))}
          </m.div>

          {/* Mobile CTA */}
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex justify-center md:hidden"
          >
            <Link
              href="/explorar"
              className={cn(
                manrope.className,
                'group inline-flex items-center gap-2 rounded-xl border border-reviuy-primary-200 dark:border-reviuy-primary-500/30 bg-white dark:bg-reviuy-gray-800 px-5 py-2.5 text-sm font-semibold text-reviuy-primary-700 dark:text-reviuy-primary-400 shadow-sm transition-all hover:shadow-md'
              )}
            >
              Explorar todas las zonas
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
};
