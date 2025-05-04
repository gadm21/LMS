# Database Models

![Database Architecture](https://images.unsplash.com/photo-1544383835-bda2bc66a55d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)

## Overview

The LMS platform uses SQLAlchemy as its ORM (Object-Relational Mapping) layer to interact with a PostgreSQL database. The models defined here represent the database schema and provide an abstraction layer for database operations.

## Database Schema

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

## Database Models

### User Model

The User model represents a registered user in the system.

::: server.db.User
    options:
      show_root_heading: true
      show_source: true

### Base Model

All models inherit from the SQLAlchemy Base class.

::: server.db.Base
    options:
      show_root_heading: true
      show_source: true

## Database Connection

The database connection is established in the main application and provides a dependency for all routes.

::: server.db
    options:
      show_root_heading: true
      show_source: true
