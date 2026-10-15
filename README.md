
# Syntecxhub Grocery Store

A full-stack MERN e-commerce web app for buying groceries online. Built during the Web Development Internship at Syntecxhub.

## Features
- User register and login with JWT authentication
- Browse products by category
- Shopping cart
- Checkout with Cash on Delivery
- My Orders page to track order status
- Admin dashboard to manage products and orders

## Tech Stack
- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT, bcryptjs

## Run Locally

### Backend
```
cd backend
npm install
npm run seed
npm run dev
```
Create a `.env` file in `backend` (see `.env.example`):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

### Frontend
```
cd frontend
npm install
npm run dev
```
Create a `.env` file in `frontend` (see `.env.example`):
```
VITE_API_URL=http://localhost:5000
```

## Admin Login (created by seed)
- Email: admin@grocery.com
- Password: admin123
