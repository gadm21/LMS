#!/usr/bin/env python3

"""
Flask Application Configuration Module

This module handles the setup and configuration of the Flask application.
It creates and configures the Flask app with appropriate settings and middleware.
"""

import logging

from flask import Flask
from flask_cors import CORS


def create_app(debug=False):
    """Create and configure the Flask application.

    Sets up the Flask app with CORS enabled and appropriate logging.

    Args:
        debug (bool): Whether to run the app in debug mode

    Returns:
        Flask: The configured Flask application

    Example:
        >>> app = create_app(debug=True)
        >>> app.run(host='0.0.0.0', port=5000)
    """
    logging.info(f"Creating Flask application (debug={debug})")

    # Create Flask application
    app = Flask(__name__)

    # Enable Cross-Origin Resource Sharing for the extension (allow all origins for dev)
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Configure application
    app.config["JSON_SORT_KEYS"] = False
    app.config["DEBUG"] = debug

    # Add global error handler
    @app.errorhandler(Exception)
    def handle_exception(e):
        import traceback
        return {
            "error": str(e),
            "trace": traceback.format_exc()
        }, 500

    # Return the configured app
    return app
