#!/bin/bash

set -e  # Exit on any error

echo "[BUILD] Starting documentation build process"

# Debug: Show environment
echo "[BUILD] Working directory: $(pwd)"
echo "[BUILD] Contents of directory:"
ls -la

# Install MkDocs and dependencies
echo "[BUILD] Installing MkDocs and dependencies"
pip install mkdocs mkdocs-material mkdocstrings mkdocstrings-python pymdown-extensions

# Verify mkdocs.yml exists
if [ ! -f "mkdocs.yml" ]; then
    echo "[BUILD ERROR] mkdocs.yml not found in $(pwd)"
    exit 1
fi

# Create destination directory
mkdir -p docs_build

# Build the documentation
echo "[BUILD] Building documentation with MkDocs"
mkdocs build -d docs_build --verbose

# Verify the build was successful
if [ ! -f "docs_build/index.html" ]; then
    echo "[BUILD ERROR] Documentation build failed - index.html not found"
    exit 1
fi

echo "[BUILD] Documentation built successfully in docs_build directory"
echo "[BUILD] Contents of docs_build:"
ls -la docs_build

# Create a simple test file to verify serving works
echo "<html><body><h1>MkDocs Test Page</h1><p>This is a test page to verify Vercel static serving.</p></body></html>" > docs_build/test.html

echo "[BUILD] Build process completed successfully"
