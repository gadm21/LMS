# Configuration Guide

![Configuration](https://images.unsplash.com/photo-1607706189992-eae578626c86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)

## Environment Variables

The LMS platform uses environment variables for configuration. These can be set in a `.env` file for local development or as environment variables in your production environment.

### Required Environment Variables

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/lms` |
| `SECRET_KEY` | JWT signing key (keep this secret!) | `your-256-bit-secret-key` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | `sk-...` |

### Optional Environment Variables

| Variable | Description | Default | Example |
| -------- | ----------- | ------- | ------- |
| `ALGORITHM` | JWT signing algorithm | `HS256` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT expiration time in minutes | `60` | `120` |
| `PORT` | Server port | `7050` | `8000` |
| `VERCEL` | Flag indicating Vercel deployment | `null` | `1` |

## Configuration Examples

### Local Development

Create a `.env` file in the project root with your configuration:

```
DATABASE_URL=postgresql://lms_user:lms_password@localhost:5432/thoth
SECRET_KEY=your-256-bit-secret-key
OPENAI_API_KEY=your-openai-api-key
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALGORITHM=HS256
PORT=7050
```
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/lms_db` |
| `SECRET_KEY` | Secret key for JWT token generation | `your-secure-secret-key` |
| `OPENAI_API_KEY` | API key for OpenAI integration | `sk-...` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time in minutes | `60` |
| `ALGORITHM` | JWT token algorithm | `HS256` |
| `PORT` | Server port | `7050` |

## Configuration Methods

There are several ways to set these environment variables:

### 1. Environment File (.env)

Create a `.env` file in the project root:

```
DATABASE_URL=postgresql://lms_user:lms_password@localhost:5432/lms_db
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALGORITHM=HS256
PORT=7050
```

### 2. System Environment Variables

Set variables directly in your shell session:

=== "macOS/Linux"

    ```bash
    export DATABASE_URL="postgresql://lms_user:lms_password@localhost:5432/lms_db"
    export SECRET_KEY="your-secret-key-here"
    export OPENAI_API_KEY="your-openai-api-key"
    export ACCESS_TOKEN_EXPIRE_MINUTES=60
    export ALGORITHM="HS256"
    export PORT=7050
    ```

=== "Windows"

    ```cmd
    set DATABASE_URL=postgresql://lms_user:lms_password@localhost:5432/lms_db
    set SECRET_KEY=your-secret-key-here
    set OPENAI_API_KEY=your-openai-api-key
    set ACCESS_TOKEN_EXPIRE_MINUTES=60
    set ALGORITHM=HS256
    set PORT=7050
    ```

### 3. Deployment Platform Variables

For production deployments on platforms like Vercel, set environment variables in the platform's dashboard:

1. Log into your Vercel account
2. Navigate to your project
3. Go to "Settings" > "Environment Variables"
4. Add each variable and its value
5. Deploy or redeploy your application

## Database Configuration

### PostgreSQL Connection String

The PostgreSQL connection string format is:

```
postgresql://[username]:[password]@[host]:[port]/[database]
```

For Supabase deployments with Vercel, use the Transaction pooler connection:

```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

!!! warning "IPv4 Compatibility"
    When deploying to Vercel, use the Transaction pooler URL for Supabase connections, as direct connections are not IPv4 compatible.

### Database Migrations

The LMS uses SQLAlchemy's `create_all()` method to automatically create database tables. For production, you should consider implementing proper migrations with tools like Alembic.

## File Storage Configuration

By default, files are stored in the local filesystem under the `assets` directory. For production deployments, consider configuring:

1. **Cloud Storage**: Services like AWS S3 or Google Cloud Storage
2. **Content Delivery Network (CDN)**: For faster file delivery
3. **Storage Quotas**: Set limits on user file storage

## Security Configuration

### JWT Configuration

For JWT token security, consider:

1. Using a strong, random `SECRET_KEY`
2. Setting an appropriate `ACCESS_TOKEN_EXPIRE_MINUTES` (balance between security and user experience)
3. Regularly rotating your secret keys

### CORS Configuration

Configure Cross-Origin Resource Sharing (CORS) based on your frontend domains:

```python
origins = [
    "http://localhost:7040",
    "https://your-frontend-domain.com"
]
```

## OpenAI API Configuration

The OpenAI integration requires:

1. A valid API key (set as `OPENAI_API_KEY`)
2. Sufficient API credits for your usage volume
3. Optionally, set model parameters like temperature, max tokens, etc.

## Advanced Configuration

For advanced scenarios, you may need to modify the application code directly. Key configuration files include:

- `server/main.py`: Main application configuration
- `server/auth.py`: Authentication settings
- `server/db.py`: Database connection
