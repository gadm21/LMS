# Installation Guide

![Installation Image](https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)

## Prerequisites

Before installing the LMS platform, make sure you have the following prerequisites:

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/gadm21/LMS.git
cd LMS
```

### 2. Set Up a Virtual Environment

=== "macOS/Linux"

    ```bash
    python -m venv .venv
    source .venv/bin/activate
    ```

=== "Windows"

    ```bash
    python -m venv .venv
    .venv\Scripts\activate
    ```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Database Setup

1. Create a PostgreSQL database for the LMS system:

```bash
createdb lms_db
```

2. Create a database user (optional):

```bash
createuser lms_user -P
# Enter password when prompted
```

3. Grant privileges:

```sql
GRANT ALL PRIVILEGES ON DATABASE lms_db TO lms_user;
```

### 5. Environment Variables

Create a `.env` file in the project root with the following variables:

```
DATABASE_URL=postgresql://lms_user:lms_password@localhost:5432/lms_db
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALGORITHM=HS256
PORT=7050
```

### 6. Initialize the Database

The database tables will be created automatically when you first run the application.

## Running the Application

### 5. Start the Application

```bash
uvicorn server.main:app --reload --port 7050
```

The application will be available at [http://localhost:7050](http://localhost:7050).

## Vercel Deployment

![Vercel Deployment](https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)

The LMS platform can be deployed to Vercel for a serverless production environment. Follow these steps for deployment:

### 1. Set up Vercel CLI

```bash
npm install -g vercel
vercel login
```

### 2. Configure Environment Variables

In your Vercel project settings, add the following environment variables:

```
DATABASE_URL=postgresql://postgres.otjjjagmwzswbinwxmfw:thothpassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
OPENAI_API_KEY=your_openai_api_key
```

!!! warning "Important Database Connection Note"
    For Vercel deployments, you **must** use the Supabase Transaction pooler URL format as shown above, not the direct connection URL. This is because Vercel's serverless functions require IPv4 connectivity which the direct connection doesn't support.

### 3. Deploy the Application

```bash
vercel
```

### 4. Set up API Routes

Ensure your `vercel.json` file has the correct configuration for FastAPI routes:

```json
{
  "version": 2,
  "builds": [
    { "src": "server/main.py", "use": "@vercel/python" },
    { "src": "docs_build/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/docs/(.*)", "dest": "docs_build/$1" },
    { "src": "/(.*)", "dest": "server/main.py" }
  ]
}
```

This configuration enables serving both your FastAPI application and static documentation from the same Vercel domain.

## Verifying the Installation

1. Open your browser and navigate to [http://localhost:7050](http://localhost:7050)
2. If everything is set up correctly, you'll see the API running
3. You can check the API documentation at [http://localhost:7050/docs](http://localhost:7050/docs)

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Check if PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Verify your DATABASE_URL environment variable is correct

3. Ensure the database user has the correct permissions

### API Not Starting

If the API fails to start:

1. Check for error messages in the terminal
2. Verify all dependencies are installed correctly
3. Make sure all required environment variables are set

### OpenAI API Issues

If the AI assistant is not working:

1. Verify your OpenAI API key is valid
2. Check if you have sufficient credits in your OpenAI account
