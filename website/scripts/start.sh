#!/bin/bash

# Create necessary directories
mkdir -p public/content

# Run the TeX processing script
python scripts/process_tex.py

# Start the development server
npm run dev 