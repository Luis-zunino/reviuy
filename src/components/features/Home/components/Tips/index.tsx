'use client';

import { motion } from 'framer-motion';
import { PagesUrls } from '@/enums';
import { manrope, playfair } from '@/constants';
import { cn } from '@/lib/utils';
import { tips } from '@/services/mocks/tips.mock';
import { ShieldCheck, ArrowRight, Home, Handshake, Scale } from 'lucide-react';
import Link from 'next/link';

const tipIcons = [Home, Handshake, Scale];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const tipTitles = ['Evalua la experiencia', 'Inmobiliarias confiables', 'Derechos del inquilino'];

const tipDescriptions = [
  'Como revisar propiedades mas alla de fotos: visita el vecindario, habla con actuales inquilinos.',
  'Senales de una inmobiliaria seria: transparencia, respuesta rapida, sin presion.',
  'Protege tu experiencia: conoce tus derechos, clausulas clave y garantias legales.',
];

/**
 * Tips Section - Blog tips with improved styling
 * Features subtle gradient background and smooth animations
 */
export const Tips = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'overflow-hidden rounded-3xl border border-reviuy-gray-200/60 dark:border-reviuy-gray-700/50 p-8 shadow-sm md:p-12',
            'bg-gradient-to-br from-white via-reviuy-secondary-50/20 to-reviuy-primary-50/30',
            'dark:from-reviuy-gray-800 dark:via-reviuy-secondary-900/10 dark:to-reviuy-primary-900/10'
          )}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2
                className={`${playfair.className} text-2xl font-bold text-reviuy-gray-900 dark:text-white md:text-3xl`}
              >
                Te ayudamos a tomar la mejor decision
              </h2>
              <p
                className={`${manrope.className} mt-2 text-reviuy-gray-600 dark:text-reviuy-gray-400`}
              >
                Consejos y guias para una mejor experiencia
              </p>
            </div>
            <Link
              href={PagesUrls.TIPS}
              className={cn(
                manrope.className,
                'group hidden items-center gap-2 rounded-full border border-reviuy-primary-200 dark:border-reviuy-primary-500/30  dark:bg-reviuy-gray-800 px-4 py-2 text-sm font-semibold text-reviuy-primary-700 dark:text-reviuy-primary-400 shadow-sm transition-all hover:border-reviuy-primary-300 dark:hover:border-reviuy-primary-500/50 hover:shadow-md md:inline-flex'
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              Ver todos
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Tips grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-6 md:grid-cols-3"
          >
            {tips.slice(0, 3).map((tip, index) => {
              const Icon = tipIcons[index];
              return (
                <motion.div key={tip.id} variants={itemVariants}>
                  <Link
                    href={PagesUrls.TIPS_DETAILS.replace(':id', tip.id)}
                    className="group flex h-full flex-col rounded-2xl border border-reviuy-gray-200/60 dark:border-reviuy-gray-700/50  dark:bg-reviuy-gray-800/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-reviuy-gray-300 dark:hover:border-reviuy-gray-600 hover:shadow-lg"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-reviuy-gray-100 dark:bg-reviuy-gray-700/50 text-reviuy-gray-600 dark:text-reviuy-gray-400 transition-colors duration-300 group-hover:bg-reviuy-primary-50 dark:group-hover:bg-reviuy-primary-500/10 group-hover:text-reviuy-primary-600 dark:group-hover:text-reviuy-primary-400">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3
                      className={`${manrope.className} mb-2 text-base font-semibold text-reviuy-gray-900 dark:text-white`}
                    >
                      {tipTitles[index]}
                    </h3>

                    <p
                      className={`${manrope.className} flex-1 text-sm leading-relaxed text-reviuy-gray-600 dark:text-reviuy-gray-400`}
                    >
                      {tipDescriptions[index]}
                    </p>

                    <span
                      className={`${manrope.className} mt-4 inline-flex items-center gap-1 text-sm font-medium text-reviuy-primary-600 dark:text-reviuy-primary-400 transition-colors group-hover:text-reviuy-primary-700 dark:group-hover:text-reviuy-primary-300`}
                    >
                      Leer mas
                      <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Mobile CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex justify-center md:hidden"
          >
            <Link
              href={PagesUrls.TIPS}
              className={cn(
                manrope.className,
                'group inline-flex items-center gap-2 rounded-full border border-reviuy-primary-200 dark:border-reviuy-primary-500/30  dark:bg-reviuy-gray-800 px-4 py-2 text-sm font-semibold text-reviuy-primary-700 dark:text-reviuy-primary-400 shadow-sm'
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              Ver todos los consejos
              <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
