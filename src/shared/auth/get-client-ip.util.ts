import { headers } from 'next/headers';

/**
 * IP del cliente para claves de rate limiting en server actions.
 *
 * - `x-vercel-forwarded-for`: lo fija el borde de Vercel y el cliente no puede
 *   falsificarlo. Es la fuente preferida.
 * - `x-forwarded-for` / `x-real-ip`: solo son confiables detrás de un proxy que los
 *   sobrescriba (Vercel lo hace). Si se despliega en otro hosting sin ese proxy, un
 *   atacante puede enviar uno distinto en cada request y evadir el rate limit por IP.
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const firstIp = (value: string | null) => value?.split(',')[0]?.trim();

  return (
    firstIp(headerList.get('x-vercel-forwarded-for')) ||
    firstIp(headerList.get('x-forwarded-for')) ||
    headerList.get('x-real-ip')?.trim() ||
    'unknown'
  );
}
