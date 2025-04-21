#!/usr/bin/env python3

"""
Flask Server Package for AI Chat Bot

This package contains the server components that act as a bridge between
the Chrome extension and the AI system. It provides a RESTful API for
handling queries and all aspects of the AI interaction flow.

Main components:
- app.py: Flask application setup and configuration
- routes.py: API endpoint definitions
- handlers.py: Business logic for processing requests
- mqtt.py: MQTT client for real-time notifications
"""

from server.app import create_app
from server.routes import register_routes
from server.handlers import handle_new_tab_info

__all__ = ["create_app", "register_routes", "handle_new_tab_info"]
