import type { ContactEmailPayload, SendContactMessageOutput } from '../contracts/contact.types';

export interface ContentCommandRepository {
  sendContactMessage(payload: ContactEmailPayload): Promise<SendContactMessageOutput>;
}
