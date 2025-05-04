# API Routes

![API Routes](https://images.unsplash.com/photo-1580894732444-8ecded7900cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)

## Overview

The LMS Platform provides a comprehensive REST API for interacting with the system. All endpoints require authentication via JWT token (except for registration and login).

## Base URL

**Endpoint**: `/upload`  
**Method**: `POST`  
**Authorization**: Bearer Token  
**Form Data**:
- `file`: The file to upload

**Response**:

```json
{
  "filename": "example.pdf",
  "size": 1024
}
```

### List Files

Get a list of all files uploaded by the authenticated user.

**Endpoint**: `/files`  
**Method**: `GET`  
**Authorization**: Bearer Token

**Response**:

```json
[
  "file1.pdf",
  "file2.jpg",
  "file3.docx"
]
```

### Download File

Download a specific file.

**Endpoint**: `/download/{filename}`  
**Method**: `GET`  
**Authorization**: Bearer Token  
**URL Parameters**:
- `filename`: The name of the file to download

**Response**: Binary file content

### Delete File

Delete a specific file.

**Endpoint**: `/delete/{filename}`  
**Method**: `DELETE`  
**Authorization**: Bearer Token  
**URL Parameters**:
- `filename`: The name of the file to delete

**Response**:

```json
{
  "message": "File 'example.pdf' deleted successfully."
}
```

## User Management

### Delete User

Delete a user account.

**Endpoint**: `/user/{username}`  
**Method**: `DELETE`  
**Authorization**: Bearer Token  
**URL Parameters**:
- `username`: The username of the account to delete

**Response**:

```json
{
  "message": "User 'username' deleted successfully."
}
```

## AI Assistant

### Query

Send a query to the AI assistant.

**Endpoint**: `/query`  
**Method**: `POST`  
**Authorization**: Bearer Token  
**Request Body**:

```json
{
  "query": "What is machine learning?",
  "chatId": "chat123",
  "pageContent": "Optional content from current page"
}
```

**Response**:

```json
{
  "userId": 123,
  "username": "user123",
  "query": "What is machine learning?",
  "chatId": "chat123",
  "pageContent": "Optional content from current page",
  "message": "Query received",
  "response": "Machine learning is a branch of artificial intelligence..."
}
```

## Misc Endpoints

### Active URL

Report an active URL being viewed by the user.

**Endpoint**: `/active_url`  
**Method**: `POST`  
**Request Body**:

```json
{
  "url": "https://example.com/lesson",
  "title": "Lesson: Introduction to Python"
}
```

**Response**:

```json
{
  "data": {
    "status": "success"
  }
}
```

### Profile

Get user profile information.

**Endpoint**: `/profile`  
**Method**: `GET`  

**Response**:

```json
{
  "name": "Gad Mohamed",
  "profession": "AI Engineer",
  "favorite_color": "Blue",
  "spirit_animal": "Owl"
}
```

## Routes Code Reference

::: server.routes
    options:
      show_root_heading: true
      show_source: true
