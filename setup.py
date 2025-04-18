"""
Setup script for the Hermite Solver package.
"""


from setuptools import setup, find_packages
setup(    name="hermite_solver",
    version="1.0.0",
    description="A rigorous solver for Hermite's problem",
    author="Brandon Barclay",
    author_email="example@example.com",
    packages=find_packages(),
    install_requires=[
        "numpy>=1.20.0",
        "mpmath>=1.2.0",
        "sympy>=1.8.0",
        "scipy>=1.7.0",
    ],
    classifiers=[
        "Development Status :: 4 - Beta",
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
