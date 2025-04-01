#!/bin/bash

echo "Starting LaTeX compilation process..."

# Run pdflatex first pass
echo "Running first pdflatex pass..."
pdflatex -interaction=nonstopmode main.tex

# Run bibtex
echo "Running bibtex..."
bibtex main

# Run pdflatex second pass
echo "Running second pdflatex pass..."
pdflatex -interaction=nonstopmode main.tex

# Run pdflatex final pass
echo "Running final pdflatex pass..."
pdflatex -interaction=nonstopmode main.tex

echo "Compilation complete. Check main.pdf for the result." 