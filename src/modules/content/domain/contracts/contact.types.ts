export interface SendContactMessageInput {
  name: string;
  email: string;
  message: string;
}

export interface SendContactMessageOutput {
  success: boolean;
}

export interface AuthenticatedContactUser {
  id: string;
  email: string | null;
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  message: string;
  loginEmail: string;
  replyTo: string;
}
