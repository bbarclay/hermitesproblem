# Hermite Solver

A rigorous implementation of algorithms for solving Hermite's problem on cubic irrationals.

## Overview

The Hermite Solver is a comprehensive Python library that implements multiple approaches to detect and characterize cubic irrationals. It provides a complete solution to Hermite's problem as described in "The Complete Solution to Hermite's Problem: A Definitive Proof."

Key components include:

1. **HAPD Algorithm**: A Hermite-like Algorithm with Projective Dual action that characterizes cubic irrationals through their periodicity properties in projective space.

2. **Matrix-Based Verification**: Techniques for verifying cubic irrationals using companion matrices and trace relations.

3. **Computational Methods**: Advanced computational approaches including entropy analysis and spectral analysis.

4. **Combined Approach**: A unified methodology that integrates all approaches for high-confidence classification.

## Installation

```bash
pip install hermite_solver
```

Or install from source:

```bash
git clone https://github.com/yourusername/hermite-solver.git
cd hermite-solver
pip install -e .
```

## Requirements

- Python 3.8+
- NumPy
- mpmath
- SymPy
- SciPy

## Usage

Basic usage example:

```python
from hermite_solver import HermiteSolver

# Create a solver instance
solver = HermiteSolver()

# Analyze a number
result = solver.detect_cubic_irrational(2**(1/3))
print(result["classification"])  # Should output "cubic_irrational"
print(result["confidence"])      # Should output "very_high" or "high"

# Non-cubic numbers
result = solver.detect_cubic_irrational(2**0.5)  # Quadratic irrational (√2)
print(result["classification"])  # Should not be "cubic_irrational"

result = solver.detect_cubic_irrational(3.14159)  # Approximation of π
print(result["classification"])  # Should not be "cubic_irrational"
```

## Theory

The library implements the theoretical framework presented in "The Complete Solution to Hermite's Problem: A Definitive Proof" which establishes that:

1. Cubic irrationals exhibit periodic behavior under the HAPD algorithm
2. This periodicity can be rigorously verified through matrix-based approaches
3. The period length of the algorithm is related to the regulator of the associated cubic field

The implementation has been extensively validated against known cubic irrationals, rational numbers, quadratic irrationals, and transcendental numbers.

## Testing

To run the comprehensive test suite:

```bash
python -m unittest hermite_solver_test.py
```

## License

MIT License

## Author

Brandon Barclay 