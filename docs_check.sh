#!/bin/bash
# Documentation validation script

echo "===== LMS Documentation Validation ====="
echo "Checking MkDocs installation..."

# Check if mkdocs is installed
if ! command -v mkdocs &> /dev/null; then
    echo "MkDocs not found. Installing required packages..."
    pip install mkdocs mkdocs-material mkdocstrings mkdocstrings-python pymdown-extensions
fi

echo "Validating documentation structure..."
mkdocs build --strict

if [ $? -eq 0 ]; then
    echo "Documentation build successful! Running local server..."
    echo "You can view your documentation at http://127.0.0.1:8000"
    mkdocs serve
else
    echo "Error: Documentation build failed. Please fix the issues above."
    exit 1
fi
