import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Card, Button } from "../atoms";
import { FormField, SelectField } from "../molecules";
import type { UserProfile, FormErrors } from "../../types";

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const ProfileForm = ({ onSubmit, isLoading }: ProfileFormProps) => {
  const [profile, setProfile] = useState<UserProfile>({
    gmat_score: 0,
    gpa: 0,
    work_experience: 0,
    target_program: "MBA",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: number | string): string => {
    switch (name) {
      case "gmat_score": {
        const gmat = Number(value);
        if (gmat < 200 || gmat > 800)
          return "GMAT score must be between 200 and 800";
        return "";
      }
      case "gpa": {
        const gpa = Number(value);
        if (gpa < 0 || gpa > 4.0) return "GPA must be between 0.0 and 4.0";
        return "";
      }
      case "work_experience": {
        const exp = Number(value);
        if (exp < 0 || exp > 30)
          return "Work experience must be between 0 and 30 years";
        return "";
      }
      case "target_program": {
        if (!value) return "Please select a target program";
        return "";
      }
      default:
        return "";
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericValue =
      name === "target_program" ? value : parseFloat(value) || 0;

    setProfile((prev) => ({ ...prev, [name]: numericValue }));

    const error = validateField(name, numericValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    Object.keys(profile).forEach((key) => {
      const error = validateField(key, profile[key as keyof UserProfile]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    const allTouched: Record<string, boolean> = {};
    Object.keys(profile).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(profile);
    } else {
      setErrors(newErrors);
    }
  };

  // Calculate profile strength
  const getProfileStrength = () => {
    const gmatStrength =
      profile.gmat_score >= 700 ? 25 : (profile.gmat_score / 700) * 25;
    const gpaStrength = profile.gpa >= 3.5 ? 25 : (profile.gpa / 3.5) * 25;
    const expStrength =
      profile.work_experience >= 5 ? 25 : (profile.work_experience / 5) * 25;
    const programStrength = profile.target_program ? 25 : 0;

    const total = gmatStrength + gpaStrength + expStrength + programStrength;
    return Math.round(total);
  };

  const profileStrength = getProfileStrength();

  return (
    <Card className="p-8 shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Your Academic Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about your academic background to find your perfect match
        </p>
      </div>

      {/* Profile Strength Indicator */}
      {profileStrength > 0 && (
        <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700 transition-colors duration-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Profile Strength
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {profileStrength}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-600 to-purple-600 transition-all duration-500 rounded-full"
              style={{ width: `${profileStrength}%` }}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="gmat_score"
          name="gmat_score"
          type="number"
          label="GMAT Score"
          placeholder="Enter your GMAT score (200-800)"
          value={profile.gmat_score || ""}
          onChange={handleChange}
          onBlur={() => handleBlur("gmat_score")}
          error={errors.gmat_score}
          touched={touched.gmat_score}
          required
          min={0}
          max={800}
          disabled={isLoading}
        />

        <FormField
          id="gpa"
          name="gpa"
          type="number"
          label="GPA"
          placeholder="Enter your GPA (0.0-4.0)"
          value={profile.gpa || ""}
          onChange={handleChange}
          onBlur={() => handleBlur("gpa")}
          error={errors.gpa}
          touched={touched.gpa}
          required
          min={0}
          max={4}
          step={0.01}
          disabled={isLoading}
        />

        <FormField
          id="work_experience"
          name="work_experience"
          type="number"
          label="Work Experience (Years)"
          placeholder="Enter years of work experience"
          value={profile.work_experience || ""}
          onChange={handleChange}
          onBlur={() => handleBlur("work_experience")}
          error={errors.work_experience}
          touched={touched.work_experience}
          required
          min={0}
          max={30}
          disabled={isLoading}
        />

        <SelectField
          id="target_program"
          name="target_program"
          label="Target Program"
          value={profile.target_program}
          onChange={handleChange}
          onBlur={() => handleBlur("target_program")}
          error={errors.gmat_score}
          touched={touched.target_program}
          required
          disabled={isLoading}
        >
          <option value="">Select a program</option>
          <option value="MBA">MBA</option>
          <option value="MS" disabled>
            MS (Coming Soon)
          </option>
          <option value="Executive MBA" disabled>
            Executive MBA (Coming Soon)
          </option>
        </SelectField>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing Profile...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                🎓 Find My Matches
              </span>
            )}
          </Button>
        </div>
      </form>

      {/* Pro Tips */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700 transition-colors duration-200">
        <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Higher GMAT scores increase your chances significantly</li>
          <li>
            • 3+ years of work experience is preferred by top MBA programs
          </li>
          <li>• Consider both Safety and Reach schools for a balanced list</li>
        </ul>
      </div>
    </Card>
  );
};
