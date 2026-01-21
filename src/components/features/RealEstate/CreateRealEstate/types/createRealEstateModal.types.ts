export interface CreateRealEstateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValue?: string;
  handleCreateNew: (open: boolean) => void;
  isModal: boolean;
  showModal: boolean;
}
