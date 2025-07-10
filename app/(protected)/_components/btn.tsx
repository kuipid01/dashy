import { Loader2 } from "lucide-react";
import React from "react";

const Btn = ({
  className,
  isPending,
  disabled,
  text = "Submit",
}: {
  disabled?: boolean;
  className?: string;
  isPending?: boolean;
  text?: string;
}) => {
  return (
    <div>
      <button
        type="submit"
        className={`cursor-pointer ${className}`}
        disabled={isPending || disabled}
      >
        {isPending ? <Loader2 className="animate-spin  duration-300" /> : text}
      </button>
    </div>
  );
};

export default Btn;
