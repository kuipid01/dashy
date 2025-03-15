import Image from "next/image";
import Link from "next/link";

export const Categories = () => {
  return (
    <div className=" flex flex-col py-[100px] lg:py-[200px] items-center justify-center">
      <h1 className=" text-black max-w-[80%] text-center font-medium text-2xl sm:text-4xl">
        Elevated essentials for every moment.
      </h1>
      <div className="grid w-full mt-[50px] grid-cols-1 sm:grid-cols-2">
        <CardSingle text="Men" image="/assets/man.jpg" />
        <CardSingle text="Women" image="/assets/woman.jpg" />
      </div>
    </div>
  );
};

const CardSingle = ({ text, image }: { text: string; image: string }) => {
  return (
    <div className="bg-black cursor-pointer h-[400px] lg:h-screen relative overflow-hidden">
      <Image
        src={image}
        className="transform transition-transform duration-300 hover:scale-110 object-cover"
        alt={text}
        fill
      />
      <div className="absolute w-full h-full bg-black opacity-40 top-0 right-0 bottom-0 left-0"></div>
      <Link
        href={`/${text.toLowerCase()}`}
        className="text-white absolute bottom-3 left-1/2 -translate-y-1/2"
      >
        {text}
      </Link>
    </div>
  );
};
