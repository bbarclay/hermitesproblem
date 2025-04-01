#!/usr/bin/env python3
"""
This script creates all necessary files for the Hermite's Problem presentation.
"""

import os


def create_file(filename, content):
    """Create a file with the given content."""
    with open(filename, "w") as f:
        f.write(content)
    print(f"Created {filename}")


def main():
    # Create render_presentation.sh
    render_script = """#!/bin/bash

# Set environment variables to enable GPU acceleration
export MANIM_RENDERER=opengl
export MANIM_CTX_BACKEND=metal
export MANIM_USE_HARDWARE_ACCEL=True
export MANIM_QUALITY=high

# Define output directory
OUTPUT_DIR="./media/videos/HermitePresentation/1080p60"
mkdir -p "$OUTPUT_DIR"

echo "Starting presentation rendering with GPU acceleration..."

# Render the presentation
python3 hermite_presentation.py -o "HermitePresentation.mp4" --renderer=opengl --fps=60 --quality=h

# Check if rendering was successful
if [ $? -eq 0 ]; then
    echo "Presentation successfully rendered!"
    echo "Output file: $OUTPUT_DIR/HermitePresentation.mp4"
    
    # Open the video after rendering
    open "$OUTPUT_DIR/HermitePresentation.mp4"
else
    echo "Error occurred during rendering."
fi
"""
    create_file("render_presentation.sh", render_script)
    os.chmod("render_presentation.sh", 0o755)  # Make executable

    # Create README.md
    readme = """# Hermite's Problem Presentation

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
"""
    create_file("README.md", readme)

    print("\nAll files created successfully!")
    print(
        "To create the presentation Python file, run 'create_hermite_presentation.py'"
    )


if __name__ == "__main__":
    main()
