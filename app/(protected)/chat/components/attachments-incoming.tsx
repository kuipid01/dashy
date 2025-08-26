import { Loader2 } from "lucide-react";
import React from "react";

const AttachmentsIncoming = ({
  state,
}: {
  state: {
    active: boolean;
    type: string;
    amount: number | null;
  };
}) => {
  if (!state.active || !state.amount) return null;

  return (
    <div className="flex gap-2">
      {Array.from({ length: state.amount }, (_, index) => (
        <div
          key={index}
          className="w-16 grid place-items-center h-16 bg-gray-600 rounded"
        >
          <Loader2 className=" animate-spin duration-1000" />
        </div>
      ))}
    </div>
  );
};

export default AttachmentsIncoming;
