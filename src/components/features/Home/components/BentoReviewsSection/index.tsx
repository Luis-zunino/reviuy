'use client';

import { LazyMotion, m, domAnimation, Variants } from 'framer-motion';
import { Star, MapPin, ThumbsUp, Quote } from 'lucide-react';
import { manrope, playfair } from '@/constants/fonts.constant';
import { cn } from '@/lib/utils/cn';

// Mock data for featured reviews
const featuredReviews = [
  {
    id: 1,
    title: 'Excelente edificio en Pocitos',
    excerpt:
      'Vivi 3 anos en este edificio. El portero es muy amable, la administracion responde rapido y el estado general es impecable.',
    rating: 5,
    location: 'Pocitos, Montevideo',
    likes: 42,
    size: 'large',
  },
  {
    id: 2,
    title: 'Buena experiencia',
    excerpt: 'Departamento bien mantenido, vecinos tranquilos.',
    rating: 4,
    location: 'Cordon, Montevideo',
    likes: 28,
    size: 'small',
  },
  {
    id: 3,
    title: 'Recomendado',
    excerpt: 'Inmobiliaria seria y profesional.',
    rating: 5,
    location: 'Punta Carretas',
    likes: 35,
    size: 'small',
  },
  {
    id: 4,
    title: 'Muy buen barrio',
    excerpt:
      'Zona segura, cerca de todo. El edificio tiene buena iluminacion y las areas comunes estan siempre limpias. Recomiendo.',
    rating: 4,
    location: 'Malvin, Montevideo',
    likes: 31,
    size: 'medium',
  },
  {
    id: 5,
    title: 'Destaco la atencion',
    excerpt: 'El propietario fue muy atento con todos los detalles.',
    rating: 5,
    location: 'Centro',
    likes: 19,
    size: 'small',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
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

interface ReviewCardProps {
  review: (typeof featuredReviews)[0];
  className?: string;
}

const ReviewCard = ({ review, className }: ReviewCardProps) => {
  return (
    <m.article
      variants={cardVariants}
      whileHover={{
        y: -6,
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      className={cn(
        'group relative flex flex-col rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50  dark:bg-reviuy-gray-800/50 p-5 shadow-sm transition-all duration-300',
        'hover:border-zinc-300/70 dark:hover:border-zinc-600/70 hover:shadow-lg',
        className
      )}
    >
      {/* Quote icon */}
      <Quote className="absolute right-4 top-4 size-6 text-reviuy-gray-200 dark:text-reviuy-gray-600 transition-colors duration-300 group-hover:text-reviuy-gray-400 dark:group-hover:text-reviuy-gray-400" />

      {/* Rating */}
      <div className="mb-3 flex items-center gap-1">
        {new Array(5).map((element, i) => (
          <Star
            key={element}
            className={cn(
              'size-4',
              i < review.rating
                ? 'fill-reviuy-gray-500 text-reviuy-gray-500'
                : 'fill-reviuy-gray-200 dark:fill-reviuy-gray-600 text-reviuy-gray-200 dark:text-reviuy-gray-600'
            )}
          />
        ))}
      </div>

      <h3
        className={`${manrope.className} mb-2 text-base font-semibold text-foreground line-clamp-2`}
      >
        {review.title}
      </h3>

      <p
        className={`${manrope.className} mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3`}
      >
        {review.excerpt}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-reviuy-gray-200 dark:border-reviuy-gray-700 pt-4">
        <div className="flex flex-col">
          <span
            className={`${manrope.className} flex items-center gap-1 text-sm font-medium text-foreground`}
          >
            <MapPin className="size-3" />
            {review.location}
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-reviuy-gray-50 dark:bg-reviuy-gray-700/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <ThumbsUp className="size-3" />
          {review.likes}
        </div>
      </div>
    </m.article>
  );
};

/**
 * Bento Reviews Section - Dynamic grid layout for featured reviews
 * Implements Bento Grid design pattern with subtle borders and soft shadows
 */
export const BentoReviewsSection = () => {
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
            className="mb-12"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2
                  className={`${playfair.className} text-3xl font-bold text-foreground md:text-4xl`}
                >
                  Reseñas destacadas
                </h2>
                <p className={`${manrope.className} mt-3 max-w-xl text-muted-foreground`}>
                  Experiencias reales de inquilinos que ya encontraron su hogar
                </p>
              </div>
              <m.a
                href="/review"
                whileHover={{ x: 4 }}
                className={`${manrope.className} group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-foreground/70`}
              >
                Ver todas las reseñas{' '}
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  &rarr;
                </span>
              </m.a>
            </div>
          </m.div>

          {/* Bento Grid */}
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2"
          >
            {/* Large card - spans 2 rows on lg */}
            <ReviewCard
              review={featuredReviews[0]}
              className="sm:col-span-2 lg:col-span-1 lg:row-span-2"
            />

            {/* Small cards */}
            <ReviewCard review={featuredReviews[1]} />
            <ReviewCard review={featuredReviews[2]} />

            {/* Medium card - spans 2 columns on lg */}
            <ReviewCard review={featuredReviews[3]} className="lg:col-span-2" />
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
};
