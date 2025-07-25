/* eslint-disable @typescript-eslint/no-unused-vars */
import { LucideVoicemail, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export const VoiceRecorder = ({
  setIsRecording,
  isRecording,
}: {
  isRecording: boolean;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setIsRecording(true)}
        className="bg-green-600 cursor-pointer text-white px-4 rounded-md py-2"
      >
        <LucideVoicemail />
      </button>
    </div>
  );
};
