export interface SelectedAddress {
  osmId?: string | null;
  display_name?: string | null;
  position: { lat?: number | null; lon?: number | null };
}
