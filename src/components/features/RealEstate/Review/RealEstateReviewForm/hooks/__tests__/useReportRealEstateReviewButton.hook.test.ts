// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReportRealEstateReviewButton } from '../useReportRealEstateReviewButton.hook';

const { mockMutateAsync, mockSendMessage, mockValidateText } = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
  mockSendMessage: vi.fn(),
  mockValidateText: vi.fn(),
}));

vi.mock('@/modules/real-estates/presentation', () => ({
  useReportRealEstateReview: vi.fn(() => ({ mutateAsync: mockMutateAsync, isPending: false })),
  useHasUserReportedRealEstateReview: vi.fn(() => ({ data: false })),
}));

vi.mock('@/modules/moderation/presentation', () => ({
  useSendReportRealEstateReviewMessage: vi.fn(() => ({ mutateAsync: mockSendMessage })),
}));

vi.mock('@/utils/textValidation.util', () => ({
  validateText: mockValidateText,
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe('useReportRealEstateReviewButton', () => {
  const mockReview = { id: 'review-1', is_mine: false };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna estado inicial', () => {
    const { result } = renderHook(() =>
      useReportRealEstateReviewButton({ review: mockReview as any })
    );

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedReason).toBe('');
    expect(result.current.description).toBe('');
    expect(result.current.showReportedButton).toBe(true);
    expect(result.current.reportReasons).toBeDefined();
  });

  it('ejecuta mutateAsync y sendMessage al enviar exitosamente', async () => {
    mockMutateAsync.mockImplementation((_data: any, { onSuccess }: any) => {
      onSuccess({ success: true, message: 'Reporte enviado' });
    });
    mockValidateText.mockReturnValue({ isValid: true });

    const { result } = renderHook(() =>
      useReportRealEstateReviewButton({ review: mockReview as any })
    );

    act(() => {
      result.current.onReasonChange('fake');
      result.current.onDescriptionChange('Review falsa');
    });

    await act(async () => {
      await result.current.onSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        review_id: 'review-1',
        reason: 'fake',
        description: 'Review falsa',
      }),
      expect.any(Object)
    );
    expect(mockSendMessage).toHaveBeenCalledWith({
      reason: 'fake',
      message: 'Review falsa',
      realEstateReviewUuid: 'review-1',
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('no cierra el diálogo si la mutación falla', async () => {
    mockMutateAsync.mockImplementation((_data: any, { onSuccess }: any) => {
      onSuccess({ success: false, error: 'Error' });
    });

    const { result } = renderHook(() =>
      useReportRealEstateReviewButton({ review: mockReview as any })
    );

    act(() => {
      result.current.onReasonChange('spam');
    });

    await act(async () => {
      await result.current.onSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('resetea estado al cancelar', () => {
    const { result } = renderHook(() =>
      useReportRealEstateReviewButton({ review: mockReview as any })
    );

    act(() => {
      result.current.onOpenChange(true);
      result.current.onReasonChange('other');
    });
    act(() => {
      result.current.onCancel();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedReason).toBe('');
    expect(result.current.description).toBe('');
  });

  it('muestra showReportedButton false si review es propia', () => {
    const { result } = renderHook(() =>
      useReportRealEstateReviewButton({ review: { id: 'mine', is_mine: true } as any })
    );

    expect(result.current.showReportedButton).toBe(false);
  });
});
