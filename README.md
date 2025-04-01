# Hermite's Problem Presentation

This is an animated presentation about Hermite's Problem and its solution using Python and Manim.

## Requirements

- Python 3.8+
- Manim library
- OpenGL and Metal support (for GPU acceleration)

## Installation

If you haven't installed Manim yet, you can do so with:

```bash
pip install manim
```

## Rendering the Presentation

To render the presentation with GPU acceleration:

1. Make the render script executable:
   ```bash
   chmod +x render_presentation.sh
   ```

2. Run the render script:
   ```bash
   ./render_presentation.sh
   ```

This will generate a high-quality MP4 video with all 10 slides and their animations.

## Presentation Content

The presentation consists of 10 slides covering:

1. Title and Introduction
2. What is Hermite's Problem?
3. Cubic Numbers Explained
4. The Challenge of Periodicity Detection
5. Our Solution: HAPD Algorithm
6. The Modified sin² Algorithm
7. Comparison of Approaches
8. Numerical Validation
9. Future Research Directions
10. Thank You / Q&A

## Customization

You can modify the `hermite_presentation.py` file to:
- Change colors or styles
- Adjust animation timings
- Add or remove content
- Customize transition effects

## Troubleshooting

If you encounter issues with GPU acceleration:

1. Check if your Mac supports Metal framework
2. Try rendering without GPU acceleration by removing the environment variables in the render script
3. For quality issues, adjust the `--quality` parameter (l for low, m for medium, h for high)

## Credits

This presentation was created using Manim, the Mathematical Animation Engine originally developed by 3Blue1Brown. 