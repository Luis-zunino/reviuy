import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrivacyPolicyComponent } from '../index';

vi.mock('@/components/common', () => ({
  PageWithSidebar: ({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

describe('PrivacyPolicyComponent', () => {
  it('renderiza titulo, descripcion y secciones completas', () => {
    render(<PrivacyPolicyComponent />);

    // Shell
    expect(screen.getByText('Política de privacidad')).toBeInTheDocument();

    // La única fecha que debe aparecer es la unificada
    expect(screen.getAllByText(/21 de mayo de 2026/).length).toBeGreaterThan(0);
    // No debe haber otra fecha diferente en el cuerpo
    expect(screen.queryByText(/12 de febrero de 2026/)).not.toBeInTheDocument();

    // Sections existentes que se mantienen
    expect(screen.getByText('1. Información que recolectamos')).toBeInTheDocument();
    expect(screen.getByText('4. Cookies')).toBeInTheDocument();

    // Nuevas secciones (~14 total)
    expect(screen.getByText('2. Datos del responsable')).toBeInTheDocument();
    expect(screen.getByText('3. Base legal para el tratamiento')).toBeInTheDocument();
    expect(screen.getByText('5. Procesadores externos')).toBeInTheDocument();
    expect(screen.getByText('6. Transferencias internacionales de datos')).toBeInTheDocument();
    expect(screen.getByText('7. Retención de datos')).toBeInTheDocument();
    expect(screen.getByText('8. Medidas de seguridad')).toBeInTheDocument();
    expect(screen.getByText('9. Derechos ARCO')).toBeInTheDocument();
    expect(screen.getByText('10. Cómo ejercer tus derechos')).toBeInTheDocument();
    expect(screen.getByText('11. Cambios a esta política')).toBeInTheDocument();
    expect(screen.getByText('12. Menores de edad')).toBeInTheDocument();
    expect(
      screen.getByText('13. Unidad Reguladora y de Control de Datos Personales (URCDP)')
    ).toBeInTheDocument();
    expect(screen.getByText('14. Contacto')).toBeInTheDocument();
  });
});
