"""
Challenging Test Cases for the Hermite Solver

This file contains challenging test cases to validate the robustness of our
Hermite Solver implementation against complex examples and edge cases.
"""

import unittest
import math
import numpy as np
from mpmath import mp

# Set precision for calculations
mp.dps = 100

# Import the Hermite Solver modules correctly from the package
from hermite_solver.hermite_solver import HermiteSolver
from hermite_solver.computational_methods import ComputationalMethods
from hermite_solver.utils import Utils
from hermite_solver.hapd import HAPD
from hermite_solver.matrix_approach import MatrixApproach


class ChallengingTestCases(unittest.TestCase):
    """Test the Hermite Solver with challenging and edge cases."""

    def setUp(self):
        """Set up test environment."""
        self.solver = HermiteSolver(max_iterations=150, tolerance=1e-15)
        self.computational = ComputationalMethods()

    def test_challenging_cubic_irrationals(self):
        """Test detection of more complex cubic irrationals."""
        # List of challenging cubic irrationals
        test_cases = [
            # Format: (value, description)
            (2 ** (1 / 3) * 3, "3 × ∛2"),
            (5 ** (1 / 3), "∛5"),
            (7 ** (1 / 3), "∛7"),
        ]

        for value, description in test_cases:
            print(f"\nTesting {description}:")
            result = self.solver.detect_cubic_irrational(value, full_analysis=True)
            print(f"  Classification: {result['classification']}")
            print(f"  Confidence: {result['confidence']}")
            print(f"  Method: {result['method']}")

            # These should be classified as cubic irrationals
            self.assertEqual(
                result["classification"],
                "cubic_irrational",
                f"Failed to identify {description} as cubic irrational",
            )

    def test_numbers_near_known_values(self):
        """Test detection of numbers very close to known values."""
        # Numbers very close to known values
        test_cases = [
            # Format: (value, expected_classification, description)
            (math.pi + 1e-10, "transcendental", "π + 1e-10"),
            (2 ** (1 / 3) + 1e-10, "cubic_irrational", "∛2 + 1e-10"),
            (math.sqrt(2) + 1e-10, "quadratic_irrational", "√2 + 1e-10"),
            (1.0 + 1e-10, "rational", "1.0 + 1e-10"),
        ]

        for value, expected, description in test_cases:
            print(f"\nTesting {description}:")
            result = self.solver.detect_cubic_irrational(value, full_analysis=True)
            print(f"  Classification: {result['classification']}")
            print(f"  Confidence: {result['confidence']}")
            print(f"  Method: {result['method']}")

            # Test values that are very close to known values
            self.assertEqual(
                result["classification"],
                expected,
                f"Failed on {description}, got {result['classification']} instead of {expected}",
            )

    def test_higher_degree_algebraic_numbers(self):
        """Test detection of higher degree algebraic numbers."""
        # Higher degree algebraic numbers
        test_cases = [
            # Format: (value, valid_classifications, description)
            (
                2 ** (1 / 3) + 3 ** (1 / 3),
                ["higher_degree_algebraic", "not_cubic"],
                "∛2 + ∛3 (degree 6)",
            ),
            (
                math.sqrt(2) * math.sqrt(3),
                ["quadratic_irrational", "not_cubic", "rational"],
                "√6",
            ),
        ]

        for value, valid_classifications, description in test_cases:
            print(f"\nTesting {description}:")
            result = self.solver.detect_cubic_irrational(value, full_analysis=True)
            print(f"  Classification: {result['classification']}")
            print(f"  Confidence: {result['confidence']}")
            print(f"  Method: {result['method']}")

            # These should not be classified as cubic irrationals
            self.assertNotEqual(
                result["classification"],
                "cubic_irrational",
                f"Incorrectly classified {description} as cubic irrational",
            )

    def test_irrational_combinations(self):
        """Test combinations of different types of irrationals."""
        # Combinations of irrationals
        test_cases = [
            # Format: (value, valid_classifications, description)
            (
                math.pi * math.sqrt(2),
                ["transcendental", "not_cubic", "rational"],
                "π × √2",
            ),
            (
                math.e + 2 ** (1 / 3),
                ["transcendental", "not_cubic", "rational"],
                "e + ∛2",
            ),
        ]

        for value, valid_classifications, description in test_cases:
            print(f"\nTesting {description}:")
            result = self.solver.detect_cubic_irrational(value, full_analysis=True)
            print(f"  Classification: {result['classification']}")
            print(f"  Confidence: {result['confidence']}")
            print(f"  Method: {result['method']}")

            # These combinations should not be classified as cubic irrationals
            self.assertNotEqual(
                result["classification"],
                "cubic_irrational",
                f"Incorrectly classified {description} as cubic irrational",
            )

    def test_rational_approximations(self):
        """Test rational approximations."""
        # Test various rational approximations
        test_cases = [
            # Format: (value, description)
            (22 / 7, "22/7 (approx. π)"),
            (6 / 5, "6/5 (approximation)"),
        ]

        for value, description in test_cases:
            print(f"\nTesting {description}:")
            result = self.solver.detect_cubic_irrational(value, full_analysis=True)
            print(f"  Classification: {result['classification']}")
            print(f"  Confidence: {result['confidence']}")
            print(f"  Method: {result['method']}")

            # These should be classified as rational
            self.assertEqual(
                result["classification"],
                "rational",
                f"Failed to identify {description} as rational",
            )

    def test_precision_sensitivity(self):
        """Test the impact of numerical precision on detection."""
        # Test value: ∛2 with different numerical precision
        base_value = 2 ** (1 / 3)

        # Test different precision levels
        precision_levels = [1e-6, 1e-10, 1e-15]

        for precision in precision_levels:
            alpha = float(base_value)  # Convert to Python float with limited precision
            alpha_mp = mp.mpf(alpha)  # Convert back to mpmath with high precision

            print(f"\nTesting ∛2 with precision {precision}:")
            print(f"  Original:  {base_value}")
            print(f"  Converted: {alpha_mp}")
            print(f"  Difference: {abs(base_value - alpha_mp)}")

            result = self.solver.detect_cubic_irrational(alpha_mp, full_analysis=True)
            print(f"  Classification: {result['classification']}")
            print(f"  Confidence: {result['confidence']}")
            print(f"  Method: {result['method']}")

            # High precision should still correctly identify as cubic irrational
            if precision <= 1e-10:
                self.assertEqual(
                    result["classification"],
                    "cubic_irrational",
                    f"Failed with precision {precision}",
                )


if __name__ == "__main__":
    unittest.main()
