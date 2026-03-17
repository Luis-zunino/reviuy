'use client';

import { manrope } from '@/constants';
import {
  HeroSection,
  SocialProofSection,
  WhySection,
  BentoReviewsSection,
  PrivacySection,
  FeaturedProjectsCarousel,
  Tips,
} from './components';

/**
 * Home - Redesigned landing page
 * Features Bento Grid layout, Framer Motion animations,
 * and a clean, professional design following ReviUy brand guidelines
 */
export const Home = () => {
  return (
    <div className={`${manrope.className} relative flex flex-col`}>
      {/* Subtle background gradient */}
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,rgba(239,246,255,0.5),transparent_50%)]" />
      
      {/* Hero with minimalist search */}
      <HeroSection />
      
      {/* Social proof statistics */}
      <SocialProofSection />
      
      {/* Why ReviUy works */}
      <WhySection />
      
      {/* Bento grid reviews */}
      <BentoReviewsSection />
      
      {/* Privacy focus section */}
      <PrivacySection />
      
      {/* Featured projects carousel */}
      <FeaturedProjectsCarousel />
      
      {/* Tips and guides */}
      <Tips />
    </div>
  );
};
