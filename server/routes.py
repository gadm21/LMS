#!/usr/bin/env python3

"""
API Routes Module

This module defines the API routes for the Flask server.
It registers all the API endpoints and their handlers.
"""

import logging
import os
import re
import time
import sys
import platform
import psutil
import traceback
from datetime import datetime

from flask import Blueprint, request, jsonify

from server.logging_utils import (
    log_server_lifecycle, log_server_health, log_request_start,
    log_request_payload, log_validation, log_ai_call,
    log_ai_response, log_file_operation, log_response, log_error
)

from aiagent.handler.query import ask_ai

# Configure logger
logger = logging.getLogger(__name__)

# Environment information
SERVER_ENV = os.environ.get('SERVER_ENV', 'development')

main_bp = Blueprint('main', __name__)

# References directory
REFERENCES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'references')
os.makedirs(REFERENCES_DIR, exist_ok=True)

@main_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for backend connectivity verification.
    
    Returns:
        JSON response with status 'ok' to indicate server is running.
    """
    try:
        # Log request
        logger.info(f"[SERVER] Health check requested from {request.remote_addr}")
        
        # Collect basic system metrics
        system_info = {
            "memory_usage_percent": psutil.virtual_memory().percent,
            "cpu_usage_percent": psutil.cpu_percent(interval=0.1),
            "timestamp": datetime.now().isoformat()
        }
        
        # Log system health
        log_server_health()
        
        return jsonify({"status": "ok", "system": system_info}), 200
    except Exception as e:
        logger.error(f"[SERVER] Health check error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@main_bp.route('/query', methods=['POST'])
def query():
    """Handle AI queries."""
    try:
        # Log request start
        log_request_start('/query', request.method, request.headers, request.remote_addr)
        
        # Get and log payload
        try:
            data = request.get_json(force=True)
        except Exception as e:
            import werkzeug.exceptions
            if isinstance(e, werkzeug.exceptions.BadRequest):
                log_error("Invalid JSON format", e, {"endpoint": "/query"}, "/query")
                return jsonify({"error": "Invalid JSON format"}), 400
            raise
        log_request_payload(data, '/query')
        
        # Validate query
        if data is None or data == {}:
            log_error("No JSON data provided", None, {"endpoint": "/query"}, "/query")
            return jsonify({"error": "No JSON data provided"}), 400
        query_text = data.get('query', '')
        log_validation('query', query_text, bool(query_text), '/query')
        if not query_text or not query_text.strip():
            log_error("No query provided", None, {"endpoint": "/query"}, "/query")
            return jsonify({"error": "No query provided"}), 400
        
        # Log page content details if present
        page_content = data.get('pageContent', '') if data else ''
        if page_content:
            logger.info(f"[SERVER] Page content length: {len(page_content)}")
            logger.debug(f"[SERVER] Page content type: {type(page_content).__name__}")
        
        # Chat Id 
        chat_id = data.get('chatId', '') if data else ''
        
        # Log chat id
        logger.info(f"[SERVER] Chat ID: {chat_id}")
        log_validation('chatId', chat_id, bool(chat_id), '/query')
        if not chat_id or not chat_id.strip():
            log_error("No chat ID provided", None, {"endpoint": "/query"}, "/query")
            return jsonify({"error": "No chat ID provided"}), 400


        # Log AI call
        logger.info(f"[SERVER] Processing query: {query_text[:50]}...")
        log_ai_call(query_text, "gpt-3.5-turbo", '/query')
        
        # Get AI response
        start_time = time.time()
        response = ask_ai(query_text, aux_data={"page_content":page_content})
        duration = time.time() - start_time
        
        # Log AI response information
        log_ai_response(response, '/query')
        logger.info(f"[SERVER] AI response time: {duration:.2f} seconds")
        
        # Log response
        result = {"response": response}
        log_response(200, result, '/query')
        return jsonify(result), 200
    except Exception as e:
        # Log errors
        import werkzeug.exceptions
        if isinstance(e, werkzeug.exceptions.BadRequest):
            return jsonify({"error": "Invalid JSON format"}), 400
        log_error(str(e), e, {"endpoint": "/query", "query": query_text if 'query_text' in locals() else ''}, "/query")
        return jsonify({"error": str(e)}), 500

@main_bp.route('/tab-info', methods=['POST'])
def tab_info():
    """Receive tab information."""
    try:
        # Log request start
        log_request_start('/tab-info', request.method, request.headers, request.remote_addr)
        
        # Get and log payload
        data = request.get_json(silent=True)
        log_request_payload(data, '/tab-info')
        
        # Validate fields
        title = data.get('title', '') if data else ''
        url = data.get('url', '') if data else ''
        tab_id = data.get('tabId', '') if data else ''
        
        log_validation('title', title, bool(title), '/tab-info')
        log_validation('url', url, bool(url), '/tab-info')
        log_validation('tabId', tab_id, bool(tab_id), '/tab-info')
        
        if not title or not url:
            log_error("Missing title or URL", None, {"endpoint": "/tab-info", "data": data}, "/tab-info")
            return jsonify({"status": "error", "message": "Missing title or URL"}), 400
        
        # Log additional tab details
        logger.info(f"[SERVER] Tab ID: {tab_id}")
        logger.info(f"[SERVER] URL domain: {url.split('/')[2] if '//' in url else 'unknown'}")
        logger.info(f"[SERVER] Title length: {len(title)}")
        
        # Log MQTT status if available
        try:
            from server.mqtt import is_connected, publish_message
            logger.info(f"[SERVER] MQTT connected: {is_connected()}")
            if is_connected():
                logger.info(f"[SERVER] Publishing to MQTT topic: walnut/active_url")
        except ImportError:
            logger.info("[SERVER] MQTT module not available")
        
        # Log response
        response = {"status": "success", "message": "Tab info received", "title": title}
        log_response(200, response, '/tab-info')
        
        return jsonify(response), 200
    except Exception as e:
        # Log errors
        log_error(str(e), e, {"endpoint": "/tab-info"}, "/tab-info")
        return jsonify({"status": "error", "message": str(e)}), 500

@main_bp.route('/save-page', methods=['POST'])
def save_page_extensive_logging():
    """Save webpage HTML to references folder."""
    try:
        # Log request start
        logger.info('Received save request')
        logger.debug(f'Save request data: {request.get_json()}')
        
        # Get and log payload
        data = request.get_json(silent=True)
        log_request_payload(data, '/save-page')
        
        # Validate fields
        title = data.get('title', 'untitled') if data else 'untitled'
        html = data.get('html', '') if data else ''
        
        log_validation('title', title, bool(title), '/save-page')
        log_validation('html', html, bool(html), '/save-page')
        
        if not html:
            log_error("No HTML content provided", None, {"endpoint": "/save-page"}, "/save-page")
            return jsonify({"status": "error", "message": "No HTML content"}), 400
        
        # Log HTML content details
        logger.info(f"[SERVER] HTML content size: {len(html)} bytes")
        
        # Sanitize and prepare filename
        logger.info(f"[SERVER] Sanitizing title: {title}")
        title = re.sub(r'[^\w\s-]', '', title).replace(' ', '_')[:50]
        filename = f"{title}_{int(time.time())}.html"
        file_path = os.path.join(REFERENCES_DIR, filename)
        logger.info(f"[SERVER] Generated filename: {filename}")
        
        # Save file and log operation
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(html)
        
        log_file_operation('write', file_path, True, '/save-page')
        
        # Log response
        response = {"status": "success", "message": "Saved", "path": file_path}
        log_response(200, response, '/save-page')
        
        # Log processing started
        logger.info('Processing save request')
        logger.debug('Save request processing started')
        
        # Log processing completed
        logger.info('Save request processed successfully')
        logger.debug('Save request processing completed')
        
        return jsonify(response)
    except Exception as e:
        # Log file operation failure if path is defined
        if 'file_path' in locals():
            log_file_operation('write', file_path, False, '/save-page')
        
        # Log errors
        log_error(str(e), e, {"endpoint": "/save-page"}, "/save-page")
        return jsonify({"status": "error", "message": str(e)}), 500

@main_bp.route('/translate', methods=['POST'])
def translate_extensive_logging():
    """Translate HTML page text to specified language, preserving tags."""
    try:
        # Log request start
        logger.info('Received translate request')
        logger.debug(f'Translate request data: {request.get_json()}')
        
        # Get and log payload
        data = request.get_json(silent=True)
        log_request_payload(data, '/translate')
        
        # Validate fields
        html = data.get('html', '') if data else ''
        language = data.get('language', '') if data else ''
        
        log_validation('html', html, bool(html), '/translate')
        log_validation('language', language, bool(language), '/translate')
        
        if not html or not language:
            log_error("Missing HTML or language", None, {"endpoint": "/translate"}, "/translate")
            return jsonify({"status": "error", "message": "Missing HTML or language"}), 400
        
        # Log translation request details
        logger.info(f"[SERVER] Target language: {language}")
        logger.info(f"[SERVER] HTML size for translation: {len(html)} bytes")
        
        # Prepare query for translation
        query = (
            f"Translate all text content in the following HTML to {language}, "
            f"preserving all HTML tags and structure unchanged. Ensure the output is a valid, "
            f"functional HTML file with only the text translated:\n{html[:50000]}"
        )
        
        # Log AI call for translation
        log_ai_call(query, "gpt-3.5-turbo", '/translate')
        
        # Get AI response with timing
        start_time = time.time()
        translated_html = ask_ai(query)
        duration = time.time() - start_time
        
        # Log AI response information
        log_ai_response(translated_html, '/translate')
        logger.info(f"[SERVER] Translation time: {duration:.2f} seconds")
        
        # Log response
        logger.info(f"[SERVER] Translated content size: {len(translated_html)} bytes")
        log_response(200, "HTML content (not shown in logs)", '/translate')
        
        # Log processing started
        logger.info('Processing translate request')
        logger.debug('Translate request processing started')
        
        # Log processing completed
        logger.info('Translate request processed successfully')
        logger.debug('Translate request processing completed')
        
        # Return JSON with translation for client-side rendering
        return jsonify({
            "status": "success", 
            "translation": translated_html,
            "language": language,
            "timing": duration
        })
    except Exception as e:
        # Log errors
        log_error(str(e), e, {"endpoint": "/translate", "language": language if 'language' in locals() else "unknown"}, "/translate")
        return jsonify({"status": "error", "message": str(e)}), 500

@main_bp.route('/summarize', methods=['POST'])
def summarize_extensive_logging():
    """Generate HTML summary of page content using OpenAI's latest model and long-term memory."""
    try:
        import json
        # Log request start
        logger.info('Received summarize request')
        logger.debug(f'Summarize request data: {request.get_json()}')
        # Get and log payload
        data = request.get_json(silent=True)
        log_request_payload(data, '/summarize')
        # Validate fields
        content = data.get('content', '') if data else ''
        title = data.get('title', 'Summary') if data else 'Summary'
        url = data.get('url', '') if data else ''
        log_validation('content', content, bool(content), '/summarize')
        log_validation('title', title, bool(title), '/summarize')
        log_validation('url', url, bool(url), '/summarize')
        if not content:
            log_error("No content provided for summary", None, {"endpoint": "/summarize"}, "/summarize")
            return jsonify({"status": "error", "message": "No content"}), 400
        # Log content details
        logger.info(f"[SERVER] Content size for summarization: {len(content)} bytes")
        if url:
            logger.info(f"[SERVER] Content source URL: {url}")

        # Prepare query for summarization
        prompt = (
            f"You are an expert summarizer. Summarize the following HTML page content. "
            f"Focus on clarity, actionable insights, and brevity. Use <h1>, <h2>, <ul>, <p> as appropriate, Return a valid HTML page. "
        )
        # Log AI call
        model = "gpt-4-turbo"  # Use latest model
        log_ai_call(prompt, model, '/summarize')
        # Get AI response with timing
        start_time = time.time()
        
        summary_html = ask_ai(prompt, aux_data={"page_content": content})
        duration = time.time() - start_time
        # Log AI response information
        log_ai_response(summary_html, '/summarize')
        logger.info(f"[SERVER] Summarization time: {duration:.2f} seconds")
        # Log response
        logger.info(f"[SERVER] Summary HTML size: {len(summary_html)} bytes")
        log_response(200, "HTML content (not shown in logs)", '/summarize')
        # Log processing started
        logger.info('Processing summarize request')
        logger.debug('Summarize request processing started')
        # Log processing completed
        logger.info('Summarize request processed successfully')
        logger.debug('Summarize request processing completed')
        return summary_html, 200, {'Content-Type': 'text/html'}
    except Exception as e:
        # Log errors
        log_error(str(e), e, {"endpoint": "/summarize", "title": title if 'title' in locals() else "unknown"}, "/summarize")
        return jsonify({"status": "error", "message": str(e)}), 500

