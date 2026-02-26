# Seat Booking System

Seat booking app for batch-based access with regular and floater seats.

## Features
- Batch 1: regular seats Mon-Wed, floater seats other weekdays (tomorrow only).
- Batch 2: regular seats Thu-Fri, floater seats other weekdays (tomorrow only).
- Weekends are blocked.
- Release a regular booking to make that seat a floater for the same date.
- Profile page shows user details and rules.

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React + Vite + Tailwind CSS

## Prerequisites
- Node.js 18+
- MongoDB connection string

## Backend Setup
1. Create backend env file:
   - Copy `backend/.env` and set values as needed.
   - Ensure `MONGODB_URI` and `JWT_SECRET` are set.
2. Install and run:
   ```bash
   cd backend
   npm install
   npm run seed
   npm run dev
   ```

Backend default: `http://localhost:8080`

## Frontend Setup
1. Configure API URL (optional):
   - Create `frontend/.env` with:
     ```
     VITE_API_BASE_URL=http://localhost:8080
     ```
2. Install and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Frontend default: `http://localhost:5173`

## Test Accounts
If you run the seed script, use:
- Email: `user1@seatflow.local`
- Password: `Password@123`

## API Endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`
- GET `/api/users/me`
- GET `/api/seats?date=YYYY-MM-DD`
- POST `/api/bookings`
- DELETE `/api/bookings/:id`

## Notes
- Floater seats are shown as `floater` in the API.
- Release is allowed only before the booking date.
