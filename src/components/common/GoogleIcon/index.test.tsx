import { render } from '@testing-library/react';
import { GoogleIcon } from './index';

describe('GoogleIcon', () => {
  it('renders an svg icon with default size', () => {
    const { container } = render(<GoogleIcon data-testid="google-icon" />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 48 48');
    expect(svg).toHaveAttribute('width', '24px');
    expect(svg).toHaveAttribute('height', '24px');
  });
});
