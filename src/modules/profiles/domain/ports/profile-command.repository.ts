import type { DeleteAccountCommand, DeleteAccountOutput } from '../contracts/profile-account.types';

export interface ProfileCommandRepository {
  deleteAccount(input: DeleteAccountCommand): Promise<DeleteAccountOutput>;
}
