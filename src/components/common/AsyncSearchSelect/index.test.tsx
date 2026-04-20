import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Form } from '@/components/ui/form';
import { AsyncSearchSelect } from './index';

vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: ReactNode }) => <div data-testid="popover">{children}</div>,
  PopoverAnchor: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children }: { children: ReactNode }) => (
    <div data-testid="popover-content">{children}</div>
  ),
}));

vi.mock('@/components/ui/command', () => ({
  Command: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CommandList: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CommandGroup: ({ children, heading }: { children: ReactNode; heading?: string }) => (
    <div>
      {heading ? <span>{heading}</span> : null}
      {children}
    </div>
  ),
  CommandItem: ({
    children,
    onSelect,
  }: {
    children: ReactNode;
    onSelect?: (v: string) => void;
  }) => (
    <button type="button" onClick={() => onSelect?.('')}>
      {children}
    </button>
  ),
  CommandEmpty: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

type FormValues = { address: string };

type RenderAsyncSearchSelectProps = {
  options?: Array<{ id: string; name: string }>;
  isFetching?: boolean;
  open?: boolean;
  defaultValue?: string;
  emptyComponent?: ReactNode;
  errorMessage?: string;
};

const renderAsyncSearchSelect = (props: RenderAsyncSearchSelectProps = {}) => {
  const setOpen = vi.fn();
  const handleClear = vi.fn();
  const onSelect = vi.fn();

  const {
    options = [{ id: '1', name: 'Montevideo' }],
    isFetching = false,
    open = true,
    defaultValue = '',
    emptyComponent,
    errorMessage,
  } = props;

  const Wrapper = () => {
    const form = useForm<FormValues>({
      defaultValues: {
        address: defaultValue,
      },
    });

    useEffect(() => {
      if (errorMessage) {
        form.setError('address', { type: 'manual', message: errorMessage });
      }
    }, [errorMessage, form]);

    return (
      <Form {...form}>
        <AsyncSearchSelect<FormValues, { id: string; name: string }>
          name="address"
          form={form}
          options={options}
          isFetching={isFetching}
          handleClear={handleClear}
          open={open}
          setOpen={setOpen}
          onSelect={onSelect}
          placeholder="Busca una ciudad"
          emptyComponent={emptyComponent}
        />
      </Form>
    );
  };

  render(<Wrapper />);

  return {
    setOpen,
    handleClear,
    onSelect,
  };
};

describe('AsyncSearchSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('abre popover al enfocar si hay opciones', async () => {
    const user = userEvent.setup();
    const { setOpen } = renderAsyncSearchSelect({ options: [{ id: '1', name: 'Montevideo' }] });

    await user.click(screen.getByPlaceholderText('Busca una ciudad'));

    expect(setOpen).toHaveBeenCalledWith(true);
  });

  it('muestra boton limpiar y ejecuta handleClear', async () => {
    const user = userEvent.setup();
    const { handleClear } = renderAsyncSearchSelect({ defaultValue: 'Parque Rodo' });

    await user.click(screen.getByRole('button'));

    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('dispara onSelect al seleccionar una opcion', async () => {
    const user = userEvent.setup();
    const options = [
      { id: '1', name: 'Montevideo' },
      { id: '2', name: 'Canelones' },
    ];
    const { onSelect } = renderAsyncSearchSelect({ options });

    const input = screen.getByPlaceholderText('Busca una ciudad');
    await user.type(input, 'Mon');
    await user.click(screen.getByRole('button', { name: 'Montevideo' }));

    expect(onSelect).toHaveBeenCalledWith(options[0]);
  });

  it('muestra mensaje vacio cuando no hay resultados', async () => {
    const user = userEvent.setup();
    renderAsyncSearchSelect({
      options: [],
      emptyComponent: <span>Sin coincidencias</span>,
    });

    const input = screen.getByPlaceholderText('Busca una ciudad');
    await user.type(input, 'Mon');

    expect(screen.getByText('Sin coincidencias')).toBeInTheDocument();
  });

  it('muestra error del formulario si existe', async () => {
    renderAsyncSearchSelect({ errorMessage: 'Direccion requerida' });

    expect(await screen.findByText('Direccion requerida')).toBeInTheDocument();
  });
});
