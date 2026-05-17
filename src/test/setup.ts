import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock global de paquetes que restringen su uso a servidor/cliente en Next.js.
// Esto evita que las Server Actions o utilidades de caché fallen al ser evaluadas por Vitest.
vi.mock('server-only', () => ({}));
vi.mock('client-only', () => ({}));
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Mock global de next/font/google para evitar el error "Manrope is not a function"
// Esto permite que las constantes de fuentes en src/constants/fonts.constant.ts se inicialicen correctamente.
vi.mock('next/font/google', () => ({
  Manrope: () => ({
    className: 'mocked-manrope-font',
  }),
  Playfair_Display: () => ({
    className: 'mocked-playfair-font',
  }),
}));

afterEach(() => {
  cleanup();
});
