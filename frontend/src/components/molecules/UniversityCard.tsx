import { Card, Badge } from "../atoms";
import type { University } from "../../types";

interface UniversityCardProps {
  university: University;
  rank: number;
}

export const UniversityCard = ({ university, rank }: UniversityCardProps) => {
  // Convert admission_chance to number (API returns it as string or number)
  const admissionChance = typeof university.admission_chance === 'string' 
    ? parseFloat(university.admission_chance) 
    : university.admission_chance;

  const getTierBadge = (chance: number) => {
    if (chance >= 60)
      return { variant: "safety" as const, text: "Safety", icon: "🎯" };
    if (chance >= 35)
      return { variant: "target" as const, text: "Target", icon: "🎓" };
    return { variant: "reach" as const, text: "Reach", icon: "🚀" };
  };

  const tier = getTierBadge(admissionChance);

  return (
    <Card hover className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">#{rank}</span>
            <Badge variant={tier.variant}>
              {tier.icon} {tier.text}
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {university.university}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            📍 {university.location} • 🏆 Rank #{university.ranking}
          </p>
        </div>
      </div>

      {/* Admission Chance */}
      <div className="mb-4 p-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700 transition-colors duration-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Admission Chance
          </span>
          <span className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {admissionChance.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-200">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg GMAT</p>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {university.program_stats.avg_gmat}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-200">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg GPA</p>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {university.program_stats.avg_gpa.toFixed(2)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-200">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Acceptance</p>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {university.program_stats.acceptance_rate}%
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-200">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tuition</p>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {university.tuition_cost ? `$${(university.tuition_cost / 1000).toFixed(0)}k` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Work Experience */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg transition-colors duration-200">
        💼 Avg Work Experience:{" "}
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {university.program_stats.avg_work_experience} years
        </span>
      </div>
    </Card>
  );
};

