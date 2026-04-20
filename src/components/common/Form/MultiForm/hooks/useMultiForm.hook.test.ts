import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useMultiForm } from './useMultiForm.hook';

const { toastErrorMock, toastSuccessMock } = vi.hoisted(() => ({
  toastErrorMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

describe('useMultiForm', () => {
  it('inicia en el paso 0 y calcula totalSteps', () => {
    const form = { trigger: vi.fn() } as never;

    const { result } = renderHook(() =>
      useMultiForm({ formsChildren: ['Paso 1', 'Paso 2'], form })
    );

    expect(result.current.step).toBe(0);
    expect(result.current.totalSteps).toBe(2);
  });

  it('no avanza y muestra error cuando trigger es invalido', async () => {
    const form = { trigger: vi.fn().mockResolvedValue(false) } as never;
    const { result } = renderHook(() =>
      useMultiForm({ formsChildren: ['Paso 1', 'Paso 2'], form })
    );

    await act(async () => {
      await result.current.handleNext();
    });

    expect(result.current.step).toBe(0);
    expect(toastErrorMock).toHaveBeenCalledWith('Por favor completa todos los campos requeridos');
  });

  it('avanza de paso cuando trigger es valido', async () => {
    const form = { trigger: vi.fn().mockResolvedValue(true) } as never;
    const { result } = renderHook(() =>
      useMultiForm({ formsChildren: ['Paso 1', 'Paso 2', 'Paso 3'], form })
    );

    await act(async () => {
      await result.current.handleNext();
    });

    expect(result.current.step).toBe(1);
  });

  it('en el ultimo paso reinicia a 0 y muestra toast success', async () => {
    const form = { trigger: vi.fn().mockResolvedValue(true) } as never;
    const { result } = renderHook(() =>
      useMultiForm({ formsChildren: ['Paso 1', 'Paso 2'], form })
    );

    await act(async () => {
      await result.current.handleNext();
    });

    await act(async () => {
      await result.current.handleNext();
    });

    expect(result.current.step).toBe(0);
    expect(toastSuccessMock).toHaveBeenCalledWith('Form successfully submitted');
  });

  it('retrocede un paso cuando step es mayor a 0', async () => {
    const form = { trigger: vi.fn().mockResolvedValue(true) } as never;
    const { result } = renderHook(() =>
      useMultiForm({ formsChildren: ['Paso 1', 'Paso 2'], form })
    );

    await act(async () => {
      await result.current.handleNext();
    });

    act(() => {
      result.current.handleBack();
    });

    expect(result.current.step).toBe(0);
  });
});
