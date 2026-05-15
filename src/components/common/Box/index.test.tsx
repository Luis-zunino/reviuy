import { render, screen } from '@testing-library/react';
import { Box } from './index';

describe('Box', () => {
  it('renders children content', () => {
    render(
      <Box>
        <span>contenido</span>
      </Box>
    );

    expect(screen.getByText('contenido')).toBeInTheDocument();
  });

  it('applies default and custom classes', () => {
    const { container } = render(
      <Box className="custom-class">
        <span>contenido</span>
      </Box>
    );

    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass('dark:bg-reviuy-gray-800/50');
    expect(wrapper).toHaveClass('custom-class');
  });
});
