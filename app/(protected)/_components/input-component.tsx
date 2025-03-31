export const InputComponent: React.FC<
  { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>
> = ({ label, name, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        {...props}
        name={name}
        id={name}
        className="shadow-sm h-[50px] px-2 focus:ring-indigo-500 border border-gray-300 focus:border-indigo-500 block w-full sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-gray-900 dark:focus:border-gray-900"
      />
    </div>
  );
};