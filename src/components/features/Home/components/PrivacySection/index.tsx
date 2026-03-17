'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, CheckCircle2 } from 'lucide-react';
import { manrope, playfair } from '@/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PagesUrls } from '@/enums';

const privacyFeatures = [
  {
    icon: Lock,
    title: 'Encriptacion de datos',
    description: 'Toda la informacion se transmite y almacena con cifrado de grado bancario.',
  },
  {
    icon: Eye,
    title: 'Anonimato protegido',
    description: 'Tu identidad nunca se revela sin tu consentimiento explicito.',
  },
  {
    icon: Database,
    title: 'Row Level Security',
    description: 'Usamos Supabase RLS para que solo puedas acceder a tus propios datos.',
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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Privacy Section - Explains data protection using Supabase RLS
 * Visually appealing component with trust-building design
 */
export const PrivacySection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-reviuy-gray-200/60 dark:border-reviuy-gray-700/50 bg-gradient-to-br from-white via-white to-reviuy-primary-50/30 dark:from-reviuy-gray-800 dark:via-reviuy-gray-800 dark:to-reviuy-primary-900/20 shadow-sm">
          <div className="grid gap-8 p-8 md:grid-cols-2 md:gap-12 md:p-12 lg:p-16">
            {/* Left side - Content */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-reviuy-success-200 dark:border-reviuy-success-500/30 bg-reviuy-success-50 dark:bg-reviuy-success-500/10 px-4 py-2 text-sm font-medium text-reviuy-success-700 dark:text-reviuy-success-400">
                  <Shield className="h-4 w-4" />
                  Cumplimiento normativa uruguaya
                </div>

                <h2 className={`${playfair.className} mb-4 text-3xl font-bold text-reviuy-gray-900 dark:text-white md:text-4xl`}>
                  Tu privacidad es nuestra prioridad
                </h2>

                <p className={`${manrope.className} mb-8 text-base leading-relaxed text-reviuy-gray-600 dark:text-reviuy-gray-400 md:text-lg`}>
                  Implementamos las mejores practicas de seguridad para proteger tu identidad 
                  y datos personales, cumpliendo con la Ley N 18.331 de Proteccion de Datos Personales.
                </p>

                {/* Features list */}
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="space-y-5"
                >
                  {privacyFeatures.map((feature) => (
                    <motion.li
                      key={feature.title}
                      variants={itemVariants}
                      className="flex items-start gap-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-reviuy-primary-50 dark:bg-reviuy-primary-500/10 text-reviuy-primary-600 dark:text-reviuy-primary-400">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className={`${manrope.className} text-base font-semibold text-reviuy-gray-900 dark:text-white`}>
                          {feature.title}
                        </h3>
                        <p className={`${manrope.className} mt-1 text-sm text-reviuy-gray-600 dark:text-reviuy-gray-400`}>
                          {feature.description}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-8"
                >
                  <Link
                    href={PagesUrls.PRIVACY_POLICY}
                    className={cn(
                      manrope.className,
                      'inline-flex items-center gap-2 text-sm font-semibold text-reviuy-primary-600 dark:text-reviuy-primary-400 transition-colors hover:text-reviuy-primary-700 dark:hover:text-reviuy-primary-300'
                    )}
                  >
                    Conoce nuestra politica de privacidad
                    <span className="transition-transform duration-200 hover:translate-x-1">
                      &rarr;
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Right side - Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative">
                {/* Background circles */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-reviuy-primary-100/40 dark:bg-reviuy-primary-500/10 blur-3xl" />
                  <div className="absolute left-1/3 top-1/3 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-reviuy-success-100/50 dark:bg-reviuy-success-500/10 blur-2xl" />
                </div>

                {/* Main shield icon */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex h-48 w-48 items-center justify-center rounded-3xl border border-reviuy-gray-200/60 dark:border-reviuy-gray-700/50 bg-white dark:bg-reviuy-gray-800/80 shadow-xl shadow-reviuy-primary-100/20 dark:shadow-reviuy-primary-900/10 md:h-64 md:w-64"
                >
                  <Shield className="h-24 w-24 text-reviuy-primary-500 dark:text-reviuy-primary-400 md:h-32 md:w-32" />
                  
                  {/* Floating badges */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="absolute -right-4 -top-4 flex items-center gap-1.5 rounded-full border border-reviuy-success-200 dark:border-reviuy-success-500/30 bg-white dark:bg-reviuy-gray-800 px-3 py-1.5 shadow-lg md:-right-6"
                  >
                    <CheckCircle2 className="h-4 w-4 text-reviuy-success-500" />
                    <span className={`${manrope.className} text-xs font-semibold text-reviuy-success-700 dark:text-reviuy-success-400`}>
                      Verificado
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="absolute -bottom-4 -left-4 flex items-center gap-1.5 rounded-full border border-reviuy-primary-200 dark:border-reviuy-primary-500/30 bg-white dark:bg-reviuy-gray-800 px-3 py-1.5 shadow-lg md:-left-6"
                  >
                    <Lock className="h-4 w-4 text-reviuy-primary-500 dark:text-reviuy-primary-400" />
                    <span className={`${manrope.className} text-xs font-semibold text-reviuy-primary-700 dark:text-reviuy-primary-400`}>
                      Encriptado
                    </span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
