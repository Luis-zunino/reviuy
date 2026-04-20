const DEFAULT_SITE_ORIGIN = 'https://reviuy.vercel.app';

/**
 * Normaliza NEXT_PUBLIC_SITE_URL para evitar paths accidentales (p. ej. /auth/callback)
 * en canonical, Open Graph y redirects.
 */
export const getSiteOrigin = (rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL): string => {
  if (!rawSiteUrl) {
    return DEFAULT_SITE_ORIGIN;
  }

  try {
    return new URL(rawSiteUrl).origin;
  } catch {
    return DEFAULT_SITE_ORIGIN;
  }
};

export const buildSiteUrl = (path = ''): string => {
  const siteOrigin = getSiteOrigin();

  if (!path) {
    return siteOrigin;
  }

  return new URL(path, siteOrigin).toString();
};
