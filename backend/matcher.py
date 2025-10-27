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
    """Intelligent matching algorithm for college admissions"""

    # Weights for different factors
    GMAT_WEIGHT = 0.40
    GPA_WEIGHT = 0.30
    WORK_EXP_WEIGHT = 0.15
    ACCEPTANCE_RATE_WEIGHT = 0.15

    @staticmethod
    def calculate_score_match(
        user_score: float, avg_score: float, std_dev: float
    ) -> float:
        """
        Calculate match score using normal distribution
        Returns value between 0 and 1
        """
        if std_dev == 0:
            std_dev = avg_score * 0.15  # Assume 15% standard deviation

        # Calculate z-score
        z_score = (user_score - avg_score) / std_dev if std_dev > 0 else 0

        # Convert to probability using cumulative distribution function
        # Higher score than average = better match
        probability = 0.5 * (1 + math.erf(z_score / math.sqrt(2)))

        # Adjust: scores below average get penalized less than raw probability
        if user_score < avg_score:
            # Softer penalty for being below average
            penalty_factor = max(0.3, probability)
            return penalty_factor
        else:
            # Reward for being above average
            return min(1.0, 0.5 + probability * 0.5)

    @staticmethod
    def calculate_gmat_match(user_gmat: int, avg_gmat: float) -> float:
        """Calculate GMAT match score"""
        # GMAT standard deviation is typically around 100 points
        std_dev = 100
        return CollegeMatcher.calculate_score_match(user_gmat, avg_gmat, std_dev)

    @staticmethod
    def calculate_gpa_match(user_gpa: float, avg_gpa: float) -> float:
        """Calculate GPA match score"""
        # GPA standard deviation typically around 0.3
        std_dev = 0.3
        return CollegeMatcher.calculate_score_match(user_gpa, avg_gpa, std_dev)

    @staticmethod
    def calculate_work_exp_match(user_exp: float, avg_exp: float) -> float:
        """Calculate work experience match"""
        # Work experience is more flexible
        std_dev = 2.0  # 2 years standard deviation
        return CollegeMatcher.calculate_score_match(user_exp, avg_exp, std_dev)

    @staticmethod
    def calculate_admission_probability(
        user_gmat: int, user_gpa: float, user_work_exp: float, university: University
    ) -> float:
        """
        Calculate overall admission probability for a university
        Returns percentage (0-100)
        """
        # Calculate individual match scores
        gmat_match = CollegeMatcher.calculate_gmat_match(user_gmat, university.avg_gmat)
        gpa_match = CollegeMatcher.calculate_gpa_match(user_gpa, university.avg_gpa)
        work_exp_match = CollegeMatcher.calculate_work_exp_match(
            user_work_exp, university.avg_work_experience
        )

        # Acceptance rate factor (higher acceptance rate = higher base probability)
        acceptance_factor = university.acceptance_rate / 100.0

        # Weighted combination
        composite_score = (
            CollegeMatcher.GMAT_WEIGHT * gmat_match
            + CollegeMatcher.GPA_WEIGHT * gpa_match
            + CollegeMatcher.WORK_EXP_WEIGHT * work_exp_match
            + CollegeMatcher.ACCEPTANCE_RATE_WEIGHT * acceptance_factor
        )

        # Convert to percentage and apply acceptance rate ceiling
        # No one can have more than ~95% chance even at safety schools
        max_probability = min(95, university.acceptance_rate + 10)
        admission_probability = composite_score * 100

        # Apply ceiling
        admission_probability = min(admission_probability, max_probability)

        # Apply floor (minimum 5% chance if scores are reasonable)
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
        """
        Match user profile against all universities
        Returns list of (university, admission_probability) tuples sorted by probability
        """
        matches = []

        for university in universities:
            # Filter by program type
            if university.program_type.upper() != target_program.upper():
                continue

            admission_prob = CollegeMatcher.calculate_admission_probability(
                user_gmat, user_gpa, user_work_exp, university
            )

            matches.append((university, admission_prob))

        # Sort by admission probability (descending)
        matches.sort(key=lambda x: x[1], reverse=True)

        return matches
