import clsx from "clsx";

export const Button = ({
  className,
  text,
  onClick,
  icon
}: {
  text: string;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(" px-5 flex items-center justify-between gap-3 bg-white  text-black py-2 rounded-[60px] border border-black", className)}
    >
      {text}      
      {
        icon && icon
      }
    </button>
  );
};
