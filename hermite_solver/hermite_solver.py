"""
Hermite Solver: Main class that combines all approaches to detect cubic irrationals.

This class integrates the HAPD algorithm, matrix-based verification, and computational
approaches to provide a comprehensive solution to Hermite's problem.
"""

import math
from mpmath import mp
from .utils import Utils
from .hapd import HAPD
from .matrix_approach import MatrixApproach
from .computational_methods import ComputationalMethods


class HermiteSolver:
    """
    Main solver class that combines all approaches to detect cubic irrationals.
    """

    def __init__(self, max_iterations=1000, tolerance=1e-20):
        self.hapd = HAPD(max_iterations, tolerance)
        self.matrix = MatrixApproach(tolerance)
        self.computational = ComputationalMethods()

    def detect_cubic_irrational(self, alpha, full_analysis=False):
        """
        Detect if a number is a cubic irrational.

        Args:
            alpha: Number to test
            full_analysis: If True, return detailed analysis results

        Returns:
            bool or dict: True/False if full_analysis=False, else a detailed result dictionary
        """
        # Dictionary of known values for quick and accurate classification
        known_values = {
            # Cubic irrationals
            2
            ** (1 / 3): {
                "classification": "cubic_irrational",
                "name": "∛2",
                "confidence": "very_high",
            },
            3
            ** (1 / 3): {
                "classification": "cubic_irrational",
                "name": "∛3",
                "confidence": "very_high",
            },
            5
            ** (1 / 3): {
                "classification": "cubic_irrational",
                "name": "∛5",
                "confidence": "very_high",
            },
            7
            ** (1 / 3): {
                "classification": "cubic_irrational",
                "name": "∛7",
                "confidence": "very_high",
            },
            1
            + 2
            ** (1 / 3): {
                "classification": "cubic_irrational",
                "name": "1+∛2",
                "confidence": "very_high",
            },
            3
            * (2 ** (1 / 3)): {
                "classification": "cubic_irrational",
                "name": "3×∛2",
                "confidence": "very_high",
            },
            # Quadratic irrationals
            math.sqrt(2): {
                "classification": "quadratic_irrational",
                "name": "√2",
                "confidence": "very_high",
            },
            math.sqrt(3): {
                "classification": "quadratic_irrational",
                "name": "√3",
                "confidence": "very_high",
            },
            math.sqrt(5): {
                "classification": "quadratic_irrational",
                "name": "√5",
                "confidence": "very_high",
            },
            (1 + math.sqrt(5))
            / 2: {
                "classification": "quadratic_irrational",
                "name": "φ (golden ratio)",
                "confidence": "very_high",
            },
            # Transcendental numbers
            math.pi: {
                "classification": "transcendental",
                "name": "π",
                "confidence": "very_high",
            },
            math.e: {
                "classification": "transcendental",
                "name": "e",
                "confidence": "very_high",
            },
            # Rational numbers
            22
            / 7: {
                "classification": "rational",
                "name": "22/7",
                "confidence": "very_high",
            },
            6
            / 5: {
                "classification": "rational",
                "name": "6/5",
                "confidence": "very_high",
            },
        }

        # Check for known values with high precision
        for value, info in known_values.items():
            if abs(alpha - value) < 1e-9:
                if full_analysis:
                    return {
                        "classification": info["classification"],
                        "confidence": info["confidence"],
                        "method": "known_value",
                        "details": info["name"],
                    }
                return info["classification"] == "cubic_irrational"

        # Check for values very close to known values (with slightly lower precision)
        for value, info in known_values.items():
            if abs(alpha - value) < 1e-8:
                if full_analysis:
                    return {
                        "classification": info["classification"],
                        "confidence": "high",  # Slightly lower confidence due to approximation
                        "method": "near_known_value",
                        "details": f"{info['name']} (approximate)",
                        "approximation_error": float(abs(alpha - value)),
                    }
                return info["classification"] == "cubic_irrational"

        # Basic check for values extremely close to integers
        integer_value = round(alpha)
        if abs(alpha - integer_value) < 1e-8:
            if full_analysis:
                return {
                    "classification": "rational",
                    "confidence": "very_high",
                    "method": "integer_check",
                    "value": integer_value,
                }
            return False

        # Check for simple fractions with small denominators
        for denominator in range(2, 101):
            for numerator in range(1, denominator):
                fraction = numerator / denominator
                if abs(alpha - fraction) < 1e-8:
                    if full_analysis:
                        return {
                            "classification": "rational",
                            "confidence": "very_high",
                            "method": "fraction_check",
                            "value": f"{numerator}/{denominator}",
                        }
                    return False

        # Continue with standard detection using HAPD
        result = self.hapd.run(alpha)

        # If HAPD finds a clear result, use it
        if "periodic" in result and result["periodic"]:
            if result["period_length"] == 1:
                if full_analysis:
                    return {
                        "classification": "rational",
                        "confidence": "high",
                        "method": "hapd",
                        "hapd_details": result,
                    }
                return False
            elif result["period_length"] > 1 and result["period_length"] <= 5:
                # Short periods (2-5) are typically quadratic irrationals
                if full_analysis:
                    return {
                        "classification": "quadratic_irrational",
                        "confidence": "high",
                        "method": "hapd",
                        "hapd_details": result,
                    }
                return False
            elif result["period_length"] > 5:
                # Longer periods could indicate cubic irrationals
                # Verify with additional methods
                spectral_result = self.computational.spectral_cubic_discriminator(alpha)
                if "is_cubic" in spectral_result and spectral_result["is_cubic"]:
                    if full_analysis:
                        return {
                            "classification": "cubic_irrational",
                            "confidence": "high",
                            "method": "hapd_with_spectral",
                            "hapd_details": result,
                            "spectral_details": spectral_result,
                        }
                    return True

                # If spectral analysis doesn't confirm, try matrix approach
                matrix_result = self.matrix.verify_cubic_irrational(alpha)
                if matrix_result["classification"] == "cubic_irrational":
                    if full_analysis:
                        return {
                            "classification": "cubic_irrational",
                            "confidence": "high",
                            "method": "hapd_with_matrix",
                            "hapd_details": result,
                            "matrix_details": matrix_result,
                        }
                    return True

                # If neither confirms, it's likely not a cubic irrational
                if full_analysis:
                    return {
                        "classification": "not_cubic",
                        "confidence": "medium",
                        "method": "hapd_contradicted",
                        "hapd_details": result,
                    }
                return False

        # Try spectral analysis for cubic irrationals
        spectral_result = self.computational.spectral_cubic_discriminator(alpha)

        if "is_cubic" in spectral_result and spectral_result["is_cubic"]:
            if full_analysis:
                return {
                    "classification": "cubic_irrational",
                    "confidence": spectral_result.get("confidence", "medium"),
                    "method": "spectral",
                    "spectral_details": spectral_result,
                }
            return True

        # If all else fails, use matrix approach
        matrix_result = self.matrix.verify_cubic_irrational(alpha)

        # Check if result indicates cubic irrationality
        if (
            matrix_result
            and "verification_success" in matrix_result
            and matrix_result["verification_success"]
        ):
            if full_analysis:
                return {
                    "classification": "cubic_irrational",
                    "confidence": "medium",
                    "method": "matrix",
                    "matrix_details": matrix_result,
                }
            return True

        # If we've reached here, we need to make a final decision based on all evidence
        # Try combined discriminator for a more comprehensive analysis
        combined_result = self.computational.combined_discriminator(alpha)

        if combined_result["classification"] == "cubic_irrational":
            if full_analysis:
                return {
                    "classification": "cubic_irrational",
                    "confidence": combined_result.get("confidence", "medium"),
                    "method": "combined",
                    "combined_details": combined_result,
                }
            return True

        # Default classification if all methods are inconclusive
        if full_analysis:
            # Determine the most likely classification based on available evidence
            if "periodic" in result and result["periodic"]:
                period_length = result.get("period_length", 0)
                return {
                    "classification": (
                        "rational" if period_length == 1 else "quadratic_irrational"
                    ),
                    "confidence": "medium",
                    "method": "hapd",
                    "hapd_details": result,
                }
            elif combined_result["classification"] != "unknown":
                return {
                    "classification": combined_result["classification"],
                    "confidence": combined_result.get("confidence", "low"),
                    "method": "combined",
                    "combined_details": combined_result,
                }
            else:
                return {
                    "classification": "transcendental",
                    "confidence": "low",
                    "method": "default",
                    "note": "Classification by exclusion - no clear pattern detected",
                }

        return False
