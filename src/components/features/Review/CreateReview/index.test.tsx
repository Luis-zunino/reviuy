import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CreateReview } from './index';

const { useCreateReviewFormMock, reviewFormMock } = vi.hoisted(() => ({
  useCreateReviewFormMock: vi.fn(),
  reviewFormMock: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useCreateReviewForm: useCreateReviewFormMock,
}));

vi.mock('../components/ReviewForm', () => ({
  ReviewForm: (props: unknown) => {
    reviewFormMock(props);
    return <div>ReviewForm</div>;
  },
}));

describe('CreateReview', () => {
  it('pasa props de useCreateReviewForm al ReviewForm', () => {
    useCreateReviewFormMock.mockReturnValue({
      mode: 'create',
      handleSubmit: vi.fn(),
    });

    render(<CreateReview />);

    expect(screen.getByText('ReviewForm')).toBeInTheDocument();
    expect(reviewFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'create',
      })
    );
  });
});
