/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useRef, useState } from "react";

export default function WebcamRecorder({
  videoRecording,
  setVideoRecording,
}: {
  videoRecording: {
    local: string;
    blob: null | Blob;
  };
  setVideoRecording: React.Dispatch<
    React.SetStateAction<{
      local: string;
      blob: null | Blob;
    }>
  >;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (videoRef.current) videoRef.current.srcObject = stream;

    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = () => {
      const fullBlob = new Blob(chunks, { type: "video/webm" });
      console.log(fullBlob, "gull blob");

      setVideoRecording((prev) => ({
        ...prev,
        blob: fullBlob,
      }));
      const fileUrl = URL.createObjectURL(fullBlob);

      setVideoRecording((prev) => ({
        ...prev,
        local: fileUrl,
      }));

      stream.getTracks().forEach((track) => track.stop());
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted width="320" height="240" />
      <div>
        {!isRecording ? (
          <button onClick={startRecording}>🎥 Start</button>
        ) : (
          <button onClick={stopRecording}>⏹ Stop</button>
        )}
      </div>
    </div>
  );
}
