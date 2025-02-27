# Bus Booking System API

## Overview
The **Bus Booking System API** is a RESTful service that allows users to register, log in, search for buses, book seats, and manage bookings. The system supports role-based access control (RBAC) for **users** and **admins**, with admins having additional privileges to manage buses.

---
## Features
✅ User authentication and authorization (JWT-based)
✅ Role-based access control (User/Admin)
✅ Bus management (Add, Update, Delete - Admin only)
✅ Booking management (Book, Cancel, View bookings)
✅ Secure API endpoints with JWT authentication
✅ Well-structured API responses

---
## Technologies Used
- **Node.js** (Runtime Environment)
- **Express.js** (Backend Framework)
- **MongoDB** (Database)
- **Mongoose** (ODM for MongoDB)
- **JWT** (Authentication)
- **BCrypt** (Password hashing)
- **Dotenv** (Environment variables)
- **Cors** (Handling CORS policies)

---
## Installation & Setup
### 1. Clone the Repository
```bash
git clone https://github.com/Rajvikash2/Anthill_Task.git
cd BusBooking
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and set the following:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the Server
```bash
npm start
```
Server will run at: `http://localhost:4000`

---
## API Endpoints
### 🔹 **Authentication Routes**

#### **1. User Registration**
**Endpoint:** `POST /api/auth/register`
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "role": "user"
}
```
✔️ **Response:**
```json
{
  "message": "User registered successfully"
}
```

#### **2. User Login**
**Endpoint:** `POST /api/auth/login`
```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```
✔️ **Response:**
```json
{
  "token": "your_jwt_token_here",
  "role": "user"
}
```

---
### 🔹 **Bus Management (Admin Only)**

#### **3. Add a Bus**
**Endpoint:** `POST /api/buses/add`
**Headers:**
- `Authorization: Bearer <your_token>`
```json
{
  "name": "Luxury Bus 1",
  "source": "New York",
  "destination": "Los Angeles",
  "seats": 40,
  "availableSeats": 40,
  "departureTime": "2025-02-25T10:00:00",
  "price": 50
}
```
✔️ **Response:**
```json
{
  "message": "Bus added successfully",
  "bus": { ... }
}
```


---
### 🔹 **Bus & Booking Routes**

#### **4. Get All Buses**
**Endpoint:** `GET /api/buses/`
✔️ **Response:**
```json
[
  { "name": "Luxury Bus 1", "source": "NYC", "destination": "LA", "price": 50 },
  { "name": "Express Bus", "source": "Boston", "destination": "Chicago", "price": 40 }
]
```

#### **5. Book a Bus**
**Endpoint:** `POST /api/bookings/book`
**Headers:** `Authorization: Bearer <your_token>`
```json
{
  "busId": "60d2b3e4b4b6e5f689d0f987",
  "seats": 2
}
```
✔️ **Response:**
```json
{
  "message": "Booking confirmed",
  "booking": { "busId": "60d2b3e4b4b6e5f689d0f987", "seats": 2 }
}
```

#### **6. Cancel Booking**
**Endpoint:** `POST /api/bookings/cancel/:bookingId`
```json
{
  "bookingId": "60d2b3e4b4b6e5f689d0f999"
}
```
✔️ **Response:**
```json
{
  "message": "Booking canceled successfully"
}
```

---
## Authentication & Security
- All protected routes require a **JWT token**.
- Include the token in the **Authorization** header as:
  ```bash
  Authorization: Bearer <your_token>
  ```

---
## Contribution Guidelines
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m 'Added feature'`).
4. Push to branch (`git push origin feature-name`).
5. Open a pull request.

---

## Contact
📩 **Email:** rajvikash.r2022cse@sece.ac.in   
📂 **GitHub:** https://github.com/Rajvikash2

