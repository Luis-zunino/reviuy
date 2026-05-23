import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSendReportRealEstateReviewMessage } from '../useSendReportRealEstateReviewMessage.hook';

const mockUseApiMutation = vi.hoisted(() => vi.fn(() => ({ mutate: vi.fn(), isLoading: false })));
vi.mock('@/shared/api', () => ({ useApiMutation: mockUseApiMutation }));

describe('useSendReportRealEstateReviewMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls useApiMutation with /api/report-real-estate-review', () => {
    renderHook(() => useSendReportRealEstateReviewMessage());
    expect(mockUseApiMutation).toHaveBeenCalledWith('/api/report-real-estate-review');
  });

  it('returns mutation result', () => {
    const mock = { mutate: vi.fn(), isLoading: true };
    mockUseApiMutation.mockReturnValue(mock);
    const { result } = renderHook(() => useSendReportRealEstateReviewMessage());
    expect(result.current).toEqual(mock);
  });
});
