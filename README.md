# GigFlow - Mini Freelance Marketplace

GigFlow is a production-ready freelance marketplace built with the MERN stack (MongoDB, Express, React, Node.js). It features fluid user roles, generic gig posting, bidding with real-time notifications, and atomic transactions for hiring.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io, JWT
- **Frontend**: React (Vite), Redux Toolkit, Tailwind CSS, Socket.io-client
- **Security**: HttpOnly Cookies, Helmet, concurrent transaction handling.

## Features

- **Authentication**: Secure JWT authentication with HttpOnly cookies.
- **Fluid Roles**: Single user account can act as both Client (Post Gigs) and Freelancer (Bid).
- **Atomic Hiring**: Robust handling of the hiring process using MongoDB Transactions to prevent race conditions and ensure data integrity.
- **Real-time Notifications**: Instant alerts for freelancers when they are hired.
- **Client Dashboard**: Manage posted gigs and review bids.

## Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas) - Ensure replica set is enabled for Transactions (required for MongoDB transactions). *Note: Standalone MongoDB instances do not support transactions.*

## Getting Started

### 1. Clone & Install

```bash
# Clone the repository
git clone <repo-url>
cd freelancer

# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Environment Variables

Create `.env` in `server/` directory:
```env
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Run the Application

You need to run both server and client terminals.

**Terminal 1 (Server):**
```bash
cd server
npm run dev
```

**Terminal 2 (Client):**
```bash
cd client
npm run dev
```

The server runs on port 5000, and the client runs on port 5173 by default.

## Project Structure

```
freelancer/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Application pages
│   │   ├── slices/         # Redux slices
│   │   └── ...
├── server/                 # Express Backend
│   ├── config/             # DB Config
│   ├── controllers/        # Logic
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Routes
│   ├── middleware/         # Auth & Error handling
│   └── ...
```

## Authors
- Shrey Agrawal
