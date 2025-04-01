# Hermite's Problem: Generated Figures

This directory contains Python-generated figures for the paper on solving Hermite's Problem through complementary approaches.

## Overview

The script `generate_figures.py` creates professional, publication-quality visualizations for the key algorithms and concepts presented in the paper. The figures are generated using matplotlib and networkx libraries, designed with a consistent visual style.

## Generated Figures

The following figures are produced by the script:

1. **Complementary Solutions Diagram** (`complementary_solutions_diagram.pdf/png`)
   - Illustrates the two complementary approaches (HAPD Algorithm and Modified sin² Algorithm)
   - Shows the key features of each approach
   - Highlights the common properties of both methods

2. **Projective Periodicity Visualization** (`projective_periodicity_visualization.pdf/png`)
   - Demonstrates how periodicity is detected in projective space
   - Shows the trajectory of projective triples as they move through the space
   - Highlights the return to an equivalent region, confirming periodicity

3. **HAPD Algorithm Flowchart** (`hapd_algorithm_flowchart.pdf/png`)
   - Step-by-step visualization of the algorithm process
   - Shows the initialization, iteration, and decision points
   - Illustrates the loop back for continued processing until periodicity is detected

4. **Algorithm Comparison Chart** (`algorithm_comparison_chart.pdf/png`)
   - Side-by-side comparison of the features of both algorithms
   - Highlights the differences in mathematical foundations, approaches, and implementations

## Usage

The figures are generated in both PDF and PNG formats for use in different contexts (publication vs. presentation). To regenerate these figures, run:

```bash
python generate_figures.py
```

## Integration with LaTeX

The figures are designed to be easily integrated into the LaTeX document with commands like:

```latex
\includegraphics[width=0.9\textwidth]{../figures/output/complementary_solutions_diagram.pdf}
```

## Style and Design

All figures follow a consistent design language with:
- Professional color scheme with distinct colors for the two algorithms
- Clear titles and labels
- Appropriate annotation of mathematical elements
- High resolution for publication quality 