# Employee Leave Management System

## Project Overview

This is a full-stack Employee Leave Management System built with React, Node.js, Express, and MongoDB. Employees can submit and view leave requests, while managers can review, approve, or reject them.

---

## Technologies Used

* React
* Vite
* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

---

## Setup Instructions

### Install Dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### Create a `.env` file in the backend

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Seed Demo Users

```bash
npm run seed
```

### Start the Application

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Frontend and Backend

* **Frontend:** React application with employee and manager dashboards.
* **Backend:** Express API with authentication and leave request management.

---

## MongoDB Database Integration

The application uses MongoDB to store:

### Users

* Name
* Email
* Password
* Role

### Leave Requests

* Employee ID
* Leave Type
* Start Date
* End Date
* Reason
* Status
* Created Date
