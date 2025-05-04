#!/bin/bash

# Install MkDocs and dependencies
pip install mkdocs mkdocs-material mkdocstrings mkdocstrings-python pymdown-extensions

# Build the documentation
mkdocs build -d docs_build

echo "Documentation built successfully in docs_build directory"
