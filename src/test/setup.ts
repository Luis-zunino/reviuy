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

// Mock global de next/font/google para evitar errores en tests.
// Las constantes de fuentes (fonts.constant.ts) usan Inter.
vi.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mocked-inter-font',
  }),
}));

afterEach(() => {
  cleanup();
});
