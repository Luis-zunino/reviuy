'use client';

import { LazyMotion, m, domAnimation } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import { manrope, playfair } from '@/constants/fonts.constant';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import { PagesUrls } from '@/enums';

/**
 * Privacy Section - Simplificada y trasladada al final de la home
 * Ya no compite visualmente con las reseñas. Texto breve, CTA al policy.
 */
export const PrivacySection = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-reviuy-gray-200/50 dark:border-reviuy-gray-700/40  dark:bg-reviuy-gray-800/40 px-6 py-8 md:px-10 md:py-10"
          >
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              {/* Icon */}
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-reviuy-primary-50 dark:bg-reviuy-primary-500/10">
                <Shield className="size-7 text-reviuy-primary-600 dark:text-reviuy-primary-400" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h2
                  className={`${playfair.className} text-xl font-bold text-reviuy-gray-900 dark:text-white md:text-2xl`}
                >
                  Tus datos protegidos
                </h2>
                <p
                  className={`${manrope.className} mt-1 max-w-2xl text-sm leading-relaxed text-reviuy-gray-600 dark:text-reviuy-gray-400`}
                >
                  Cumplimos con la Ley N° 18.331 de Protección de Datos Personales de Uruguay. Tu
                  identidad nunca se revela sin tu consentimiento.
                </p>
              </div>

              {/* CTA */}
              <Link
                href={PagesUrls.PRIVACY_POLICY}
                className={cn(
                  manrope.className,
                  'group inline-flex shrink-0 items-center gap-2 rounded-xl border border-reviuy-primary-200 dark:border-reviuy-primary-500/30  dark:bg-reviuy-gray-800 px-5 py-2.5 text-sm font-semibold text-reviuy-primary-700 dark:text-reviuy-primary-400 shadow-sm transition-all hover:border-reviuy-primary-300 dark:hover:border-reviuy-primary-500/50 hover:shadow-md'
                )}
              >
                Política de privacidad
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
};
