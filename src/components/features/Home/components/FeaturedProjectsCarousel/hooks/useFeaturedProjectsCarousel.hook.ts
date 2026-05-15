import { PanInfo } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

export const useFeaturedProjectsCarousel = () => {
  // Mock data for featured projects/buildings
  const featuredProjects = [
    {
      id: 1,
      name: 'Torres del Puerto',
      location: 'Ciudad Vieja, Montevideo',
      rating: 4.8,
      reviewCount: 127,
      image: '/images/building-1.jpg',
      description:
        'Moderno complejo residencial con vista al puerto. Excelente mantenimiento y seguridad 24hs.',
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

  const [[page, direction], setPage] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const projectIndex =
    ((page % featuredProjects.length) + featuredProjects.length) % featuredProjects.length;

  const paginate = useCallback(
    (newDirection: number) => {
      setPage([page + newDirection, newDirection]);
    },
    [page]
  );

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
  return {
    featuredProjects,
    page,
    setPage,
    direction,
    setIsAutoPlaying,
    projectIndex,
    paginate,
    handleDragEnd,
    variants,
    currentProject,
  };
};
