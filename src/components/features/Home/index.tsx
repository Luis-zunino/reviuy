'use client';

import { manrope } from '@/constants/fonts.constant';
import {
  HeroSection,
  BentoReviewsSection,
  SocialProofSection,
  WhySection,
  ReviewedZones,
  Tips,
  PrivacySection,
} from './components';

/**
 * Home - Landing page rediseñada con filosofía editorial
 * Las reseñas son el centro. Secciones ordenadas por importancia:
 * Hero (propuesta de valor) → Reseñas destacadas → Stats → Por qué funciona
 * → Barrios comentados → Tips → Privacidad
 */
export const Home = () => {
  return (
    <div className={`${manrope.className} relative flex flex-col`}>
      <HeroSection />
      <BentoReviewsSection />
      <SocialProofSection />
      <WhySection />
      <ReviewedZones />
      <Tips />
      <PrivacySection />
    </div>
  );
};
