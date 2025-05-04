# Authentication API

![Authentication](https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)

## Overview

The LMS Platform uses JWT (JSON Web Token) based authentication to secure API endpoints. This approach provides stateless authentication with secure token exchange.

## Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Database
    
    Client->>API: POST /register (credentials)
    API->>Database: Create User
    Database-->>API: User Created
    API-->>Client: Success Response
    
    Client->>API: POST /token (credentials)
    API->>Database: Validate Credentials
    Database-->>API: Credentials Valid
    API-->>Client: JWT Access Token
    
    Client->>API: Request with Bearer Token
    API->>API: Validate Token
    API-->>Client: Protected Resource
```

## API Endpoints

### Register

Register a new user in the system.

**Endpoint**: `/register`  
**Method**: `POST`  
**Request Body**:

```json
{
  "username": "string",
  "password": "string"
}
```

**Response**:

```json
{
  "message": "Registered successfully",
  "userId": 123
}
```

### Login (Token)

Obtain an access token.

**Endpoint**: `/token`  
**Method**: `POST`  
**Form Data**:
- `username`: Username
- `password`: Password

**Response**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

## Authentication Code Reference

Here's the auto-generated documentation from the code:

::: server.auth
    options:
      show_root_heading: true
      show_source: true
