interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export const StatCard = ({ label, value, icon, color = "blue" }: StatCardProps) => {
  const colorStyles: Record<string, string> = {
    blue: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400",
    green: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400",
    orange: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400",
    purple: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400",
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 bg-linear-to-br transition-colors duration-200 ${colorStyles[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80 font-medium">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {icon && <span className="text-3xl opacity-50">{icon}</span>}
      </div>
    </div>
  );
};

