# Nako Frontend

This is the frontend for the Nako astrology project. It is designed to be deployed on Vercel and communicate with the backend API.

## Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Set the backend API URL (e.g., in `.env.local`):
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
   ```

3. Start the dev server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Deployment
Deploy to Vercel and set the `NEXT_PUBLIC_BACKEND_URL` environment variable in the Vercel dashboard for production.

## API Calls
All API calls should use the backend URL, e.g.,
```js
fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rectify`, { ... })
```
