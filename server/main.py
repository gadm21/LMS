from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy import Column, String, Integer, create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
import os
from urllib.parse import unquote, quote
import logging
import time

from aiagent.handler.query import ask_ai
from aiagent.context import reference as ai_reference
# Import server logging utilities if available
try:
    from server.logging_utils import (
        log_request_start, log_request_payload, log_validation, log_ai_call, log_ai_response, log_response, log_error
    )
except ImportError:
    # Fallback: define dummy logging functions if not running in full server context
    def log_request_start(*args, **kwargs): pass
    def log_request_payload(*args, **kwargs): pass
    def log_validation(*args, **kwargs): pass
    def log_ai_call(*args, **kwargs): pass
    def log_ai_response(*args, **kwargs): pass
    def log_response(*args, **kwargs): pass
    def log_error(*args, **kwargs): pass

logger = logging.getLogger(__name__)

# FastAPI instance
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://lms_user:lms_password@localhost:5432/lms_db")
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# For Vercel, set DATABASE_URL in your environment. See .env.example for details.

# Folder setup
ASSETS_FOLDER = "assets"
os.makedirs(ASSETS_FOLDER, exist_ok=True)

# Auth config
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# DB Models
class User(Base):
    """
    SQLAlchemy model for user accounts.
    """
    __tablename__ = "users"
    userId = Column(Integer, primary_key=True, autoincrement=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String)
    max_file_size = Column(Integer, default=524288000)  # 500MB

Base.metadata.create_all(bind=engine)

# Schemas
class RegisterRequest(BaseModel):
    """
    Pydantic schema for user registration.
    """
    username: str
    password: str

# Utilities
def get_db():
    """
    Dependency that provides a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_password_hash(password: str) -> str:
    """
    Hash a plaintext password using bcrypt.
    """
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    """
    Verify a plaintext password against a hashed password.
    """
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """
    Authenticate a user by username and password.
    """
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """
    Dependency to get the current authenticated user from the JWT token.
    """
    credentials_exception = HTTPException(status_code=401, detail="Invalid credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise credentials_exception
    return user

# Routes
@app.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_pw = get_password_hash(req.password)
    user = User(username=req.username, hashed_password=hashed_pw)
    db.add(user)
    db.commit()
    db.refresh(user)
    # Create user folder in assets/{userId}
    user_folder = os.path.join("assets", str(user.userId))
    os.makedirs(user_folder, exist_ok=True)
    return {"message": "Registered successfully", "userId": user.userId}

@app.delete("/user/{username}")
def delete_user(username: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Delete a user account. Only the user themselves can delete their account.
    """
    if current_user.username != username:
        raise HTTPException(status_code=403, detail="You can only delete your own account.")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": f"User '{username}' deleted successfully."}

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.username},
                                       expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/upload")
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

@app.get("/files")
def list_files(user: User = Depends(get_current_user)):
    user_folder = os.path.join(ASSETS_FOLDER, str(user.userId))
    files = os.listdir(user_folder) if os.path.exists(user_folder) else []
    return files

@app.get("/download/{filename}")
def download_file(filename: str, user: User = Depends(get_current_user)):
    user_folder = os.path.join(ASSETS_FOLDER, str(user.userId))
    filepath = os.path.join(user_folder, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    def iterfile():
        with open(filepath, mode="rb") as file_like:
            yield from file_like
    return StreamingResponse(iterfile(), media_type="application/octet-stream", headers={"Content-Disposition": f"attachment; filename={quote(filename)}"})

@app.delete("/delete/{filename}")
def delete_file(filename: str, user: User = Depends(get_current_user)):
    # Decode percent-encoded filename (e.g., from URL like Screenshot%202025.png)
    decoded_filename = unquote(filename)
    # Sanitize filename to prevent directory traversal
    safe_filename = os.path.basename(decoded_filename)
    user_folder = os.path.join(ASSETS_FOLDER, str(user.userId))
    path = os.path.join(user_folder, safe_filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    os.remove(path)
    return {"message": f"File '{safe_filename}' deleted successfully."}



@app.post("/query/{userId}")
async def queryEndpoint(userId: str, request: Request, user: User = Depends(get_current_user)):
    """
    Handle AI queries. Expects a JSON body with at least a 'query' field and a 'chatId'.
    Optionally accepts 'pageContent'.

    Args:
        userId (str): The user ID for the query (from path)
        request (Request): The FastAPI request object
        user (User): The authenticated user

    Returns:
        JSONResponse: The AI's response or error message
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
        # page_content = body.get('pageContent', '')
        # (rest of your logic)
        # For demonstration, include userId in the response and also a 'response' key for test compatibility
        return JSONResponse({
            "userId": user.userId,
            "username": user.username,
            "query": queryText,
            "chatId": chatId,
            "pageContent": pageContent,
            "message": "Query received",
            "response": f"This is a placeholder response for user {user.userId}"  # for test compatibility
        })
    except Exception as e:
        log_error(str(e), None, {"endpoint": "/query"}, "/query")
        return JSONResponse({"error": str(e)}, status_code=500)
        if page_content:
            logger.info(f"[SERVER] Page content length: {len(page_content)}")
            logger.debug(f"[SERVER] Page content type: {type(page_content).__name__}")
        chat_id = body.get('chatId', '')
        logger.info(f"[SERVER] Chat ID: {chat_id}")
        log_validation('chatId', chat_id, bool(chat_id), '/query')
        if not chat_id or not chat_id.strip():
            log_error("No chat ID provided", None, {"endpoint": "/query"}, "/query")
            return JSONResponse({"error": "No chat ID provided"}, status_code=400)

        # Log AI call
        logger.info(f"[SERVER] Processing query: {query_text[:50]}...")
        log_ai_call(query_text, "gpt-3.5-turbo", '/query')
        start_time = time.time()
        response = ask_ai(query_text, aux_data={"page_content": page_content})
        duration = time.time() - start_time
        log_ai_response(response, '/query')
        logger.info(f"[SERVER] AI response time: {duration:.2f} seconds")
        result = {"response": response}
        log_response(200, result, '/query')
        return JSONResponse(result, status_code=200)
    except Exception as e:
        log_error(str(e), e, {"endpoint": "/query", "query": query_text if 'query_text' in locals() else ''}, "/query")
        return JSONResponse({"error": str(e)}, status_code=500)





@app.post("/active_url")
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

@app.get('/profile')
def profile():
    """Return hardcoded user profile info as JSON."""
    return {
        "name": "Gad Mohamed",
        "profession": "AI Engineer",
        "favorite_color": "Blue",
        "spirit_animal": "Owl"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)

# To deploy on Vercel, use vercel.json and set up ASGI handler.
