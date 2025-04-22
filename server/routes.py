import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from fastapi.responses import FileResponse
import os
from fastapi.responses import StreamingResponse, JSONResponse
from .db import User, SessionLocal
from .schemas import RegisterRequest
from .auth import (
    get_db, get_password_hash, authenticate_user, create_access_token,
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from urllib.parse import unquote, quote
from typing import List
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Body, Request
import logging

from aiagent.handler import query

router = APIRouter()

# Set up logger
logger = logging.getLogger("lms.server")
logger.setLevel(logging.INFO)

# --- Logging configuration: print to console and log to file (if possible) ---
import os
formatter = logging.Formatter('[%(asctime)s] %(levelname)s %(name)s: %(message)s')

# Always log to console (stdout), which Vercel captures
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# Only log to file if not running on Vercel (Vercel sets the VERCEL env var)
if not os.environ.get("VERCEL"):
    try:
        log_dir = "logs"
        os.makedirs(log_dir, exist_ok=True)
        log_file = os.path.join(log_dir, "lms_server.log")
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    except Exception as e:
        logger.warning(f"[Logging] Could not set up file logging: {e}")
else:
    logger.warning("[Logging] File logging is disabled (running on Vercel or read-only filesystem)")
# --- End logging configuration ---

# Logging helpers (stubs for demonstration)
def log_request_start(endpoint, method, headers, client_host):
    logger.info(f"[{endpoint}] {method} request from {client_host}, headers: {headers}")
def log_request_payload(payload, endpoint):
    logger.info(f"[{endpoint}] Payload: {payload}")
def log_validation(field, value, valid, endpoint):
    logger.info(f"[{endpoint}] Validation: {field} valid={valid}")
def log_error(msg, exc=None, context=None, endpoint=None):
    logger.error(f"[{endpoint}] ERROR: {msg} | Context: {context}")
def log_response(status, response, endpoint):
    logger.info(f"[{endpoint}] Responded with status {status}: {response}")

def log_ai_call(query, model, endpoint):
    logger.info(f"[{endpoint}] AI call to {model} with query: {query}")
def log_ai_response(response, endpoint):
    logger.info(f"[{endpoint}] AI response: {response}")

# Set ASSETS_FOLDER to /tmp/assets if on Vercel or read-only FS, else use 'assets'
if os.environ.get("VERCEL") or os.environ.get("READ_ONLY_FS"):
    ASSETS_FOLDER = "/tmp/assets"
    logger.warning("[Assets] Using /tmp/assets due to read-only filesystem or Vercel environment.")
else:
    ASSETS_FOLDER = "assets"
os.makedirs(ASSETS_FOLDER, exist_ok=True)

@router.get("/")
def root():
    return {"message": "LMS API is running"}

@router.get("/favicon.ico")
def favicon():
    favicon_path = os.path.join(os.path.dirname(__file__), "../static/favicon.ico")
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path)
    return {"detail": "No favicon found"}

@router.post("/register")
def register(req: RegisterRequest, db: SessionLocal = Depends(get_db)):
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_pw = get_password_hash(req.password)
    user = User(username=req.username, hashed_password=hashed_pw)
    db.add(user)
    db.commit()
    db.refresh(user)
    user_folder = os.path.join(ASSETS_FOLDER, str(user.userId))
    os.makedirs(user_folder, exist_ok=True)
    return {"message": "Registered successfully", "userId": user.userId}

@router.delete("/user/{username}")
def delete_user(username: str, current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    if current_user.username != username:
        raise HTTPException(status_code=403, detail="You can only delete your own account.")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": f"User '{username}' deleted successfully."}

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: SessionLocal = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), user: User = Depends(get_current_user)):
    user_folder = os.path.join(ASSETS_FOLDER, str(user.userId))
    os.makedirs(user_folder, exist_ok=True)
    contents = await file.read()
    if len(contents) > user.max_file_size:
        raise HTTPException(status_code=400, detail="File too large")
    filepath = os.path.join(user_folder, file.filename)
    with open(filepath, "wb") as f:
        f.write(contents)
    return {"filename": file.filename, "size": len(contents)}

