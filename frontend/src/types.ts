export interface University {
  university: string;
  admission_chance: number | string; // API returns as string
  program_stats: {
    acceptance_rate: number;
    avg_gmat: number;
    avg_gpa: number;
    avg_work_experience?: number;
  };
  location?: string;
  ranking?: number;
  tuition_cost?: number;
}

export interface MatchResponse {
  matches: University[];
  search_id?: number;
  total_universities: number;
}

export interface UserProfile {
  gmat_score: number;
  gpa: number;
  work_experience: number;
  target_program: string;
}

export interface FormErrors {
  gmat_score?: string;
  gpa?: string;
  work_experience?: string;
}

