export interface UseDeleteReviewOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectToHome?: boolean;
}
