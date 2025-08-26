import clsx from "clsx";

export const Button = ({
  className,
  text,
  onClick,
  icon,
  iconPlace="right"
}: {
  text: string;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconPlace?:"right" | "left"
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(" px-5 flex items-center justify-between gap-3 bg-white  text-black py-2 rounded-[60px] border border-black", className)}
    >
       {
        icon && iconPlace==="left" && icon
      }
      {text}      
      {
        icon && iconPlace==="right" && icon
      }
    </button>
  );
};
