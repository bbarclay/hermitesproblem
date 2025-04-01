"""
Setup files for the Hermite Solver package.

This file contains:
1. setup.py for package installation
2. __init__.py for package structure
3. README.md with package documentation
"""

#============================================================================
# setup.py
#============================================================================
"""
Setup script for the Hermite Solver package.
"""

from setuptools import setup, find_packages

setup(
    name="hermite-solver",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "numpy>=1.20.0",
        "scipy>=1.7.0",
        "mpmath>=1.2.0",
        "sympy>=1.8.0",
    ],
    author="Brandon Barclay",
    author_email="brandon.barclay@example.com",
    description="A Python library for solving Hermite's problem",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/username/hermite-solver",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Topic :: Scientific/Engineering :: Mathematics",
    ],
    python_requires=">=3.8",
)

#============================================================================
# __init__.py
#============================================================================
"""
Hermite Solver: A Python library for solving Hermite's problem.

This library implements the complete solution to Hermite's problem as described in
"The Complete Solution to Hermite's Problem: A Definitive Proof" by Brandon Barclay.
"""

from .hermite_solver import (
    Utils,
    HAPD,
    MatrixApproach,
    ComputationalMethods,
    HermiteSolver
)

__version__ = "0.1.0"
__author__ = "Brandon Barclay"
__all__ = [
    "Utils",
    "HAPD",
    "MatrixApproach",
    "ComputationalMethods",
    "HermiteSolver"
]

#============================================================================
# README.md
#============================================================================
"""
# Hermite Solver

A Python library for solving Hermite's problem, as described in "The Complete Solution to Hermite's Problem: A Definitive Proof" by Brandon Barclay.

## Overview

In 1848, Charles Hermite posed a profound question about the relationship between periodicity in number representations and algebraic properties. While it was known that:
- A real number has an eventually periodic decimal expansion if and only if it is rational.
- A real number has an eventually periodic continued fraction expansion if and only if it is a quadratic irrational.

Hermite asked whether a representation system could be found where periodicity would characterize cubic irrationals.

This library implements the complete solution to Hermite's problem, offering multiple approaches to identify and characterize cubic irrationals:

1. **HAPD Algorithm**: The Hermite-like Algorithm with Projective Dual action, which operates in three-dimensional projective space, producing a sequence that is eventually periodic if and only if the input is a cubic irrational.

2. **Matrix-Based Verification**: A method that relates cubic irrationals to properties of companion matrices and their traces.

3. **Advanced Computational Methods**: Entropy analysis, spectral properties, and other computational approaches to distinguish cubic irrationals from other number types.

## Installation

```bash
pip install hermite-solver
```

## Dependencies

- numpy
- scipy
- mpmath
- sympy

## Usage

### Basic Usage

```python
from hermite_solver import HermiteSolver

# Create a solver instance
solver = HermiteSolver()

# Detect if a number is a cubic irrational
result = solver.detect_cubic_irrational(2**(1/3))
print(f"Classification: {result['classification']}")
print(f"Confidence: {result['confidence']}")

# Perform comprehensive analysis
analysis = solver.analyze_number(2**(1/3))
print(analysis)
```

### HAPD Algorithm

```python
from hermite_solver import HAPD

# Create an instance
hapd = HAPD(max_iterations=1000, tolerance=1e-20)

# Run on a number
result = hapd.run(2**(1/3))
print(f"Status: {result['status']}")
print(f"Classification: {result['classification']}")
if result['status'] == 'periodic':
    print(f"Preperiod: {result['preperiod']}")
    print(f"Period: {result['period']}")
```

### Matrix-Based Verification

```python
from hermite_solver import MatrixApproach

# Create an instance
matrix = MatrixApproach()

# Verify if a number is a cubic irrational
result = matrix.verify_cubic_irrational(2**(1/3))
print(f"Classification: {result['classification']}")
if result['classification'] == 'cubic_irrational':
    print(f"Polynomial: {result['polynomial']}")
```

### Computational Methods

```python
from hermite_solver import ComputationalMethods

# Create an instance
comp = ComputationalMethods()

# Analyze entropy
metrics = comp.entropy_metrics(2**(1/3))
print(f"Entropy: {metrics[-1]['entropy']}")

# Perform spectral analysis
spectrum = comp.spectral_analysis(comp.continued_fraction(2**(1/3)))
print(f"Dominant frequencies: {spectrum['dominant_frequencies']}")

# Use the combined discriminator
result = comp.combined_discriminator(2**(1/3))
print(f"Classification: {result['classification']}")
print(f"Confidence: {result['confidence']}")
print(f"Votes: {result['votes']}")
```

## Testing

```bash
python -m unittest discover -s tests
```

## License

MIT

## Citation

If you use this library in your research, please cite:

```
Barclay, Brandon. "The Complete Solution to Hermite's Problem: A Definitive Proof." (2023)
```
"""

#============================================================================
# File structure for the package
#============================================================================
"""
hermite_solver/
├── __init__.py
├── hermite_solver.py
├── tests/
│   ├── __init__.py
│   └── test_hermite_solver.py
├── setup.py
├── README.md
└── LICENSE
"""
