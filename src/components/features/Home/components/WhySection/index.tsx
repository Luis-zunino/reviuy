'use client';

import { motion } from 'framer-motion';
import { Search, Star, Users, ArrowRight } from 'lucide-react';
import { manrope, playfair } from '@/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PagesUrls } from '@/enums';
import { Box } from '@/components/common';

const features = [
  {
    icon: Search,
    title: 'Busca por direccion',
    description: 'Filtra por zona y ve experiencias reales de vecinos e inquilinos.',
    color: 'text-reviuy-primary-600 dark:text-reviuy-primary-400',
    bgColor: 'bg-reviuy-primary-50 dark:bg-reviuy-primary-500/10',
    borderColor: 'border-reviuy-primary-100 dark:border-reviuy-primary-500/20',
  },
  {
    icon: Star,
    title: 'Evalua antes de alquilar',
    description:
      'Entende el estado del inmueble, el trato del propietario y el contexto del barrio.',
    color: 'text-reviuy-success-600 dark:text-reviuy-success-500',
    bgColor: 'bg-reviuy-success-50 dark:bg-reviuy-success-500/10',
    borderColor: 'border-reviuy-success-100 dark:border-reviuy-success-500/20',
  },
  {
    icon: Users,
    title: 'Comparti y protege',
    description: 'Tu resena ayuda a toda la comunidad a tomar decisiones mas seguras.',
    color: 'text-reviuy-secondary-600 dark:text-reviuy-secondary-500',
    bgColor: 'bg-reviuy-secondary-50 dark:bg-reviuy-secondary-500/10',
    borderColor: 'border-reviuy-secondary-100 dark:border-reviuy-secondary-500/20',
  },
];

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

/**
 * Why Section - Explains why ReviUy works
 * Clean grid layout with hover interactions
 */
export const WhySection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Box className="rounded-3xl border border-reviuy-gray-200/60 dark:border-reviuy-gray-700/50  p-8 shadow-sm md:p-12 lg:p-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="mb-12 max-w-2xl"
          >
            <h2
              className={`${playfair.className} text-3xl font-bold text-reviuy-gray-900 dark:text-white md:text-4xl`}
            >
              Por que ReviUy funciona
            </h2>
            <p
              className={`${manrope.className} mt-4 text-lg leading-relaxed text-reviuy-gray-600 dark:text-reviuy-gray-400`}
            >
              Tomamos resenas reales y las convertimos en una decision clara para tu proximo
              alquiler.
            </p>
          </motion.div>

          {/* Features grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-6 md:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.25, ease: 'easeOut' },
                }}
                className={cn(
                  'group relative flex flex-col rounded-2xl border  dark:bg-reviuy-gray-800/80 p-6 transition-all duration-300',
                  feature.borderColor,
                  'hover:shadow-lg hover:border-opacity-70'
                )}
              >
                <div
                  className={cn(
                    'mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                    feature.bgColor
                  )}
                >
                  <feature.icon className={cn('h-6 w-6', feature.color)} />
                </div>

                <h3
                  className={`${manrope.className} mb-3 text-lg font-bold text-reviuy-gray-900 dark:text-white`}
                >
                  {feature.title}
                </h3>

                <p
                  className={`${manrope.className} flex-1 text-sm leading-relaxed text-reviuy-gray-600 dark:text-reviuy-gray-400`}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex justify-center"
          >
            <Link
              href={PagesUrls.REVIEW_CREATE}
              className={cn(
                manrope.className,
                'group inline-flex items-center gap-2 rounded-xl bg-reviuy-primary-600 dark:bg-reviuy-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-reviuy-primary-700 dark:hover:bg-reviuy-primary-600 hover:shadow-md'
              )}
            >
              Escribi tu primera resena
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </Box>
      </div>
    </section>
  );
};
