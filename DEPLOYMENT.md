# Deployment Guide

This project is ready for:

- Backend: Azure App Service + Azure Database for PostgreSQL Flexible Server
- Frontend: Vercel

## Backend on Azure

Create an Azure Database for PostgreSQL Flexible Server and an Azure App Service for Linux/Python 3.11.

Use `backend` as the deployed application folder.

Azure App Service startup command:

```bash
bash startup.sh
```

Required Azure App Service environment variables:

```text
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<database>?sslmode=require
SECRET_KEY=<generate-a-long-random-secret>
ACCESS_TOKEN_EXPIRE_MINUTES=480
GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_MODEL=gemini-3-flash-preview
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

Optional:

```text
WEB_CONCURRENCY=2
```

Health check URL:

```text
https://your-azure-backend.azurewebsites.net/health
```

Expected response includes:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## Frontend on Vercel

In Vercel project settings:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm ci
```

Set this Vercel environment variable:

```text
VITE_API_URL=https://your-azure-backend.azurewebsites.net
```

Do not add `/api` at the end. The frontend already calls endpoints such as `/api/v1/auth/login`.

## Connect Backend and Frontend

After Vercel gives you the frontend URL, update Azure:

```text
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

If you also want local development to work against the same Azure backend, use:

```text
CORS_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:5173,http://127.0.0.1:5173
```

Restart the Azure App Service after changing environment variables.

## Smoke Test

1. Open `https://your-azure-backend.azurewebsites.net/health`.
2. Open the Vercel frontend.
3. Login with seeded credentials after the backend has started:

```text
Coordinator: admin@arpan.org / admin123
Volunteer: volunteer@arpan.org / volunteer123
Community: user@arpan.org / user123
```

4. Visit AI Matching. If Gemini quota is unavailable, the backend returns deterministic database-derived fallback matches instead of failing.
