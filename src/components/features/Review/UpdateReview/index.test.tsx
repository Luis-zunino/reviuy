import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UpdateReview } from './index';

const { useUpdateReviewFormMock, reviewFormMock, handleSubmitMock } = vi.hoisted(() => ({
  useUpdateReviewFormMock: vi.fn(),
  reviewFormMock: vi.fn(),
  handleSubmitMock: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useUpdateReviewForm: useUpdateReviewFormMock,
}));

vi.mock('../components/ReviewForm', () => ({
  ReviewForm: (props: unknown) => {
    reviewFormMock(props);
    return <div>ReviewForm</div>;
  },
}));

describe('UpdateReview', () => {
  it('pasa handleSubmit y resto de props al ReviewForm', () => {
    useUpdateReviewFormMock.mockReturnValue({
      handleSubmit: handleSubmitMock,
      mode: 'update',
      reviewId: '123',
    });

    render(<UpdateReview />);

    expect(screen.getByText('ReviewForm')).toBeInTheDocument();
    expect(reviewFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        handleSubmit: handleSubmitMock,
        mode: 'update',
        reviewId: '123',
      })
    );
  });
});
