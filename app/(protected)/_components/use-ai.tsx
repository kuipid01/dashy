import { PaintbrushVertical } from "lucide-react";
import React from "react";

const UseAi = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button onClick={onClick} className="bg-black px-3 py-1 flex items-center gap-1 font-medium text-white rounded-md uppercase text-xs">
      Use Ai <PaintbrushVertical size={14} />{" "}
    </button>
  );
};

export default UseAi;
