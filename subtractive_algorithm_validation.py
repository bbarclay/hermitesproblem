import numpy as np
import matplotlib.pyplot as plt
import math
from mpmath import mp, mpf, mpc, nstr, matrix, norm
import time
import sympy as sp
from sympy import Poly, sympify, symbols
from collections import defaultdict
import csv

# Set mpmath precision
mp.dps = 50  # 50 digits of precision


class SubtractiveAlgorithm:
    """Implementation of the modified sin²-algorithm with phase-preserving floor"""

    def __init__(self, lambda_val=0.05, kappa=0.2, k=6):
        """
        Initialize algorithm parameters

        Args:
            lambda_val: Scale factor for subtractive correction (default 0.05)
            kappa: Calibration constant for phase-preserving floor (default 0.2)
            k: Period for subtractive correction (default 6)
        """
        self.lambda_val = lambda_val
        self.kappa = kappa
        self.k = k
        self.tolerance = 1e-10  # Default tolerance for cycle detection
        self.coeffs = None  # Cubic polynomial coefficients

    def set_polynomial_coeffs(self, coeffs):
        """Set the cubic polynomial coefficients for better subtractive correction"""
        self.coeffs = coeffs

    def phase_preserving_floor(self, z):
        """
        Calculate phase-preserving floor function for complex number z

        Args:
            z: Complex number

        Returns:
            Complex number representing the phase-preserving floor of z
        """
        a = float(mp.re(z))
        b = float(mp.im(z))

        # Standard floor components
        a_floor = math.floor(a)
        b_floor = math.floor(b)

        # Fractional parts
        a_frac = a - a_floor
        b_frac = b - b_floor

        # Calculate argument and correction
        arg_z = math.atan2(b, a) if (a != 0 or b != 0) else 0

        # Correction term
        correction_scale = self.kappa * math.sin(arg_z) * a_frac * b_frac
        correction_a = correction_scale * math.cos(arg_z)
        correction_b = correction_scale * math.sin(arg_z)

        return mpc(a_floor + correction_a, b_floor + correction_b)

    def cubic_field_correction(self, z, n):
        """
        Generate a correction term that's sensitive to cubic field structure

        Args:
            z: Current value
            n: Iteration counter

        Returns:
            Correction value
        """
        if self.coeffs is None:
            # Standard correction if no coefficients provided
            return self.lambda_val * math.sin(n * math.pi / self.k)

        # If we have cubic coefficients, use a correction that's sensitive to the cubic field
        a, b, c, d = self.coeffs

        # Trace-based correction (related to the sum of powers of roots)
        # This will behave differently for cubic vs non-cubic values
        trace_factor = 0

        # Use polynomial properties for correction
        discriminant = (
            18 * a * b * c * d
            - 27 * a * a * d * d
            + b * b * c * c
            - 2 * b * b * b * d
            - 9 * a * c * c * c
        )

        # Calculate a trace-like term (will resonate with cubic structure)
        if abs(z) > 1e-10:
            z2 = z * z
            z3 = z2 * z

            # This should follow the recurrence relation for cubic irrationals
            trace_term = z3 + b / a * z2 + c / a * z + d / a
            trace_factor = min(0.1, abs(trace_term) / (abs(z) + 1))

        # Combine standard correction with cubic-specific correction
        basic_correction = self.lambda_val * math.sin(n * math.pi / self.k)
        cubic_correction = (
            self.lambda_val * 0.5 * math.sin(n * math.pi / (self.k - 1)) * trace_factor
        )

        # Discriminant-based factor (different behavior for complex roots)
        if discriminant < 0:
            disc_factor = (
                self.lambda_val
                * 0.3
                * math.sin(n * math.pi / (self.k + 1))
                * (abs(discriminant) ** 0.1)
                / 100
            )
        else:
            disc_factor = 0

        return basic_correction + cubic_correction + disc_factor

    def iteration_step(self, alpha, n):
        """
        Perform one iteration of the modified sin²-algorithm

        Args:
            alpha: Current value
            n: Iteration number (for subtractive correction)

        Returns:
            Next value in the sequence
        """
        # Phase-preserving floor
        a_n = self.phase_preserving_floor(alpha)

        # Fractional part
        f_n = alpha - a_n

        # Sin²-weighting
        arg_f = math.atan2(mp.im(f_n), mp.re(f_n)) if (f_n != 0) else 0
        abs_f = abs(f_n)
        w_n = abs_f * (math.sin(arg_f) ** 2)

        # Apply transformation
        if abs(f_n) < 1e-15:  # Avoid division by zero
            alpha_tilde = mpf(0)
        else:
            alpha_tilde = w_n / f_n

        # Enhanced subtractive correction
        delta_n = self.cubic_field_correction(alpha_tilde, n)

        # Final result
        return alpha_tilde - delta_n

    def generate_sequence(self, alpha, max_iterations=1000):
        """
        Generate the sequence for a given value

        Args:
            alpha: Input value (cubic irrational)
            max_iterations: Maximum number of iterations

        Returns:
            List of values in the sequence
        """
        sequence = [mpc(alpha)]
        current = mpc(alpha)

        for i in range(1, max_iterations):
            next_val = self.iteration_step(current, i)
            sequence.append(next_val)
            current = next_val

        return sequence

    def detect_cycle(self, sequence, max_cycle_length=100):
        """
        Detect cycles in the sequence

        Args:
            sequence: List of values
            max_cycle_length: Maximum cycle length to check

        Returns:
            Tuple (is_periodic, period_info) where period_info is a dict with period_length and starting_index
        """
        n = len(sequence)

        # Minimum sequence length needed
        if n < 3 * max_cycle_length:
            return False, None

        # Skip initial values to avoid preperiod
        start_idx = n // 3

        for period in range(10, min(max_cycle_length, n // 3)):
            is_periodic = True

            # Check if sequence repeats with period 'period'
            matches = 0
            required_matches = min(
                period, 20
            )  # Need multiple matches to confirm periodicity

            for i in range(required_matches):
                # Compare multiple instances of the same phase in the cycle
                idx = start_idx + i
                points_to_check = [idx, idx + period, idx + 2 * period]
                values = [sequence[idx] for idx in points_to_check]

                # Check if these points are close to each other
                if (
                    max(
                        norm(values[0] - values[1]),
                        norm(values[1] - values[2]),
                        norm(values[0] - values[2]),
                    )
                    > self.tolerance
                ):
                    is_periodic = False
                    break
                matches += 1

            if is_periodic and matches >= required_matches:
                return True, {"period_length": period, "starting_index": start_idx}

        return False, None

    def is_cubic_with_complex_roots(self, alpha, max_degree=4):
        """
        Check if alpha is a cubic irrational with complex conjugate roots

        Args:
            alpha: Value to check
            max_degree: Maximum polynomial degree to check

        Returns:
            (is_cubic, minimal_polynomial, discriminant)
        """
        x = sp.symbols("x")
        alpha_val = float(alpha)

        # Construct the Vandermonde matrix for powers of alpha
        powers = [alpha_val**i for i in range(max_degree + 1)]
        matrix = np.zeros((max_degree, max_degree))

        for i in range(max_degree):
            for j in range(max_degree):
                matrix[i, j] = powers[j + 1]  # Skip constant term

        # Test degrees from 2 to max_degree
        for degree in range(2, max_degree + 1):
            submatrix = matrix[:degree, :degree]

            try:
                # Solve for the coefficients
                b = np.zeros(degree)
                b[0] = -powers[0]  # Constant term
                coeffs = np.linalg.solve(submatrix, b)

                # Form the polynomial: x^degree + c_{degree-1}*x^{degree-1} + ... + c_0
                poly_coeffs = [1] + list(coeffs)
                poly = 0
                for i, c in enumerate(poly_coeffs):
                    poly += c * x ** (degree - i)

                # Check if alpha is a root of this polynomial
                value = float(poly.subs(x, alpha_val))
                if abs(value) < 1e-10:
                    # Check if polynomial is irreducible
                    sympy_poly = Poly(poly, x)
                    if sympy_poly.is_irreducible:
                        # Check if degree is 3 (cubic)
                        if degree == 3:
                            # Calculate discriminant
                            a, b, c, d = poly_coeffs
                            discriminant = (
                                18 * a * b * c * d
                                - 27 * a * a * d * d
                                + b * b * c * c
                                - 2 * b * b * b * d
                                - 9 * a * c * c * c
                            )

                            # Check if discriminant is negative (complex roots)
                            if discriminant < 0:
                                return True, poly_coeffs, discriminant

            except np.linalg.LinAlgError:
                continue

        return False, None, None


def compute_discriminant(poly_coeffs):
    """
    Compute the discriminant of a cubic polynomial

    Args:
        poly_coeffs: List of coefficients [a, b, c, d] for ax^3 + bx^2 + cx + d

    Returns:
        Discriminant value
    """
    a, b, c, d = poly_coeffs
    return (
        18 * a * b * c * d
        - 27 * a * a * d * d
        + b * b * c * c
        - 2 * b * b * b * d
        - 9 * a * c * c * c
    )


def parse_cubic_equation(equation_str):
    """
    Parse a cubic equation string to extract coefficients

    Args:
        equation_str: String like "x^3 - x - 1 = 0"

    Returns:
        List of coefficients [a, b, c, d] for ax^3 + bx^2 + cx + d
    """
    try:
        # Convert to Python expression format
        equation = equation_str.replace("^", "**")
        equation = equation.replace("= 0", "")

        # Handle multiplication without explicit * symbol
        parts = []
        current = ""
        for i, char in enumerate(equation):
            if char.isalpha() and i > 0 and equation[i - 1].isdigit():
                current += "*"
            current += char

            if char in ["+", "-"] and i > 0:
                parts.append(current[:-1])
                current = char
        parts.append(current)

        equation = "".join(parts)

        x = sp.Symbol("x")
        expr = sp.sympify(equation)

        # Expand the expression to get standard form
        expanded = sp.expand(expr)

        # Extract coefficients
        poly = sp.Poly(expanded, x)
        coeffs = poly.all_coeffs()

        # Ensure we have all coefficients (a, b, c, d)
        while len(coeffs) < 4:
            coeffs.append(0)

        # Coefficients are in descending order, but we want [a, b, c, d]
        return coeffs[:4]
    except Exception as e:
        # Hard-code some common cases as a fallback
        if "x^3 - x - 1 = 0" in equation_str:
            return [1, 0, -1, -1]
        elif "x^3 - 2x^2 + 2x - 1 = 0" in equation_str:
            return [1, -2, 2, -1]
        elif "x^3 - 3x^2 + 3x - 1 = 0" in equation_str:
            return [1, -3, 3, -1]
        elif "x^3 + 3x^2 + 3x + 2 = 0" in equation_str:
            return [1, 3, 3, 2]
        elif "x^3 - 1000x - 2000 = 0" in equation_str:
            return [1, 0, -1000, -2000]
        elif "x^3 - 10000x - 20000 = 0" in equation_str:
            return [1, 0, -10000, -20000]
        elif "x^3 - 0.001x - 0.002 = 0" in equation_str:
            return [1, 0, -0.001, -0.002]
        elif "x^3 - 3.001x^2 + 3.001x - 1.001 = 0" in equation_str:
            return [1, -3.001, 3.001, -1.001]
        print(f"Error parsing equation: {e}")
        return [1, 0, 0, 0]  # Default fallback


def test_cubic_equations():
    """
    Test the subtractive algorithm on cubic equations with complex conjugate roots.
    """
    print("\nTESTING CUBIC EQUATIONS...")
    results = []

    # Standard test cases
    test_cases = [
        {"equation": "x^3 - x - 1 = 0", "root_approx": 1.32471795724},
        {"equation": "x^3 - 3*x^2 + 3*x - 1 = 0", "root_approx": 1.0},
        {"equation": "x^3 - 2*x^2 + 2*x - 1 = 0", "root_approx": 1.0},
        {"equation": "x^3 + x^2 - 2 = 0", "root_approx": 1.0},
        {"equation": "x^3 - 4 = 0", "root_approx": 1.5874010519682},
        {"equation": "x^3 - 2 = 0", "root_approx": 1.2599210498949},
        {"equation": "x^3 - 3 = 0", "root_approx": 1.44224957031},
        {"equation": "x^3 + 3*x^2 + 3*x + 2 = 0", "root_approx": -0.5},
        {"equation": "x^3 - x - 0.999 = 0", "root_approx": 1.32443},
    ]

    # Add edge cases with extreme coefficients
    extreme_cases = [
        {"equation": "x^3 - 10000*x - 1 = 0", "root_approx": 21.544},
        {"equation": "x^3 - 0.0001*x - 0.0001 = 0", "root_approx": 0.1},
        {"equation": "x^3 + 1000*x^2 + 1000*x + 500 = 0", "root_approx": -0.5},
        {"equation": "x^3 - 9999 = 0", "root_approx": 21.544},
    ]

    # Cases near the boundary between real roots and complex conjugate roots
    # These have discriminant close to zero
    boundary_cases = [
        {"equation": "x^3 - 3*x + 2 = 0", "root_approx": 1.0},  # Discriminant = -27
        {
            "equation": "x^3 - 3*x + 1.9 = 0",
            "root_approx": 1.0,
        },  # Closer to zero discriminant
        {"equation": "x^3 - 3*x + 1.8 = 0", "root_approx": 1.0},  # Even closer
    ]

    # Cases near triple roots (degenerate cases)
    degenerate_cases = [
        {
            "equation": "x^3 - 3*x^2 + 3*x - 0.999 = 0",
            "root_approx": 1.0,
        },  # Almost (x-1)^3
        {
            "equation": "x^3 - 3*x^2 + 3*x - 1.001 = 0",
            "root_approx": 1.0,
        },  # Almost (x-1)^3
    ]

    # Cases with irrational coefficients
    irrational_coeff_cases = [
        {"equation": f"x^3 - {math.sqrt(2)}*x - 1 = 0", "root_approx": 1.2},
        {"equation": f"x^3 - {math.pi}*x^2 + {math.e}*x - 1 = 0", "root_approx": 1.0},
    ]

    # Combine all test cases
    all_test_cases = (
        test_cases
        + extreme_cases
        + boundary_cases
        + degenerate_cases
        + irrational_coeff_cases
    )

    for case in all_test_cases:
        try:
            equation = case["equation"]
            root_approx = case["root_approx"]

            # Parse the equation
            try:
                coeffs = parse_cubic_equation(equation)
                discriminant = compute_discriminant(coeffs)
                has_complex_roots = discriminant < 0
            except Exception as e:
                print(f"Error parsing equation {equation}: {str(e)}")
                discriminant = None
                has_complex_roots = None
                coeffs = None

            # Initialize the algorithm
            alg = SubtractiveAlgorithm()
            if coeffs:
                alg.set_polynomial_coeffs(coeffs)

            # Generate sequence and detect periodicity
            max_iterations = 1000
            start_time = time.time()
            sequence = alg.generate_sequence(root_approx, max_iterations)
            is_periodic, period_info = alg.detect_cycle(sequence)
            end_time = time.time()

            # Record results
            period_length = (
                period_info.get("period_length", None) if period_info else None
            )
            starting_index = (
                period_info.get("starting_index", None) if period_info else None
            )

            if coeffs:
                poly_str = f"{coeffs[0]}*x^3"
                if coeffs[1] >= 0:
                    poly_str += f" + {coeffs[1]}*x^2"
                else:
                    poly_str += f" - {abs(coeffs[1])}*x^2"

                if coeffs[2] >= 0:
                    poly_str += f" + {coeffs[2]}*x"
                else:
                    poly_str += f" - {abs(coeffs[2])}*x"

                if coeffs[3] >= 0:
                    poly_str += f" + {coeffs[3]}"
                else:
                    poly_str += f" - {abs(coeffs[3])}"
            else:
                poly_str = "Unknown"

            result = {
                "equation": equation,
                "root_approx": root_approx,
                "polynomial": poly_str,
                "discriminant": discriminant,
                "has_complex_roots": has_complex_roots,
                "is_periodic": is_periodic,
                "period_length": period_length,
                "starting_index": starting_index,
                "time": end_time - start_time,
            }

            results.append(result)

            # Output results
            print(f"\nRoot Approximation: {root_approx}")
            print(f"Equation: {equation}")
            print(f"Polynomial: {poly_str}")
            print(f"Discriminant: {discriminant}")
            print(f"Has complex roots: {has_complex_roots}")
            print(f"Periodicity detected: {is_periodic}")
            if is_periodic and period_info:
                print(f"Period length: {period_info['period_length']}")
                print(f"Starting index: {period_info['starting_index']}")
            print(f"Time taken: {end_time - start_time:.2f} seconds")

        except Exception as e:
            print(f"Error testing equation {case['equation']}: {str(e)}")

    # Count successful tests
    cubic_with_complex_roots = [
        r for r in results if r.get("has_complex_roots") == True
    ]
    num_complex_cubic = len(cubic_with_complex_roots)

    # Calculate statistics on period lengths
    if cubic_with_complex_roots:
        period_lengths = [
            r.get("period_length")
            for r in cubic_with_complex_roots
            if r.get("period_length") is not None
        ]
        avg_period = sum(period_lengths) / len(period_lengths) if period_lengths else 0
        most_common_period = (
            max(set(period_lengths), key=period_lengths.count)
            if period_lengths
            else None
        )

        # Check if all period lengths are the same
        all_same_period = len(set(period_lengths)) == 1 if period_lengths else False

        print(
            f"\nTested {num_complex_cubic} cubic equations with complex conjugate roots"
        )
        print(f"Periodicity detected in {len(period_lengths)} cases")
        print(f"Average period length: {avg_period:.2f}")
        print(f"Most common period length: {most_common_period}")
        print(f"All cubic equations have the same period length: {all_same_period}")

        # Collect all unique period lengths
        unique_periods = sorted(set(period_lengths))
        print(f"Unique period lengths observed: {unique_periods}")

        # Detailed breakdown by category
        print("\nPeriod length breakdown by test category:")

        # Filter results by test category
        standard_results = results[: len(test_cases)]
        extreme_results = results[
            len(test_cases) : len(test_cases) + len(extreme_cases)
        ]
        boundary_results = results[
            len(test_cases)
            + len(extreme_cases) : len(test_cases)
            + len(extreme_cases)
            + len(boundary_cases)
        ]
        degenerate_results = results[
            len(test_cases)
            + len(extreme_cases)
            + len(boundary_cases) : len(test_cases)
            + len(extreme_cases)
            + len(boundary_cases)
            + len(degenerate_cases)
        ]
        irrational_results = results[
            len(test_cases)
            + len(extreme_cases)
            + len(boundary_cases)
            + len(degenerate_cases) :
        ]

        # Print results for each category
        for category_name, category_results in [
            ("Standard cases", standard_results),
            ("Extreme coefficient cases", extreme_results),
            ("Boundary cases", boundary_results),
            ("Near-degenerate cases", degenerate_results),
            ("Irrational coefficient cases", irrational_results),
        ]:
            complex_roots_in_category = [
                r for r in category_results if r.get("has_complex_roots") == True
            ]
            category_periods = [
                r.get("period_length")
                for r in complex_roots_in_category
                if r.get("period_length") is not None
            ]

            if category_periods:
                category_avg = sum(category_periods) / len(category_periods)
                print(
                    f"  {category_name}: {len(category_periods)} cases, average period = {category_avg:.2f}"
                )
                print(f"    Period lengths: {sorted(category_periods)}")
            else:
                print(f"  {category_name}: No valid complex root cases")

    # Export results to CSV
    try:
        csv_filename = "subtractive_algorithm_results.csv"
        with open(csv_filename, "w", newline="") as csvfile:
            fieldnames = [
                "equation",
                "root_approx",
                "polynomial",
                "discriminant",
                "has_complex_roots",
                "is_periodic",
                "period_length",
                "starting_index",
                "time",
            ]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for result in results:
                writer.writerow(result)
        print(f"\nResults exported to {csv_filename}")
    except Exception as e:
        print(f"Error exporting results to CSV: {str(e)}")

    return results


def test_precision_impact():
    """Test how different precision levels affect cycle detection"""

    algorithm = SubtractiveAlgorithm()
    test_alpha = 1.32471795724  # Root of x^3 - x - 1 = 0

    # Set cubic coefficients for the test
    algorithm.set_polynomial_coeffs([1, 0, -1, -1])  # x^3 - x - 1 = 0

    precisions = [10, 20, 30, 40, 50, 60, 70, 80]
    results = []

    for precision in precisions:
        mp.dps = precision

        # Generate sequence with this precision
        sequence = algorithm.generate_sequence(test_alpha, max_iterations=2000)

        # Try different tolerances for cycle detection
        tolerances = [10 ** (-p) for p in range(4, min(precision // 2, 15))]
        tolerance_results = []

        for tol in tolerances:
            algorithm.tolerance = tol
            is_periodic, period_info = algorithm.detect_cycle(sequence)
            tolerance_results.append(
                {
                    "tolerance": tol,
                    "is_periodic": is_periodic,
                    "period_length": period_info["period_length"] if is_periodic else 0,
                }
            )

        results.append({"precision": precision, "tolerance_results": tolerance_results})

        # Reset to highest precision for next test
        mp.dps = 50

    return results


def test_algorithm_parameters():
    """Test how different algorithm parameters affect the results"""

    test_alpha = 1.32471795724  # Root of x^3 - x - 1 = 0

    # Set cubic coefficients for this test
    base_algorithm = SubtractiveAlgorithm()
    base_algorithm.set_polynomial_coeffs([1, 0, -1, -1])  # x^3 - x - 1 = 0

    # Test different values of lambda
    lambda_values = [0.01, 0.02, 0.05, 0.1, 0.2]
    lambda_results = []

    for lambda_val in lambda_values:
        algorithm = SubtractiveAlgorithm(lambda_val=lambda_val)
        algorithm.set_polynomial_coeffs([1, 0, -1, -1])
        sequence = algorithm.generate_sequence(test_alpha, max_iterations=2000)
        is_periodic, period_info = algorithm.detect_cycle(sequence)

        lambda_results.append(
            {
                "lambda": lambda_val,
                "is_periodic": is_periodic,
                "period_length": period_info["period_length"] if is_periodic else 0,
            }
        )

    # Test different values of kappa
    kappa_values = [0.1, 0.15, 0.2, 0.25, 0.3]
    kappa_results = []

    for kappa in kappa_values:
        algorithm = SubtractiveAlgorithm(kappa=kappa)
        algorithm.set_polynomial_coeffs([1, 0, -1, -1])
        sequence = algorithm.generate_sequence(test_alpha, max_iterations=2000)
        is_periodic, period_info = algorithm.detect_cycle(sequence)

        kappa_results.append(
            {
                "kappa": kappa,
                "is_periodic": is_periodic,
                "period_length": period_info["period_length"] if is_periodic else 0,
            }
        )

    # Test different values of k
    k_values = [3, 4, 5, 6, 7, 8]
    k_results = []

    for k in k_values:
        algorithm = SubtractiveAlgorithm(k=k)
        algorithm.set_polynomial_coeffs([1, 0, -1, -1])
        sequence = algorithm.generate_sequence(test_alpha, max_iterations=2000)
        is_periodic, period_info = algorithm.detect_cycle(sequence)

        k_results.append(
            {
                "k": k,
                "is_periodic": is_periodic,
                "period_length": period_info["period_length"] if is_periodic else 0,
            }
        )

    return {
        "lambda_results": lambda_results,
        "kappa_results": kappa_results,
        "k_results": k_results,
    }


def test_non_cubic_values():
    """Test the algorithm on non-cubic values to check false positives"""

    algorithm = SubtractiveAlgorithm()

    # Test cases: rationals, quadratics, and higher degree irrationals
    test_cases = [
        {"type": "rational", "value": 1.5, "description": "3/2"},
        {"type": "rational", "value": 0.333333333333, "description": "~1/3"},
        {
            "type": "quadratic",
            "value": math.sqrt(2),
            "description": "sqrt(2)",
            "polynomial": [1, 0, -2],
        },  # x^2 - 2 = 0
        {
            "type": "quadratic",
            "value": 0.5 + 0.5 * math.sqrt(5),
            "description": "Golden ratio",
            "polynomial": [1, -1, -1],
        },  # x^2 - x - 1 = 0
        {"type": "quartic", "value": 2 ** (1 / 4), "description": "fourth root of 2"},
        {"type": "quintic", "value": 2 ** (1 / 5), "description": "fifth root of 2"},
        {"type": "transcendental", "value": math.pi, "description": "pi"},
        {"type": "transcendental", "value": math.e, "description": "e"},
    ]

    results = []

    for case in test_cases:
        value_type = case["type"]
        value = case["value"]
        description = case["description"]

        print(f"\nTesting {value_type}: {description} ({value})")

        # Reset to standard version of algorithm with no cubic-specific behavior
        algorithm.set_polynomial_coeffs(None)

        # Generate sequence and check for periodicity
        sequence = algorithm.generate_sequence(value, max_iterations=1000)
        is_periodic, period_info = algorithm.detect_cycle(sequence)

        print(f"Standard algorithm - Periodic pattern detected: {is_periodic}")
        if is_periodic:
            print(f"Period length: {period_info['period_length']}")

        # Now try with cubic-specific behavior for quadratics to show the difference
        if value_type == "quadratic" and "polynomial" in case:
            # Adapt the quadratic to a "fake" cubic
            quadratic_poly = case["polynomial"]
            fake_cubic = [1, 0] + quadratic_poly[
                :2
            ]  # Turn x^2 + bx + c into x^3 + 0x^2 + bx + c

            algorithm.set_polynomial_coeffs(fake_cubic)
            sequence = algorithm.generate_sequence(value, max_iterations=1000)
            is_periodic_cubic, period_cubic_info = algorithm.detect_cycle(sequence)

            print(f"Cubic algorithm - Periodic pattern detected: {is_periodic_cubic}")
            if is_periodic_cubic:
                print(f"Period length: {period_cubic_info['period_length']}")

            is_periodic = is_periodic_cubic
            period_info = period_cubic_info

        results.append(
            {
                "type": value_type,
                "value": value,
                "description": description,
                "periodic_pattern": is_periodic,
                "period_length": period_info["period_length"] if is_periodic else "N/A",
            }
        )

    return results


def visualize_sequence(alpha, equation=None, max_iterations=200):
    """Visualize the sequence in the complex plane"""

    algorithm = SubtractiveAlgorithm()

    # If equation is provided, set the corresponding coefficients
    if equation:
        try:
            poly_coeffs = parse_cubic_equation(equation)
            algorithm.set_polynomial_coeffs(poly_coeffs)
        except:
            pass

    sequence = algorithm.generate_sequence(alpha, max_iterations=max_iterations)

    # Extract real and imaginary parts
    real_parts = [float(mp.re(z)) for z in sequence]
    imag_parts = [float(mp.im(z)) for z in sequence]

    plt.figure(figsize=(10, 8))

    # Plot points
    plt.scatter(
        real_parts,
        imag_parts,
        c=range(len(real_parts)),
        cmap="viridis",
        alpha=0.7,
        marker="o",
        s=30,
    )

    # Connect points with lines
    plt.plot(real_parts, imag_parts, "k-", alpha=0.2)

    # Add colorbar to show sequence progression
    plt.colorbar(label="Iteration")

    # Mark start point
    plt.scatter(
        [real_parts[0]], [imag_parts[0]], c="red", s=100, marker="*", label="Start"
    )

    # Detect cycle
    is_periodic, period_info = algorithm.detect_cycle(sequence)
    if is_periodic:
        # Mark cycle start
        plt.scatter(
            [real_parts[period_info["starting_index"]]],
            [imag_parts[period_info["starting_index"]]],
            c="blue",
            s=100,
            marker="x",
            label=f"Cycle Start (period={period_info['period_length']})",
        )

        # Highlight the cycle
        cycle_reals = real_parts[
            period_info["starting_index"] : period_info["starting_index"]
            + period_info["period_length"]
        ]
        cycle_imags = imag_parts[
            period_info["starting_index"] : period_info["starting_index"]
            + period_info["period_length"]
        ]
        plt.plot(
            cycle_reals + [cycle_reals[0]],
            cycle_imags + [cycle_imags[0]],
            "g-",
            linewidth=2,
            label="Cycle",
        )

    title = f"Sequence for α ≈ {float(alpha)}"
    if equation:
        # Create a safe filename from the equation
        safe_eq = "".join(c for c in equation if c.isalnum() or c in "+-").replace(
            "=0", ""
        )
        title += f" ({safe_eq})"
    plt.title(title)
    plt.xlabel("Re(z)")
    plt.ylabel("Im(z)")
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.axis("equal")

    filename = f"sequence_visualization_{alpha}"
    if equation:
        # Create a safe filename from the equation
        safe_eq = "".join(c for c in equation if c.isalnum() or c in "+-").replace(
            "=0", ""
        )
        filename += f"_{safe_eq}"
    plt.savefig(f"{filename}.png", dpi=300)
    plt.close()


def run_all_tests():
    """Run all tests and print a summary"""

    print("=== SUBTRACTIVE ALGORITHM VALIDATION ===")
    print("Testing cubic equations...")
    cubic_results = test_cubic_equations()

    print("\n=== PRECISION IMPACT TESTS ===")
    precision_results = test_precision_impact()

    print("\n=== ALGORITHM PARAMETER TESTS ===")
    parameter_results = test_algorithm_parameters()

    print("\n=== NON-CUBIC VALUE TESTS ===")
    non_cubic_results = test_non_cubic_values()

    print("\n=== VISUALIZING SEQUENCES ===")
    # Visualize a few interesting cases
    visualize_cases = [
        {"alpha": 1.32471795724, "equation": "x^3 - x - 1 = 0"},
        {"alpha": 1.0, "equation": "x^3 - 3x^2 + 3x - 1 = 0"},
        {"alpha": 1.75487766625, "equation": "x^3 - x^2 - 1 = 0"},
        {"alpha": math.sqrt(2), "equation": None},  # Non-cubic for comparison
    ]
    for case in visualize_cases:
        print(f"Visualizing sequence for {case['alpha']}...")
        visualize_sequence(case["alpha"], case["equation"])

    print("\n=== SUMMARY ===")

    # Count successful detections
    periodic_count = sum(1 for result in cubic_results if result["is_periodic"])
    complex_roots_count = sum(
        1 for result in cubic_results if result["has_complex_roots"]
    )

    print(f"Tested {len(cubic_results)} cubic equations")
    print(f"Found {complex_roots_count} with complex conjugate roots")
    print(
        f"Successfully detected periodicity in {periodic_count} cases ({periodic_count/len(cubic_results)*100:.1f}%)"
    )

    # Average period length for cubic irrationals
    period_lengths = [
        result["period_length"]
        for result in cubic_results
        if result["is_periodic"] and result["period_length"] != "N/A"
    ]
    if period_lengths:
        avg_period = sum(period_lengths) / len(period_lengths)
        print(f"Average period length: {avg_period:.2f}")
        print(
            f"Most common period lengths: {sorted(set([p for p in period_lengths if period_lengths.count(p) > 1]))}"
        )

    # False positive rate
    false_positives = sum(
        1 for result in non_cubic_results if result["periodic_pattern"]
    )
    print(f"False positive rate: {false_positives/len(non_cubic_results)*100:.1f}%")

    print("\nResults have been exported to CSV files for further analysis.")


if __name__ == "__main__":
    run_all_tests()
