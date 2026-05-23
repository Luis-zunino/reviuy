import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ResendContentCommandRepository } from '../resend-content-command.repository';
import { createElement } from 'react';

vi.mock('react', () => ({
  createElement: vi.fn(() => 'email-element'),
}));

const mockSendEmail = vi.hoisted(() => vi.fn());
vi.mock('@/app/api/_utils', () => ({
  sendEmail: mockSendEmail,
}));

vi.mock('@/components/common/Emails', () => ({
  ContactEmailTemplate: 'ContactEmailTemplate',
}));

const OLD_ENV = process.env;

describe('ResendContentCommandRepository', () => {
  let repository: ResendContentCommandRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...OLD_ENV, CONTACT_EMAIL: 'contact@reviuy.com' };
    repository = new ResendContentCommandRepository();
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  const payload = {
    name: 'Luis',
    email: 'luis@example.com',
    message: 'Hola equipo!',
    loginEmail: 'login@example.com',
    replyTo: 'login@example.com',
  };

  it('sends an email and returns success', async () => {
    mockSendEmail.mockResolvedValue(undefined);

    const result = await repository.sendContactMessage(payload);

    expect(result).toEqual({ success: true });
    expect(mockSendEmail).toHaveBeenCalledWith({
      to: ['contact@reviuy.com'],
      replyTo: 'login@example.com',
      subject: 'Nuevo mensaje de contacto - Luis',
      react: 'email-element',
    });
    expect(createElement).toHaveBeenCalled();
  });

  it('throws INTERNAL_ERROR when CONTACT_EMAIL is not configured', async () => {
    process.env.CONTACT_EMAIL = '';

    await expect(repository.sendContactMessage(payload)).rejects.toMatchObject({
      code: 'INTERNAL_ERROR',
      message: 'Email de contacto no configurado.',
    });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('throws INTERNAL_ERROR when CONTACT_EMAIL is undefined', async () => {
    delete process.env.CONTACT_EMAIL;

    await expect(repository.sendContactMessage(payload)).rejects.toMatchObject({
      code: 'INTERNAL_ERROR',
    });
  });

  it('propagates errors from sendEmail', async () => {
    mockSendEmail.mockRejectedValue(new Error('Resend API error'));

    await expect(repository.sendContactMessage(payload)).rejects.toThrow('Resend API error');
  });
});
