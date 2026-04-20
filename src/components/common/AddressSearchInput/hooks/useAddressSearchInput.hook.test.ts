import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAddressSearchInput } from './useAddressSearchInput.hook';

const { useDebounceMock, useGetAddressListByNameMock } = vi.hoisted(() => ({
  useDebounceMock: vi.fn(),
  useGetAddressListByNameMock: vi.fn(),
}));

vi.mock('@/hooks', () => ({
  useDebounce: useDebounceMock,
}));

vi.mock('@/modules/addresses/presentation', () => ({
  useGetAddressListByName: useGetAddressListByNameMock,
}));

describe('useAddressSearchInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('usa el valor con debounce para buscar direcciones y retorna su estado', () => {
    const data = [
      {
        osm_id: 10,
        display_name: 'Montevideo, Uruguay',
      },
    ];

    useDebounceMock.mockReturnValue('montevideo');
    useGetAddressListByNameMock.mockReturnValue({
      data,
      isLoading: true,
    });

    const { result } = renderHook(() => useAddressSearchInput({ queryValue: 'monte' }));

    expect(useDebounceMock).toHaveBeenCalledWith('monte', 1000);
    expect(useGetAddressListByNameMock).toHaveBeenCalledWith({ query: 'montevideo' });
    expect(result.current).toEqual({ data, isLoading: true });
  });

  it('usa query vacia cuando el debounce retorna undefined', () => {
    useDebounceMock.mockReturnValue(undefined);
    useGetAddressListByNameMock.mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { result } = renderHook(() => useAddressSearchInput({ queryValue: 'mo' }));

    expect(useGetAddressListByNameMock).toHaveBeenCalledWith({ query: '' });
    expect(result.current).toEqual({ data: [], isLoading: false });
  });
});