@router.post("/query")
async def queryEndpoint(request: Request, user: User = Depends(get_current_user)):
    """
    Handle AI queries. Expects a JSON body with at least a 'query' field and a 'chatId'.
    Optionally accepts 'pageContent'.
    """
    print(f"[QUERY] userId: {user.userId}, username: {user.username}")
    try:
        data = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"error": "Missing or invalid JSON body"})
    if "query" not in data:
        return JSONResponse(status_code=400, content={"error": "No query provided"})
    if "chatId" not in data:
        return JSONResponse(status_code=400, content={"error": "No chat ID provided"})
    queryText = data.get('query', '')
    pageContent = data.get('pageContent', '')
    chatId = data.get('chatId', '')
    try:
        log_request_start('/query', request.method, dict(request.headers), request.client.host if request.client else None)
        log_request_payload(data, '/query')
        log_validation('query', queryText, bool(queryText), '/query')
        if not queryText or not queryText.strip():
            log_error("No query provided", None, {"endpoint": "/query"}, "/query")
            return JSONResponse({"error": "No query provided"}, status_code=400)
        import traceback
        client_dir = os.path.join(ASSETS_FOLDER, str(user.userId))
        response = query.ask_ai(queryText, client_dir=client_dir)
        
        log_response(200, {"message": "Query received", "response": response}, '/query')
        return JSONResponse({
            "userId": user.userId,
            "username": user.username,
            "query": queryText,
            "chatId": chatId,
            "pageContent": pageContent,
            "message": "Query received",
            "response": response
        })
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print("DEBUG: Exception in /query endpoint", e, tb)
        log_error(str(e), None, {"endpoint": "/query", "traceback": tb}, "/query")
        return JSONResponse({"error": str(e), "traceback": tb}, status_code=500)

@router.post("/active_url")
async def active_url(request: Request):
    """
    Receive active URL updates from the extension and return a success response.
    Expected POST data:
        url (str): The current active URL
        title (str, optional): The page title
    Returns:
        JSON response with status acknowledgment
    """
    try:
        # Log request start
        log_request_start('/active_url', request.method, dict(request.headers), request.client.host if request.client else None)
        # Get and log payload
        data = await request.json()
        log_request_payload(data, '/active_url')
        # Validate fields
        url = data.get('url', '') if data else ''
        title = data.get('title', '') if data else ''
        log_validation('url', url, bool(url), '/active_url')
        log_validation('title', title, bool(title), '/active_url')
        if data is None:
            log_error("No JSON data provided", None, {"endpoint": "/active_url"}, "/active_url")
            return JSONResponse({"error": "No JSON data provided"}, status_code=400)
        if not url:
            log_error("Missing URL", None, {"endpoint": "/active_url"}, "/active_url")
            return JSONResponse({"error": "Missing URL"}, status_code=400)
        # Log URL details
        logger.info(f"[SERVER] Active URL: {url[:100]}")
        if title:
            logger.info(f"[SERVER] Page title: {title[:50]}")
        # Log response
        response = {"data": {"status": "success"}}
        log_response(200, response, '/active_url')
        return JSONResponse(response, status_code=200)
    except Exception as e:
        # Log errors
        log_error(str(e), e, {"endpoint": "/active_url"}, "/active_url")
        return JSONResponse({"error": str(e)}, status_code=500)

@router.get("/files", response_model=List[str])
def list_files(user: User = Depends(get_current_user)):
    user_folder = os.path.join(ASSETS_FOLDER, str(user.userId))
    files = os.listdir(user_folder) if os.path.exists(user_folder) else []
    return files

@router.get("/download/{filename}")
def download_file(filename: str, user: User = Depends(get_current_user)):
    user_folder = os.path.join(ASSETS_FOLDER, str(user.userId))
    filepath = os.path.join(user_folder, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    def iterfile():
        with open(filepath, mode="rb") as file_like:
            yield from file_like
    return StreamingResponse(iterfile(), media_type="application/octet-stream", headers={"Content-Disposition": f"attachment; filename={quote(filename)}"})

@router.delete("/delete/{filename}")
def delete_file(filename: str, user: User = Depends(get_current_user)):
    decoded_filename = unquote(filename)
    safe_filename = os.path.basename(decoded_filename)
    user_folder = os.path.join(ASSETS_FOLDER, str(user.userId))
    path = os.path.join(user_folder, safe_filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    os.remove(path)
    return {"message": f"File '{safe_filename}' deleted successfully."}

@router.get('/profile')
def profile():
    return {
        "name": "Gad Mohamed",
        "profession": "AI Engineer",
        "favorite_color": "Blue",
        "spirit_animal": "Owl"
    }
