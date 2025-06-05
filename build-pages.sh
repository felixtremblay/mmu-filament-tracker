#!/bin/bash

# Build for GitHub Pages
echo "Building for GitHub Pages..."
ng build --configuration github-pages --output-path docs

# Move files from browser subfolder to docs root
if [ -d "docs/browser" ]; then
    echo "Moving files from browser subfolder..."
    mv docs/browser/* docs/
    rmdir docs/browser
fi

# Create 404.html for SPA routing
echo "Creating 404.html for SPA routing..."
cp docs/index.html docs/404.html

# Create .nojekyll file to prevent Jekyll processing
echo "Creating .nojekyll file..."
touch docs/.nojekyll

echo "GitHub Pages build complete!"
echo "Files are ready in the docs/ folder."
