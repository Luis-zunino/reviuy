'use client';

import { LazyMotion, m, domAnimation } from 'framer-motion';
import { SearcherAddressHomeSection } from '../SearcherAddressHomeSection';
import { playfair, manrope } from '@/constants/fonts.constant';
import { Quote, Star, MapPin } from 'lucide-react';

// Micro-testimonial flotante para mostrar reseñas desde el hero
const floatingReviews = [
  {
    text: 'Me avisaron antes de firmar que el edificio tenía problemas de humedad',
    rating: 5,
    location: 'Pocitos',
  },
  {
    text: 'La inmobiliaria no respondía los reclamos. Ojalá hubiera leído esto antes',
    rating: 2,
    location: 'Cordón',
  },
];

/**
 * Hero Section - Rediseñado con filosofía editorial
 * El centro ya no es "encontrá tu hogar" sino "leé experiencias reales"
 * Las reseñas flotantes refuerzan que acá se leen opiniones, no se buscan propiedades
 */
export const HeroSection = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Fondo más editorial - sutiles líneas de textura */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,0,0,0.03),transparent),radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(0,0,0,0.02),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.04),transparent),radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(255,255,255,0.03),transparent)]" />
          {/* Línea editorial sutil */}
          <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-reviuy-gray-300/30 to-transparent dark:via-reviuy-gray-500/20" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Badge - más editorial, menos badge de startup */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`${manrope.className} mb-8 inline-flex items-center gap-2 rounded-full border border-reviuy-gray-300/40 dark:border-reviuy-gray-500/20 bg-reviuy-gray-50/60 dark:bg-reviuy-gray-800/60 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-foreground backdrop-blur-sm`}
            >
              <span className="size-1.5 rounded-full bg-reviuy-gray-500" />
              Opiniones verificadas · Uruguay
            </m.div>

            {/* Main heading - reframed a review-first */}
            <m.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className={`${playfair.className} mb-4 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl`}
            >
              Antes de alquilar,
              <m.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-2 block bg-linear-to-r from-reviuy-gray-700 via-reviuy-gray-600 to-reviuy-gray-500 dark:from-reviuy-gray-300 dark:via-reviuy-gray-400 dark:to-reviuy-gray-500 bg-clip-text text-transparent"
              >
                leé experiencias reales
              </m.span>
            </m.h1>

            {/* Subheading - énfasis en información, no en transacción */}
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
              className={`${manrope.className} mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg`}
            >
              Opiniones detalladas de inquilinos sobre propiedades e inmobiliarias en Uruguay. Sabé
              lo que te espera antes de firmar, no después.
            </m.p>

            {/* Search box */}
            <m.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
              className="w-full max-w-2xl"
            >
              <div className="rounded-2xl border border-reviuy-gray-200/70 dark:border-reviuy-gray-700/50 bg-white/80 dark:bg-reviuy-gray-800/80 p-2 shadow-lg shadow-reviuy-gray-200/50 dark:shadow-black/20 backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-reviuy-gray-200/60 dark:hover:shadow-black/30">
                <SearcherAddressHomeSection />
              </div>
              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className={`${manrope.className} mt-3 text-sm font-medium text-muted-foreground`}
              >
                Buscá una dirección y leé lo que dicen los que vivieron ahí
              </m.p>
            </m.div>

            {/* Micro-reseñas flotantes - refuerzan que el contenido son experiencias */}
            <div className="mt-16 hidden md:block">
              <div className="flex gap-6">
                {floatingReviews.map((review, i) => (
                  <m.div
                    key={review.text.slice(0, 10)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.15, ease: 'easeOut' }}
                    className="flex max-w-sm items-start gap-3 rounded-xl border border-reviuy-gray-200/40 dark:border-reviuy-gray-700/30 bg-white/60 dark:bg-card/40 px-4 py-3 backdrop-blur-sm"
                  >
                    <Quote className="mt-0.5 size-4 shrink-0 text-reviuy-gray-400/60" />
                    <div className="text-left">
                      <p
                        className={`${manrope.className} text-sm leading-relaxed text-muted-foreground line-clamp-2`}
                      >
                        &ldquo;{review.text}&rdquo;
                      </p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: review.rating }).map((_, j) => (
                            <Star
                              key={j}
                              className="size-3 fill-reviuy-gray-400 text-reviuy-gray-400"
                            />
                          ))}
                        </div>
                        <span
                          className={`${manrope.className} flex items-center gap-1 text-xs text-muted-foreground`}
                        >
                          <MapPin className="size-3" />
                          {review.location}
                        </span>
                      </div>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};
