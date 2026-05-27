import * as fs from 'node:fs';
import * as path from 'node:path';

const ENV_FILES = ['.env.local', '.env'];

/**
 * Carga variables de entorno desde archivos .env / .env.local.
 *
 * Necesario porque Playwright corre globalSetup en un proceso Node.js
 * que NO carga automáticamente los archivos .env.local de Next.js.
 */
export function loadEnvFiles(): void {
  const cwd = process.cwd();

  for (const file of ENV_FILES) {
    const envPath = path.resolve(cwd, file);
    if (!fs.existsSync(envPath)) continue;

    const content = fs.readFileSync(envPath, 'utf-8');

    for (const rawLine of content.split('\n')) {
      const line = rawLine.trim();

      if (!line || line.startsWith('#')) continue;

      const eqIndex = line.indexOf('=');
      if (eqIndex === -1) continue;

      const key = line.slice(0, eqIndex).trim();
      let value = line.slice(eqIndex + 1).trim();

      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}
