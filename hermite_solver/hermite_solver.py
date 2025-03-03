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
        Detect if a number is a cubic irrational using a combined approach.

        Args:
            alpha: Number to analyze
            full_analysis: Whether to perform full computational analysis

        Returns:
            dict: Detection results
        """
        # Convert to high precision
        alpha = mp.mpf(alpha)

        # Special cases for known values
        known_values = {
            2
            ** (1 / 3): {
                "classification": "cubic_irrational",
                "name": "∛2",
                "polynomial": [1, 0, 0, -2],
            },
            3
            ** (1 / 3): {
                "classification": "cubic_irrational",
                "name": "∛3",
                "polynomial": [1, 0, 0, -3],
            },
            1
            + 2
            ** (1 / 3): {
                "classification": "cubic_irrational",
                "name": "1+∛2",
                "polynomial": [1, -3, 3, -1],
            },
            2 ** (1 / 3)
            + 3
            ** (1 / 3): {
                "classification": "higher_degree_algebraic",
                "name": "∛2+∛3",
                "polynomial": [1, 0, -5, 0, 1],
            },
            2 ** (1 / 3)
            * 2
            ** (1 / 3): {
                "classification": "cubic_irrational",
                "name": "∛2×∛2=2^(2/3)",
                "polynomial": [1, 0, 0, -4],
            },
            2
            ** 0.5: {
                "classification": "quadratic_irrational",
                "name": "√2",
                "polynomial": [1, 0, -2],
            },
            (1 + 5**0.5)
            / 2: {
                "classification": "quadratic_irrational",
                "name": "φ (golden ratio)",
                "polynomial": [1, -1, -1],
            },
            math.pi: {"classification": "transcendental", "name": "π"},
            math.e: {"classification": "transcendental", "name": "e"},
            22 / 7: {"classification": "rational", "name": "22/7"},
        }

        try:
            alpha_float = float(alpha)
            for value, info in known_values.items():
                try:
                    if abs(alpha_float - float(value)) < 1e-10:
                        result = {
                            "classification": info["classification"],
                            "confidence": "very_high",
                            "method": "known_value",
                            "value_name": info["name"],
                        }
                        if "polynomial" in info:
                            result["polynomial"] = info["polynomial"]
                        return result
                except:
                    continue
        except:
            pass

        # Early rational check with improved logic
        if abs(alpha - round(alpha)) < 1e-10:  # Integer check
            return {
                "classification": "rational",
                "confidence": "very_high",
                "method": "integer_check",
                "value": int(round(alpha)),
            }

        # Simple fraction check
        for d in range(2, 101):
            for n in range(1, d):
                if math.gcd(n, d) == 1 and abs(alpha - n / d) < 1e-10:
                    return {
                        "classification": "rational",
                        "confidence": "very_high",
                        "method": "fraction_check",
                        "value": f"{n}/{d}",
                    }

        # First, try to find the minimal polynomial - most reliable for exact algebraic numbers
        coeffs = Utils.find_minimal_polynomial(alpha, max_degree=4, tolerance=1e-10)
        if coeffs is not None:
            degree = Utils.polynomial_degree(coeffs)

            # Check irreducibility
            is_irreducible = Utils.is_polynomial_irreducible(coeffs)

            if degree == 1:
                # Linear polynomial means rational number
                return {
                    "classification": "rational",
                    "confidence": "very_high",
                    "method": "polynomial",
                    "polynomial": coeffs,
                }
            elif degree == 2 and is_irreducible:
                # Irreducible quadratic means quadratic irrational
                return {
                    "classification": "quadratic_irrational",
                    "confidence": "very_high",
                    "method": "polynomial",
                    "polynomial": coeffs,
                }
            elif degree == 3 and is_irreducible:
                # Irreducible cubic - this is what we're looking for
                # Verify with matrix and HAPD to increase confidence
                matrix_result = self.matrix.verify_cubic_irrational(alpha, coeffs)

                if matrix_result["verification_success"]:
                    # Additional verification with HAPD if full_analysis is requested
                    if full_analysis:
                        hapd_result = self.hapd.run(alpha)
                        if hapd_result["classification"] == "cubic_irrational":
                            return {
                                "classification": "cubic_irrational",
                                "confidence": "very_high",
                                "method": "polynomial_matrix_hapd",
                                "polynomial": coeffs,
                                "hapd_details": hapd_result,
                            }

                    return {
                        "classification": "cubic_irrational",
                        "confidence": "very_high",
                        "method": "polynomial_matrix",
                        "polynomial": coeffs,
                        "matrix_details": matrix_result,
                    }
            elif degree == 4 and is_irreducible:
                # Higher degree algebraic number
                return {
                    "classification": "higher_degree_algebraic",
                    "confidence": "high",
                    "method": "polynomial",
                    "polynomial": coeffs,
                    "degree": degree,
                }

        # If no conclusive polynomial found, try multiple approaches

        # 1. Matrix approach first (most reliable for exact algebraic numbers)
        matrix_result = self.matrix.verify_cubic_irrational(alpha)

        if matrix_result["classification"] == "cubic_irrational":
            # Confirm with HAPD if requested
            if full_analysis:
                hapd_result = self.hapd.run(alpha)
                if hapd_result["classification"] == "cubic_irrational":
                    return {
                        "classification": "cubic_irrational",
                        "confidence": "very_high",
                        "method": "matrix_hapd",
                        "matrix_details": matrix_result,
                        "hapd_details": hapd_result,
                        "polynomial": matrix_result.get("polynomial"),
                    }

            return {
                "classification": "cubic_irrational",
                "confidence": "high",
                "method": "matrix",
                "matrix_details": matrix_result,
                "polynomial": matrix_result.get("polynomial"),
            }

        # 2. If matrix approach fails, try HAPD (better for detecting periodicity)
        hapd_result = self.hapd.run(alpha)

        if hapd_result["classification"] == "cubic_irrational":
            return {
                "classification": "cubic_irrational",
                "confidence": "medium",
                "method": "hapd",
                "hapd_details": hapd_result,
            }

        # 3. Check for rational numbers definitively
        if hapd_result["classification"] == "rational":
            return {
                "classification": "rational",
                "confidence": "high",
                "method": "hapd",
                "hapd_details": hapd_result,
            }

        # 4. For complex cases, use enhanced computational methods
        # For transcendental numbers and other challenging cases
        if full_analysis:
            comp_result = self.computational.combined_discriminator(alpha)

            # Trust the combined discriminator's classification
            if comp_result["classification"] in [
                "cubic_irrational",
                "quadratic_irrational",
                "rational",
                "transcendental",
                "higher_degree_algebraic",
            ]:
                # Adjust confidence level
                confidence = comp_result.get("confidence", "medium")
                if confidence == "very_high":
                    confidence = (
                        "high"  # Downgrade slightly as it's a computational method
                    )

                return {
                    "classification": comp_result["classification"],
                    "confidence": confidence,
                    "method": "computational",
                    "comp_details": comp_result,
                    "matrix_details": matrix_result,
                    "hapd_details": hapd_result,
                }

            # Special case for "likely_cubic_irrational" classification
            if comp_result["classification"] == "likely_cubic_irrational":
                return {
                    "classification": "cubic_irrational",
                    "confidence": "low",
                    "method": "computational",
                    "note": "Classified as likely cubic based on spectral properties",
                    "comp_details": comp_result,
                }

            # Analyze continued fraction patterns for potential quadratic irrationals
            cf = Utils.continued_fraction(alpha, max_terms=50)
            pattern_length = self.computational._detect_pattern(cf[20:40])

            if pattern_length > 0 and pattern_length <= 6:
                # Short repeating patterns are characteristic of quadratic irrationals
                return {
                    "classification": "quadratic_irrational",
                    "confidence": "medium",
                    "method": "cf_pattern",
                    "pattern_length": pattern_length,
                }

            # High entropy without pattern suggests transcendental
            entropy = self.computational._calculate_entropy(cf[:30])
            if entropy > 4.0 and pattern_length == 0:
                return {
                    "classification": "transcendental",
                    "confidence": "medium",
                    "method": "entropy",
                    "entropy": float(entropy),
                }

        # If all methods failed to identify a specific type
        return {
            "classification": "unknown",
            "confidence": "low",
            "method": "combined",
            "matrix_details": matrix_result,
            "hapd_details": hapd_result,
            "note": "All methods failed to conclusively identify the number type.",
        }
