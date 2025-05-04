"""API Routes Module for LMS Platform.

This module defines all the API endpoints for the LMS platform, including:
- User authentication and management
- File operations (upload, download, listing, deletion)
- AI query handling
- URL tracking
- User profile information
"""

import os
import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile as FastAPIFile, File, Request, Header
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Dict, List, Optional
from fastapi.responses import StreamingResponse, JSONResponse
from .db import User, File as DBFile, Query, Session, SessionLocal, FileVersion, FileMetadata
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
    """Root endpoint that confirms the API is running.
    
    Returns:
        dict: A simple message indicating the API is operational
    """
    return {"message": "LMS API is running"}

@router.get("/favicon.ico")
def favicon():
    favicon_path = os.path.join(os.path.dirname(__file__), "../static/favicon.ico")
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path)
    return {"detail": "No favicon found"}

@router.post("/register")
def register(req: RegisterRequest, db: SessionLocal = Depends(get_db)):
    """Register a new user in the system.
    
    Args:
        req: The registration request containing username and password
        db: Database session dependency
        
    Returns:
        dict: Registration confirmation with userId
        
    Raises:
        HTTPException: 400 error if username already exists
    """
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
    """Delete a user account.
    
    Users can only delete their own accounts, not others.
    
    Args:
        username: The username of the account to delete
        current_user: The authenticated user making the request
        db: Database session dependency
        
    Returns:
        dict: Confirmation message
        
    Raises:
        HTTPException: 403 if trying to delete another user's account
        HTTPException: 404 if user not found
    """
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
    """Authenticate user and generate access token.
    
    This endpoint conforms to the OAuth2 password flow standard.
    
    Args:
        form_data: OAuth2 form containing username and password
        db: Database session dependency
        
    Returns:
        dict: JWT access token and token type
        
    Raises:
        HTTPException: 401 if authentication fails
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/upload")
async def upload_file(file: FastAPIFile = File(...), user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    """Upload a file to the system.
    
    The file is stored in the user's directory within the assets folder and tracked in the database.
    
    Args:
        file: The file to upload
        user: The authenticated user uploading the file
        db: Database session dependency
        
    Returns:
        dict: Information about the uploaded file
        
    Raises:
        HTTPException: 400 if file is too large
        HTTPException: 500 if file upload fails
    """
    try:
        # Read file contents
        contents = await file.read()
        
        # Check file size
        file_size = len(contents)
        if file_size > user.max_file_size:
            raise HTTPException(status_code=400, detail="File too large")
        
        # Detect MIME type
        import mimetypes
        content_type = mimetypes.guess_type(file.filename)[0] or "application/octet-stream"
        
        # Create database record - using the improved schema with content column
        db_file = DBFile()
        db_file.filename = file.filename
        db_file.userId = user.userId
        db_file.size = file_size
        db_file.content = contents  # Store binary content directly in the database
        db_file.content_type = content_type
        
        # Also save to filesystem in development environment (not on Vercel) for easier debugging
        if not os.environ.get("VERCEL") and not os.environ.get("READ_ONLY_FS"):
            user_folder = os.path.join(ASSETS_FOLDER, str(user.userId))
            os.makedirs(user_folder, exist_ok=True)
            filepath = os.path.join(user_folder, file.filename)
            with open(filepath, "wb") as f:
                f.write(contents)
            db_file.path = filepath
        
        # Save the file first to get its ID
        db.add(db_file)
        db.commit()
        db.refresh(db_file)
        
        # Now create the initial version with the file ID
        initial_version = FileVersion(
            fileId=db_file.fileId,
            userId=user.userId,
            content=contents,
            size=file_size,
            version_number=1
        )
        db.add(initial_version)
        
        # Add basic metadata
        content_type_metadata = FileMetadata(
            fileId=db_file.fileId,
            key="content_type",
            value=content_type
        )
        db.add(content_type_metadata)
        
        db.commit()
        
        return {
            "filename": file.filename, 
            "size": file_size,
            "fileId": db_file.fileId,
            "content_type": content_type,
            "version": 1,
            "uploaded_at": db_file.uploaded_at
        }
    except Exception as e:
        db.rollback()
        log_error(f"File upload failed: {str(e)}", exc=e, endpoint="/upload")
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@router.post("/query")
async def queryEndpoint(request: Request, user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    """Process an AI query from a user.
    
    Sends the query to the OpenAI API and returns the response. The query and response
    are associated with a chat ID for maintaining conversation context.
    All queries and responses are stored in the database for future reference.
    
    Args:
        request: The HTTP request containing the query data
        user: The authenticated user making the query
        db: Database session dependency
        
    Returns:
        dict: The AI response along with query details

    Raises:
        HTTPException: 400 if required parameters are missing
        HTTPException: 500 if OpenAI API call fails
    """
    # First check if there's any content in the request body
    body_bytes = await request.body()
    if not body_bytes:
        return JSONResponse({"error": "Empty request body"}, status_code=400)
        
    # Try to parse the JSON body
    try:
        body = await request.json()
    except json.JSONDecodeError as json_err:
        return JSONResponse({"error": f"Invalid JSON in request body: {str(json_err)}"}, status_code=400)
        
    try:
        
        # Check for required fields
        if not body.get("query"):
            return JSONResponse(status_code=400, content={"error": "No query provided"})
            
        # Check for chat_id field - Make sure this runs BEFORE the try-except for the AI agent
        chat_id = body.get("chat_id")
        if chat_id is None or chat_id == "":
            return JSONResponse(status_code=400, content={"error": "No chat ID provided"})
        
        user_query = body.get("query")
        model = body.get("model", "gpt-3.5-turbo")
        max_tokens = body.get("max_tokens", 1024)
        temperature = body.get("temperature", 0.7)
        
        # Log the incoming query
        log_ai_call(user_query, model, "/query")
        
        # Create a new query record in the database (without response yet)
        db_query = Query(
            userId=user.userId,
            chatId=chat_id,
            query_text=user_query
        )
        db.add(db_query)
        db.commit()
        db.refresh(db_query)
        
        from aiagent.memory.memory_manager import LongTermMemoryManager, ShortTermMemoryManager
        long_term_memory = LongTermMemoryManager()
        short_term_memory = ShortTermMemoryManager()
        
        # Call your AI agent with try/except to handle Vercel environment limitations
        try:
            from aiagent.handler.query import ask_ai
            
            # Set up auxiliary data for the AI query
            aux_data = {
                "username": user.username,
                "user_id": user.userId,
                "chat_id": chat_id,
                "query_id": db_query.queryId,
                "client_info": {
                    "model": model,
                    "max_tokens": max_tokens,
                    "temperature": temperature
                }
            }
            
            # Send query to AI agent
            response = ask_ai(
                query=user_query,
                max_tokens=max_tokens,
                temperature=temperature,
                aux_data=aux_data
            )
        except FileNotFoundError as file_err:
            # Handle missing files in Vercel environment
            log_error(f"AI agent file not found: {str(file_err)}", exc=file_err, endpoint="/query")
            if os.environ.get("VERCEL"):
                # In Vercel, return a graceful error message for testing purposes
                response = "The AI agent is not fully configured in this environment. This is a test instance."
            else:
                # In non-Vercel environments, still raise the error
                raise file_err
        
        # Log the response
        log_ai_response(response, "/query")
        
        # Update the query record with the response
        db_query.response = response
        db.commit()
        
        return {
            "response": response,
            "query": user_query,
            "chat_id": chat_id,
            "queryId": db_query.queryId
        }
    except Exception as e:
        db.rollback()  # Rollback transaction on error
        log_error(f"AI query failed: {str(e)}", exc=e, endpoint="/query")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@router.post("/active_url")
async def active_url(request: Request):
    """Track active URL being viewed by user.
    
    Records the URL and page title the user is currently viewing.
    No authentication required for this endpoint.
    
    Args:
        request: The HTTP request containing the URL data
        
    Returns:
        dict: Success status
        
    Raises:
        HTTPException: 400 if URL is missing
    """
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
        
        # First check if there's any content in the request body
        body_bytes = await request.body()
        if not body_bytes:
            log_error("Empty request body", None, {"endpoint": "/active_url"}, "/active_url")
            return JSONResponse({"error": "Empty request body"}, status_code=400)
            
        # Try to parse the JSON body
        try:
            data = await request.json()
            log_request_payload(data, '/active_url')
        except json.JSONDecodeError as json_err:
            log_error(f"Invalid JSON: {str(json_err)}", json_err, {"endpoint": "/active_url"}, "/active_url")
            return JSONResponse({"error": f"Invalid JSON in request body: {str(json_err)}"}, status_code=400)
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
    except json.JSONDecodeError as json_err:
        return JSONResponse({"error": f"Invalid JSON in request body: {str(json_err)}"}, status_code=400)
    except Exception as e:
        # Log errors
        log_error(str(e), e, {"endpoint": "/active_url"}, "/active_url")
        return JSONResponse({"error": str(e)}, status_code=500)

@router.get("/files")
def list_files(user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    """List all files uploaded by the authenticated user.
    
    Retrieves files from the database instead of checking the filesystem directly.
    
    Args:
        user: The authenticated user whose files to list
        db: Database session dependency
        
    Returns:
        dict: List of files with their metadata
    """
    try:
        # Query the database for files owned by this user
        files = db.query(DBFile).filter(DBFile.userId == user.userId).all()
        
        # Format the response with file metadata
        file_list = [
            {
                "fileId": file.fileId,
                "filename": file.filename,
                "size": file.size,
                "uploaded_at": file.uploaded_at
            } for file in files
        ]
        
        return {"files": file_list, "count": len(file_list)}
    except Exception as e:
        log_error(f"Error listing files: {str(e)}", exc=e, endpoint="/files")
        raise HTTPException(status_code=500, detail=f"Error listing files: {str(e)}")

@router.get("/download/{fileId}")
def download_file(fileId: int, user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    """Download a specific file by its ID.
    
    Retrieves the file record from the database before accessing the filesystem.
    
    Args:
        fileId: The ID of the file to download
        user: The authenticated user requesting the download
        db: Database session dependency
        
    Returns:
        FileResponse: The file content as a download
        
    Raises:
        HTTPException: 404 if file not found
        HTTPException: 403 if trying to access another user's file
    """
    try:
        # Query the database for the file record
        file_record = db.query(DBFile).filter(DBFile.fileId == fileId).first()
        
        # Check if file exists and belongs to the user
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
            
        if file_record.userId != user.userId:
            raise HTTPException(status_code=403, detail="You don't have permission to access this file")
        
        # First try to get content directly from the database
        if file_record.content is not None:
            file_content = file_record.content
        else:
            # Fall back to the filesystem if content is not in the database
            filepath = file_record.path
            if filepath and os.path.exists(filepath):
                with open(filepath, "rb") as f:
                    file_content = f.read()
            else:
                # Try standard path as fallback
                user_folder = os.path.join(ASSETS_FOLDER, str(user.userId))
                fallback_path = os.path.join(user_folder, file_record.filename)
                
                if os.path.exists(fallback_path):
                    with open(fallback_path, "rb") as f:
                        file_content = f.read()
                else:
                    # Check if we have any versions of this file
                    latest_version = db.query(FileVersion).filter(
                        FileVersion.fileId == fileId
                    ).order_by(FileVersion.version_number.desc()).first()
                    
                    if latest_version and latest_version.content is not None:
                        file_content = latest_version.content
                    else:
                        raise HTTPException(status_code=404, detail="File not found on server")
        
        # Determine content type
        content_type = file_record.content_type
        if not content_type:
            # Look for content type in metadata
            metadata = db.query(FileMetadata).filter(
                FileMetadata.fileId == fileId,
                FileMetadata.key == "content_type"
            ).first()
            
            if metadata and metadata.value:
                content_type = metadata.value
            else:
                # Guess from filename
                import mimetypes
                content_type = mimetypes.guess_type(file_record.filename)[0] or "application/octet-stream"
        
        # Stream the file from memory
        def iterfile():
            yield file_content
                
        return StreamingResponse(
            iterfile(), 
            media_type=content_type, 
            headers={"Content-Disposition": f"attachment; filename={quote(file_record.filename)}"}
        )
    except HTTPException:
        raise
    except Exception as e:
        log_error(f"Error downloading file: {str(e)}", exc=e, endpoint=f"/download/{fileId}")
        raise HTTPException(status_code=500, detail=f"Error downloading file: {str(e)}")

@router.post("/files/{fileId}/versions")
async def upload_file_version(fileId: int, file: FastAPIFile = File(...), user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    """Upload a new version of an existing file.
    
    Creates a new version of the file while preserving the original.
    Only the owner of the file can add new versions.
    
    Args:
        fileId: ID of the file to create a version for
        file: The new version of the file
        user: The authenticated user making the request
        db: Database session dependency
        
    Returns:
        dict: Information about the newly created version
        
    Raises:
        HTTPException: 404 if file not found
        HTTPException: 403 if user doesn't own the file
        HTTPException: 400 if file is too large
    """
    try:
        # Check if file exists and belongs to the user
        original_file = db.query(DBFile).filter(DBFile.fileId == fileId).first()
        if not original_file:
            raise HTTPException(status_code=404, detail="File not found")
            
        if original_file.userId != user.userId:
            raise HTTPException(status_code=403, detail="You don't have permission to modify this file")
        
        # Read file contents
        contents = await file.read()
        
        # Check file size
        file_size = len(contents)
        if file_size > user.max_file_size:
            raise HTTPException(status_code=400, detail="File too large")
        
        # Get the latest version number
        latest_version = db.query(FileVersion).filter(
            FileVersion.fileId == fileId
        ).order_by(FileVersion.version_number.desc()).first()
        
        new_version_number = 1
        if latest_version:
            new_version_number = latest_version.version_number + 1
        
        # Create new version
        new_version = FileVersion(
            fileId=fileId,
            userId=user.userId,
            content=contents,
            size=file_size,
            version_number=new_version_number
        )
        
        db.add(new_version)
        db.commit()
        db.refresh(new_version)
        
        # Update the main file record with the latest content
        original_file.content = contents
        original_file.size = file_size
        db.commit()
        
        return {
            "fileId": fileId,
            "filename": original_file.filename,
            "version": new_version_number,
            "size": file_size,
            "created_at": new_version.created_at
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        log_error(f"Error uploading file version: {str(e)}", exc=e, endpoint=f"/files/{fileId}/versions")
        raise HTTPException(status_code=500, detail=f"Error uploading file version: {str(e)}")

# Create a Pydantic model for metadata validation
class MetadataUpdate(BaseModel):
    metadata: Dict[str, str]
    
@router.post("/files/{fileId}/metadata")
def set_file_metadata(fileId: int, update: MetadataUpdate, user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    """Set or update metadata for a file.
    
    Adds or updates metadata key-value pairs for a file.
    Only the owner of the file can modify metadata.
    
    Args:
        fileId: ID of the file to set metadata for
        metadata: Dictionary of metadata key-value pairs
        user: The authenticated user making the request
        db: Database session dependency
        
    Returns:
        dict: Updated metadata for the file
        
    Raises:
        HTTPException: 404 if file not found
        HTTPException: 403 if user doesn't own the file
    """
    try:
        # Check if file exists and belongs to the user
        file_record = db.query(DBFile).filter(DBFile.fileId == fileId).first()
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
            
        if file_record.userId != user.userId:
            raise HTTPException(status_code=403, detail="You don't have permission to modify this file's metadata")
        
        # Add or update metadata entries
        updated_keys = []
        for key, value in update.metadata.items():
            # Skip invalid keys
            if not key or not isinstance(key, str):
                continue
                
            # Look for existing metadata with this key
            existing = db.query(FileMetadata).filter(
                FileMetadata.fileId == fileId,
                FileMetadata.key == key
            ).first()
            
            if existing:
                # Update existing metadata
                existing.value = str(value)
                updated_keys.append(key)
            else:
                # Create new metadata entry
                new_metadata = FileMetadata(
                    fileId=fileId,
                    key=key,
                    value=str(value)
                )
                db.add(new_metadata)
                updated_keys.append(key)
        
        db.commit()
        
        # Get all metadata for this file
        all_metadata = {}
        metadata_records = db.query(FileMetadata).filter(FileMetadata.fileId == fileId).all()
        for record in metadata_records:
            all_metadata[record.key] = record.value
        
        return {
            "fileId": fileId,
            "metadata": all_metadata,
            "updated_keys": updated_keys
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        log_error(f"Error updating file metadata: {str(e)}", exc=e, endpoint=f"/files/{fileId}/metadata")
        raise HTTPException(status_code=500, detail=f"Error updating file metadata: {str(e)}")

@router.delete("/delete/{fileId}")
def delete_file(fileId: int, user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    """Delete a specific file by its ID.
    
    Deletes both the database record and the file on disk.
    
    Args:
        fileId: The ID of the file to delete
        user: The authenticated user requesting the deletion
        db: Database session dependency
        
    Returns:
        dict: Confirmation message
        
    Raises:
        HTTPException: 404 if file not found
        HTTPException: 403 if trying to delete another user's file
    """
    try:
        # Query the database for the file record
        file_record = db.query(DBFile).filter(DBFile.fileId == fileId).first()
        
        # Check if file exists and belongs to the user
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
            
        if file_record.userId != user.userId:
            raise HTTPException(status_code=403, detail="You don't have permission to delete this file")
        
        # Get file information before deleting
        filename = file_record.filename
        filepath = file_record.path
        
        # Delete the file from disk if it exists
        try:
            # If filepath is None, we're using database storage, so no need to remove from disk
            if filepath and os.path.exists(filepath):
                os.remove(filepath)
            else:
                # Try the standard path pattern as fallback (only for non-Vercel environments)
                if not os.environ.get("VERCEL") and not os.environ.get("READ_ONLY_FS"):
                    user_folder = os.path.join(ASSETS_FOLDER, str(user.userId))
                    fallback_path = os.path.join(user_folder, filename)
                    if os.path.exists(fallback_path):
                        os.remove(fallback_path)
        except (OSError, TypeError) as e:
            # Continue even if file removal fails, as we still want to remove the database record
            log_error(f"Error removing file from disk: {str(e)}", exc=e, endpoint=f"/delete/{fileId}")
        
        # Delete the database record
        db.delete(file_record)
        db.commit()
        
        return {"message": f"File '{filename}' deleted successfully.", "fileId": fileId}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        log_error(f"Error deleting file: {str(e)}", exc=e, endpoint=f"/delete/{fileId}")
        raise HTTPException(status_code=500, detail=f"Error deleting file: {str(e)}")

@router.get('/profile')
def profile():
    """Get user profile information.
    
    This is a static endpoint that returns hardcoded profile information.
    In a real application, this would fetch data from the database.
    
    Returns:
        dict: Profile information
    """
    return {
        "name": "Gad Mohamed",
        "profession": "AI Engineer",
        "favorite_color": "Blue",
        "spirit_animal": "Owl"
    }
