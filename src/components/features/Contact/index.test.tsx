import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Contact } from './index';

const { useContactFormMock, onSubmitMock } = vi.hoisted(() => ({
  useContactFormMock: vi.fn(),
  onSubmitMock: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useContactForm: useContactFormMock,
}));

const createContactFormMock = (overrides?: Partial<ReturnType<typeof useContactFormMock>>) => ({
  register: (name: string) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }),
  handleSubmit: (cb: (data: unknown) => unknown) => (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.();
    return cb({});
  },
  errors: {},
  isSubmitting: false,
  onSubmit: onSubmitMock,
  isAuthenticated: true,
  watch: (field: string) => {
    if (field === 'email') return 'test@reviuy.com';
    if (field === 'name') return 'Luis';
    return '';
  },
  ...overrides,
});

describe('Contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useContactFormMock.mockReturnValue(createContactFormMock());
  });

  it('muestra advertencia y deshabilita envio cuando no esta autenticado', () => {
    useContactFormMock.mockReturnValue(createContactFormMock({ isAuthenticated: false }));

    render(<Contact />);

    expect(
      screen.getByText('Debes iniciar sesión para enviar este formulario.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeDisabled();
  });

  it('ejecuta onSubmit al enviar el formulario', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });
});
