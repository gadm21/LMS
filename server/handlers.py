#!/usr/bin/env python3

"""
Request Handlers Module

This module contains the business logic for handling API requests.
It processes incoming requests, interacts with the AI agent, and formats responses.
"""

import logging
import json
import os
from typing import Dict, Any, List
import subprocess
from subprocess import CalledProcessError
from datetime import datetime
import traceback

from flask import jsonify

# Import MQTT client for active URL notifications
from server.mqtt import publish_message, connected as mqtt_connected


def handle_active_url_request(data):
    """Process an active URL update request from the client.
    
    Receives URL updates from the extension and forwards them via MQTT.
    
    Args:
        data (Dict): The request data containing the URL
    
    Returns:
        Dict: Response dictionary with status acknowledgment
    """
    try:
        logging.info(f"Received active URL: {data.get('url', 'N/A')}")

        # Publish to MQTT topic
        publish_success = publish_message("walnut/active_url", json.dumps(data))
        if publish_success:
            logging.info("Published URL update to MQTT topic walnut/active_url")

        return create_json_response({"status": "success"})

    except Exception as e:
        logging.error(f"Error handling active URL: {e}")
        logging.error(f"Full traceback: {traceback.format_exc()}")
        return create_json_response({"error": str(e)}, 500)


def handle_new_tab_info(tab_info: dict):
    """
    Handle information about a tab navigated by the user (received via MQTT).
    Generate an AI response about the page and send it back via MQTT.
    """
    if not mqtt_connected:
        logging.warning("MQTT not connected, cannot process tab info or send response.")
        return

    url = tab_info.get('url')
    title = tab_info.get('title', 'N/A')
    timestamp = tab_info.get('timestamp', datetime.now().isoformat())

    logging.info(f"Received tab info via MQTT: URL='{url}', Title='{title}'")

    if not url or url.startswith("chrome://") or url.startswith("about:"):
        logging.debug(f"Skipping AI processing for internal or invalid URL: {url}")
        return

    try:
        # Construct a prompt for the AI
        # Maybe fetch page content here first? For now, just use URL/Title
        prompt = f"The user has just navigated to a webpage.\nURL: {url}\nTitle: {title}\n\nBriefly describe what this page might be about or provide a relevant insight."

        # --- Call the AI ---
        # Option 1: Using a high-level function if available
        # ai_response_text = get_ai_response(prompt) # Assuming get_ai_response handles context, etc.

        # Option 2: Calling the core function directly (simpler for this example)
        ai_response = query_openai(prompt, max_tokens=100, temperature=0.5) # Adjust parameters as needed
        ai_response_text = ai_response.get("response", "Sorry, I couldn't generate a response for that page.")

        logging.info(f"Generated AI response for URL {url}: {ai_response_text[:100]}...") # Log snippet

        # --- Publish response back to the extension ---
        response_payload = {
            "message": ai_response_text,
            "source_url": url,
            "timestamp": datetime.now().isoformat()
        }
        publish_success = publish_message("ai/response", json.dumps(response_payload))

        if publish_success:
            logging.debug(f"Successfully published AI response to ai/response for URL: {url}")
        else:
            logging.warning(f"Failed to publish AI response to ai/response for URL: {url}")

    except Exception as e:
        logging.error(f"Error handling tab info for URL {url}: {e}", exc_info=True)
        # Optionally publish an error message back
        # publish_message("ai/response", json.dumps({"error": "Failed to process page info.", "source_url": url}))

# Ensure the old handle_active_url_request is still present if needed elsewhere
# def handle_active_url_request(data):
#     ...
