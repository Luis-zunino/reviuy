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
      <HeroSection />
      <SocialProofSection />
      <WhySection />
      <BentoReviewsSection />
      <PrivacySection />
      <FeaturedProjectsCarousel />
      <Tips />
    </div>
  );
};
