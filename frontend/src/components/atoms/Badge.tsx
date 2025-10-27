import type { ReactNode } from "react";

interface BadgeProps {
  variant: "safety" | "target" | "reach" | "info";
  children: ReactNode;
  className?: string;
}

export const Badge = ({ variant, children, className = "" }: BadgeProps) => {
  const variantStyles = {
    safety: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700",
    target: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700",
    reach: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700",
    info: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 transition-colors duration-200 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

