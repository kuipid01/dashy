import { Loader2 } from "lucide-react";
import React from "react";

const Btn = ({
  className,
  isPending,
  disabled,
  text = "Submit",
  onclick,
  type = "submit"
}: {
  disabled?: boolean;
  className?: string;
  isPending?: boolean;
  text?: string;
  onclick?: () => void;
  type?: "submit" | "reset" | "button" | undefined;
}) => {
  return (
    <div>
      <button
        onClick={onclick}
        type={type}
        className={`cursor-pointer ${className}`}
        disabled={isPending || disabled}
      >
        {isPending ? <Loader2 className="animate-spin  duration-300" /> : text}
      </button>
    </div>
  );
};

export default Btn;
