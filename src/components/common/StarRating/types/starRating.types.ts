export interface StarRatingDisplayProps {
  rating: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  isError?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  showLabel?: boolean;
  errorMessage?: string;
}
