import { useState } from "react";
import { Button } from "../atoms";
import type { University, UserProfile } from "../../types";
import {
  exportToPDF,
  exportToCSV,
  printResults,
} from "../../utils/exportUtils";

interface ExportButtonsProps {
  universities: University[];
  userProfile?: UserProfile;
}

export const ExportButtons = ({
  universities,
  userProfile,
}: ExportButtonsProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      exportToPDF(universities, userProfile);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
      setShowMenu(false);
    }
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      exportToCSV(universities);
    } catch (error) {
      console.error("CSV export failed:", error);
      alert("Failed to export CSV. Please try again.");
    } finally {
      setIsExporting(false);
      setShowMenu(false);
    }
  };

  const handlePrint = () => {
    printResults();
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
      >
        {isExporting ? "⏳ Exporting..." : "📥 Export"}
      </Button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            <button
              onClick={handleExportPDF}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
              disabled={isExporting}
            >
              <span className="text-xl">📄</span>
              <div>
                <div className="font-semibold">Export as PDF</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Formatted report
                </div>
              </div>
            </button>

            <button
              onClick={handleExportCSV}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700"
              disabled={isExporting}
            >
              <span className="text-xl">📊</span>
              <div>
                <div className="font-semibold">Export as CSV</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Spreadsheet data
                </div>
              </div>
            </button>

            <button
              onClick={handlePrint}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700"
            >
              <span className="text-xl">🖨️</span>
              <div>
                <div className="font-semibold">Print</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Print-friendly view
                </div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
