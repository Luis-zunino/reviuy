import { defineConfig, devices } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * baseURL consistente entre use.baseURL, webServer.url y el puerto de next start.
 *
 * El config se evalúa varias veces (proceso principal + workers). Los .env solo
 * se cargan después, en globalSetup, así que en la PRIMERA evaluación
 * (`process.env.PLAYWRIGHT_BASE_URL`) puede ser undefined mientras en las
 * workers sí existe. Si el valor cambiara entre evaluaciones, el webServer
 * arrancaría en un puerto (3000) y los tests navegarían a otro (3100).
 *
 * El config por eso lee el .env por su cuenta y lo fija en process.env antes de
 * calcular nada: todas las evaluaciones derivan el mismo valor.
 */
function readDotEnvFile(filePath: string): Record<string, string> {
  const values: Record<string, string> = {};
  try {
    const content = fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');
    for (const line of content.split('\n')) {
      // Acepta valores vacíos (p. ej. UPSTASH_REDIS_REST_URL= para desactivarlo).
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_0-9]+)\s*=\s*([^\r\n]*)$/);
      if (!match?.[1] || match[1].startsWith('#')) continue;
      let value = match[2].replace(/^['"]|['"]$/g, '');
      const commentIdx = value.indexOf(' #');
      if (commentIdx !== -1) value = value.slice(0, commentIdx).trim();
      values[match[1]] = value;
    }
  } catch {
    // archivo inexistente
  }
  return values;
}

function readDotEnvValue(key: string, filePath: string): string | undefined {
  return readDotEnvFile(filePath)[key];
}

const PLAYWRIGHT_ENV_FILES = ['.env.local', '.env'];
for (const file of PLAYWRIGHT_ENV_FILES) {
  const value = readDotEnvValue('PLAYWRIGHT_BASE_URL', file);
  if (value && !process.env.PLAYWRIGHT_BASE_URL) {
    process.env.PLAYWRIGHT_BASE_URL = value;
  }
}

// .env.e2e: destino EXCLUSIVO de la suite e2e (stack local de Supabase). Antes
// el e2e heredaba NEXT_PUBLIC_* del .env de desarrollo y terminaba creando
// reseñas, users y sesiones de prueba en PROD (además de romper los specs que
// dependen de migraciones locales, como update_review con firma nueva).
// Cuidado con el "no pisar existentes": el runner de Playwright es el mismo
// proceso que evalúa el config, así que lo fijado acá lo ven globalSetup y el
// webServer (que hereda el entorno del runner).
const E2E_ENV_FILE = '.env.e2e';
const e2eEnv = readDotEnvFile(E2E_ENV_FILE);
for (const [key, value] of Object.entries(e2eEnv)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}

// PLAYWRIGHT_BASE_URL puede setearse en el entorno o en .env (p. ej. 3100 para
// no chocar con un next dev en 3000).
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
// El puerto puede no estar en process.env al evaluar el config (los .env se
// cargan en globalSetup), pero Playwright sí lo expone al runner.
const baseURLPort = new URL(baseURL).port || '3000';

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],

  globalSetup: './e2e/global-setup.ts',

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: `pnpm next start -p ${baseURLPort}`,
    // Prod build necesario: ejecutar `pnpm build` antes del primer test run
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120_000,
  },
});
