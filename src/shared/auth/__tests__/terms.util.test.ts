import { describe, expect, it } from 'vitest';
import { hasAcceptedCurrentTerms } from '../terms.util';
import { CURRENT_TERMS_VERSION } from '@/constants/legal-terms.constant';

describe('hasAcceptedCurrentTerms', () => {
  it('returns false without user or claims', () => {
    expect(hasAcceptedCurrentTerms(null)).toBe(false);
    expect(hasAcceptedCurrentTerms(undefined)).toBe(false);
  });

  it('returns true when the current version was signed server-side (app_metadata)', () => {
    expect(
      hasAcceptedCurrentTerms({ app_metadata: { terms_version: CURRENT_TERMS_VERSION } })
    ).toBe(true);
  });

  it('returns true when the current version lives in user_metadata (legacy fallback)', () => {
    expect(
      hasAcceptedCurrentTerms({ user_metadata: { terms_version: CURRENT_TERMS_VERSION } })
    ).toBe(true);
  });

  it('returns false when the accepted version is older, even with terms_accepted_at present', () => {
    expect(
      hasAcceptedCurrentTerms({
        app_metadata: { terms_version: 'v1' },
        user_metadata: { terms_version: 'v1', terms_accepted_at: '2026-01-01' },
      })
    ).toBe(false);
  });

  it('returns false when there is no terms metadata at all', () => {
    expect(hasAcceptedCurrentTerms({})).toBe(false);
  });
});
