import { CURRENT_TERMS_VERSION } from '@/constants/legal-terms.constant';

/**
 * Única regla para decidir si el usuario aceptó los términos vigentes. La usan el
 * callback de auth, el middleware y la pantalla de aceptación: si divergen, un
 * usuario puede quedar en loop entre /home y /auth/accept-terms.
 */
export const hasAcceptedCurrentTerms = (userMetadata?: Record<string, unknown> | null): boolean =>
  userMetadata?.terms_version === CURRENT_TERMS_VERSION;