@main_bp.route('/bookmark', methods=['POST'])
def bookmark_extensive_logging():
    """Bookmark webpage."""
    try:
        # Log request start
        logger.info('Received bookmark request')
        logger.debug(f'Bookmark request data: {request.get_json()}')
        
        # Get and log payload
        data = request.get_json(silent=True)
        log_request_payload(data, '/bookmark')
        
        # Validate fields
        url = data.get('url', '') if data else ''
        title = data.get('title', '') if data else ''
        
        log_validation('url', url, bool(url), '/bookmark')
        log_validation('title', title, bool(title), '/bookmark')
        
        if not url or not title:
            log_error("Missing URL or title", None, {"endpoint": "/bookmark"}, "/bookmark")
            return jsonify({"status": "error", "message": "Missing URL or title"}), 400
        
        # Log bookmark details
        logger.info(f"[SERVER] Bookmark URL: {url}")
        logger.info(f"[SERVER] Bookmark title: {title}")
        
        # Log processing started
        logger.info('Processing bookmark request')
        logger.debug('Bookmark request processing started')
        
        # Log processing completed
        logger.info('Bookmark request processed successfully')
        logger.debug('Bookmark request processing completed')
        
        return jsonify({"status": "success", "message": "Bookmark saved"})
    except Exception as e:
        # Log errors
        log_error(str(e), e, {"endpoint": "/bookmark"}, "/bookmark")
        return jsonify({"status": "error", "message": str(e)}), 500

