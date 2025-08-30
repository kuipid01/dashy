import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

export const ArrowDiv = ({ value }: { value: number }) => {
  const isNegative = value < 0;
  return (
    <div className=" flex items-center gap-1">
      <div
        style={{
          background: isNegative ? "#cc5069" : "#b9f8cf",
          color: isNegative ? "white" : "black"
        }}
        className=" flex items-center   font-medium rounded-md text-[12px] bg-red-300 px-2 py-1 text-xs gap-1"
      >
        {isNegative ? (
          <Image
            src="/assets/arrowrise.png"
            alt="arrowrise"
            width={15}
            height={15}
            className=" text-zinc-300"
          />
        ) : (
          // <Image
          //   src="/assets/arrowrise.png"
          //   alt="arrowrise"
          //   width={15}
          //   height={15}
          //   className=" text-zinc-300"
          // />
          <ArrowUpRight />
        )}{" "}
        {value}
      </div>
    </div>
  );
};
export const getPercentageChange = (newValue: number, prevValue: number) => {
  if (prevValue === 0) {
    if (newValue === 0) {
      // If both values are zero, there is no change.
      return 0;
    } else {
      // If the value increased from zero, the percentage change is infinite.
      return Infinity;
    }
  }

  return ((newValue - prevValue) / prevValue) * 100;
};
export const ArrowDivNew = ({
  newValue,
  prevValue
}: {
  newValue: number;
  prevValue: number;
}) => {
  // Calculate percentage change
  const percentageChange = getPercentageChange(newValue, prevValue);
  const isNegative = percentageChange < 0;
  const isFromZero = percentageChange === Infinity;
  // Conditional rendering based on the type of change
  const content = () => {
    if (isFromZero) {
      return (
        <span className="flex items-center gap-1">
          <ArrowUpRight className="w-4 h-4" />
          Up from zero
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1">
        {isNegative ? (
          <ArrowDownRight className="w-4 h-4" />
        ) : (
          <ArrowUpRight className="w-4 h-4" />
        )}
        {percentageChange.toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="flex items-center gap-1">
      <div
        style={{
          background: isNegative ? "#cc5069" : "#b9f8cf",
          color: isNegative ? "white" : "black"
        }}
        className="flex items-center font-medium rounded-md text-[12px] px-2 py-1 text-xs"
      >
        {content()}
      </div>
    </div>
  );
};

export const Pill = ({
  upperText,
  value
}: {
  upperText: string;
  value: number;
  valueDirection?: number;
}) => {
  return (
    <div className=" p-4 rounded-md max-w-[400px] shadow shadow-gray-400  bg-[#F7F7F8] max-h-[100px] justify-between flex flex-col">
      <small className=" font-medium text-zinc-500">{upperText}</small>
      <div className=" flex justify-between items-center ">
        <h1 className=" text-2xl text-black">₦{value}</h1>
        {/* <ArrowDiv value={valueDirection || 0} /> */}
      </div>
    </div>
  );
};

export const GraphGoesHere = () => {
  return (
    <div className=" flex-1 w-full h-full bg-gray-200 rounded-md grid place-items-center">
      <h1>GRAPH GOES HERE</h1>
    </div>
  );
};
