# 🚌 BusGo — MERN Bus Booking App

Production-ready bus booking web application built step-by-step.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js (MVC + Service Layer)
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT + bcrypt

## Project Structure
```
bus-booking/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level page components
│   │   ├── context/      # React Context (Auth state)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # Axios API call functions
│   │   └── utils/        # Helper functions
│   └── tailwind.config.js
│
└── backend/           # Express API
    ├── app.js         # Express setup + middleware
    ├── server.js      # DB connect + server start
    └── src/
        ├── controllers/  # Handle req/res
        ├── services/     # Business logic
        ├── models/       # Mongoose schemas
        ├── routes/       # Express routers
        ├── middleware/   # Auth, error, validation
        ├── config/       # DB connection
        └── utils/        # AppError, catchAsync
```

## Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Add your MongoDB URI + JWT secret
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Build Order (Step-by-Step)
1. ✅ Project structure
2. ⏳ Backend: User model + Auth (register/login)
3. ⏳ Backend: Bus model + CRUD
4. ⏳ Backend: Booking system
5. ⏳ Frontend: Auth pages (Login/Register)
6. ⏳ Frontend: Search + Booking UI
7. ⏳ Frontend: Admin panel
