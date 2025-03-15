import clsx from "clsx";

export const Button = ({
  className,
  text,
  onClick
}: {
  text: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(" px-5  bg-white  text-black py-2 rounded-md", className)}
    >
      {text}
    </button>
  );
};
