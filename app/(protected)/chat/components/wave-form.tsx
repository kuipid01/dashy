export const Waveform = ({ amplitudes }: { amplitudes: number[] }) => {
  return (
    <div className="flex items-end _justify-between gap-[2px] bg-red-500 h-12 w-full overflow-hidden px-2">
      {amplitudes.map((amp, index) => {
        const height = (amp / 255) * 58; // scale to max 48px
        return (
          <div
            key={index}
            className="w-[2px] bg-white rounded-sm"
            style={{ height }}
          ></div>
        );
      })}
    </div>
  );
};
