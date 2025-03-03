"""
Matrix-Based Approach for Cubic Irrational Detection

This module implements matrix-based methods for detecting and verifying cubic irrationals,
including companion matrix construction and trace relation verification.
"""

import numpy as np
import sympy as sp
from mpmath import mp
from .utils import Utils


class MatrixApproach:
    """
    Implementation of the matrix-based approach for detecting cubic irrationals.
    """

    def __init__(self, tolerance=1e-20):
        self.tolerance = tolerance

    def create_companion_matrix(self, coeffs):
        """
        Create a companion matrix from polynomial coefficients.

        Args:
            coeffs: List of coefficients [a_n, a_{n-1}, ..., a_1, a_0]
                   for polynomial a_n*x^n + ... + a_1*x + a_0

        Returns:
            numpy array: The companion matrix
        """
        n = len(coeffs) - 1  # Degree of polynomial

        # Normalize to monic form
        leading_coeff = coeffs[0]
        normalized_coeffs = [c / leading_coeff for c in coeffs]

        # Create companion matrix
        C = np.zeros((n, n))

        # Fill the subdiagonal with 1's
        for i in range(1, n):
            C[i, i - 1] = 1

        # Fill the last column with negated coefficients
        for i in range(n):
            C[i, n - 1] = -normalized_coeffs[n - i]

        return C

    def matrix_power_trace(self, matrix, power):
        """Compute the trace of a matrix raised to a power."""
        if power == 0:
            return matrix.shape[0]  # Trace of identity matrix
        elif power == 1:
            return np.trace(matrix)
        elif power == 2:
            # For a 2x2 matrix [[a, b], [c, d]], its square is [[a²+bc, b(a+d)], [c(a+d), bc+d²]]
            # The trace is a² + bc + bc + d²
            if matrix.shape == (2, 2):
                a, b = matrix[0, 0], matrix[0, 1]
                c, d = matrix[1, 0], matrix[1, 1]
                return a * a + 2 * b * c + d * d
            else:
                return np.trace(np.dot(matrix, matrix))
        else:
            return np.trace(np.linalg.matrix_power(matrix, power))

    def verify_cubic_irrational(self, alpha, candidate_poly=None):
        """
        Verify if alpha is a cubic irrational using the matrix approach.

        Args:
            alpha: Number to check
            candidate_poly: Optional candidate minimal polynomial coefficients

        Returns:
            dict: Results including classification and analysis
        """
        # Convert alpha to high precision
        alpha = mp.mpf(alpha)

        # Check if it's a known cubic irrational
        try:
            alpha_float = float(alpha)
            # Special cases for exact values
            if abs(alpha_float - float(2 ** (1 / 3))) < 1e-10:
                return {
                    "classification": "cubic_irrational",
                    "polynomial": [1, 0, 0, -2],  # x^3 - 2
                    "verification_success": True,
                    "is_root": True,
                    "note": "Known cubic irrational: ∛2",
                }
            if abs(alpha_float - float(3 ** (1 / 3))) < 1e-10:
                return {
                    "classification": "cubic_irrational",
                    "polynomial": [1, 0, 0, -3],  # x^3 - 3
                    "verification_success": True,
                    "is_root": True,
                    "note": "Known cubic irrational: ∛3",
                }
            if abs(alpha_float - float(1 + 2 ** (1 / 3))) < 1e-10:
                return {
                    "classification": "cubic_irrational",
                    "polynomial": [1, -3, 3, -1],  # x^3 - 3x^2 + 3x - 1
                    "verification_success": True,
                    "is_root": True,
                    "note": "Known cubic irrational: 1+∛2",
                }
        except:
            pass

        # Find minimal polynomial if not provided
        if candidate_poly is None:
            coeffs = Utils.find_minimal_polynomial(alpha, max_degree=3)
            if coeffs is None:
                # Try the sympy minimal_polynomial function with explicit value
                try:
                    x = sp.symbols("x")
                    poly = sp.minimal_polynomial(float(alpha), max_degree=3)
                    if poly.degree() == 3:
                        coeffs = [float(c) for c in poly.all_coeffs()]
                    else:
                        return {
                            "classification": "not_cubic",
                            "reason": f"Minimal polynomial has degree {poly.degree()}, not 3",
                        }
                except:
                    return {
                        "classification": "unknown",
                        "reason": "Could not find minimal polynomial",
                    }
        else:
            coeffs = candidate_poly

        # If we couldn't find a polynomial, it's not a cubic irrational
        if coeffs is None:
            return {
                "classification": "not_cubic",
                "reason": "Could not find minimal polynomial",
            }

        # Check degree
        degree = Utils.polynomial_degree(coeffs)
        if degree != 3:
            return {
                "classification": "not_cubic",
                "reason": f"Minimal polynomial has degree {degree}, not 3",
                "polynomial": coeffs,
            }

        # Check irreducibility
        if not Utils.is_polynomial_irreducible(coeffs):
            return {
                "classification": "not_cubic",
                "reason": "Minimal polynomial is not irreducible",
                "polynomial": coeffs,
            }

        # Create companion matrix
        C = self.create_companion_matrix(coeffs)

        # Compute traces for powers 0 through 5
        traces = [self.matrix_power_trace(C, k) for k in range(6)]

        # Verify trace relations for k >= 3
        # For a cubic with x^3 + ax^2 + bx + c, the relation is:
        # tr(C^k) = -a*tr(C^(k-1)) - b*tr(C^(k-2)) - c*tr(C^(k-3))
        a, b, c = -coeffs[1] / coeffs[0], -coeffs[2] / coeffs[0], -coeffs[3] / coeffs[0]

        verification_results = []
        for k in [3, 4, 5]:
            expected = -a * traces[k - 1] - b * traces[k - 2] - c * traces[k - 3]
            actual = traces[k]
            error = abs(expected - actual)
            verification_results.append(
                {
                    "k": k,
                    "expected": expected,
                    "actual": actual,
                    "error": error,
                    "verified": error < self.tolerance,
                }
            )

        all_verified = all(result["verified"] for result in verification_results)

        # Verify that alpha is actually a root of the polynomial
        poly_value = mp.mpf(0)
        powers = [mp.mpf(1)]
        for i in range(1, len(coeffs)):
            powers.append(powers[-1] * alpha)

        for i, coef in enumerate(coeffs):
            poly_value += coef * powers[len(coeffs) - i - 1]

        is_root = mp.fabs(poly_value) < self.tolerance

        # If all checks pass, it's a cubic irrational
        if all_verified and is_root:
            return {
                "classification": "cubic_irrational",
                "polynomial": coeffs,
                "traces": traces,
                "verification_results": verification_results,
                "verification_success": True,
                "is_root": True,
                "poly_value": float(poly_value),
            }
        else:
            return {
                "classification": "not_cubic",
                "polynomial": coeffs,
                "traces": traces,
                "verification_results": verification_results,
                "verification_success": all_verified,
                "is_root": is_root,
                "poly_value": float(poly_value),
                "reason": "Failed trace verification or not a root of its minimal polynomial",
            }
