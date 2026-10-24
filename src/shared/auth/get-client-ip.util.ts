import { headers } from 'next/headers';

/**
 * Deriva la IP del cliente desde los headers del request.
 *
 * Vercel/Next.js setean x-forwarded-for con la IP real del cliente
 * (posible lista "client, proxy1, proxy2" — se toma la primera).
 * Fallback a x-real-ip. Si no hay ninguna se devuelve 'unknown' para no
 * bloquear el flujo; el rate limiter agrupa entonces a los desconocidos.
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();

  const forwardedFor = headerList.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = headerList.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
}
