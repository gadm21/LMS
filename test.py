import os
import pytest
from fastapi.testclient import TestClient
import main
from main import app, Base, User, ASSETS_FOLDER
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient


TEST_DATABASE_URL = "postgresql+psycopg2://lms_user:lms_password@localhost:5432/lms_db_test"
test_engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(bind=test_engine)

# Patch main.py's engine and SessionLocal to use the test versions
main.engine = test_engine
main.SessionLocal = TestingSessionLocal

# Now create tables using the test engine
Base.metadata.create_all(bind=test_engine)

# Patch app dependencies to use the test DB
app.dependency_overrides = {}

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
app.dependency_overrides[main.get_db] = override_get_db

client = TestClient(app)

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
    if user is None:
        user = getUniqueUser()
    resp = client.post("/register", json=user)
    assert resp.status_code == 200
    assert resp.json()["message"] == "Registered successfully"
    return user

def loginUser(user):
    resp = client.post("/token", data=user, headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert resp.status_code == 200
    assert "access_token" in resp.json()
    return resp.json()["access_token"]

def test_upload_file():
    user = registerUser()
    token = loginUser(user)
    headers = {"Authorization": f"Bearer {token}"}
    files = {"file": (TEST_FILE_NAME, TEST_FILE_CONTENT, "text/plain")}
    resp = client.post("/upload", headers=headers, files=files)
    assert resp.status_code == 200
    assert resp.json()["filename"] == TEST_FILE_NAME
    assert resp.json()["size"] == len(TEST_FILE_CONTENT)
    # Clean up: delete user
    client.delete(f"/user/{user['username']}", headers=headers)

def test_active_url_success():
    payload = {"url": "https://example.com", "title": "Example Page"}
    resp = client.post("/active_url", json=payload)
    assert resp.status_code == 200
    assert resp.json() == {"data": {"status": "success"}}

def test_active_url_missing_url():
    payload = {"title": "Example Page"}
    resp = client.post("/active_url", json=payload)
    assert resp.status_code == 400
    assert "error" in resp.json()

def test_profile():
    resp = client.get("/profile")
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "Gad Mohamed"
    assert data["profession"] == "AI Engineer"
    assert data["favorite_color"] == "Blue"
    assert data["spirit_animal"] == "Owl"

def testQueryEndpoint():
    """
    Test the AI query endpoint for various scenarios.
    """
    user = registerUser()
    token = loginUser(user)
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    userId = user["username"]
    url = f"/query/{userId}"

    # Case 1: Missing JSON body
    resp = client.post(url, headers=headers)
    assert resp.status_code in (400, 422)

    # Case 2: Missing 'query' field
    resp = client.post(url, headers=headers, json={"chatId": "chat1"})
    assert resp.status_code == 400
    assert resp.json()["error"] == "No query provided"

    # Case 3: Missing 'chatId' field
    resp = client.post(url, headers=headers, json={"query": "What is AI?"})
    assert resp.status_code == 400
    assert resp.json()["error"] == "No chat ID provided"

    # Case 4: Valid request
    resp = client.post(url, headers=headers, json={"query": "What is AI?", "chatId": "chat1", "pageContent": "Some content"})
    assert resp.status_code in (200, 500)
    if resp.status_code == 200:
        assert "response" in resp.json()
    else:
        assert "error" in resp.json()
    # Clean up: delete user
    client.delete(f"/user/{user['username']}", headers=headers)

def test_delete_user():
    """
    Test the delete user endpoint for success, forbidden, and not found cases.
    """
    # Use a unique user for this test
    user = getUniqueUser()
    # Register and login
    registerUser(user)
    token = loginUser(user)
    headers = {"Authorization": f"Bearer {token}"}
    username = user["username"]
    url = f"/user/{username}"

    # Success: user deletes themselves
    resp = client.delete(url, headers=headers)
    assert resp.status_code == 200
    assert resp.json()["message"].startswith(f"User '{username}' deleted successfully.")

    # Not found: try deleting again
    resp = client.delete(url, headers=headers)
    assert resp.status_code == 401

    # Forbidden: another user tries to delete test user
    # Re-register test user
    registerUser(user)
    # Register a second unique user
    second_user = getUniqueUser()
    registerUser(second_user)
    other_token = loginUser(second_user)
    other_headers = {"Authorization": f"Bearer {other_token}"}
    resp = client.delete(url, headers=other_headers)
    assert resp.status_code == 403
    assert resp.json()["detail"] == "You can only delete your own account."

def test_list_files():
    user = registerUser()
    token = loginUser(user)
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.get("/files", headers=headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    # Clean up: delete user
    client.delete(f"/user/{user['username']}", headers=headers)

def test_download_file():
    user = registerUser()
    token = loginUser(user)
    headers = {"Authorization": f"Bearer {token}"}
    # First upload a file
    files = {"file": (TEST_FILE_NAME, TEST_FILE_CONTENT, "text/plain")}
    client.post("/upload", headers=headers, files=files)
    resp = client.get(f"/download/{TEST_FILE_NAME}", headers=headers)
    assert resp.status_code == 200
    assert resp.content == TEST_FILE_CONTENT
    # Clean up: delete user
    client.delete(f"/user/{user['username']}", headers=headers)

def test_delete_file():
    user = registerUser()
    token = loginUser(user)
    headers = {"Authorization": f"Bearer {token}"}
    # First upload a file
    files = {"file": (TEST_FILE_NAME, TEST_FILE_CONTENT, "text/plain")}
    client.post("/upload", headers=headers, files=files)
    resp = client.delete(f"/delete/{TEST_FILE_NAME}", headers=headers)
    assert resp.status_code == 200
    resp_json = resp.json()
    # Accept message or detail containing 'deleted'
    msg = resp_json.get("message") or resp_json.get("detail")
    assert msg is not None and "deleted" in msg
    # Clean up: delete user
    client.delete(f"/user/{user['username']}", headers=headers)
    # Confirm file is gone
    resp = client.get("/files", headers=headers)
    assert TEST_FILE_NAME not in resp.json()
