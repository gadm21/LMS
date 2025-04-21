# LMS

[![Python application](https://github.com/gadm21/LMS/actions/workflows/python-app.yml/badge.svg)](https://github.com/gadm21/LMS/actions/workflows/python-app.yml)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/gadm21/LMS)

A modular Learning Management System (LMS) with AI agent integration, ready for deployment on Vercel with Postgres.

---

## Continuous Integration & Deployment

- **Tests:** All pushes and PRs to `main` run tests automatically via [GitHub Actions](https://github.com/gadm21/LMS/actions/workflows/python-app.yml).
- **Vercel:** Connect this repo to [Vercel](https://vercel.com/) for instant deployment. Set secrets (`DATABASE_URL`, `SECRET_KEY`, etc.) in the Vercel dashboard.
- **Badges:** See above for live test and deploy status.

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

## Documentation
- All modules and functions are documented with docstrings.
- See code for detailed API and AI agent integration.

---
learning management system
