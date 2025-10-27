"""
College Matching Algorithm

This algorithm calculates admission probability based on multiple factors:
1. GMAT score match (40% weight)
2. GPA match (30% weight)
3. Work experience match (15% weight)
4. Acceptance rate (15% weight)
"""

import math
from typing import List, Tuple
from database import University

class CollegeMatcher:
    GMAT_WEIGHT = 0.40
    GPA_WEIGHT = 0.30
    WORK_EXP_WEIGHT = 0.15
    ACCEPTANCE_RATE_WEIGHT = 0.15

    @staticmethod
    def calculate_score_match(
        user_score: float, avg_score: float, std_dev: float
    ) -> float:
        if std_dev == 0:
            std_dev = avg_score * 0.15

        z_score = (user_score - avg_score) / std_dev if std_dev > 0 else 0
        probability = 0.5 * (1 + math.erf(z_score / math.sqrt(2)))

        if user_score < avg_score:
            penalty_factor = max(0.3, probability)
            return penalty_factor
        else:
            return min(1.0, 0.5 + probability * 0.5)

    @staticmethod
    def calculate_gmat_match(user_gmat: int, avg_gmat: float) -> float:
        std_dev = 100
        return CollegeMatcher.calculate_score_match(user_gmat, avg_gmat, std_dev)

    @staticmethod
    def calculate_gpa_match(user_gpa: float, avg_gpa: float) -> float:
        std_dev = 0.3
        return CollegeMatcher.calculate_score_match(user_gpa, avg_gpa, std_dev)

    @staticmethod
    def calculate_work_exp_match(user_exp: float, avg_exp: float) -> float:
        std_dev = 2.0
        return CollegeMatcher.calculate_score_match(user_exp, avg_exp, std_dev)

    @staticmethod
    def calculate_admission_probability(
        user_gmat: int, user_gpa: float, user_work_exp: float, university: University
    ) -> float:
        gmat_match = CollegeMatcher.calculate_gmat_match(user_gmat, university.avg_gmat)
        gpa_match = CollegeMatcher.calculate_gpa_match(user_gpa, university.avg_gpa)
        work_exp_match = CollegeMatcher.calculate_work_exp_match(
            user_work_exp, university.avg_work_experience
        )

        acceptance_factor = university.acceptance_rate / 100.0

        composite_score = (
            CollegeMatcher.GMAT_WEIGHT * gmat_match
            + CollegeMatcher.GPA_WEIGHT * gpa_match
            + CollegeMatcher.WORK_EXP_WEIGHT * work_exp_match
            + CollegeMatcher.ACCEPTANCE_RATE_WEIGHT * acceptance_factor
        )

        max_probability = min(95, university.acceptance_rate + 10)
        admission_probability = composite_score * 100

        admission_probability = min(admission_probability, max_probability)
        admission_probability = max(5, admission_probability)

        return round(admission_probability, 1)

    @staticmethod
    def match_universities(
        user_gmat: int,
        user_gpa: float,
        user_work_exp: float,
        target_program: str,
        universities: List[University],
    ) -> List[Tuple[University, float]]:
        matches = []

        for university in universities:
            if university.program_type.upper() != target_program.upper():
                continue

            admission_prob = CollegeMatcher.calculate_admission_probability(
                user_gmat, user_gpa, user_work_exp, university
            )

            matches.append((university, admission_prob))

        matches.sort(key=lambda x: x[1], reverse=True)

        return matches
