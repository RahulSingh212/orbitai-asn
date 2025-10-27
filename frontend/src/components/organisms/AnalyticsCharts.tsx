import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { Card } from "../atoms";
import type { University } from "../../types";

interface AnalyticsChartsProps {
  universities: University[];
}

export const AnalyticsCharts = ({ universities }: AnalyticsChartsProps) => {
  // Prepare data for charts
  const chartData = useMemo(() => {
    // Convert admission_chance to number
    const getChance = (uni: University) =>
      typeof uni.admission_chance === "string"
        ? parseFloat(uni.admission_chance)
        : uni.admission_chance;

    // 1. Pie Chart Data - Safety/Target/Reach distribution
    const safety = universities.filter((u) => getChance(u) >= 60).length;
    const target = universities.filter(
      (u) => getChance(u) >= 35 && getChance(u) < 60
    ).length;
    const reach = universities.filter((u) => getChance(u) < 35).length;

    const pieData = [
      { name: "Safety", value: safety, color: "#10b981" },
      { name: "Target", value: target, color: "#3b82f6" },
      { name: "Reach", value: reach, color: "#f59e0b" },
    ].filter((item) => item.value > 0);

    // 2. Bar Chart Data - Top 10 universities by admission chance
    const topUniversities = [...universities]
      .sort((a, b) => getChance(b) - getChance(a))
      .slice(0, 10)
      .map((uni) => ({
        name:
          uni.university.length > 20
            ? uni.university.substring(0, 20) + "..."
            : uni.university,
        chance: getChance(uni),
      }));

    // 3. Scatter Plot Data - GMAT vs Admission Chance
    const scatterData = universities.map((uni) => ({
      gmat: uni.program_stats.avg_gmat,
      chance: getChance(uni),
      name: uni.university,
    }));

    // 4. Tuition Bar Chart - Top 10 by tuition
    const tuitionData = [...universities]
      .filter((u) => u.tuition_cost)
      .sort((a, b) => (b.tuition_cost || 0) - (a.tuition_cost || 0))
      .slice(0, 10)
      .map((uni) => ({
        name:
          uni.university.length > 20
            ? uni.university.substring(0, 20) + "..."
            : uni.university,
        tuition: Math.round((uni.tuition_cost || 0) / 1000), // Convert to thousands
      }));

    return { pieData, topUniversities, scatterData, tuitionData };
  }, [universities]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          📊 Analytics Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Visual insights into your university matches
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Pie Chart - Distribution */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Match Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${((percent as number) * 100).toFixed(
                    0
                  )}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Safety</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Reach</span>
            </div>
          </div>
        </Card>

        {/* 2. Bar Chart - Top Universities */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Top 10 Match Probabilities
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.topUniversities}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                label={{
                  value: "Admission %",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Bar dataKey="chance" fill="#3b82f6" name="Admission Chance %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* 3. Scatter Plot - GMAT vs Chance */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            GMAT Score vs Admission Chance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="gmat"
                name="Avg GMAT"
                label={{
                  value: "Average GMAT Score",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                type="number"
                dataKey="chance"
                name="Chance"
                label={{
                  value: "Admission %",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter
                name="Universities"
                data={chartData.scatterData}
                fill="#8b5cf6"
              />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Note: Lower GMAT scores may indicate less competitive programs
          </p>
        </Card>

        {/* 4. Tuition Comparison */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Top 10 Most Expensive Programs
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.tuitionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                label={{
                  value: "Tuition ($K)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Bar
                dataKey="tuition"
                fill="#f59e0b"
                name="Annual Tuition ($K)"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3">
          💡 Key Insights
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>
            • <strong>Distribution:</strong> Focus on a balanced mix of safety,
            target, and reach schools
          </li>
          <li>
            • <strong>GMAT Correlation:</strong> Higher average GMAT scores
            don't always mean lower admission chances
          </li>
          <li>
            • <strong>Cost Consideration:</strong> Top-ranked schools often have
            higher tuition but may offer better financial aid
          </li>
          <li>
            • <strong>Strategy:</strong> Apply to at least 2-3 safety schools to
            ensure you have options
          </li>
        </ul>
      </Card>
    </div>
  );
};
