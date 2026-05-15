import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MultiForm } from './index';

const { useMultiFormMock, stepperMock } = vi.hoisted(() => ({
  useMultiFormMock: vi.fn(),
  stepperMock: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useMultiForm: useMultiFormMock,
}));

vi.mock('../../Stepper', () => ({
  Stepper: (props: unknown) => {
    stepperMock(props);
    return <div data-testid="stepper" />;
  },
}));

vi.mock('@/components/ui/form', () => ({
  Form: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('MultiForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMultiFormMock.mockReturnValue({
      step: 0,
      totalSteps: 2,
      handleBack: vi.fn(),
      handleNext: vi.fn(),
    });
  });

  it('renderiza stepper y solo el child del paso actual', () => {
    const form = { formState: { isValid: true } } as never;

    render(
      <MultiForm
        form={form}
        onSubmit={vi.fn()}
        formsChildren={[<div key="1">Paso 1</div>, <div key="2">Paso 2</div>]}
        stepLabels={['Paso 1', 'Paso 2']}
      />
    );

    expect(screen.getByTestId('stepper')).toBeInTheDocument();
    expect(screen.getByText('Paso 1')).toBeInTheDocument();
    expect(screen.queryByText('Paso 2')).not.toBeInTheDocument();

    expect(stepperMock).toHaveBeenCalledWith(
      expect.objectContaining({
        stepLabels: ['Paso 1', 'Paso 2'],
        totalSteps: 2,
        step: 0,
        showProgressBar: true,
      })
    );
  });

  it('deshabilita Guardar cuando formulario es invalido', () => {
    const form = { formState: { isValid: false } } as never;

    render(
      <MultiForm form={form} onSubmit={vi.fn()} formsChildren={[<div key="1">Paso 1</div>]} />
    );

    expect(screen.getByRole('button', { name: /guardar formulario/i })).toBeDisabled();
  });

  it('deshabilita Guardar cuando isSubmitDisabled es true', () => {
    const form = { formState: { isValid: true } } as never;

    render(
      <MultiForm
        form={form}
        onSubmit={vi.fn()}
        formsChildren={[<div key="1">Paso 1</div>]}
        isSubmitDisabled
      />
    );

    expect(screen.getByRole('button', { name: /guardar formulario/i })).toBeDisabled();
  });

  it('ejecuta onSubmit al enviar el form', () => {
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault());
    const form = { formState: { isValid: true } } as never;

    render(
      <MultiForm form={form} onSubmit={onSubmit} formsChildren={[<div key="1">Paso 1</div>]} />
    );

    fireEvent.submit(screen.getByRole('button', { name: /guardar formulario/i }).closest('form')!);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('muestra botones de navegacion segun el paso y ejecuta handlers', async () => {
    const user = userEvent.setup();
    const handleBack = vi.fn();
    const handleNext = vi.fn();
    useMultiFormMock.mockReturnValue({
      step: 1,
      totalSteps: 3,
      handleBack,
      handleNext,
    });

    const form = { formState: { isValid: true } } as never;

    render(
      <MultiForm
        form={form}
        onSubmit={vi.fn()}
        formsChildren={[
          <div key="1">Paso 1</div>,
          <div key="2">Paso 2</div>,
          <div key="3">Paso 3</div>,
        ]}
      />
    );

    await user.click(screen.getByRole('button', { name: /ir al paso anterior/i }));
    await user.click(screen.getByRole('button', { name: /ir al siguiente paso/i }));

    expect(handleBack).toHaveBeenCalledTimes(1);
    expect(handleNext).toHaveBeenCalledTimes(1);
  });

  it('no muestra boton Siguiente en el ultimo paso', () => {
    useMultiFormMock.mockReturnValue({
      step: 1,
      totalSteps: 2,
      handleBack: vi.fn(),
      handleNext: vi.fn(),
    });
    const form = { formState: { isValid: true } } as never;

    render(
      <MultiForm
        form={form}
        onSubmit={vi.fn()}
        formsChildren={[<div key="1">Paso 1</div>, <div key="2">Paso 2</div>]}
      />
    );

    expect(screen.queryByRole('button', { name: /ir al siguiente paso/i })).not.toBeInTheDocument();
  });
});
