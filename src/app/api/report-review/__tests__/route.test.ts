import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockSendEmail = vi.fn();
const mockReportUseCase = vi.fn();

vi.mock('../../_utils', async () => {
  const { withErrorHandler, methodNotAllowed } =
    await import('../../_utils/with-error-handler.util');
  return {
    getAuthenticatedUser: vi.fn().mockResolvedValue({ id: 'user-1', email: 'user@reviuy.qa' }),
    parseAndValidateBody: vi.fn().mockResolvedValue({
      reviewUuid: '11111111-1111-1111-1111-111111111111',
      reason: 'Spam',
      message: 'Contenido engañoso',
    }),
    sendEmail: mockSendEmail,
    withErrorHandler,
    methodNotAllowed,
  };
});

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/lib/redis', () => ({
  withRateLimit: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/modules/moderation/application', () => ({
  createReportReviewUseCase: () => mockReportUseCase,
}));

vi.mock('@/modules/moderation/infrastructure', () => ({
  SupabaseModerationCommandRepository: vi.fn(),
}));

vi.mock('@/components/common/Emails', () => ({
  ReportReviewTemplate: () => null,
}));

describe('POST /api/report-review', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CONTACT_EMAIL = 'moderacion@reviuy.qa';
  });

  it('sends the email when the report is stored', async () => {
    mockReportUseCase.mockResolvedValue({ success: true, message: 'Reporte enviado' });
    const { POST } = await import('../route');

    const response = await POST(new Request('http://localhost/api/report-review'));

    expect(response.status).toBe(200);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });

  it('does not send the email when the RPC rejects the report', async () => {
    mockReportUseCase.mockResolvedValue({
      success: false,
      message: 'Ya has reportado esta reseña anteriormente',
    });
    const { POST } = await import('../route');

    const response = await POST(new Request('http://localhost/api/report-review'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: 'Ya has reportado esta reseña anteriormente',
    });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});
