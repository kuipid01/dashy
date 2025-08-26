// TypingIndicator.jsx
import React from "react";

const TypingIndicator = ({ isTyping }: { isTyping: boolean }) => {
  if (!isTyping) {
    return null;
  }

  return (
    <div className="flex items-center _h-[100px]  space-x-1 p-2">
      <div
        className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
        style={{ animationDelay: "0s" }}
      ></div>
      <div
        className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></div>
    </div>
  );
};

export default TypingIndicator;
