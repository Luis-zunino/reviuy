import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentType, ReactNode } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AsyncSearchSelectContent } from '../AsyncSearchSelectContent';

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

vi.mock('@/components/ui/input', () => ({
  Input: (props: Record<string, unknown>) => <input {...props} />,
}));

vi.mock('@/components/ui/form', () => ({
  FormControl: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  FormItem: ({ children }: { children: ReactNode }) => (
    <div data-testid="form-item">{children}</div>
  ),
  FormLabel: ({ children }: { children: ReactNode }) => <label>{children}</label>,
}));

vi.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loader" />,
  X: () => <div data-testid="x-icon" />,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    onClick,
    icon: Icon,
    children,
    ...props
  }: {
    onClick?: React.MouseEventHandler;
    icon?: ComponentType;
    children?: ReactNode;
    [key: string]: unknown;
  }) => (
    <button type="button" onClick={onClick} {...props}>
      {Icon ? <Icon /> : null}
      {children}
    </button>
  ),
}));

type Option = { id: string; name: string };

const createField = (overrides?: Partial<ControllerRenderProps<FieldValues>>) =>
  ({
    value: '',
    onChange: vi.fn(),
    onBlur: vi.fn(),
    name: 'test',
    ref: vi.fn(),
    ...overrides,
  }) as unknown as ControllerRenderProps<FieldValues>;

const defaultProps = {
  field: createField(),
  isDirty: true,
  options: [{ id: '1', name: 'Montevideo' }] as Option[],
  isFetching: false,
  handleClear: vi.fn(),
  open: true,
  setOpen: vi.fn(),
  onSelect: vi.fn(),
  placeholder: 'Busca una ciudad',
};

const renderContent = (overrides?: Partial<Parameters<typeof AsyncSearchSelectContent>[0]>) =>
  render(<AsyncSearchSelectContent {...defaultProps} {...overrides} />);

