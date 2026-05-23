import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSendReportRealEstateMessage } from '../useSendReportRealEstateMessage.hook';

const mockUseApiMutation = vi.hoisted(() => vi.fn(() => ({ mutate: vi.fn(), isLoading: false })));
vi.mock('@/shared/api', () => ({ useApiMutation: mockUseApiMutation }));

describe('useSendReportRealEstateMessage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('calls useApiMutation with /api/report-real-estate', () => {
    renderHook(() => useSendReportRealEstateMessage());
    expect(mockUseApiMutation).toHaveBeenCalledWith('/api/report-real-estate');
  });

  it('returns mutation result', () => {
    const mock = { mutate: vi.fn(), isLoading: true };
    mockUseApiMutation.mockReturnValue(mock);
    const { result } = renderHook(() => useSendReportRealEstateMessage());
    expect(result.current).toEqual(mock);
  });
});
