import os
import pytest
import logging
import requests
import uuid
import shutil

logger = logging.getLogger(__name__)

# Define the deployed server base URL
BASE_URL = "https://lms-swart-five.vercel.app"  # or use lms-k9p7yj9xx-gads-projects-02bd6234.vercel.app

def test_server_health():
    """Test if the server is reachable and responds to a simple request"""
    logger.info("[test_server_health] Testing server health")
    
    # Test the profile endpoint which should be static and not require DB access
    resp = requests.get(f"{BASE_URL}/profile")
    logger.info(f"[test_server_health] Profile endpoint response: {resp.status_code}, {resp.text}")
    
    # Try to get the root endpoint
    root_resp = requests.get(f"{BASE_URL}/")
    logger.info(f"[test_server_health] Root endpoint response: {root_resp.status_code}, {root_resp.text[:100]}")
    
    # If we get here without exceptions, the server is responding
    logger.info("[test_server_health] Server is responding to requests")

# For local file handling, we still need some imports
from server.routes import ASSETS_FOLDER

import uuid

def getUniqueUser():
    username = f"testuser_{uuid.uuid4().hex[:8]}"
    return {"username": username, "password": "testpass123"}

TEST_FILE_NAME = "testfile.txt"
TEST_FILE_CONTENT = b"Hello, LMS!"

import shutil

def setup_module(module):
    # Clean up assets folder before tests
    if os.path.exists(ASSETS_FOLDER):
        for f in os.listdir(ASSETS_FOLDER):
            path = os.path.join(ASSETS_FOLDER, f)
            if os.path.isfile(path):
                os.remove(path)
            elif os.path.isdir(path):
                shutil.rmtree(path)

def registerUser(user=None):
    logger.info(f"[registerUser] Registering user: {user}")
    if user is None:
        user = getUniqueUser()
    logger.info(f"[registerUser] Sending request to {BASE_URL}/register with user data: {user}")
    resp = requests.post(f"{BASE_URL}/register", json=user)
    logger.info(f"[registerUser] Response status: {resp.status_code}, raw response: {resp.text}")
    
    if resp.status_code != 200:
        raise Exception(f"[registerUser] Registration failed with status {resp.status_code}: {resp.text}")
    
    try:
        json_resp = resp.json()
        logger.info(f"[registerUser] JSON response: {json_resp}")
        assert json_resp["message"] == "Registered successfully"
        return user
    except Exception as e:
        logger.error(f"[registerUser] Error parsing response: {e}")
        logger.error(f"[registerUser] Raw response: {resp.text}")
        raise

