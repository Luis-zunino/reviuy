'use client';

import { motion } from 'framer-motion';
import { SearcherAddressHomeSection } from '../SearcherAddressHomeSection';
import { playfair, manrope } from '@/constants';

/**
 * Hero Section - Landing page hero with minimalist search
 * Features smooth animations and clear value proposition
 */
export const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Subtle radial gradient background - adapts to dark mode */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.12),transparent),radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(249,115,22,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent),radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(251,146,60,0.1),transparent)]" />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`${manrope.className} mb-6 inline-flex items-center gap-2 rounded-full border border-reviuy-primary-200/60 dark:border-reviuy-primary-500/30 bg-white/80 dark:bg-reviuy-gray-800/80 px-5 py-2.5 text-sm font-medium text-reviuy-primary-700 dark:text-reviuy-primary-400 shadow-sm backdrop-blur-sm`}
          >
            <span className="h-2 w-2 rounded-full bg-reviuy-success-500 animate-pulse" />
            La comunidad de inquilinos de Uruguay
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className={`${playfair.className} mb-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-reviuy-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl`}
          >
            Encontra tu proximo hogar
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-2 block bg-gradient-to-r from-reviuy-primary-600 via-reviuy-primary-500 to-reviuy-secondary-500 dark:from-reviuy-primary-400 dark:via-reviuy-primary-300 dark:to-reviuy-secondary-400 bg-clip-text text-transparent"
            >
              con datos reales
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className={`${manrope.className} mb-10 max-w-2xl text-lg leading-relaxed text-reviuy-gray-600 dark:text-reviuy-gray-400 md:text-xl`}
          >
            Mira experiencias verificadas de inquilinos antes de firmar. 
            Evita malas sorpresas y toma decisiones informadas.
          </motion.p>

          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="w-full max-w-2xl"
          >
            <div className="rounded-2xl border border-reviuy-gray-200/80 dark:border-reviuy-gray-700/60 bg-white dark:bg-reviuy-gray-800/90 p-2 shadow-xl shadow-reviuy-primary-100/30 dark:shadow-reviuy-primary-900/20 transition-shadow duration-300 hover:shadow-2xl hover:shadow-reviuy-primary-100/40 dark:hover:shadow-reviuy-primary-900/30">
              <SearcherAddressHomeSection />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className={`${manrope.className} mt-4 text-sm font-medium text-reviuy-gray-500 dark:text-reviuy-gray-400`}
            >
              Busca por direccion y compara opiniones en segundos
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
