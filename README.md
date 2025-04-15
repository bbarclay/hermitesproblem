# Solving Hermite's Problem

This repository contains the interactive web presentation of the paper "Solving Hermite's Problem: Three Novel Approaches for Complete Characterization of Cubic Irrationals" by Brandon Barclay.

## Paper Overview

This research presents three novel approaches to solving Hermite's problem for cubic irrationals:

1. **HAPD Algorithm**: A projective space approach
2. **Matrix Approach**: Using companion matrices and trace sequences
3. **Modified sin²-algorithm**: An extension for handling complex conjugate roots

## Setting Up GitHub Pages

To host this content as a GitHub Pages site:

1. Create a new repository on GitHub
2. Upload all the contents of this directory to your repository
3. Go to Settings > Pages
4. Under "Source", select "main" branch and the root folder (/)
5. Click Save

Your site will be published at `https://[your-username].github.io/[repository-name]/`

## Converting PDF Figures to PNG

The HTML version uses PNG images. You can convert the PDF figures to PNG using the following commands:

```bash
# Install ImageMagick if you don't have it
# On macOS: brew install imagemagick
# On Ubuntu: sudo apt-get install imagemagick

# Convert PDF figures to PNG
convert -density 300 hapd_algorithm_flowchart.pdf hapd_algorithm_flowchart.png
convert -density 300 projective_periodicity_visualization.pdf projective_periodicity_visualization.png
convert -density 300 projective_space_regions.pdf projective_space_regions.png
```

## Customizing the Site

The site is built using:
- HTML5
- Bootstrap 5.3.0
- MathJax 3 for mathematical notation

You can customize the site by editing:
- `index.html` - Main structure and content
- CSS styles in the `<style>` section
- Images in the `images/` directory

## Citation

To cite this work:

```
Barclay, B. (April 2025). Solving Hermite's Problem: Three Novel Approaches for Complete Characterization of Cubic Irrationals.
``` 