def register_routes(app):
    """Register all API routes with the Flask application.

    Sets up the /query, /health, /active_url, /tab-info, /save-page, /translate, and /summarize endpoints with their respective handlers.

    Args:
        app: The Flask application

    Example:
        >>> app = create_app()
        >>> register_routes(app)
    """
    # Log server startup and route registration
    log_server_lifecycle('route_registration', {
        "app_name": app.name,
        "environment": SERVER_ENV,
        "timestamp": datetime.now().isoformat()
    })
    
    # Log system information
    logger.info(f"[SERVER] Python version: {platform.python_version()}")
    logger.info(f"[SERVER] Platform: {platform.platform()}")
    logger.info(f"[SERVER] Hostname: {platform.node()}")
    logger.info(f"[SERVER] CPU count: {os.cpu_count()}")
    
    # Log server resources
    log_server_health()
    
    # Log reference directory info
    logger.info(f"[SERVER] References directory: {os.path.abspath(REFERENCES_DIR)}")
    logger.info(f"[SERVER] References directory exists: {os.path.exists(REFERENCES_DIR)}")
    if os.path.exists(REFERENCES_DIR):
        file_count = len([f for f in os.listdir(REFERENCES_DIR) if os.path.isfile(os.path.join(REFERENCES_DIR, f))])
        logger.info(f"[SERVER] References file count: {file_count}")
        dir_size = sum(os.path.getsize(os.path.join(REFERENCES_DIR, f)) for f in os.listdir(REFERENCES_DIR) if os.path.isfile(os.path.join(REFERENCES_DIR, f)))
        logger.info(f"[SERVER] References directory size: {dir_size / (1024*1024):.2f} MB")
    
    # Register blueprint with Flask app
    logger.info(f"[SERVER] Registering blueprint: {main_bp.name}")
    logger.info(f"[SERVER] Blueprint URL prefix: {main_bp.url_prefix or 'None'}")
    app.register_blueprint(main_bp)
    
    # Log all registered routes
    logger.info(f"[SERVER] Registered routes:")
    for rule in app.url_map.iter_rules():
        logger.info(f"[SERVER] Route: {rule.endpoint} - {rule}")
        logger.info(f"[SERVER] Methods: {', '.join(rule.methods)}")
        
    # Log which custom endpoints are available
    logger.info(f"[SERVER] Health check endpoint available at: /health (GET)")
    logger.info(f"[SERVER] Tab info endpoint available at: /tab-info (POST)")
    logger.info(f"[SERVER] Query endpoint available at: /query (POST)")
    
    # Log completion of route registration
    logger.info(f"[SERVER] Route registration complete at: {datetime.now().isoformat()}")
    logger.info(f"[SERVER] Server ready to handle requests")

