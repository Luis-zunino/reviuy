// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSendReportReviewMessage } from '../useSendReportReviewMessage.hook';

const mockUseApiMutation = vi.hoisted(() => vi.fn(() => ({ mutate: vi.fn(), isLoading: false })));
vi.mock('@/shared/api', () => ({ useApiMutation: mockUseApiMutation }));

describe('useSendReportReviewMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls useApiMutation with /api/report-review', () => {
    renderHook(() => useSendReportReviewMessage());
    expect(mockUseApiMutation).toHaveBeenCalledWith('/api/report-review');
  });

  it('returns mutation result', () => {
    const mock = { mutate: vi.fn(), isLoading: true };
    mockUseApiMutation.mockReturnValue(mock);
    const { result } = renderHook(() => useSendReportReviewMessage());
    expect(result.current).toEqual(mock);
  });
});
