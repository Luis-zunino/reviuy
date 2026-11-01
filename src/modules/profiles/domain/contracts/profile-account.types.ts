export interface DeleteAccountInput {
  lastSignInAt: string | null;
}

export interface DeleteAccountCommand {
  userId: string;
  lastSignInAt: string | null;
}

export interface DeleteAccountOutput {
  success: boolean;
}

export type AcceptTermsInput = Record<string, never>;

export interface AcceptTermsCommand {
  userId: string;
  version: string;
}

export interface AcceptTermsOutput {
  success: boolean;
}
