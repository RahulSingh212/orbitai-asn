import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export const Card = ({
  children,
  hover = false,
  className = "",
  ...props
}: CardProps) => {
  const baseStyles =
    "bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200";
  const hoverStyles = hover
    ? "transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl"
    : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
