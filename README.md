# Digital Menu - Scaling Glacier Ice Cream

This project is a migration of a single-file digital menu application to a scalable MERN-like stack (React + Node.js + MongoDB).

## Prerequisites
- Node.js (v16+)
- MongoDB (Running locally on `mongodb://localhost:27017/digital_menu`)

## Project Structure
- `frontend/`: React + Vite application.
- `backend/`: Node.js + Express + Mongoose API.

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
# Seed the database (only once)
node seed.js
# Start the server
npm start
```
The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
# Start the development server
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Features Replicated
- Exact UI clone from the original HTML/CSS.
- Brand and Category sidebar filtering.
- Search and Sort (Price/Discount/Volume).
- Persistent Cart (LocalStorage).
- Mock OTP Login (Phone: +91 xxxxxxxxxx, OTP: 123456).
- WhatsApp Checkout Integration.
- Order History (Last 10 orders).

## Phase 2 & 3 Roadmap
- **Phase 2**: Implement server-side pagination, sorting, and search indexing for 500+ items.
- **Phase 3**: UI/UX redesign, Admin Dashboard, and Analytics.
