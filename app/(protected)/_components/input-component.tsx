/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";

export const InputComponent: React.FC<
  {
    label: string;
    name: string;
    disabled?: boolean;
    onChange?: (e: any) => void;
  } & React.InputHTMLAttributes<HTMLInputElement>
> = ({ label, name, disabled, className, onChange, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name + "hiiie"}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <input
        {...props}
        name={name}
        id={name}
        disabled={disabled}
        onChange={onChange}
        className={cn(
          "shadow-sm h-[50px] px-2 focus:ring-indigo-500 border border-gray-300 focus:border-indigo-500 block w-full sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-gray-900 dark:focus:border-gray-900",
          disabled ? " cursor-not-allowed bg-gray-200" : "",
          className
        )}
      />
    </div>
  );
};
