/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Order } from "@/constants/types";
import Image from "next/image";
import { CheckCircle, Expand, XCircle } from "lucide-react";
import { useUpdateOrderEscrow } from "@/app/(handlers)/order-tracking/query";
import { useUploadImageUnprotected } from "@/app/(handlers)/product/product";
import { toast } from "sonner";

const DisputeResolutionForm = ({
  order,
  isOpen,
  setIsOpen
}: {
  order: Order;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const canInteractWithForm = !order.dispute_winner;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className=" sm:max-w-[750px]  max-h-[90vh] overflow-y-auto lg:w-[800px]  max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Dispute Resolution</DialogTitle>
          <DialogDescription>
            Review the dispute and provide evidence to resolve it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 w-full">
          {canInteractWithForm ? (
            <>
              <DisputeReasonFromCustomer order={order} />
              <DisputeRebuttalFromStore order={order} setIsOpen={setIsOpen} />
            </>
          ) : (
            <>
              <DisputeResolutionResult order={order} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DisputeReasonFromCustomer = ({ order }: { order: Order }) => {
  const [activeImage, setactiveImage] = useState<string | null>(null);
  return (
    <div className="rounded-lg border p-4 bg-red-50 w-full flex flex-col gap-2">
      <h3 className="text-red-700 font-semibold mb-2">Customer’s Dispute</h3>
      <p className="text-sm text-red-800 mb-2">
        <span className="font-medium">Reason:</span>{" "}
        {order.delivery_rejected_reason}
      </p>
      <p className="text-sm text-red-800 mb-2">
        <span className="font-medium">Description:</span>{" "}
        {order.delivery_rejected_reason}
      </p>
      {order.dispute_proof && (
        <div className="flex flex-wrap gap-2 mt-2">
          {order.dispute_proof?.split(",").map((proof) => (
            <div
              key={proof}
              className="relative w-24 h-24 rounded-md border object-cover"
            >
              <div
                onClick={() => setactiveImage(proof)}
                className=" bg-black/40 p-1 rounded-md flex z-10  absolute top-3 right-3 justify-center items-center cursor-pointer"
              >
                <Expand size={20} className="text-white " />
              </div>

              <Image
                width={100}
                height={100}
                key={proof}
                src={proof}
                alt="Dispute Proof"
                className="w-24 relative h-24 rounded-md border object-cover"
              />
            </div>
          ))}
        </div>
      )}
      {activeImage && (
        <Dialog open={!!activeImage} onOpenChange={() => setactiveImage(null)}>
          <DialogContent className=" sm:max-w-[750px]  max-h-[90vh] overflow-y-auto lg:w-[800px]  max-w-[95vw]">
            <Image
              width={100}
              height={100}
              src={activeImage}
              alt="Dispute Proof"
              className="w-full h-full object-cover"
            />
          </DialogContent>
          <DialogFooter>
            <Button
              onClick={() => setactiveImage(null)}
              className="bg-red-500 text-white"
            >
              Cancel
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};

const DisputeRebuttalFromStore = ({
  order,
  setIsOpen
}: {
  order: Order;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  console.log(order, "order");
  const [rebuttal, setRebuttal] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const { upload, isPending: isUploading } = useUploadImageUnprotected();

  const { mutateAsync: updateOrderEscrow, isPending } = useUpdateOrderEscrow(
    order.id,
    order.store_id
  );
  useEffect(() => {
    if (order.store_dispute_response) {
      setRebuttal(order.store_dispute_response);
    }
  }, [order]);
  console.log(order.store_id, "order.storeId");
  const handleUpdateOrderEscrow = async () => {
    if (!rebuttal) {
      toast.error("Please enter a rebuttal");
      return;
    }
    if (!files) {
      toast.error("Please upload a proof");
      return;
    }
    try {
      let attachmentUrls: { urls: string[] } = { urls: [] };
      if (files) {
        attachmentUrls = await upload(Array.from(files));
      }
      await updateOrderEscrow({
        store_dispute_proof: attachmentUrls.urls.join(",").toString(),
        store_dispute_response: rebuttal,
        store_dispute_at: new Date()
      });
      toast.success("We will review and either approve or reject the dispute");
      setIsOpen(false);
    } catch (error) {
      console.log(error, "error");
      toast.error("Failed to update order escrow");
      setFiles(null);
      setRebuttal("");
    }
  };

  return (
    <div className="rounded-lg border p-4 bg-gray-50 w-full">
      <h3 className="text-gray-800 font-semibold mb-2">Your Response</h3>

      <Label htmlFor="rebuttal" className="text-sm font-medium">
        Explanation / Rebuttal
      </Label>
      <Textarea
        id="rebuttal"
        placeholder="Explain your side of the case..."
        value={rebuttal}
        onChange={(e) => setRebuttal(e.target.value)}
        className="mt-1 border-general border mb-3"
      />

      <Label htmlFor="files" className="text-sm font-medium">
        Upload Proof (shipping video, receipt, etc.)
      </Label>
      <Input
        id="files"
        type="file"
        multiple
        onChange={(e) => {
          const files = e.target.files;
          Array.from(files || []).forEach((file) => {
            if (file.size > 20 * 1024 * 1024) {
              console.log(file, "file");
              toast.error("File size must be less than 20MB");
              return;
            }
          });
          setFiles(e.target.files || null);
          console.log(e.target.files, "files");
        }}
        className="mt-1"
      />
      {order.store_dispute_proof && (
        <>
          <Label htmlFor="files" className="text-sm font-medium">
            Uploaded Proofs (shipping video, receipt, etc.)
          </Label>
          <div className="flex flex-wrap gap-2 mt-3">
            {order.store_dispute_proof
              .split(",")
              .map((proof) => getProofs(proof))}
          </div>
        </>
      )}
      {files && (
        <div className="flex flex-wrap gap-2 mt-3">
          {Array.from(files).map((file, idx) => (
            <div
              key={idx}
              className="text-xs text-gray-600 border rounded-md px-2 py-1"
            >
              {file.name}
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={handleUpdateOrderEscrow}
        disabled={isPending || isUploading}
        className="bg-green-600 mt-4 hover:bg-green-700 text-white"
      >
        {isPending || isUploading ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
};

const DisputeResolutionResult = ({ order }: { order: Order }) => {
  const isStoreGuilty = order.dispute_winner !== "store";

  return (
    <div className="rounded-lg border p-4 bg-white shadow-sm w-full">
      <h3 className="text-gray-900 font-semibold mb-3 text-lg">
        Resolution Result
      </h3>

      <div className="flex items-start gap-3">
        {isStoreGuilty ? (
          <XCircle className="text-red-500 w-6 h-6 mt-0.5" />
        ) : (
          <CheckCircle className="text-green-600 w-6 h-6 mt-0.5" />
        )}

        <p className="text-sm text-gray-700 leading-relaxed">
          {isStoreGuilty ? (
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-medium block mb-1">
                The store has been found responsible for this dispute. The
                customers claim has been upheld.
              </span>
              <span className="text-gray-600">
                Please ensure all items are properly checked and packaged to
                maintain quality and avoid future disputes.
              </span>
            </p>
          ) : (
            <p>
              <span className="font-medium">
                The customer has been found responsible for this dispute. The
                stores position has been upheld.
              </span>
            </p>
          )}
        </p>
      </div>
    </div>
  );
};

export default DisputeResolutionForm;

const getProofs = (proof: string) => {
  console.log(proof, "proof");
  const lower = proof.toLowerCase();

  // ✅ Image formats
  if (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".gif") ||
    lower.endsWith(".webp")
  ) {
    return (
      <div
        key={proof}
        className="relative w-24 h-24 rounded-md border overflow-hidden"
      >
        <Image
          src={proof}
          alt="Dispute Proof"
          width={100}
          height={100}
          className="w-24 h-24 object-cover rounded-md"
        />
      </div>
    );
  }

  // ✅ Video formats
  if (
    lower.endsWith(".mp4") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".avi") ||
    lower.endsWith(".webm")
  ) {
    return (
      <video
        key={proof}
        src={proof}
        controls
        className="w-32 h-32 rounded-md border object-cover"
      />
    );
  }

  // ✅ PDF format
  if (lower.endsWith(".pdf")) {
    return (
      <a
        key={proof}
        href={proof}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-24 h-24 rounded-md border bg-gray-100 text-xs text-gray-600 hover:bg-gray-200 transition"
      >
        📄 {proof.split("/").pop()}
      </a>
    );
  }

  // ✅ Fallback (unknown file types)
  return (
    <div
      key={proof}
      className="flex items-center justify-center w-24 h-24 rounded-md border bg-gray-100 text-xs text-gray-600"
    >
      {proof.split("/").pop()}
    </div>
  );
};