# Import handlers
# from server.handlers import handle_active_url_request, handle_query

@main_bp.route("/active_url", methods=["POST"])
def active_url():
    """Receive active URL updates from the extension and forward via MQTT.
    
    Expected POST data:
        url (str): The current active URL
        title (str, optional): The page title
    
    Returns:
        JSON response with status acknowledgment
    """
    try:
        # Log request start
        log_request_start('/active_url', request.method, request.headers, request.remote_addr)
        
        # Get and log payload
        data = request.get_json(silent=True)
        log_request_payload(data, '/active_url')
        
        # Validate fields
        url = data.get('url', '') if data else ''
        title = data.get('title', '') if data else ''
        
        log_validation('url', url, bool(url), '/active_url')
        log_validation('title', title, bool(title), '/active_url')
        
        if data is None:
            log_error("No JSON data provided", None, {"endpoint": "/active_url"}, "/active_url")
            return jsonify({"error": "No JSON data provided"}), 400
        if not url:
            log_error("Missing URL", None, {"endpoint": "/active_url"}, "/active_url")
            return jsonify({"error": "Missing URL"}), 400
        
        # Log URL details
        logger.info(f"[SERVER] Active URL: {url[:100]}")
        if title:
            logger.info(f"[SERVER] Page title: {title[:50]}")
        
        # Attempt MQTT publish if module available
        try:
            from server.mqtt import is_connected, publish_message
            if is_connected():
                publish_message('walnut/active_url', {'url': url, 'title': title})
                logger.info(f"[SERVER] Published active URL to MQTT")
            else:
                logger.warning(f"[SERVER] MQTT not connected, unable to publish active URL")
        except ImportError:
            logger.warning(f"[SERVER] MQTT module not available")
        
        # Log response
        response = {"data": {"status": "success"}}
        log_response(200, response, '/active_url')
        return jsonify(response), 200
    except Exception as e:
        # Log errors
        log_error(str(e), e, {"endpoint": "/active_url"}, "/active_url")
        return jsonify({"error": str(e)}), 500