describe('AsyncSearchSelectContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('label y descripcion', () => {
    it('renderiza label cuando se provee', () => {
      renderContent({ label: 'Ciudad' });

      expect(screen.getByText('Ciudad')).toBeInTheDocument();
    });

    it('no renderiza label cuando no se provee', () => {
      const { container } = renderContent();

      expect(container.querySelector('label')).not.toBeInTheDocument();
    });

    it('renderiza descripcion cuando se provee', () => {
      renderContent({ description: 'Selecciona tu ciudad' });

      expect(screen.getByText('Selecciona tu ciudad')).toBeInTheDocument();
    });
  });

  describe('input y placeholder', () => {
    it('renderiza input con placeholder', () => {
      renderContent({ placeholder: 'Escribe...' });

      expect(screen.getByPlaceholderText('Escribe...')).toBeInTheDocument();
    });

    it('abre popover al enfocar si hay opciones', async () => {
      const user = userEvent.setup();
      const setOpen = vi.fn();
      renderContent({ setOpen, options: [{ id: '1', name: 'Montevideo' }] });

      await user.click(screen.getByPlaceholderText('Busca una ciudad'));

      expect(setOpen).toHaveBeenCalledWith(true);
    });

    it('cierra popover al enfocar si no hay opciones', async () => {
      const user = userEvent.setup();
      const setOpen = vi.fn();
      renderContent({ setOpen, options: [] });

      await user.click(screen.getByPlaceholderText('Busca una ciudad'));

      expect(setOpen).toHaveBeenCalledWith(false);
    });

    it('abre popover al escribir 3+ caracteres si isDirty', async () => {
      const user = userEvent.setup();
      const setOpen = vi.fn();
      const field = createField({ value: 'Mon' });
      renderContent({ setOpen, field, isDirty: true });

      await user.type(screen.getByPlaceholderText('Busca una ciudad'), 'Mon');

      expect(setOpen).toHaveBeenCalledWith(true);
    });
  });

  describe('loading y clear button', () => {
    it('muestra loader cuando isFetching es true', () => {
      renderContent({ isFetching: true });

      expect(screen.getAllByTestId('loader').length).toBeGreaterThanOrEqual(1);
    });

    it('no muestra loader cuando isFetching es false', () => {
      renderContent({ isFetching: false });

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    it('muestra boton limpiar cuando hay valor y no esta cargando', () => {
      const field = createField({ value: 'Montevideo' });
      renderContent({ field, isFetching: false });

      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('ejecuta handleClear al hacer click en el boton limpiar', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      const field = createField({ value: 'Montevideo' });
      renderContent({ field, handleClear });

      await user.click(screen.getByTestId('x-icon'));

      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('no muestra boton limpiar cuando field.value es falsy', () => {
      renderContent({ field: createField({ value: '' }) });

      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
    });
  });

  describe('popover y resultados', () => {
    it('muestra PopoverContent cuando isDirty es true', () => {
      renderContent({ isDirty: true });

      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });

    it('no muestra PopoverContent cuando isDirty es false', () => {
      renderContent({ isDirty: false });

      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });

    it('renderiza opciones en el CommandGroup', () => {
      const options = [
        { id: '1', name: 'Montevideo' },
        { id: '2', name: 'Canelones' },
      ];
      renderContent({ options });

      expect(screen.getByText('Montevideo')).toBeInTheDocument();
      expect(screen.getByText('Canelones')).toBeInTheDocument();
      expect(screen.getByText('Resultados')).toBeInTheDocument();
    });

    it('dispara onSelect con la opcion al hacer click', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const options = [{ id: '1', name: 'Montevideo' }];
      renderContent({ options, onSelect });

      await user.click(screen.getByText('Montevideo'));

      expect(onSelect).toHaveBeenCalledWith(options[0]);
    });

    it('muestra mensaje vacio cuando no hay resultados y cumple condiciones', () => {
      renderContent({
        options: [],
        isFetching: false,
        isDirty: true,
        field: createField({ value: 'Mon' }),
        emptyComponent: <span>Sin coincidencias</span>,
      });

      expect(screen.getByText('Sin coincidencias')).toBeInTheDocument();
    });

    it('no muestra mensaje vacio cuando isFetching es true', () => {
      renderContent({
        options: [],
        isFetching: true,
        isDirty: true,
        field: createField({ value: 'Mon' }),
        emptyComponent: <span>Sin coincidencias</span>,
      });

      expect(screen.queryByText('Sin coincidencias')).not.toBeInTheDocument();
    });

    it('usa texto default cuando no se provee emptyComponent', () => {
      renderContent({
        options: [],
        isFetching: false,
        isDirty: true,
        field: createField({ value: 'Mon' }),
      });

      expect(screen.getByText('No se encontraron resultados')).toBeInTheDocument();
    });

    it('muestra loader en input y en resultados cuando isFetching', () => {
      renderContent({ isFetching: true });

      expect(screen.getAllByTestId('loader').length).toBe(2);
    });
  });

  describe('error message', () => {
    it('muestra mensaje de error cuando se provee', () => {
      renderContent({ errorMessage: 'Direccion requerida' });

      expect(screen.getByText('Direccion requerida')).toBeInTheDocument();
    });

    it('no muestra mensaje de error cuando no se provee', () => {
      renderContent({ errorMessage: undefined });

      expect(screen.queryByText('Direccion requerida')).not.toBeInTheDocument();
    });

    it('marca el input como invalido cuando hay error', () => {
      renderContent({ errorMessage: 'Error' });

      expect(screen.getByPlaceholderText('Busca una ciudad')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('marca el input como valido cuando no hay error', () => {
      renderContent({ errorMessage: undefined });

      expect(screen.getByPlaceholderText('Busca una ciudad')).toHaveAttribute(
        'aria-invalid',
        'false'
      );
    });
  });
});
