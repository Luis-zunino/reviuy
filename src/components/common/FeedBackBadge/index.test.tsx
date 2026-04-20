import { render, screen } from '@testing-library/react';
import { FeedBackBadge } from './index';

describe('FeedBackBadge', () => {
  it('shows recommended badge text when recommended is true', () => {
    render(<FeedBackBadge recommended />);

    expect(screen.getByText(/recomiendo/i)).toBeInTheDocument();
    expect(screen.queryByText(/no recomiendo/i)).not.toBeInTheDocument();
  });

  it('shows negative badge text when recommended is false', () => {
    render(<FeedBackBadge recommended={false} />);

    expect(screen.getByText(/no recomiendo/i)).toBeInTheDocument();
    expect(screen.queryByText(/^recomiendo$/i)).not.toBeInTheDocument();
  });
});
