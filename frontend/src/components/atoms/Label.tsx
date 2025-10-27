import type { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: ReactNode;
}

export const Label = ({
  required = false,
  children,
  className = "",
  ...props
}: LabelProps) => {
  return (
    <label
      className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
    </label>
  );
};

