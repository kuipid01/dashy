import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ConfirmDeleteProps {
  isOpen: boolean;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDelete({
  isOpen,
  onCancel,
  onConfirm,
  isDeleting,
}: ConfirmDeleteProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Card className="w-[90%] max-w-sm rounded-2xl shadow-lg">
              <CardContent className="flex flex-col items-center text-center space-y-4 p-6">
                <h2 className="text-lg font-semibold text-red-600">
                  Confirm Delete
                </h2>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete this item? This action cannot
                  be undone.
                </p>
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    className="w-24 border-gray-400 text-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isDeleting}
                    variant="destructive"
                    onClick={onConfirm}
                    className="w-24"
                  >
                    {isDeleting ? (
                      <Loader2 className="animate-spin duration-300" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
