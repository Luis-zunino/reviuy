import { render, screen } from '@testing-library/react';
import { Stepper } from './index';

describe('Stepper', () => {
  it('renders current step info and labels', () => {
    render(
      <Stepper
        stepLabels={['Dirección', 'Detalles', 'Confirmación']}
        showProgressBar
        totalSteps={3}
        step={1}
      />
    );

    expect(screen.getByText('Detalles')).toBeInTheDocument();
    expect(screen.getByText('2 de 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Paso 2 de 3')).toBeInTheDocument();
  });

  it('falls back to generic step label when stepLabels is undefined', () => {
    render(<Stepper stepLabels={undefined} showProgressBar={false} totalSteps={2} step={0} />);

    expect(screen.getByText('Paso 1')).toBeInTheDocument();
    expect(screen.getByText('1 de 2')).toBeInTheDocument();
  });
});
