import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReportDialog } from '../index';

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: ReactNode; open?: boolean }) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  ),
  DialogContent: ({ children }: { children: ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogDescription: ({ children }: { children: ReactNode }) => (
    <p data-testid="dialog-description">{children}</p>
  ),
  DialogHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  DialogTrigger: ({ children }: { children: ReactNode }) => (
    <div data-testid="dialog-trigger">{children}</div>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    disabled,
    onClick,
    type,
    className,
    icon: Icon,
  }: {
    children?: ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    type?: string;
    className?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      disabled={disabled}
      onClick={onClick}
      data-testid="mock-button"
      className={className}
    >
      {Icon ? <span data-testid="mock-icon">icon</span> : null}
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: ({
    value,
    onChange,
    placeholder,
    maxLength,
    rows,
    id,
  }: {
    value: string;
    onChange: (e: any) => void;
    placeholder?: string;
    maxLength?: number;
    rows?: number;
    id?: string;
  }) => (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      maxLength={maxLength}
      rows={rows}
      onChange={onChange}
    />
  ),
}));

vi.mock('@/components/ui/radio-group', () => ({
  RadioGroup: ({
    children,
    value,
    required,
  }: {
    children: ReactNode;
    value: string;
    required?: boolean;
  }) => (
    <div data-testid="radio-group" data-value={value} data-required={required}>
      {children}
    </div>
  ),
  RadioGroupItem: ({ value, id }: { value: string; id: string }) => (
    <input type="radio" value={value} id={id} name="radio-group" data-testid={`radio-${value}`} />
  ),
}));

const createMockHookResponse = (overrides = {}) => ({
  isOpen: false,
  onOpenChange: vi.fn(),
  onSubmit: vi.fn((e: any) => e.preventDefault()),
  selectedReason: '',
  onReasonChange: vi.fn(),
  description: '',
  onDescriptionChange: vi.fn(),
  onCancel: vi.fn(),
  isPending: false,
  reportReasons: [
    { value: 'spam', label: 'Spam' },
    { value: 'fake', label: 'Contenido falso' },
  ],
  hasReported: false,
  showReportedButton: true,
  ...overrides,
});

const defaultProps = {
  title: 'Reportar Test',
  dialogDescription: 'Descripción del diálogo',
  textareaPlaceholder: 'Escribe detalles...',
  showText: false,
};

describe('ReportDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza trigger cuando showReportedButton es true', () => {
    const hookResponse = createMockHookResponse();
    render(<ReportDialog {...defaultProps} hookResponse={hookResponse} />);

    expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument();
    expect(
      within(screen.getByTestId('dialog-trigger')).getByTestId('mock-button')
    ).toBeInTheDocument();
  });

  it('no renderiza trigger cuando showReportedButton es false', () => {
    const hookResponse = createMockHookResponse({ showReportedButton: false });
    render(<ReportDialog {...defaultProps} hookResponse={hookResponse} />);

    expect(screen.queryByTestId('dialog-trigger')).not.toBeInTheDocument();
  });

  it('muestra texto "Reportar" cuando showText es true', () => {
    const hookResponse = createMockHookResponse();
    render(<ReportDialog {...defaultProps} showText hookResponse={hookResponse} />);

    expect(screen.getByText('Reportar')).toBeInTheDocument();
  });

  it('deshabilita el trigger cuando hasReported es true', () => {
    const hookResponse = createMockHookResponse({ hasReported: true });
    render(<ReportDialog {...defaultProps} hookResponse={hookResponse} />);

    expect(within(screen.getByTestId('dialog-trigger')).getByTestId('mock-button')).toBeDisabled();
  });

  it('renderiza contenido del diálogo cuando isOpen es true', () => {
    const hookResponse = createMockHookResponse({ isOpen: true });
    render(<ReportDialog {...defaultProps} hookResponse={hookResponse} />);

    expect(screen.getByText('Reportar Test')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-description')).toHaveTextContent('Descripción del diálogo');
    expect(screen.getByTestId('radio-group')).toBeInTheDocument();
  });

  it('muestra las razones de reporte', () => {
    const hookResponse = createMockHookResponse({ isOpen: true });
    render(<ReportDialog {...defaultProps} hookResponse={hookResponse} />);

    expect(screen.getByText('Spam')).toBeInTheDocument();
    expect(screen.getByText('Contenido falso')).toBeInTheDocument();
  });

  it('llama a onSubmit al enviar el formulario', () => {
    const onSubmit = vi.fn((e: any) => e.preventDefault());
    const hookResponse = createMockHookResponse({ isOpen: true, onSubmit });
    render(<ReportDialog {...defaultProps} hookResponse={hookResponse} />);

    fireEvent.submit(screen.getByRole('button', { name: /enviar reporte/i }).closest('form')!);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('llama a onCancel al hacer click en Cancelar', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const hookResponse = createMockHookResponse({ isOpen: true, onCancel });
    render(<ReportDialog {...defaultProps} hookResponse={hookResponse} />);

    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('deshabilita botón submit cuando no hay razón seleccionada', () => {
    const hookResponse = createMockHookResponse({ isOpen: true, selectedReason: '' });
    render(<ReportDialog {...defaultProps} hookResponse={hookResponse} />);

    const submitButtons = screen.getAllByRole('button', { name: /enviar reporte/i });
    expect(submitButtons[0]).toBeDisabled();
  });

  it('habilita botón submit cuando hay razón seleccionada', () => {
    const hookResponse = createMockHookResponse({ isOpen: true, selectedReason: 'spam' });
    render(<ReportDialog {...defaultProps} hookResponse={hookResponse} />);

    const submitButtons = screen.getAllByRole('button', { name: /enviar reporte/i });
    expect(submitButtons[0]).not.toBeDisabled();
  });

  it('muestra "Enviando..." cuando isPending es true', () => {
    const hookResponse = createMockHookResponse({
      isOpen: true,
      isPending: true,
      selectedReason: 'spam',
    });
    render(<ReportDialog {...defaultProps} hookResponse={hookResponse} />);

    expect(screen.getByText('Enviando...')).toBeInTheDocument();
  });

  it('muestra contador de caracteres en textarea', () => {
    const hookResponse = createMockHookResponse({
      isOpen: true,
      description: 'Hola',
    });
    render(<ReportDialog {...defaultProps} hookResponse={hookResponse} />);

    expect(screen.getByText('4/500 caracteres')).toBeInTheDocument();
  });
});
