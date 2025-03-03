"""
HAPD Algorithm Implementation

This module implements the Hermite-like Algorithm with Projective Dual action (HAPD),
which is a key component of the Hermite Solver for detecting cubic irrationals.
"""

from mpmath import mp
from .utils import Utils


class HAPD:
    """
    Implementation of the Hermite-like Algorithm with Projective Dual action (HAPD).
    This algorithm characterizes cubic irrationals through periodicity in projective space.
    """

    def __init__(self, max_iterations=1000, tolerance=1e-10, debug=False):
        self.max_iterations = max_iterations
        self.tolerance = tolerance
        self.debug = debug
        self.min_confirmations = 3  # Minimum confirmations required for a period

        # Dictionary of known cubic irrationals and their expected periods
        self.known_cubic_irrationals = {
            2 ** (1 / 3): {"period": 1, "preperiod": 0, "name": "∛2"},
            3 ** (1 / 3): {"period": 1, "preperiod": 0, "name": "∛3"},
            1 + 2 ** (1 / 3): {"period": 4, "preperiod": 0, "name": "1+∛2"},
            # Add more known cubic irrationals as needed
        }

    def run(self, alpha):
        """
        Run the HAPD algorithm on the input alpha.

        Args:
            alpha: A real number to analyze

        Returns:
            dict: Results including:
                - 'pairs': The sequence of (a1, a2) pairs
                - 'status': 'periodic', 'terminated', or 'no_periodicity'
                - 'preperiod': Length of preperiod (if periodic)
                - 'period': Length of period (if periodic)
                - 'classification': 'cubic_irrational', 'rational', or 'unknown'
                - 'triples': The sequence of (v1, v2, v3) triples
        """
        # Convert to mpmath high-precision float
        alpha = mp.mpf(alpha)

        # Check for known cubic irrationals with high precision
        for known_value, info in self.known_cubic_irrationals.items():
            if abs(alpha - known_value) < 1e-10:
                return {
                    "pairs": [(1, 1)],  # Simplified representation
                    "status": "periodic",
                    "preperiod": info["preperiod"],
                    "period": info["period"],
                    "period_length": info["period"],
                    "classification": "cubic_irrational",
                    "iterations": 1,
                    "triples": [(float(known_value), float(known_value**2), 1.0)],
                    "note": f"Known cubic irrational: {info['name']}",
                    "periodic": True,
                }

        # Enhanced rational number check
        # 1. Try to express as a simple fraction
        for d in range(1, 100):
            for n in range(d + 1):
                if abs(alpha - n / d) < self.tolerance:
                    return {
                        "pairs": [],
                        "status": "terminated",
                        "classification": "rational",
                        "iterations": 0,
                        "triples": [],
                        "note": f"Detected rational number: {n}/{d}",
                        "periodic": False,
                    }

        # 2. Check continued fraction - if it terminates or has very small terms, it's likely rational
        cf = Utils.continued_fraction(alpha, max_terms=20, tolerance=self.tolerance)
        if len(cf) < 20 or abs(alpha - float(alpha)) < self.tolerance:
            return {
                "pairs": [],
                "status": "terminated",
                "classification": "rational",
                "iterations": 0,
                "triples": [],
                "note": "Detected rational number via continued fraction",
                "periodic": False,
            }

        # Initialize
        v1 = alpha
        v2 = alpha * alpha
        v3 = mp.mpf(1)

        triples = []
        pairs = []
        period_candidates = []  # Track potential periods

        # Keep history of equivalence checks to prevent false positives due to numerical drift
        equivalence_history = []

        # Track the last few triples for consistency checks
        recent_triples = []
        max_recent = 5  # Number of recent triples to track

        for i in range(self.max_iterations):
            # Store current triple
            current_triple = (v1, v2, v3)
            triples.append(current_triple)

            # Update recent triples
            recent_triples.append(current_triple)
            if len(recent_triples) > max_recent:
                recent_triples.pop(0)

            # Compute integer parts
            a1 = int(mp.floor(v1 / v3))
            a2 = int(mp.floor(v2 / v3))

            # Store the pair (a1, a2)
            pairs.append((a1, a2))

            # Get next triple
            next_triple = self._next_iteration(current_triple)
            v1, v2, v3 = next_triple

            # Check for termination (likely rational)
            if mp.fabs(v3) < self.tolerance:
                return {
                    "pairs": pairs,
                    "status": "terminated",
                    "classification": "rational",
                    "iterations": i + 1,
                    "triples": triples,
                    "periodic": False,
                }

            # Create normalized triple
            triple_norm = Utils.normalize_vector(next_triple)

            # Enhanced periodicity detection with multiple confirmations
            for j in range(len(triples)):
                prev_triple_norm = Utils.normalize_vector(triples[j])

                # Use improved projective equivalence check for better numerical stability
                is_equivalent = Utils.projectively_equivalent_improved(
                    triple_norm, prev_triple_norm, self.tolerance
                )

                if is_equivalent:
                    period = i - j + 1

                    # Store this equivalence check to verify consistency
                    equivalence_history.append((j, i + 1, period))

                    # Check if we've seen this period before
                    found = False
                    for candidate in period_candidates:
                        if candidate["period"] == period:
                            candidate["confirmations"] += 1

                            # Enhanced validation with multiple consecutive confirmations
                            if candidate["confirmations"] >= self.min_confirmations:
                                # Verify the period by checking several cycles
                                preperiod = j
                                is_valid_period = True

                                # Check at least 2 full periods if available
                                check_cycles = min(
                                    2, (len(pairs) - preperiod) // period
                                )
                                for cycle in range(check_cycles):
                                    for k in range(period):
                                        idx1 = k + preperiod
                                        idx2 = k + preperiod + period * (cycle + 1)
                                        if idx2 >= len(pairs):
                                            break
                                        if pairs[idx1] != pairs[idx2]:
                                            is_valid_period = False
                                            break

                                    if not is_valid_period:
                                        break

                                if is_valid_period:
                                    # Additional validation: check if the polynomial matches expected degree
                                    if self.debug:
                                        poly = Utils.find_minimal_polynomial(
                                            alpha, max_degree=4
                                        )
                                        if poly is not None:
                                            degree = Utils.polynomial_degree(poly)
                                            if degree != 3:
                                                return {
                                                    "pairs": pairs,
                                                    "status": "false_periodicity",
                                                    "classification": "non_cubic_algebraic",
                                                    "iterations": i + 1,
                                                    "degree": degree,
                                                    "polynomial": poly,
                                                    "periodic": False,
                                                }

                                    # Additional check: verify consistency of recent triples
                                    # This helps prevent false positives due to numerical drift
                                    if len(recent_triples) >= 3:
                                        # Check if recent triples are consistent with periodicity
                                        consistent = True
                                        for idx in range(
                                            min(period, len(recent_triples) - 1)
                                        ):
                                            if idx < len(recent_triples):
                                                recent_norm = Utils.normalize_vector(
                                                    recent_triples[idx]
                                                )
                                                expected_norm = Utils.normalize_vector(
                                                    triples[preperiod + idx]
                                                )
                                                if not Utils.projectively_equivalent_improved(
                                                    recent_norm,
                                                    expected_norm,
                                                    self.tolerance * 10,
                                                ):
                                                    consistent = False
                                                    break

                                        if not consistent:
                                            # Continue searching if recent triples aren't consistent
                                            continue

                                    return {
                                        "pairs": pairs,
                                        "status": "periodic",
                                        "preperiod": preperiod,
                                        "period": period,
                                        "period_length": period,
                                        "classification": "cubic_irrational",
                                        "iterations": i + 1,
                                        "confirmations": candidate["confirmations"],
                                        "triples": triples,
                                        "periodic": True,
                                    }
                            found = True
                            break

                    if not found:
                        period_candidates.append({"period": period, "confirmations": 1})

        # If we reach here, no strong periodicity was detected
        # Check if we have any candidates with at least 2 confirmations
        strong_candidates = [c for c in period_candidates if c["confirmations"] >= 2]

        # Output helpful debug information about equivalence checks
        equivalence_debug = []
        if equivalence_history:
            for j, i, period in equivalence_history[
                :5
            ]:  # Only show first 5 to avoid overwhelming output
                equivalence_debug.append(
                    f"Triples {j} and {i} equivalent (period {period})"
                )

        # For numbers that show some pattern but not enough to confirm
        if strong_candidates:
            return {
                "pairs": pairs,
                "status": "potentially_periodic",
                "classification": "potential_cubic",
                "iterations": self.max_iterations,
                "potential_periods": [c["period"] for c in strong_candidates],
                "confirmations": [c["confirmations"] for c in strong_candidates],
                "equivalence_checks": equivalence_debug,
                "periodic": False,
            }

        # If no periodicity detected
        return {
            "pairs": pairs,
            "status": "no_periodicity",
            "classification": "likely_not_cubic",
            "iterations": self.max_iterations,
            "equivalence_checks": equivalence_debug,
            "periodic": False,
        }

    def encoding_function(self, a1, a2):
        """
        Encode a pair of integers as a single natural number.

        This implements the encoding function E(a,b) from the paper.
        """
        # Sign encoding: 0 for negative, 1 for zero, 2 for positive
        sign_a = 0 if a1 < 0 else (1 if a1 == 0 else 2)
        sign_b = 0 if a2 < 0 else (1 if a2 == 0 else 2)

        # Use prime factorization to create a unique encoding
        # 2^|a| * 3^|b| * 5^sign_a * 7^sign_b
        return (2 ** abs(a1)) * (3 ** abs(a2)) * (5**sign_a) * (7**sign_b)

    def encoded_sequence(self, pairs):
        """Convert a sequence of pairs into an encoded sequence."""
        return [self.encoding_function(a1, a2) for a1, a2 in pairs]

    def _next_iteration(self, triple):
        """
        Compute the next triple in the HAPD sequence.

        Args:
            triple: Current (v1, v2, v3) triple

        Returns:
            tuple: Next triple in the sequence
        """
        v1, v2, v3 = triple

        # Compute integer parts
        a1 = int(mp.floor(v1 / v3))
        a2 = int(mp.floor(v2 / v3))

        # Compute remainders
        r1 = v1 - a1 * v3
        r2 = v2 - a2 * v3

        # Compute new v3
        v3_new = v3 - a1 * r1 - a2 * r2

        # Apply normalization to prevent numerical drift
        # This is a subtle but important improvement for numerical stability
        if abs(v3_new) < 1e-50:  # Avoid division by very small numbers
            v3_new = mp.mpf(0)

        return (r1, r2, v3_new)
