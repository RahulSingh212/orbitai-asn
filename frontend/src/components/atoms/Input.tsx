import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = ({
  hasError = false,
  className = "",
  ...props
}: InputProps) => {
  const baseStyles =
    "w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white";
  const errorStyles = hasError
    ? "border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-900/50"
    : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-200 dark:focus:ring-blue-900/50";

  return (
    <input className={`${baseStyles} ${errorStyles} ${className}`} {...props} />
  );
};

