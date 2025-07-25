import { useRef } from "react";

export const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={togglePlay}
        className="bg-blue-500 text-white px-2 py-1 rounded"
      >
        ▶️
      </button>
      <video
        ref={videoRef}
        src={src}
        width="320"
        height="240"
        className="rounded"
      />
    </div>
  );
};
