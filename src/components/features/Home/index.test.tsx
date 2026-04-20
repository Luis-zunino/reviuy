import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Home } from './index';

vi.mock('@/constants', () => ({
  manrope: {
    className: 'mock-manrope',
  },
}));

vi.mock('./components', () => ({
  HeroSection: () => <section>HeroSection</section>,
  SocialProofSection: () => <section>SocialProofSection</section>,
  WhySection: () => <section>WhySection</section>,
  BentoReviewsSection: () => <section>BentoReviewsSection</section>,
  PrivacySection: () => <section>PrivacySection</section>,
  FeaturedProjectsCarousel: () => <section>FeaturedProjectsCarousel</section>,
  Tips: () => <section>Tips</section>,
}));

describe('Home', () => {
  it('renderiza todas las secciones principales', () => {
    const { container } = render(<Home />);

    expect(screen.getByText('HeroSection')).toBeInTheDocument();
    expect(screen.getByText('SocialProofSection')).toBeInTheDocument();
    expect(screen.getByText('WhySection')).toBeInTheDocument();
    expect(screen.getByText('BentoReviewsSection')).toBeInTheDocument();
    expect(screen.getByText('PrivacySection')).toBeInTheDocument();
    expect(screen.getByText('FeaturedProjectsCarousel')).toBeInTheDocument();
    expect(screen.getByText('Tips')).toBeInTheDocument();

    expect(container.firstChild).toHaveClass('mock-manrope');
  });
});
