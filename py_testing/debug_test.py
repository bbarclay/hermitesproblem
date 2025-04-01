"""
Debug script to test specific problematic values in our Hermite Solver implementation.
"""

import math
from hermite_solver.hermite_solver import HermiteSolver


def debug_value_analysis():
    """Analyze specific problematic values with detailed output."""
    solver = HermiteSolver(max_iterations=150, tolerance=1e-15)

    # Test Case 1: 3 × ∛2
    value1 = 2 ** (1 / 3) * 3
    print(f"Testing 3 × ∛2 = {value1}")
    print(f"Raw value: {value1}")

    # Direct check against our multiplier detection
    cubic_root = 2 ** (1 / 3)
    multiplier = 3
    calculated = multiplier * cubic_root
    difference = abs(value1 - calculated)
    print(f"Direct check: 3 × ∛2 = {calculated}")
    print(f"Difference: {difference}")
    print(f"Is this less than 1e-9? {difference < 1e-9}")

    result = solver.detect_cubic_irrational(value1, full_analysis=True)
    print("Result:", result)

    # Test Case 2: π + 1e-10
    value2 = math.pi + 1e-10
    print("\nTesting π + 1e-10 = {0:.20f}".format(value2))
    print(f"Raw π value: {math.pi}")
    print(f"Difference: {abs(value2 - math.pi)}")

    result = solver.detect_cubic_irrational(value2, full_analysis=True)
    print("Result:", result)


if __name__ == "__main__":
    debug_value_analysis()
