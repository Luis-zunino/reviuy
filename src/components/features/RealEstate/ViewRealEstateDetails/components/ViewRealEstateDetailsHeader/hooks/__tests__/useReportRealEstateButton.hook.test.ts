import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReportRealEstateButton } from '../useReportRealEstateButton.hook';

const { mockMutateAsync, mockSendMessage, mockValidateText } = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
  mockSendMessage: vi.fn(),
  mockValidateText: vi.fn(),
}));

vi.mock('@/modules/real-estates/presentation', () => ({
  useReportRealEstate: vi.fn(() => ({ mutateAsync: mockMutateAsync, isPending: false })),
  useHasUserReportedRealEstate: vi.fn(() => ({ data: false })),
}));

vi.mock('@/modules/moderation/presentation', () => ({
  useSendReportRealEstateMessage: vi.fn(() => ({ mutateAsync: mockSendMessage })),
}));

vi.mock('@/utils/textValidation.util', () => ({
  validateText: mockValidateText,
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe('useReportRealEstateButton', () => {
  const mockRealEstate = { id: 'real-estate-1', name: 'Inmobiliaria Test' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna estado inicial', () => {
    const { result } = renderHook(() =>
      useReportRealEstateButton({ realEstate: mockRealEstate as any })
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
      useReportRealEstateButton({ realEstate: mockRealEstate as any })
    );

    act(() => {
      result.current.onReasonChange('fraud');
      result.current.onDescriptionChange('Posible estafa');
    });

    await act(async () => {
      await result.current.onSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        real_estate_id: 'real-estate-1',
        reason: 'fraud',
        description: 'Posible estafa',
      }),
      expect.any(Object)
    );
    expect(mockSendMessage).toHaveBeenCalledWith({
      reason: 'fraud',
      message: 'Posible estafa',
      realEstateName: 'Inmobiliaria Test',
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('no ejecuta sendMessage si la mutación falla', async () => {
    mockMutateAsync.mockImplementation((_data: any, { onSuccess }: any) => {
      onSuccess({ success: false, error: 'Error al reportar' });
    });

    const { result } = renderHook(() =>
      useReportRealEstateButton({ realEstate: mockRealEstate as any })
    );

    act(() => {
      result.current.onReasonChange('fraud');
    });

    await act(async () => {
      await result.current.onSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('resetea estado al cancelar', () => {
    const { result } = renderHook(() =>
      useReportRealEstateButton({ realEstate: mockRealEstate as any })
    );

    act(() => {
      result.current.onOpenChange(true);
      result.current.onReasonChange('spam');
      result.current.onDescriptionChange('test');
    });
    act(() => {
      result.current.onCancel();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedReason).toBe('');
    expect(result.current.description).toBe('');
  });
});
