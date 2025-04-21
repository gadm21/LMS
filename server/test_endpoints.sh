#!/bin/bash

# Test script for Walnut AI Chat Bot backend endpoints

# Set the server URL
SERVER_URL="http://127.0.0.1:8055"

# Set log file
LOG_FILE="/Users/gadmohamed/Desktop/walnut/bot/server/test_endpoints_log.txt"

# Function to log messages
echo_log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Test /query endpoint
echo_log "Testing /query endpoint"
curl -X POST -H "Content-Type: application/json" -d '{"query": "What is the capital of France?"}' $SERVER_URL/query -o /tmp/query_response.json
cat /tmp/query_response.json | tee -a $LOG_FILE
echo_log ""

# Test /tab-info endpoint
echo_log "Testing /tab-info endpoint"
curl -X POST -H "Content-Type: application/json" -d '{"title": "Test Page", "url": "https://example.com", "tabId": "123"}' $SERVER_URL/tab-info -o /tmp/tab_info_response.json
cat /tmp/tab_info_response.json | tee -a $LOG_FILE
echo_log ""

# Test /save-page endpoint
echo_log "Testing /save-page endpoint"
curl -X POST -H "Content-Type: application/json" -d '{"title": "Test Save", "html": "<html><body>Test content</body></html>"}' $SERVER_URL/save-page -o /tmp/save_page_response.json
cat /tmp/save_page_response.json | tee -a $LOG_FILE
echo_log ""

# Test /translate endpoint
echo_log "Testing /translate endpoint"
curl -X POST -H "Content-Type: application/json" -d '{"html": "<p>Hello, world!</p>", "language": "Spanish"}' $SERVER_URL/translate -o /tmp/translate_response.json
cat /tmp/translate_response.json | tee -a $LOG_FILE
echo_log ""

# Test /summarize endpoint
echo_log "Testing /summarize endpoint"
curl -X POST -H "Content-Type: application/json" -d '{"content": "This is a long piece of content that needs summarization.", "title": "Test Summary", "url": "https://example.com"}' $SERVER_URL/summarize -o /tmp/summarize_response.html
cat /tmp/summarize_response.html | tee -a $LOG_FILE
echo_log ""

# Test /bookmark endpoint
echo_log "Testing /bookmark endpoint"
curl -X POST -H "Content-Type: application/json" -d '{"url": "https://example.com", "title": "Test Bookmark"}' $SERVER_URL/bookmark -o /tmp/bookmark_response.json
cat /tmp/bookmark_response.json | tee -a $LOG_FILE
echo_log ""

# Test /active_url endpoint
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Testing /active_url endpoint" | tee -a "$LOG_FILE"
curl -s -X POST -H "Content-Type: application/json" -d '{"url": "https://example.com", "title": "Example Page"}' "$SERVER_URL/active_url" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