@main_bp.route("/unique_query", methods=["POST"], endpoint="unique_query")
def unique_query():
    """
    Endpoint for handling AI query requests.
    Expects a JSON payload with query data.
    Returns the AI's response to the query.
    """
    try:
        # Log request start
        log_request_start('/unique_query', request.method, request.headers, request.remote_addr)
        
        # Get and log payload
        data = request.get_json(silent=True)
        log_request_payload(data, '/unique_query')
        
        if not data:
            log_error("No JSON data provided", None, {"endpoint": "/unique_query"}, "/unique_query")
            return jsonify({"error": "No JSON data provided"}), 400

        # Extract and validate query
        query_text = data.get("query", "")
        log_validation('query', query_text, bool(query_text), '/unique_query')
        
        if not query_text:
            log_error("No query provided", None, {"endpoint": "/unique_query"}, "/unique_query")
            return jsonify({"error": "No query provided"}), 400
        
        # Log other parameters
        page_content = data.get("page_content", "")
        if page_content:
            logger.info(f"[SERVER] Page content length: {len(page_content)}")
        
 
        # Log handler call
        logger.info(f"[SERVER] Processing query: {query_text[:50]}...")
        logger.info(f"[SERVER] Calling query handler")
        
        # Get AI response with timing
        start_time = time.time()
        response = ask_ai(query_text, aux_data={"page_content": page_content})
        duration = time.time() - start_time
        
        # Log AI response information
        log_ai_response(response, '/unique_query')
        logger.info(f"[SERVER] Query processing time: {duration:.2f} seconds")
        
        # Log response
        result = {"response": response}
        log_response(200, result, '/unique_query')
        
        return jsonify(result)
    except ValueError as e:
        # Log validation errors
        log_error(f"Invalid JSON format: {str(e)}", e, {"endpoint": "/unique_query"}, "/unique_query")
        return jsonify({"error": "Invalid JSON format"}), 400
    except Exception as e:
        # Log unexpected errors
        log_error(f"Unexpected error: {str(e)}", e, {"endpoint": "/unique_query"}, "/unique_query")
        return jsonify({"error": "Internal server error"}), 500

@main_bp.route('/profile', methods=['GET'])
def profile():
    """Return hardcoded user profile info as JSON."""
    return jsonify({
        "name": "Gad Mohamed",
        "profession": "AI Engineer",
        "favorite_color": "Blue",
        "spirit_animal": "Owl"
    }), 200
