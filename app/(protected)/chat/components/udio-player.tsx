/* eslint-disable @typescript-eslint/no-unused-vars */
import { Mic2, Pause, Play, Send, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Waveform } from "./wave-form";

export const AudioPlayer = ({
  setVoiceRecord,
  setIsRecording,
  isRecording,
  setShowRecordingStudio,
  sendMessage,
}: {
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  isRecording: boolean;
  setVoiceRecord: React.Dispatch<
    React.SetStateAction<{
      local: string;
      blob: null | Blob;
    }>
  >;
  sendMessage: () => Promise<void>;
  setShowRecordingStudio: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [amplitudes, setAmplitudes] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let analyser: AnalyserNode;
    let animationId: number;
    let audioCtx: AudioContext;
    let dataArray: Uint8Array;

    (async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setStream(userStream);

        const recorder = new MediaRecorder(userStream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.current.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks.current, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          setVoiceRecord({ local: url, blob });
          setAudioUrl(url);
        };

        recorder.start();

        // Waveform visualization
        audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(userStream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        source.connect(analyser);

        const draw = () => {
          analyser.getByteTimeDomainData(dataArray);
          setAmplitudes(Array.from(dataArray.slice(0, 100)));
          animationId = requestAnimationFrame(draw);
        };

        draw();
      } catch (error) {
        console.error("Audio recording failed:", error);
      }
    })();

    return () => {
      cancelAnimationFrame(animationId);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    setIsRecording(true);
  }, [setIsRecording]);

  const togglePause = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    if (isPaused) {
      recorder.resume();
      setIsPaused(false);
    } else {
      recorder.pause();
      setIsPaused(true);
    }
  };

  const stopAndSave = async () => {
    mediaRecorderRef.current?.stop();
    stream?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    setShowRecordingStudio(false);
    try {
      sendMessage();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayPausePreview = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <div className="flex flex-col w-full gap-2 p-4 absolute bottom-0 left-0 right-0 bg-black/70 text-white border-t border-white/10">
      {!isRecording && audioUrl && (
        <div className="relative w-full">
          <div className="relative w-full h-12 bg-black/30 rounded-md flex items-center px-2 overflow-hidden">
            {audioRef?.current?.paused ? (
              <Play
                className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2"
                onClick={handlePlayPausePreview}
              />
            ) : (
              <Pause
                className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2"
                onClick={handlePlayPausePreview}
              />
            )}
            <audio
              ref={audioRef}
              src={audioUrl}
              preload="auto"
              controls
              className="hidden"
            />
          </div>
        </div>
      )}

      {isRecording && <Waveform amplitudes={amplitudes} />}

      <div className="flex items-center justify-between mt-2">
        <Trash2
          onClick={() => {
            setVoiceRecord({ blob: null, local: "" });
            setAudioUrl(null);
            setIsRecording(false);
            setShowRecordingStudio(false);
          }}
          className="cursor-pointer hover:text-red-500 transition"
        />

        {isRecording && !isPaused && (
          <Pause
            onClick={togglePause}
            className="cursor-pointer hover:text-yellow-400"
          />
        )}
        {isRecording && isPaused && (
          <Mic2
            onClick={togglePause}
            className="cursor-pointer hover:text-green-500"
          />
        )}

        <div
          className="bg-white text-black rounded-full size-12 grid place-items-center hover:scale-105 transition cursor-pointer"
          onClick={stopAndSave}
        >
          <Send />
        </div>
      </div>
    </div>
  );
};
