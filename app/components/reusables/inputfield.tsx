import { ChangeEvent, InputHTMLAttributes, DetailedHTMLProps } from "react";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  type: "text" | "password" | "email";
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputField = ({ type, placeholder, onChange, ...rest }: Props) => {
  return (
    <input
      {...rest}
      className={` px-2 border border-zinc-500 rounded-md  text-gray-700 w-[400px] h-[40px]  ${rest.className}`}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  );
};
