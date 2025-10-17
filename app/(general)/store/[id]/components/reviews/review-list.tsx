import React, { useMemo, useState } from "react";
import ReviewCard from "./eview-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import {
  createStoreReview,
  fetchStoreReviewStats,
  fetchStoreReviews
} from "@/app/(handlers)/general/general";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StoreReview, StoreReviewStatsResponse } from "@/constants/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const ReviewsList: React.FC<{ storeId: number }> = ({ storeId }) => {
  const queryClient = useQueryClient();
  const [showAll, setShowAll] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: reviews, isLoading } = useQuery<StoreReview[]>({
    queryKey: ["store-reviews", storeId],
    queryFn: () => fetchStoreReviews(storeId),
    enabled: !!storeId
  });

  const { data: stats } = useQuery<StoreReviewStatsResponse>({
    queryKey: ["store-reviews-stats", storeId],
    queryFn: () => fetchStoreReviewStats(storeId),
    enabled: !!storeId
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      createStoreReview({ store_id: storeId, email, name, comment, rating }),
    onSuccess: () => {
      toast.success("Review submitted");
      setName("");
      setEmail("");
      setComment("");
      setRating(0);
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["store-reviews", storeId] });
      queryClient.invalidateQueries({
        queryKey: ["store-reviews-stats", storeId]
      });
    },
    onError: (e: unknown) => {
      toast.error("Failed to submit review");
      console.error(e);
    }
  });

  const displayed = useMemo(() => {
    if (!reviews) return [] as StoreReview[];
    const sorted = [...reviews].sort((a, b) => b.rating - a.rating);
    return showAll ? sorted : sorted.slice(0, 5);
  }, [reviews, showAll]);

  const handleSubmit = async () => {
    setConfirmOpen(true);
  };

  const confirmAndSubmit = async () => {
    await mutateAsync();
    setConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="bgblur rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average rating</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold">
                  {stats.average_rating.toFixed(1)}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(stats.average_rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill={
                        s <= Math.round(stats.average_rating)
                          ? "#FACC15"
                          : "#D1D5DB"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total_reviews} reviews
              </p>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {[5, 4, 3, 2, 1].map((k) => (
                <div key={k} className="text-xs">
                  <div className="font-medium">{k}★</div>
                  <div className="text-muted-foreground">
                    {
                      stats.rating_counts[
                        String(k) as keyof typeof stats.rating_counts
                      ]
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-sm text-muted-foreground">Loading reviews…</div>
        )}
        {!isLoading &&
          displayed.map((review) => (
            <ReviewCard
              key={review.id}
              review={{
                id: String(review.id),
                author: review.name,
                avatar:
                  "https://api.dicebear.com/9.x/initials/svg?seed=" +
                  encodeURIComponent(review.name || review.email),
                rating: review.rating,
                comment: review.comment,
                date: new Date(
                  review.created_at || Date.now()
                ).toLocaleDateString()
              }}
            />
          ))}
        {!!reviews?.length && reviews.length > 5 && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? "Show top 5" : "Show all"}
            </Button>
          </div>
        )}
      </div>

      {/* Toggle + Form */}
      {!showForm && (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setShowForm(true)}>
            Add a review
          </Button>
        </div>
      )}

      {showForm && (
        <div className="bgblur  w-full rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className={`p-1 ${
                    s <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  <Star
                    className="w-5 h-5"
                    fill={s <= rating ? "#FACC15" : "#D1D5DB"}
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            className={cn(
              " border rounded-md p-2 resize-none h-24 ",
              comment.length > 1000 || comment.length < 10
                ? "border-red-500"
                : "border-border"
            )}
            placeholder="Share your experience…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
          />

          {comment.length > 1000 && (
            <p className="text-red-500 text-sm">
              Comment must be less than 1000 characters
            </p>
          )}
          {comment.length < 10 && (
            <p className="text-red-500 text-sm">
              Comment must be at least 10 characters
            </p>
          )}
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={
                isPending ||
                rating === 0 ||
                !name ||
                !email ||
                !comment ||
                comment.length < 10 ||
                comment.length > 1000
              }
            >
              {isPending ? "Submitting…" : "Submit review"}
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            key="confirm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-primary/50 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              key="confirm-card"
              initial={{ y: 10, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 8, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-neutral-900 rounded-lg w-full max-w-sm shadow-lg"
            >
              <div className="p-5">
                <h3 className="text-base font-semibold">Confirm submission</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Are you sure you want to submit this review?
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            "w-4 h-4",
                            s <= rating ? "text-yellow-400" : "text-gray-300"
                          )}
                          fill={s <= rating ? "#FACC15" : "#D1D5DB"}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Comment:</span>
                    <p className="mt-1 whitespace-pre-wrap break-words max-h-32 overflow-auto border rounded-md p-2 text-sm">
                      {comment}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={confirmAndSubmit}
                    disabled={isPending}
                  >
                    {isPending ? "Submitting…" : "Confirm & submit"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewsList;
