# LMS


---


## Project Structure

```
LMS/
├── server/         # Backend API, DB, auth, routes, logging_utils
│   └── main.py     # FastAPI app
│   └── logging_utils.py
├── aiagent/        # AI logic, context, handler, memory, etc.
├── assets/
├── requirements.txt
├── README.md
├── .env.example    # For Vercel/Postgres config (no secrets)
├── vercel.json     # Vercel deployment config
```

## Setup
1. Copy `.env.example` to `.env` and set your secrets.
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Run locally:
   ```sh
   python server/main.py
   ```

## Deployment (Vercel)
- Push to your Git repo and connect to Vercel.
- Set environment variables in Vercel dashboard (`DATABASE_URL`, etc).
- Vercel will use `vercel.json` to deploy the FastAPI app.

## Database
- Uses Postgres (local or Vercel-hosted). See `.env.example` for config.

