import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Home } from '../index';

vi.mock('@/constants/fonts.constant', () => ({
  manrope: {
    className: 'mock-manrope-font',
  },
}));

vi.mock('../components', () => ({
  HeroSection: () => <section>HeroSection</section>,
  BentoReviewsSection: () => <section>BentoReviewsSection</section>,
  SocialProofSection: () => <section>SocialProofSection</section>,
  WhySection: () => <section>WhySection</section>,
  ReviewedZones: () => <section>ReviewedZones</section>,
  Tips: () => <section>Tips</section>,
  PrivacySection: () => <section>PrivacySection</section>,
}));

describe('Home', () => {
  it('renderiza todas las secciones principales en el orden correcto', () => {
    const { container } = render(<Home />);

    // Verificar que todas las secciones existen
    expect(screen.getByText('HeroSection')).toBeInTheDocument();
    expect(screen.getByText('BentoReviewsSection')).toBeInTheDocument();
    expect(screen.getByText('SocialProofSection')).toBeInTheDocument();
    expect(screen.getByText('WhySection')).toBeInTheDocument();
    expect(screen.getByText('ReviewedZones')).toBeInTheDocument();
    expect(screen.getByText('Tips')).toBeInTheDocument();
    expect(screen.getByText('PrivacySection')).toBeInTheDocument();

    // Verificar el orden: HeroSection debe ser el primer hijo
    const children = container.firstChild?.childNodes;
    expect(children?.[0]).toBe(screen.getByText('HeroSection'));
    expect(children?.[1]).toBe(screen.getByText('BentoReviewsSection'));

    expect(container.firstChild).toHaveClass('mock-manrope-font relative flex flex-col');
  });
});
