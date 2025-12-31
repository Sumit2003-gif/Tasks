# 🚀 Prime-Trade-Task: Scalable Task Management System

A production-ready Full-Stack Task Management application with secure authentication, user profile management, and an interactive task dashboard.

## 🌟 Key Features
- **User Authentication:** Secure Signup/Login with JWT and bcrypt password hashing.
- **Task Dashboard:** Full CRUD (Create, Read, Update, Delete) operations for personal tasks.
- **User Profile:** Editable profile with real-time character counting (Bio) and server-side validation.
- **Responsive UI:** Modern design built with Tailwind CSS and Framer Motion.
- **Data Integrity:** Server-side input validation using `express-validator` to prevent empty fields.

## 🛠️ Tech Stack
- **Frontend:** React 19, Redux Toolkit, Tailwind CSS, Framer Motion.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose).
- **Validation:** Express-Validator (Backend).

---

## 🚀 Production Scaling Strategy (100k+ Users)
As per assignment requirements, here is the strategy to scale this application:
1. **Horizontal Scaling:** Deploying multiple backend instances behind a **Load Balancer** (like Nginx).
2. **Caching:** Implementing **Redis** for frequently accessed data like user profiles.
3. **Database Optimization:** Adding indexes on `user_id` and `status` fields in MongoDB for faster queries.
4. **Microservices:** Decoupling Auth and Task services to scale them independently.

---

## 📦 Project Structure
```text
Prime-trade-task/
├── frontend/        # React + Vite source code
├── backend/         # Node + Express API source code
├── README.md        # Project documentation
└── Prime_Trade_APIs.json # Postman collection
⚙️ Setup Instructions
Clone the repo: git clone <your-repo-link>

Backend: Run npm install inside the backend folder and set up your .env.

Frontend: Run npm install inside the frontend folder.

Start: Run npm run dev in both folders.
