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
