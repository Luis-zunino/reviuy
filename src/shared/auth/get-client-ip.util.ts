import { headers } from 'next/headers';

/**
 * IP del cliente para claves de rate limiting en server actions.
 * En Vercel, x-forwarded-for lo fija la plataforma y su primer valor es el cliente.
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for')?.split(',')[0]?.trim();

  return forwardedFor || headerList.get('x-real-ip')?.trim() || 'unknown';
}
