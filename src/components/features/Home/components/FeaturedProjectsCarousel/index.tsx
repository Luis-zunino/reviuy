'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Star, Building2 } from 'lucide-react';
import { manrope, playfair } from '@/constants';
import { cn } from '@/lib/utils';

// Mock data for featured projects/buildings
const featuredProjects = [
  {
    id: 1,
    name: 'Torres del Puerto',
    location: 'Ciudad Vieja, Montevideo',
    rating: 4.8,
    reviewCount: 127,
    image: '/images/building-1.jpg',
    description: 'Moderno complejo residencial con vista al puerto. Excelente mantenimiento y seguridad 24hs.',
    highlights: ['Piscina', 'Gimnasio', 'Seguridad 24hs'],
  },
  {
    id: 2,
    name: 'Edificio Arcobaleno',
    location: 'Pocitos, Montevideo',
    rating: 4.6,
    reviewCount: 89,
    image: '/images/building-2.jpg',
    description: 'Edificio clasico a pasos de la rambla. Departamentos amplios y luminosos.',
    highlights: ['Frente al mar', 'Garage', 'Terraza comun'],
  },
  {
    id: 3,
    name: 'Residencias del Parque',
    location: 'Punta Carretas, Montevideo',
    rating: 4.9,
    reviewCount: 156,
    image: '/images/building-3.jpg',
    description: 'Premium living frente al Parque Rodo. Amenities de primer nivel.',
    highlights: ['Vista al parque', 'Coworking', 'Pet friendly'],
  },
  {
    id: 4,
    name: 'Mirador Malvin',
    location: 'Malvin, Montevideo',
    rating: 4.5,
    reviewCount: 72,
    image: '/images/building-4.jpg',
    description: 'Complejo familiar en barrio residencial. Ideal para familias.',
    highlights: ['Parque infantil', 'Parrilleros', 'Estacionamiento'],
  },
];

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

/**
 * Featured Projects Carousel - Fluid carousel for featured buildings
 * Supports touch gestures and keyboard navigation
 */
export const FeaturedProjectsCarousel = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const projectIndex = ((page % featuredProjects.length) + featuredProjects.length) % featuredProjects.length;

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, paginate]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
  ) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const currentProject = featuredProjects[projectIndex];

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h2 className={`${playfair.className} text-3xl font-bold text-reviuy-gray-900 dark:text-white md:text-4xl`}>
              Edificios destacados
            </h2>
            <p className={`${manrope.className} mt-3 text-reviuy-gray-600 dark:text-reviuy-gray-400`}>
              Los proyectos mejor valorados por la comunidad
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                paginate(-1);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-reviuy-gray-200 dark:border-reviuy-gray-700 bg-white dark:bg-reviuy-gray-800 text-reviuy-gray-600 dark:text-reviuy-gray-400 shadow-sm transition-all hover:border-reviuy-gray-300 dark:hover:border-reviuy-gray-600 hover:shadow-md"
              aria-label="Proyecto anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                paginate(1);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-reviuy-gray-200 dark:border-reviuy-gray-700 bg-white dark:bg-reviuy-gray-800 text-reviuy-gray-600 dark:text-reviuy-gray-400 shadow-sm transition-all hover:border-reviuy-gray-300 dark:hover:border-reviuy-gray-600 hover:shadow-md"
              aria-label="Siguiente proyecto"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="cursor-grab active:cursor-grabbing"
            >
              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                {/* Image placeholder */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-reviuy-gray-200/60 dark:border-reviuy-gray-700/50 bg-gradient-to-br from-reviuy-gray-100 to-reviuy-gray-200 dark:from-reviuy-gray-800 dark:to-reviuy-gray-700 shadow-sm md:aspect-[3/2]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="h-24 w-24 text-reviuy-gray-300 dark:text-reviuy-gray-600" />
                  </div>
                  
                  {/* Rating badge */}
                  <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-reviuy-gray-800/95 px-3 py-1.5 shadow-lg backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-reviuy-secondary-400 text-reviuy-secondary-400" />
                    <span className={`${manrope.className} text-sm font-semibold text-reviuy-gray-900 dark:text-white`}>
                      {currentProject.rating}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center">
                  <h3 className={`${playfair.className} text-2xl font-bold text-reviuy-gray-900 dark:text-white md:text-3xl`}>
                    {currentProject.name}
                  </h3>
                  
                  <div className={`${manrope.className} mt-2 flex items-center gap-1.5 text-sm text-reviuy-gray-600 dark:text-reviuy-gray-400`}>
                    <MapPin className="h-4 w-4" />
                    {currentProject.location}
                  </div>

                  <p className={`${manrope.className} mt-4 text-base leading-relaxed text-reviuy-gray-600 dark:text-reviuy-gray-400`}>
                    {currentProject.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {currentProject.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className={cn(
                          manrope.className,
                          'rounded-full border border-reviuy-primary-100 dark:border-reviuy-primary-500/30 bg-reviuy-primary-50 dark:bg-reviuy-primary-500/10 px-3 py-1.5 text-xs font-medium text-reviuy-primary-700 dark:text-reviuy-primary-400'
                        )}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <span className={`${manrope.className} text-sm text-reviuy-gray-500 dark:text-reviuy-gray-400`}>
                      {currentProject.reviewCount} resenas
                    </span>
                    <motion.a
                      href={`/real-estate/${currentProject.id}`}
                      whileHover={{ x: 4 }}
                      className={`${manrope.className} inline-flex items-center gap-2 text-sm font-semibold text-reviuy-primary-600 dark:text-reviuy-primary-400 transition-colors hover:text-reviuy-primary-700 dark:hover:text-reviuy-primary-300`}
                    >
                      Ver detalles
                      <span className="transition-transform duration-200">
                        &rarr;
                      </span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {featuredProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setPage([index, index > projectIndex ? 1 : -1]);
                }}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === projectIndex
                    ? 'w-8 bg-reviuy-primary-500'
                    : 'w-2 bg-reviuy-gray-300 dark:bg-reviuy-gray-600 hover:bg-reviuy-gray-400 dark:hover:bg-reviuy-gray-500'
                )}
                aria-label={`Ir al proyecto ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
