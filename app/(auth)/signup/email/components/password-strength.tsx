import clsx from "clsx";
import { CircleCheck, XCircleIcon } from "lucide-react";

export const PasswordStrengthUi = ({ password }: { password: string }) => {


  const passwordStrength = () => {
    if (password.length === 0) return "Empty";
    if (password.length < 8) return "Weak";
    if (
      !/[A-Z]/.test(password) ||
      !/\d/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      return "Medium";
    }
    return "Strong";
  };

  const validIcon = (criterion: string) => {
    switch (criterion) {
      case "min-character":
        return password.length >= 8 ? <CircleCheck /> : <XCircleIcon />;
      case "uppercase":
        return /[A-Z]/.test(password) ? <CircleCheck /> : <XCircleIcon />;
      case "lowercase":
        return /[a-z]/.test(password) ? <CircleCheck /> : <XCircleIcon />;
      case "special":
        return /[!@#$%^&*(),.?":{}|<>]/.test(password) ? (
          <CircleCheck />
        ) : (
          <XCircleIcon />
        );
      case "number":
        return /\d/.test(password) ? <CircleCheck /> : <XCircleIcon />;
      default:
        return <XCircleIcon />;
    }
  };

  const getTextColor = (criterion: string) => {
    switch (criterion) {
      case "min-character":
        return password.length >= 8 ? "text-green-500" : "text-red-500";
      case "uppercase":
        return /[A-Z]/.test(password) ? "text-green-500" : "text-red-500";
      case "lowercase":
        return /[a-z]/.test(password) ? "text-green-500" : "text-red-500";
      case "special":
        return /[!@#$%^&*(),.?":{}|<>]/.test(password)
          ? "text-green-500"
          : "text-red-500";
      case "number":
        return /\d/.test(password) ? "text-green-500" : "text-red-500";
      default:
        return "text-red-500";
    }
  };

  const getProgressColor = () => {
    const strength = passwordStrength();
    switch (strength) {
      case "Empty":
        return "bg-gray-300";
      case "Weak":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Strong":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-full h-3 rounded-xl bg-gray-50">
        <div
          className={`h-3 rounded-xl ${getProgressColor()}`}
          style={{
            width: `${
              password.length >= 8 ? 100 : (password.length / 8) * 100
            }%`,
            transition: "width 0.3s ease-in-out",
          }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Password strength: {passwordStrength()}
      </p>

      <div className="flex flex-col gap-1 text-sm mt-2">
        <p
          className={clsx("flex items-center gap-1", getTextColor("min-character"))}
        >
          {validIcon("min-character")} 8 characters minimum
        </p>
        <p
          className={clsx("flex items-center gap-1", getTextColor("uppercase"))}
        >
          {validIcon("uppercase")} Uppercase character
        </p>
        <p
          className={clsx("flex items-center gap-1", getTextColor("lowercase"))}
        >
          {validIcon("lowercase")} Lowercase character
        </p>
        <p
          className={clsx("flex items-center gap-1", getTextColor("special"))}
        >
          {validIcon("special")} Special character
        </p>
        <p
          className={clsx("flex items-center gap-1", getTextColor("number"))}
        >
          {validIcon("number")} Number
        </p>
      </div>
    </div>
  );
};