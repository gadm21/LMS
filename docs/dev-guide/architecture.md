# System Architecture

This document provides an overview of the LMS system architecture.

## High-Level Architecture

The LMS is built using a modern web application architecture with a clear separation between backend and frontend components.

```mermaid
graph TD
    Client[Web Client] <--> API[FastAPI Backend]
    API <--> DB[(PostgreSQL Database)]
    API <--> FileSystem[File Storage]
    API <--> OpenAI[OpenAI API]
    
    subgraph Backend
        API
        DB
        FileSystem
        OpenAI
    end
```

## Component Overview

### Backend Components

The backend system consists of several key components:

1. **REST API (FastAPI)**: Handles all HTTP requests
2. **Authentication System**: Manages user credentials and session tokens
3. **Database Layer**: Persists application data
4. **File Management**: Handles file uploads and downloads
5. **OpenAI Integration**: Connects to OpenAI for AI-powered responses

### Database Schema

The database schema represents the core data model:

```mermaid
erDiagram
    User {
        int id PK
        string username
        string password_hash
    }
    File {
        int id PK
        string filename
        int user_id FK
        string path
        datetime created_at
    }
    Query {
        int id PK
        int user_id FK
        string chat_id
        string query_text
        string response
        datetime timestamp
    }
    
    User ||--o{ File : uploads
    User ||--o{ Query : makes
```

## Request Flow

The following diagram illustrates a typical request flow through the system:

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API Server
    participant D as Database
    participant O as OpenAI API
    
    C->>A: HTTP Request
    A->>A: Validate Request
    A->>A: Authenticate User (if needed)
    
    alt File Upload
        A->>A: Save File to Storage
        A->>D: Save File Metadata
        A->>C: Return File Info
    else Query AI
        A->>D: Log Query
        A->>O: Forward Query to OpenAI
        O->>A: AI Response
        A->>D: Save Response
        A->>C: Return Response
    else File Retrieval
        A->>D: Query File Metadata
        A->>A: Get File from Storage
        A->>C: Return File
    end
```

## Code Organization

The codebase is organized into the following structure:

```
server/
├── main.py         # Application entry point
├── auth.py         # Authentication logic
├── db.py           # Database models and connection
├── routes.py       # API route handlers
└── utils.py        # Utility functions
```

### Core Modules

1. **main.py**: Initializes the FastAPI application, middleware, and routes
2. **auth.py**: Contains authentication logic including JWT token handling
3. **db.py**: Defines SQLAlchemy database models and connection setup
4. **routes.py**: Implements API endpoints and business logic

## Deployment Architecture

In production, the system is deployed on Vercel with a Supabase PostgreSQL database:

```mermaid
graph LR
    Client[Web Browser] --> Vercel[Vercel Edge]
    Vercel --> API[FastAPI Function]
    API --> Supabase[Supabase PostgreSQL]
    API --> OpenAI[OpenAI API]
```

## Security Considerations

The LMS implements several security measures:

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: Passwords are securely hashed using bcrypt
3. **CORS Protection**: Configured to prevent cross-origin attacks
4. **Input Validation**: Request validation using Pydantic models

## Future Architecture Improvements

Potential improvements to consider:

1. **Caching Layer**: Implement Redis for response caching
2. **Message Queue**: Add RabbitMQ/Kafka for async processing
3. **CDN Integration**: Use a CDN for file delivery
4. **Microservices**: Split into domain-specific microservices
5. **Real-time Communication**: Add WebSocket support
