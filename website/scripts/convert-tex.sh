#!/bin/bash

# Convert TeX files to JSON
echo "Converting TeX files to JSON..."
node scripts/tex-to-json.js

# Make the script executable
chmod +x scripts/tex-to-json.js

echo "Conversion complete!"
