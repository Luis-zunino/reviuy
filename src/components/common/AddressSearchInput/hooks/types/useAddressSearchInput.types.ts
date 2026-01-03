import type { AddressClickData } from './addressClickData.types';

export interface UseAddressSearchInputProps {
  defaultValue?: string | null;
  handleOnClick: (address: AddressClickData) => void;
}