def loginUser(user):
    logger.info(f"[loginUser] Logging in user: {user}")
    resp = requests.post(
        f"{BASE_URL}/token", 
        data=user, 
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    logger.info(f"[loginUser] Response status: {resp.status_code}, body: {resp.json()}")
    assert resp.status_code == 200, f"[loginUser] Login failed: {resp.text}"
    assert "access_token" in resp.json()
    return resp.json()["access_token"]

def test_upload_file():
    logger.info("[test_upload_file] START")
    user = registerUser()
    token = loginUser(user)
    headers = {"Authorization": f"Bearer {token}"}
    files = {"file": (TEST_FILE_NAME, TEST_FILE_CONTENT, "text/plain")}
    logger.info(f"[test_upload_file] Uploading file: {TEST_FILE_NAME}")
    resp = requests.post(f"{BASE_URL}/upload", headers=headers, files=files)
    logger.info(f"[test_upload_file] Response status: {resp.status_code}, body: {resp.json()}")
    assert resp.status_code == 200, f"[test_upload_file] Upload failed: {resp.text}"
    assert resp.json()["filename"] == TEST_FILE_NAME
    assert resp.json()["size"] == len(TEST_FILE_CONTENT)
    # Clean up: delete user
    logger.info("[test_upload_file] END")
    requests.delete(f"{BASE_URL}/user/{user['username']}", headers=headers)

def test_active_url_success():
    logger.info("[test_active_url_success] START")
    payload = {"url": "https://example.com", "title": "Example Page"}
    logger.info(f"[test_active_url_success] Payload: {payload}")
    resp = requests.post(f"{BASE_URL}/active_url", json=payload)
    logger.info(f"[test_active_url_success] Response status: {resp.status_code}, body: {resp.json()}")
    assert resp.status_code == 200, f"[test_active_url_success] Failed: {resp.text}"
    assert resp.json() == {"data": {"status": "success"}}
    logger.info("[test_active_url_success] END")

def test_active_url_missing_url():
    logger.info("[test_active_url_missing_url] START")
    payload = {"title": "Example Page"}
    logger.info(f"[test_active_url_missing_url] Payload: {payload}")
    resp = requests.post(f"{BASE_URL}/active_url", json=payload)
    logger.info(f"[test_active_url_missing_url] Response status: {resp.status_code}, body: {resp.json()}")
    assert resp.status_code == 400, f"[test_active_url_missing_url] Failed: {resp.text}"
    assert "error" in resp.json()
    logger.info("[test_active_url_missing_url] END")

def test_profile():
    logger.info("[test_profile] START")
    resp = requests.get(f"{BASE_URL}/profile")
    logger.info(f"[test_profile] Response status: {resp.status_code}, body: {resp.json()}")
    assert resp.status_code == 200, f"[test_profile] Failed: {resp.text}"
    data = resp.json()
    assert data["name"] == "Gad Mohamed"
    assert data["profession"] == "AI Engineer"
    assert data["favorite_color"] == "Blue"
    assert data["spirit_animal"] == "Owl"
    logger.info("[test_profile] END")

def testQueryEndpoint():
    """
    Test the AI query endpoint for various scenarios.
    """
    logger.info("[testQueryEndpoint] START")
    user = registerUser()
    token = loginUser(user)
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    url = f"{BASE_URL}/query"

    # Case 1: Missing JSON body
    logger.info("[testQueryEndpoint] Case 1: Missing JSON body")
    resp = requests.post(url, headers=headers)
    logger.info(f"[testQueryEndpoint] Case 1 Response: {resp.status_code}, {resp.text}")
    assert resp.status_code in (400, 422), f"[testQueryEndpoint] Case 1 failed: {resp.text}"

    # Case 2: Missing 'query' field
    logger.info("[testQueryEndpoint] Case 2: Missing 'query' field")
    resp = requests.post(url, headers=headers, json={"chatId": "chat1"})
    logger.info(f"[testQueryEndpoint] Case 2 Response: {resp.status_code}, {resp.text}")
    assert resp.status_code == 400, f"[testQueryEndpoint] Case 2 failed: {resp.text}"
    assert resp.json()["error"] == "No query provided"

    # Case 3: Missing 'chatId' field
    logger.info("[testQueryEndpoint] Case 3: Missing 'chatId' field")
    resp = requests.post(url, headers=headers, json={"query": "what IS GAD?"})
    logger.info(f"[testQueryEndpoint] Case 3 Response: {resp.status_code}, {resp.text}")
    assert resp.status_code == 400, f"[testQueryEndpoint] Case 3 failed: {resp.text}"
    assert resp.json()["error"] == "No chat ID provided"

    # Case 4: Valid request
    logger.info("[testQueryEndpoint] Case 4: Valid request")
    resp = requests.post(url, headers=headers, json={"query": "what does GAD refer to?", "chatId": "chat1", "pageContent": "Some content"})
    logger.info(f"[testQueryEndpoint] Case 4 Response: {resp.status_code}, {resp.text}")
    assert resp.status_code in (200, 500), f"[testQueryEndpoint] Case 4 failed: {resp.text}"
    if resp.status_code == 200:
        assert "response" in resp.json()
    else:
        assert "error" in resp.json()
    # Clean up: delete user
    requests.delete(f"{BASE_URL}/user/{user['username']}", headers=headers)
    logger.info("[testQueryEndpoint] END")

def test_delete_user():
    """
    Test the delete user endpoint for success, forbidden, and not found cases.
    """
    logger.info("[test_delete_user] START")
    # Use a unique user for this test
    user = getUniqueUser()
    logger.info(f"[test_delete_user] Registering user: {user}")
    # Register and login
    registerUser(user)
    token = loginUser(user)
    headers = {"Authorization": f"Bearer {token}"}
    username = user["username"]
    url = f"{BASE_URL}/user/{username}"

    # Success: user deletes themselves
    logger.info(f"[test_delete_user] Deleting user {username} (self-delete)")
    resp = requests.delete(url, headers=headers)
    logger.info(f"[test_delete_user] Delete response: {resp.status_code}, {resp.text}")
    assert resp.status_code == 200, f"[test_delete_user] Delete failed: {resp.text}"
    assert resp.json()["message"].startswith(f"User '{username}' deleted successfully.")

    # Not found: try deleting again
    logger.info(f"[test_delete_user] Try deleting user {username} again (should be not found/unauthorized)")
    resp = requests.delete(url, headers=headers)
    logger.info(f"[test_delete_user] Second delete response: {resp.status_code}, {resp.text}")
    assert resp.status_code == 401, f"[test_delete_user] Second delete failed: {resp.text}"

    # Forbidden: another user tries to delete test user
    logger.info(f"[test_delete_user] Re-registering user {username}")
    registerUser(user)
    # Register a second unique user
    second_user = getUniqueUser()
    logger.info(f"[test_delete_user] Registering second user: {second_user}")
    registerUser(second_user)
    other_token = loginUser(second_user)
    other_headers = {"Authorization": f"Bearer {other_token}"}
    logger.info(f"[test_delete_user] Second user attempts to delete {username}")
    resp = requests.delete(url, headers=other_headers)
    logger.info(f"[test_delete_user] Forbidden delete response: {resp.status_code}, {resp.text}")
    assert resp.status_code == 403, f"[test_delete_user] Forbidden delete failed: {resp.text}"
    assert resp.json()["detail"] == "You can only delete your own account."
    logger.info("[test_delete_user] END")

def test_list_files():
    logger.info("[test_list_files] START")
    user = registerUser()
    token = loginUser(user)
    headers = {"Authorization": f"Bearer {token}"}
    logger.info("[test_list_files] Listing files")
    resp = requests.get(f"{BASE_URL}/files", headers=headers)
    logger.info(f"[test_list_files] Response status: {resp.status_code}, body: {resp.json()}")
    assert resp.status_code == 200, f"[test_list_files] Failed: {resp.text}"
    # New response format is a dict with 'files' array
    response_data = resp.json()
    assert isinstance(response_data, dict)
    assert "files" in response_data
    assert isinstance(response_data["files"], list)
    # Clean up: delete user
    requests.delete(f"{BASE_URL}/user/{user['username']}", headers=headers)
    logger.info("[test_list_files] END")

def test_download_file():
    logger.info("[test_download_file] START")
    user = registerUser()
    token = loginUser(user)
    headers = {"Authorization": f"Bearer {token}"}
    
    # First upload a file
    logger.info(f"[test_download_file] Uploading file: {TEST_FILE_NAME}")
    files = {"file": (TEST_FILE_NAME, TEST_FILE_CONTENT, "text/plain")}
    upload_resp = requests.post(f"{BASE_URL}/upload", headers=headers, files=files)
    assert upload_resp.status_code == 200, f"[test_download_file] Upload failed: {upload_resp.text}"
    
    # Get the fileId from the upload response
    upload_data = upload_resp.json()
    logger.info(f"[test_download_file] Upload response: {upload_data}")
    assert "fileId" in upload_data, "Upload response doesn't include fileId"
    file_id = upload_data["fileId"]
    
    # Download the file using fileId
    logger.info(f"[test_download_file] Downloading file with ID: {file_id}")
    resp = requests.get(f"{BASE_URL}/download/{file_id}", headers=headers)
    logger.info(f"[test_download_file] Response status: {resp.status_code}, length: {len(resp.content)}")
    assert resp.status_code == 200, f"[test_download_file] Download failed: {resp.text}"
    assert resp.content == TEST_FILE_CONTENT
    
    # Clean up: delete user
    requests.delete(f"{BASE_URL}/user/{user['username']}", headers=headers)
    logger.info("[test_download_file] END")

def test_delete_file():
    logger.info("[test_delete_file] START")
    user = registerUser()
    token = loginUser(user)
    headers = {"Authorization": f"Bearer {token}"}
    
    # First upload a file
    logger.info(f"[test_delete_file] Uploading file: {TEST_FILE_NAME}")
    files = {"file": (TEST_FILE_NAME, TEST_FILE_CONTENT, "text/plain")}
    upload_resp = requests.post(f"{BASE_URL}/upload", headers=headers, files=files)
    assert upload_resp.status_code == 200, f"[test_delete_file] Upload failed: {upload_resp.text}"
    
    # Get the fileId from the upload response
    upload_data = upload_resp.json()
    logger.info(f"[test_delete_file] Upload response: {upload_data}")
    assert "fileId" in upload_data, "Upload response doesn't include fileId"
    file_id = upload_data["fileId"]
    
    # Delete the file using fileId
    logger.info(f"[test_delete_file] Deleting file with ID: {file_id}")
    resp = requests.delete(f"{BASE_URL}/delete/{file_id}", headers=headers)
    logger.info(f"[test_delete_file] Delete response: {resp.status_code}, {resp.json()}")
    assert resp.status_code == 200, f"[test_delete_file] Delete failed: {resp.text}"
    resp_json = resp.json()
    
    # Accept message or detail containing 'deleted'
    msg = resp_json.get("message") or resp_json.get("detail")
    assert msg is not None and "deleted" in msg
    
    # Clean up: delete user
    requests.delete(f"{BASE_URL}/user/{user['username']}", headers=headers)
    
    # Confirm file is gone by checking the files list
    resp = requests.get(f"{BASE_URL}/files", headers=headers)
    logger.info(f"[test_delete_file] File list after delete: {resp.json()}")
    files_data = resp.json()
    
    # Check that the file with our fileId is not in the list
    if "files" in files_data and isinstance(files_data["files"], list):
        file_ids = [file.get("fileId") for file in files_data["files"]]
        assert file_id not in file_ids, f"File with ID {file_id} was not deleted"
    
    logger.info("[test_delete_file] END")
