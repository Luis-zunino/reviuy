import { Review } from "@/types/review";

export interface ReviewListProps {
    reviews: Review[];
    onReviewClick: (review: Review) => void;
}