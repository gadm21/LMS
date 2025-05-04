# LMS Platform Documentation

This directory contains the official documentation for the LMS Platform. The documentation is built using MkDocs with the Material theme and serves as a comprehensive guide for users, developers, and administrators.

## Documentation Structure

- **API Reference**: Detailed information about the REST API endpoints, authentication, database models
- **User Guide**: Getting started, installation instructions, configuration options
- **Developer Guide**: Architecture overview, contribution guidelines

## Contributing to Documentation

We welcome contributions to improve our documentation. Here's how you can help:

1. **Fix typos or clarify text**: Submit a pull request with your changes
2. **Add missing information**: Identify gaps in our documentation and fill them
3. **Improve examples**: Add more detailed examples to help users understand features

## Building the Documentation Locally

To build and preview the documentation on your local machine:

```bash
# Install required packages
pip install mkdocs mkdocs-material mkdocstrings mkdocstrings-python pymdown-extensions

# Run the development server
mkdocs serve

# Or use our validation script
./docs_check.sh
```

The documentation will be available at http://127.0.0.1:8000.

## Documentation Deployment

The documentation is automatically deployed to:

1. **GitHub Pages**: https://gadm21.github.io/LMS/ (via GitHub Actions)
2. **Vercel**: https://lms-swart-five.vercel.app/docs/ (alongside the application)

## Image Credits

All images used in this documentation are from [Unsplash](https://unsplash.com/) and [Pexels](https://www.pexels.com/), used with appropriate attribution to their creators.
