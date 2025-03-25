import Image from "next/image";

export const ArrowDiv = ({ value }: { value: number }) => {
  const isNegative = value < 0;
  return (
    <div className=" flex items-center gap-1">
      <div
        style={{
          background: isNegative ? "#cc5069" : "#b9f8cf",
          color: isNegative ? "white" : "black",
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
          <Image
            src="/assets/arrowrise.png"
            alt="arrowrise"
            width={15}
            height={15}
            className=" text-zinc-300"
          />
        )}{" "}
        {value}
      </div>
    </div>
  );
};

export const Pill = ({
  upperText,
  value,
  valueDirection,
}: {
  upperText: string;
  value: number;
  valueDirection?: number;
}) => {
  return (
    <div className=" p-4 rounded-md max-w-[400px]  bg-[#F7F7F8] max-h-[100px] justify-between flex flex-col">
      <small className=" font-medium text-zinc-500">{upperText}</small>
      <div className=" flex justify-between items-center ">
        <h1 className=" text-2xl text-black">${value}</h1>
        <ArrowDiv value={valueDirection || 0} />
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
