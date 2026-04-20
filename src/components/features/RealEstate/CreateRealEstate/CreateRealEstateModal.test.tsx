import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateRealEstateModal } from './CreateRealEstateModal';

const { useCreateRealEstateModalMock, handleFormSubmitMock } = vi.hoisted(() => ({
  useCreateRealEstateModalMock: vi.fn(),
  handleFormSubmitMock: vi.fn((e?: { preventDefault?: () => void }) => e?.preventDefault?.()),
}));

vi.mock('./hook', () => ({
  useCreateRealEstateModal: useCreateRealEstateModalMock,
}));

vi.mock('@/components/common/Form', () => ({
  FormLabel: ({ label }: { label: string }) => <label>{label}</label>,
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

describe('CreateRealEstateModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCreateRealEstateModalMock.mockReturnValue({
      register: (name: string) => ({ name, onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() }),
      handleFormSubmit: handleFormSubmitMock,
      isSubmitting: false,
      errors: {},
      watch: () => 'Inmobiliaria ABC',
    });
  });

  it('renderiza trigger opcional y contenido del modal', () => {
    render(
      <CreateRealEstateModal
        name="real_estate_name"
        isOpen
        onOpenChange={vi.fn()}
        showModal
        triggerComponentModal={() => <button type="button">Abrir modal</button>}
        defaultValues={{ real_estate_name: '' }}
      />
    );

    expect(screen.getByRole('button', { name: 'Abrir modal' })).toBeInTheDocument();
    expect(screen.getByText('Crear una nueva Inmobiliaria')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear Inmobiliaria' })).toBeInTheDocument();
  });

  it('cierra modal al click en Cancelar', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <CreateRealEstateModal
        name="real_estate_name"
        isOpen
        onOpenChange={onOpenChange}
        defaultValues={{ real_estate_name: '' }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('ejecuta handleFormSubmit al enviar formulario', () => {
    render(
      <CreateRealEstateModal
        name="real_estate_name"
        isOpen
        onOpenChange={vi.fn()}
        defaultValues={{ real_estate_name: '' }}
      />
    );

    fireEvent.submit(document.getElementById('create-real-estate-form')!);

    expect(handleFormSubmitMock).toHaveBeenCalledTimes(1);
  });
});
