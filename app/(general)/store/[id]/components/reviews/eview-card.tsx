/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Star } from "lucide-react";
import { Review } from "../types";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start gap-4">
        <img
          src={review.avatar}
          alt={review.author}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900">{review.author}</h4>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={14}
                    className={
                      index < review.rating ? "text-amber-400" : "text-gray-300"
                    }
                    fill={index < review.rating ? "#FFC107" : "#D1D5DB"}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-500">{review.date}</span>
          </div>
          <p className="mt-2 text-gray-600 text-sm">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
