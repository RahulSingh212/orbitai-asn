import { useState } from 'react';
import type { UserProfile, University } from './types';
import { ProfileForm, ResultsDisplay } from './components/organisms';
import { Spinner, ThemeToggle } from './components/atoms';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchId, setSearchId] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleSubmit = async (profile: UserProfile) => {
    setLoading(true);
    setError(null);
    setUserProfile(profile);

    try {
      const response = await fetch(`${API_URL}/api/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch matches');
      }

      const data = await response.json();
      setUniversities(data.matches);
      setSearchId(data.search_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUniversities([]);
    setError(null);
    setSearchId(null);
    setUserProfile(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b-4 border-blue-500 dark:border-blue-600 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                O
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  OrbitAI
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Right Fit Matcher</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {searchId && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Search ID: <span className="font-mono font-bold">#{searchId}</span>
                </div>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 flex items-start gap-4 transition-colors duration-200">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-1">Error</h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 dark:text-red-300 dark:hover:text-red-100 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Profile Form */}
        {!universities.length && !loading && (
          <ProfileForm onSubmit={handleSubmit} isLoading={loading} />
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <Spinner size="lg" className="mb-4" />
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Analyzing your profile...
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Finding the best university matches for you
            </p>
          </div>
        )}

        {/* Results Display */}
        {universities.length > 0 && !loading && (
          <ResultsDisplay 
            universities={universities} 
            onReset={handleReset}
            userProfile={userProfile || undefined}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 mt-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">
              © 2025 OrbitAI - Right Fit Matcher for MBA/MS Programs
            </p>
            <p className="text-xs mt-2">
              Powered by advanced statistical matching algorithms
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
