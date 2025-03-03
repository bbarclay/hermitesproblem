"""
Hermite Solver: A Python library for solving Hermite's problem.

This library implements the complete solution to Hermite's problem as described in
"The Complete Solution to Hermite's Problem: A Definitive Proof" by Brandon Barclay.
"""

from .utils import Utils
from .hapd import HAPD
from .matrix_approach import MatrixApproach
from .computational_methods import ComputationalMethods
from .hermite_solver import HermiteSolver

__all__ = ["Utils", "HAPD", "MatrixApproach", "ComputationalMethods", "HermiteSolver"]
