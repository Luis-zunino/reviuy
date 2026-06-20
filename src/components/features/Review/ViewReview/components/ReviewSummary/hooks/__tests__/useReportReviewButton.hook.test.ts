// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReportReviewButton } from '../useReportReviewButton.hook';

const { mockMutateAsync, mockSendMessage, mockValidateText } = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
  mockSendMessage: vi.fn(),
  mockValidateText: vi.fn(),
}));

vi.mock('@/modules/property-reviews/presentation', () => ({
  useReportReview: vi.fn(() => ({ mutateAsync: mockMutateAsync, isPending: false })),
  useHasUserReportedReview: vi.fn(() => ({ data: false })),
}));

vi.mock('@/modules/moderation/presentation', () => ({
  useSendReportReviewMessage: vi.fn(() => ({ mutateAsync: mockSendMessage })),
}));

vi.mock('@/utils/textValidation.util', () => ({
  validateText: mockValidateText,
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe('useReportReviewButton', () => {
  const mockReview = { id: 'review-1', is_mine: false };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna estado inicial correctamente', () => {
    const { result } = renderHook(() => useReportReviewButton({ review: mockReview as any }));

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedReason).toBe('');
    expect(result.current.description).toBe('');
    expect(result.current.isPending).toBe(false);
    expect(result.current.hasReported).toBe(false);
    expect(result.current.showReportedButton).toBe(true);
    expect(result.current.reportReasons).toBeDefined();
  });

  it('no ejecuta mutateAsync si no hay motivo seleccionado', async () => {
    const { result } = renderHook(() => useReportReviewButton({ review: mockReview as any }));

    await act(async () => {
      await result.current.onSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('ejecuta mutateAsync con los datos correctos al enviar', async () => {
    mockMutateAsync.mockImplementation((_data: any, { onSuccess }: any) => {
      onSuccess({ success: true, message: 'Reporte enviado' });
    });
    mockValidateText.mockReturnValue({ isValid: true });

    const { result } = renderHook(() => useReportReviewButton({ review: mockReview as any }));

    act(() => {
      result.current.onReasonChange('spam');
      result.current.onDescriptionChange('Esto es spam');
    });

    await act(async () => {
      await result.current.onSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(mockValidateText).toHaveBeenCalledWith('Esto es spam');
    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        review_id: 'review-1',
        reason: 'spam',
        description: 'Esto es spam',
      }),
      expect.any(Object)
    );
    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedReason).toBe('');
    expect(result.current.description).toBe('');
  });

  it('muestra error si la validación de texto falla', async () => {
    mockValidateText.mockReturnValue({ isValid: false, message: 'Texto no permitido' });

    const { result } = renderHook(() => useReportReviewButton({ review: mockReview as any }));

    act(() => {
      result.current.onReasonChange('spam');
      result.current.onDescriptionChange('texto malo');
    });

    await act(async () => {
      await result.current.onSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('cierra y resetea estado al cancelar', () => {
    const { result } = renderHook(() => useReportReviewButton({ review: mockReview as any }));

    act(() => {
      result.current.onOpenChange(true);
      result.current.onReasonChange('spam');
      result.current.onDescriptionChange('descripcion');
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.onCancel();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedReason).toBe('');
    expect(result.current.description).toBe('');
  });

  it('oculta botón de reportar si la reseña es propia', () => {
    const { result } = renderHook(() =>
      useReportReviewButton({ review: { id: 'mine', is_mine: true } as any })
    );

    expect(result.current.showReportedButton).toBe(false);
  });

  it('no envía descripción vacía como undefined', async () => {
    mockMutateAsync.mockImplementation((_data: any, { onSuccess }: any) => {
      onSuccess({ success: true });
    });

    const { result } = renderHook(() => useReportReviewButton({ review: mockReview as any }));

    act(() => {
      result.current.onReasonChange('spam');
    });

    await act(async () => {
      await result.current.onSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ description: undefined }),
      expect.any(Object)
    );
  });
});
