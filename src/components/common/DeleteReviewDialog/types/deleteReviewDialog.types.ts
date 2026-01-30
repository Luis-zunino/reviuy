export interface DeleteReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reviewTitle?: string | null;
  isDeleting?: boolean;
}
