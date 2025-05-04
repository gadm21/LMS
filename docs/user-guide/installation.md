# Installation Guide

This guide explains how to install and set up the LMS system locally for development or testing purposes.

## System Requirements

- Python 3.9 or higher
- PostgreSQL database
- Git (for cloning the repository)

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

Start the application with:

```bash
uvicorn server.main:app --reload --port 7050
```

The application will be available at [http://localhost:7050](http://localhost:7050).

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
