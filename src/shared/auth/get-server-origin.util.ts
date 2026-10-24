import { headers } from 'next/headers';

/**
 * Deriva el origin absoluto del request actual.
 *
 * En una Server Action no existe window.location, así que si se pasa un
 * emailRedirectTo/redirectTo relativo a Supabase, este usa el Site URL de su
 * dashboard (el dominio deployado) y el magic link manda al usuario producción.
 * Derivar el origin de los headers mantiene la redirección en el entorno actual
 * (localhost en dev, preview URL en Vercel, dominio en producción).
 */
export async function getServerOrigin(): Promise<string> {
  const headerList = await headers();

  const forwardedHost = headerList.get('x-forwarded-host');
  const host = forwardedHost ?? headerList.get('host') ?? 'localhost:3000';

  const forwardedProto = headerList.get('x-forwarded-proto');
  const proto =
    forwardedProto?.split(',')[0]?.trim() ??
    (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');

  return `${proto}://${host}`;
}
