import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SupabaseModerationCommandRepository } from '../supabase-moderation-command.repository';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('SupabaseModerationCommandRepository', () => {
  let mockSupabase: any;
  let repository: SupabaseModerationCommandRepository;

  beforeEach(() => {
    mockSupabase = {
      rpc: vi.fn(),
    };
    repository = new SupabaseModerationCommandRepository(mockSupabase);
  });

  describe('reportReview', () => {
    const input = { review_id: VALID_UUID, reason: 'spam', description: 'Es spam' };

    it('returns success on RPC success', async () => {
      mockSupabase.rpc.mockReturnValue({
        then: (onfulfilled: any) => Promise.resolve({ data: null, error: null }).then(onfulfilled),
      });

      const result = await repository.reportReview(input);

      expect(result).toEqual({ success: true, message: 'Reporte enviado' });
      expect(mockSupabase.rpc).toHaveBeenCalledWith('report_review', {
        p_review_id: input.review_id,
        p_reason: input.reason,
        p_description: input.description,
      });
    });

    it('throws on RPC error', async () => {
      const error = { message: 'RPC error', code: 'PGRST116' };
      mockSupabase.rpc.mockReturnValue({
        then: (onfulfilled: any) => Promise.resolve({ data: null, error }).then(onfulfilled),
      });

      await expect(repository.reportReview(input)).rejects.toThrow();
    });

    it('works without optional description', async () => {
      mockSupabase.rpc.mockReturnValue({
        then: (onfulfilled: any) => Promise.resolve({ data: null, error: null }).then(onfulfilled),
      });

      const result = await repository.reportReview({ review_id: VALID_UUID, reason: 'spam' });

      expect(result.success).toBe(true);
    });
  });

  describe('reportRealEstate', () => {
    const input = { real_estate_id: VALID_UUID, reason: 'spam' };

    it('returns success on RPC success', async () => {
      mockSupabase.rpc.mockReturnValue({
        then: (onfulfilled: any) => Promise.resolve({ data: null, error: null }).then(onfulfilled),
      });

      const result = await repository.reportRealEstate(input);

      expect(result).toEqual({ success: true, message: 'Reporte enviado' });
      expect(mockSupabase.rpc).toHaveBeenCalledWith('report_real_estate', {
        p_real_estate_id: input.real_estate_id,
        p_reason: input.reason,
        p_description: undefined,
      });
    });

    it('throws on RPC error', async () => {
      mockSupabase.rpc.mockReturnValue({
        then: (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'DB fail' } }).then(onfulfilled),
      });

      await expect(repository.reportRealEstate(input)).rejects.toThrow();
    });
  });

  describe('reportRealEstateReview', () => {
    const input = { review_id: VALID_UUID, reason: 'spam' };

    it('returns success on RPC success', async () => {
      mockSupabase.rpc.mockReturnValue({
        then: (onfulfilled: any) => Promise.resolve({ data: null, error: null }).then(onfulfilled),
      });

      const result = await repository.reportRealEstateReview(input);

      expect(result).toEqual({ success: true, message: 'Reporte enviado' });
      expect(mockSupabase.rpc).toHaveBeenCalledWith('report_real_estate_review', {
        p_real_estate_review_id: input.review_id,
        p_reason: input.reason,
        p_description: undefined,
      });
    });

    it('throws on RPC error', async () => {
      mockSupabase.rpc.mockReturnValue({
        then: (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled),
      });

      await expect(repository.reportRealEstateReview(input)).rejects.toThrow();
    });
  });
});
