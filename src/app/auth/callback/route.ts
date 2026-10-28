import { NextResponse, type NextRequest } from 'next/server';
import { PagesUrls } from '@/enums';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { AUTH_CALLBACK_ERROR } from '@/shared/auth/auth-callback.constant';
import { hasAcceptedCurrentTerms } from '@/shared/auth/terms.util';

/**
 * Destino del magic link y de Google OAuth (flujo PKCE). Intercambia el `code` por la
 * sesión en el servidor, así las cookies quedan seteadas antes del primer render, y
 * decide en un único lugar si el usuario debe aceptar los términos vigentes.
 *
 * Los destinos son rutas fijas: no se acepta un "next" arbitrario (open redirect).
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const redirectTo = (path: string) => NextResponse.redirect(new URL(path, request.url));
  const redirectToLoginWithError = () =>
    redirectTo(`${PagesUrls.LOGIN}?error=${AUTH_CALLBACK_ERROR}`);

  // Sin code: link vencido o ya usado, o el proveedor devolvió ?error=...
  if (!code) {
    return redirectToLoginWithError();
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return redirectToLoginWithError();
  }

  return redirectTo(
    hasAcceptedCurrentTerms(data.user.user_metadata) ? PagesUrls.HOME : PagesUrls.ACCEPT_TERMS
  );
}
