#!/bin/bash

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