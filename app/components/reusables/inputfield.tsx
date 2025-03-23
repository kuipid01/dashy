import { ChangeEvent, InputHTMLAttributes, DetailedHTMLProps } from "react";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  type: "text" | "password" | "email";
  placeholder: string;
  onChange: (e: ChangeEvent) => void;
}

export const InputField = ({ type, placeholder, onChange }: Props) => {
  return (
    <input
      className=" px-2 border border-zinc-300 rounded-md  text-gray-700 w-[400px] h-[40px]"
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  );
};
