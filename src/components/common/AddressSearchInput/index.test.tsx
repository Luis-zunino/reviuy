import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddressSearchInput } from './index';

const { useAddressSearchInputMock, asyncSearchSelectMock } = vi.hoisted(() => ({
  useAddressSearchInputMock: vi.fn(),
  asyncSearchSelectMock: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useAddressSearchInput: useAddressSearchInputMock,
}));

vi.mock('../AsyncSearchSelect', () => ({
  AsyncSearchSelect: (props: unknown) => {
    asyncSearchSelectMock(props);
    return <div data-testid="async-search-select" />;
  },
}));

describe('AddressSearchInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('consulta direcciones por queryValue y transforma las opciones para AsyncSearchSelect', () => {
    useAddressSearchInputMock.mockReturnValue({
      data: [
        {
          osm_id: 123,
          display_name: 'Avenida Italia 1234, Montevideo, Uruguay',
          lat: '-34.9',
          lon: '-56.1',
        },
      ],
      isLoading: true,
    });

    const props = {
      form: {} as never,
      open: false,
      setOpen: vi.fn(),
      handleClear: vi.fn(),
      name: 'address',
      queryValue: 'avenida',
      onSelect: vi.fn(),
      placeholder: 'Busca una direccion',
      label: 'Direccion',
      className: { container: 'w-full' },
    };

    render(<AddressSearchInput {...props} />);

    expect(screen.getByTestId('async-search-select')).toBeInTheDocument();
    expect(useAddressSearchInputMock).toHaveBeenCalledWith({ queryValue: 'avenida' });

    const asyncProps = asyncSearchSelectMock.mock.calls[0][0] as {
      options: Array<{ id: string; name: string; osm_id: number; display_name: string }>;
      isFetching: boolean;
      name: string;
      open: boolean;
      placeholder: string;
      label: string;
      className: { container: string };
    };

    expect(asyncProps.options).toEqual([
      expect.objectContaining({
        osm_id: 123,
        display_name: 'Avenida Italia 1234, Montevideo, Uruguay',
        id: '123',
        name: 'Avenida Italia 1234, Montevideo, Uruguay',
      }),
    ]);
    expect(asyncProps.isFetching).toBe(true);
    expect(asyncProps.name).toBe('address');
    expect(asyncProps.open).toBe(false);
    expect(asyncProps.placeholder).toBe('Busca una direccion');
    expect(asyncProps.label).toBe('Direccion');
    expect(asyncProps.className).toEqual({ container: 'w-full' });
  });

  it('envia opciones undefined cuando no hay resultados', () => {
    useAddressSearchInputMock.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    render(
      <AddressSearchInput
        form={{} as never}
        open
        setOpen={vi.fn()}
        handleClear={vi.fn()}
        name="address"
        queryValue=""
        onSelect={vi.fn()}
        placeholder="Busca una direccion"
      />
    );

    const asyncProps = asyncSearchSelectMock.mock.calls[0][0] as {
      options: unknown;
      isFetching: boolean;
    };

    expect(asyncProps.options).toBeUndefined();
    expect(asyncProps.isFetching).toBe(false);
  });
});
