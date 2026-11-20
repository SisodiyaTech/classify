# Classify — Small-Batch Interactive Live Coaching Marketplace

**Classify** is a modern, responsive, production-quality EdTech marketplace connecting students with verified instructors for small-batch live classes. Unlike traditional pre-recorded course platforms, Classify emphasizes interactive cohort learning, personal mentorship, student-teacher interaction, and flexible income opportunities for skilled individuals and home educators.

---

## 🎯 Core Concept & Business Rules

1. **Small-Batch Cohort Learning**:
   - Batches have a **strict hard limit of 50 students**.
   - Default recommended cohort size is **10–15 students** for high engagement.
   - Batch capacity is strictly enforced on both frontend and backend (no over-enrollment).
2. **Verified Instructor Quality**:
   - Instructors must submit verification documents (ID, credentials, intro video).
   - Only **admin-approved** instructors can publish courses and schedule cohorts.
3. **Escrow & Commission Model**:
   - Students enroll through secure checkout.
   - Platform automatically tracks instructor payouts (85%) and platform fees (15%).
4. **Interactive Live Classroom**:
   - Real-time room presence powered by Socket.io.
   - Audio/video controls, screen sharing, live chat, and student hand-raising.
   - Only enrolled students and assigned instructors can access scheduled live sessions.

---

## 🧱 Architecture & Tech Stack

### Frontend (`/frontend`)
- **Framework**: React 19 + Vite (JavaScript ES6+, modular component hierarchy)
- **Styling**: Tailwind CSS with custom design tokens:
  - Primary: `#176B5B`
  - Dark: `#102A2A`
  - Secondary: `#12483F`
  - Accent: `#D9BC83`
  - Background: `#F8F7F2`
  - Text: `#344054`
  - Border: `#E5E7EB`
- **Routing**: React Router DOM (v7) with role-based guards (`Student`, `Instructor`, `Admin`, `Public`)
- **State Management**:
  - `AuthContext`: Real JWT auth synced with backend + instant demo role switcher fallback
  - `AppContext`: Reactive data layer for courses, batches, classes, and assignments
  - `ToastContext`: Unified notification system
- **Icons & Charts**: Lucide React + Recharts
- **Live Classroom**: Real-time Socket.io client (`socket.io-client`)

### Backend (`/backend`)
- **Runtime**: Node.js & Express
- **Database**: MongoDB Atlas with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Real-Time Sockets**: Socket.io classroom signaling (cohort rooms, chat, hand raise, presence)
- **Security & Headers**: Helmet, CORS, Morgan request logging
- **File Uploads**: Multer configured for verification docs & assignments

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ & npm
- MongoDB Atlas or local MongoDB instance

### 2. Backend Setup
```bash
cd backend
npm install
```

Configure your environment variables in `backend/.env` (sample provided in `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/classify?retryWrites=true&w=majority
JWT_SECRET=classify_super_secret_jwt_key_2025
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
PLATFORM_COMMISSION_PERCENT=15
```

Seed initial demo data (users, courses, batches, and live sessions):
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev   # Runs with nodemon on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Configure environment in `frontend/.env` (optional, defaults to proxy):
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev   # Runs on http://localhost:5173
```

---

## 👥 Demo Accounts (Pre-configured via Seed)

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@classify.com` | `Admin@123` | Platform oversight, course approvals, instructor verification |
| **Instructor (Approved)** | `sarah@classify.com` | `Sarah@123` | Verified teacher with active courses & cohorts |
| **Instructor (Pending)** | `marcus@classify.com` | `Marcus@123` | Application submitted, awaiting review |
| **Student** | `alex@classify.com` | `Alex@123` | Enrolled student with live classes & assignments |

*Note: You can also use the floating **Demo Role Switcher** badge in the bottom-right corner to test all roles without re-logging in.*

---

## 📡 REST API Summary

### Authentication (`/api/v1/auth`)
- `POST /register` — Register as Student or Instructor
- `POST /login` — Login with email & password
- `GET /me` — Get current authenticated user profile
- `POST /forgot-password` & `POST /reset-password` — Password recovery

### Courses (`/api/v1/courses`)
- `GET /` — Filterable course discovery (categories, price, rating, search)
- `GET /:id` — Detailed course info with approved batches and instructor profile
- `POST /` — Create new course (Instructors only)
- `PUT /:id` — Update course

### Batches (`/api/v1/batches`)
- `GET /` — Browse batches
- `GET /course/:courseId` — Get cohorts for a course
- `POST /` — Create cohort (Enforces `maxCapacity <= 50`)

### Enrollments & Checkout (`/api/v1/enrollments`)
- `POST /create-checkout` — Enroll in a batch with capacity validation & escrow calculation
- `GET /my-learning` — Student's enrolled courses and cohorts

### Live Classes (`/api/v1/classes`)
- `GET /my-schedule` — Upcoming classes for enrolled students and instructors
- `GET /:id` — Get live class metadata and eligibility check

### Admin (`/api/v1/admin`)
- `GET /stats` — Platform metrics (revenue, instructors, students, cohorts)
- `GET /instructors` & `PATCH /instructors/:id/status` — Review and approve instructor applications
- `GET /courses` & `PATCH /courses/:id/status` — Approve or reject submitted courses

---

## 🛡️ License
MIT License. Built for modern interactive education.
