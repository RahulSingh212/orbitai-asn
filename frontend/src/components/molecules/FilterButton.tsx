interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

export const FilterButton = ({
  label,
  isActive,
  onClick,
  count,
}: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
        isActive
          ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg"
          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
      }`}
      style={isActive ? { backgroundColor: "rgb(37, 99, 235)" } : undefined}
    >
      {label}
      {count !== undefined && (
        <span
          className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            isActive ? "bg-blue-700 dark:bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

