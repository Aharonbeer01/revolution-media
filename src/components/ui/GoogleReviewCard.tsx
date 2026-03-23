"use client";

import { GoogleReview } from "@/types/google-review";
import { StarRating } from "@/components/ui/StarRating";

export function GoogleReviewCard({ review }: { review: GoogleReview }) {
  return (
    <div className="flex h-full flex-col rounded-lg bg-warm-white p-6 shadow-sm sm:p-8">
      {/* Star rating */}
      <StarRating rating={review.rating} />

      {/* Review text */}
      <p className="mt-4 flex-1 text-base text-midnight/80 leading-relaxed line-clamp-6">
        {review.text}
      </p>

      {/* Author */}
      <div className="mt-6 flex items-center gap-3">
        {review.profile_photo_url && (
          <img
            src={review.profile_photo_url}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}
        <div>
          <p className="font-semibold text-midnight">{review.author_name}</p>
          <p className="text-xs text-midnight/50">{review.relative_time_description}</p>
        </div>
      </div>
    </div>
  );
}
