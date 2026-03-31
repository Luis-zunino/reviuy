'use client';

import { motion } from 'framer-motion';
import { Star, Building2, Users, Shield } from 'lucide-react';
import { manrope, playfair } from '@/constants';

const stats = [
  {
    icon: Star,
    value: '2,500+',
    label: 'Resenas verificadas',
    color: 'text-reviuy-secondary-500',
    bgColor: 'bg-reviuy-secondary-50',
  },
  {
    icon: Building2,
    value: '850+',
    label: 'Edificios registrados',
    color: 'text-reviuy-primary-600',
    bgColor: 'bg-reviuy-primary-50',
  },
  {
    icon: Users,
    value: '5,000+',
    label: 'Inquilinos activos',
    color: 'text-reviuy-success-600',
    bgColor: 'bg-reviuy-success-50',
  },
  {
    icon: Shield,
    value: '100%',
    label: 'Datos protegidos',
    color: 'text-reviuy-gray-700',
    bgColor: 'bg-reviuy-gray-100',
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
 * Social Proof Section - Displays platform statistics
 * Clean, minimalist design with subtle animations
 */
export const SocialProofSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center "
        >
          <h2 className={`${playfair.className} text-2xl font-bold  md:text-3xl`}>
            La confianza de la comunidad
          </h2>
          <p className={`${manrope.className} mt-3`}>
            Miles de uruguayos ya comparten sus experiencias
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group flex flex-col items-center rounded-2xl border border-reviuy-gray-200/60  dark:bg-reviuy-gray-800/50  p-6 shadow-sm transition-all duration-300 hover:border-reviuy-gray-300 hover:shadow-lg md:p-8"
            >
              <div
                className={`mb-4 rounded-xl ${stat.bgColor} p-3 transition-transform duration-300 group-hover:scale-110`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className={`${playfair.className} text-2xl font-bold  md:text-3xl`}>
                {stat.value}
              </span>
              <span className={`${manrope.className} mt-1 text-center text-sm`}>{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
