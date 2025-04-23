import React from "react";
import ReviewCard from "./eview-card";
import { reviews } from "../data/reviews";

const ReviewsList: React.FC = () => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewsList;
