import { useState, useMemo } from "react";
import { Button, Select } from "../atoms";
import {
  SearchBar,
  UniversityCard,
  FilterButton,
  StatCard,
  ExportButtons,
} from "../molecules";
import { AnalyticsCharts } from "./AnalyticsCharts";
import type { University, UserProfile } from "../../types";

interface ResultsDisplayProps {
  universities: University[];
  onReset: () => void;
  userProfile?: UserProfile;
}

type SortOption = "chance" | "ranking" | "tuition" | "acceptance";
type FilterOption = "all" | "safety" | "target" | "reach";

export const ResultsDisplay = ({
  universities,
  onReset,
  userProfile,
}: ResultsDisplayProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("chance");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Filter and sort universities
  const processedUniversities = useMemo(() => {
    let filtered = universities.filter(
      (uni) =>
        uni.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (uni.location &&
          uni.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Apply tier filter
    if (filterBy !== "all") {
      filtered = filtered.filter((uni) => {
        // Convert to number if string
        const chance = typeof uni.admission_chance === 'string' 
          ? parseFloat(uni.admission_chance) 
          : uni.admission_chance;
        if (filterBy === "safety") return chance >= 60;
        if (filterBy === "target") return chance >= 35 && chance < 60;
        if (filterBy === "reach") return chance < 35;
        return true;
      });
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "chance": {
          const aChance = typeof a.admission_chance === 'string' ? parseFloat(a.admission_chance) : a.admission_chance;
          const bChance = typeof b.admission_chance === 'string' ? parseFloat(b.admission_chance) : b.admission_chance;
          return bChance - aChance;
        }
        case "ranking":
          return (a.ranking || 999) - (b.ranking || 999);
        case "tuition":
          return (a.tuition_cost || 0) - (b.tuition_cost || 0);
        case "acceptance":
          return (
            b.program_stats.acceptance_rate - a.program_stats.acceptance_rate
          );
        default:
          return 0;
      }
    });
  }, [universities, searchTerm, sortBy, filterBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const safety = universities.filter((u) => {
      const chance = typeof u.admission_chance === 'string' ? parseFloat(u.admission_chance) : u.admission_chance;
      return chance >= 60;
    }).length;
    const target = universities.filter((u) => {
      const chance = typeof u.admission_chance === 'string' ? parseFloat(u.admission_chance) : u.admission_chance;
      return chance >= 35 && chance < 60;
    }).length;
    const reach = universities.filter((u) => {
      const chance = typeof u.admission_chance === 'string' ? parseFloat(u.admission_chance) : u.admission_chance;
      return chance < 35;
    }).length;

    return { safety, target, reach, total: universities.length };
  }, [universities]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your University Matches
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Found {processedUniversities.length} universities matching your
              profile
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              {showAnalytics ? "📋 View List" : "📊 View Analytics"}
            </Button>
            <ExportButtons universities={universities} userProfile={userProfile} />
            <Button variant="outline" onClick={onReset}>
              🔄 New Search
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Matches"
            value={stats.total}
            icon="🎯"
            color="blue"
          />
          <StatCard
            label="Safety Schools"
            value={stats.safety}
            icon="✅"
            color="green"
          />
          <StatCard
            label="Target Schools"
            value={stats.target}
            icon="🎓"
            color="blue"
          />
          <StatCard
            label="Reach Schools"
            value={stats.reach}
            icon="🚀"
            color="orange"
          />
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by university name or location..."
          />

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Sort Dropdown */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="chance">Admission Chance (High to Low)</option>
                <option value="ranking">University Ranking (Best First)</option>
                <option value="tuition">Tuition Cost (Low to High)</option>
                <option value="acceptance">
                  Acceptance Rate (High to Low)
                </option>
              </Select>
            </div>

            {/* Filter Buttons */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Filter By Tier
              </label>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  label="All"
                  isActive={filterBy === "all"}
                  onClick={() => setFilterBy("all")}
                  count={stats.total}
                />
                <FilterButton
                  label="Safety"
                  isActive={filterBy === "safety"}
                  onClick={() => setFilterBy("safety")}
                  count={stats.safety}
                />
                <FilterButton
                  label="Target"
                  isActive={filterBy === "target"}
                  onClick={() => setFilterBy("target")}
                  count={stats.target}
                />
                <FilterButton
                  label="Reach"
                  isActive={filterBy === "reach"}
                  onClick={() => setFilterBy("reach")}
                  count={stats.reach}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard or Results Grid */}
      {showAnalytics ? (
        <AnalyticsCharts universities={universities} />
      ) : (
        <>
          {/* Results Grid */}
          {processedUniversities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedUniversities.map((university, index) => (
                <UniversityCard
                  key={university.university}
                  university={university}
                  rank={index + 1}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border-2 border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No universities found
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
