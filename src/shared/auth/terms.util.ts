import { CURRENT_TERMS_VERSION } from '@/constants/legal-terms.constant';

/**
 * Única regla para decidir si el usuario aceptó los términos vigentes. La usan el
 * callback de auth, el middleware y la pantalla de aceptación: si divergen, un
 * usuario puede quedar en loop entre /home y /auth/accept-terms.
 *
 * Fuente de verdad: `app_metadata.terms_version`, firmado server-side con
 * service role (`acceptTermsAction` → SupabaseProfileCommandRepository) y no
 * editable por el usuario con la anon key. `user_metadata.terms_version` acepta
 * el fallback legacy: usuarios que aceptaron mientras la firma era client-side.
 */
interface AuthMetadataBag {
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
}

export const hasAcceptedCurrentTerms = (userOrClaims?: AuthMetadataBag | null): boolean =>
  userOrClaims?.app_metadata?.terms_version === CURRENT_TERMS_VERSION ||
  userOrClaims?.user_metadata?.terms_version === CURRENT_TERMS_VERSION;
