import * as fs from 'node:fs';
import * as path from 'node:path';

// .env.e2e primero: es el destino de la suite (stack local). Si falta, cae a
// los .env de desarrollo, que apuntan a prod.
const ENV_FILES = ['.env.e2e', '.env.local', '.env'];

type EnvVar = { key: string; value: string };

function parseLine(rawLine: string): EnvVar | null {
  const line = rawLine.trim();
  if (!line || line.startsWith('#')) return null;

  const eqIndex = line.indexOf('=');
  if (eqIndex === -1) return null;

  const key = line.slice(0, eqIndex).trim();
  let value = line.slice(eqIndex + 1).trim();

  const isQuoted =
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"));

  if (isQuoted) value = value.slice(1, -1);

  return { key, value };
}

function loadFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');

  for (const rawLine of content.split('\n')) {
    const parsed = parseLine(rawLine);
    if (!parsed) continue;
    if (process.env[parsed.key]) continue;

    process.env[parsed.key] = parsed.value;
  }
}

/**
 * Carga variables de entorno desde `.env.e2e`, `.env.local` y `.env`
 * (en ese orden; no pisa las que ya existen).
 *
 * Necesario porque Playwright corre globalSetup en un proceso Node.js
 * que NO carga automáticamente los archivos .env.local de Next.js.
 */
export function loadEnvFiles(): void {
  const cwd = process.cwd();

  for (const file of ENV_FILES) {
    loadFile(path.resolve(cwd, file));
  }
}
