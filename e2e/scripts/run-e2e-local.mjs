/**
 * Corre la suite e2e contra el stack LOCAL de Supabase.
 *
 *   pnpm test:e2e:local                     # suite completa
 *   pnpm test:e2e:local -- e2e/specs/foo.spec.ts
 *   pnpm test:e2e:local -- --grep "texto"
 *
 * Por qué existen este script y .env.e2e:
 * - El .env de desarrollo apunta NEXT_PUBLIC_SUPABASE_URL a prod. El e2e crea
 *   reseñas, users y sesiones reales contra ese destino: correrlo así escribe
 *   datos de test en prod (y rompe los specs que usan migraciones que prod
 *   todavía no tiene).
 * - NEXT_PUBLIC_* se hornea en el build: para que el browser y el server de la
 *   app apunten AMBOS a local, el build debe hacerse con .env.e2e. `next start`
 *   sobre ese build + este entorno queda consistente end to end.
 *
 * Vive en e2e/scripts/ (no en /scripts, que está ignorado por git) para que el
 * script quede versionado. .env.e2e está ignorado: copiar .env.e2e.example.
 *
 * Requiere el stack local corriendo: `npx supabase start`.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const E2E_ENV_FILE = '.env.e2e';

function parseEnvFile(filePath) {
  try {
    const content = readFileSync(path.resolve(process.cwd(), filePath), 'utf8');
    return Object.fromEntries(
      content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && /^[A-Za-z_0-9]+=/.test(line))
        .map((line) => {
          const eq = line.indexOf('=');
          let value = line.slice(eq + 1).trim();
          value = value.replace(/^['"]|['"]$/g, '');
          const commentIdx = value.indexOf(' #');
          if (commentIdx !== -1) value = value.slice(0, commentIdx).trim();
          return [line.slice(0, eq).trim(), value];
        })
    );
  } catch {
    console.error(
      `✗ No se encontró ${E2E_ENV_FILE}. Copiá .env.e2e.example con las claves del stack local`
    );
    process.exit(1);
  }
}

const e2eEnv = parseEnvFile(E2E_ENV_FILE);
const childEnv = { ...process.env, ...e2eEnv };

// `pnpm xxx -- a b` empaqueta los args a este script con el `--` incluido.
const extraArgs = process.argv.slice(2).filter((arg) => arg !== '--');
const isWindows = process.platform === 'win32';
const npx = isWindows ? 'pnpm.cmd' : 'pnpm';

console.log('▸ Build de la app con', E2E_ENV_FILE, '(NEXT_PUBLIC_* se hornea en el bundle)…');

const build = spawnSync(npx, ['build'], {
  stdio: ['ignore', 'inherit', 'inherit'],
  shell: true,
  env: childEnv,
});

if (build.status !== 0) {
  console.error(`✗ El build falló con código ${build.status ?? 'desconocido'}`);
  process.exit(build.status ?? 1);
}

console.log('▸ Playwright test…');

const result = await new Promise((resolve) => {
  const child = spawn(npx, ['exec', 'playwright', 'test', ...extraArgs], {
    stdio: 'inherit',
    shell: true,
    env: childEnv,
  });
  child.on('close', (code) => resolve(code));
  child.on('error', (err) => {
    console.error('✗ No se pudo lanzar playwright:', err.message);
    resolve(1);
  });
});

process.exit(result ?? 1);
