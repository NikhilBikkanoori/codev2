# Drop Shield - Full-Stack Project

A complete dropout prediction and counseling system with React frontend and Node.js/Express backend.

## Project Structure

```
drop-shield-react/
├── backend/          # Node.js + Express API
├── src/              # React frontend
├── public/           # Static assets
└── package.json      # Frontend dependencies
```

## Prerequisites

- Node.js (LTS version)
- MongoDB (local or Atlas)
- npm

## Setup Instructions

### 1. Backend Setup

```powershell
cd backend
npm install
```

Create `.env` file in `backend/` directory:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dropshield
JWT_SECRET=your_secure_secret_key
```

Start backend server:
```powershell
npm run dev
```

Backend runs on: http://localhost:5000

### 2. Frontend Setup

```powershell
cd ..
npm install
```

Create `.env` file in root directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```powershell
npm start
```

Frontend runs on: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get current user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)

### Sessions
- `GET /api/sessions` - Get all counseling sessions (protected)
- `POST /api/sessions` - Schedule new session (protected)
- `PUT /api/sessions/:id` - Update session (protected)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/stats` - Get dashboard stats (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

## Testing with Postman

1. Register a user:
   - POST http://localhost:5000/api/auth/register
   - Body: `{ "name": "Test User", "email": "test@example.com", "password": "password123", "role": "student" }`

2. Login:
   - POST http://localhost:5000/api/auth/login
   - Body: `{ "email": "test@example.com", "password": "password123" }`
   - Copy the returned token

3. Access protected routes:
   - Add header: `Authorization: Bearer <your_token>`
   - GET http://localhost:5000/api/users/profile

## User Roles

- `student` - Students accessing counseling
- `mentor` - Mentors guiding students
- `parent` - Parents monitoring their children
- `counselor` - Counselors providing sessions
- `admin` - System administrators

## Features

- JWT-based authentication
- Role-based access control
- Profile management
- Session scheduling
- Admin dashboard
- MongoDB integration

## Technologies

**Frontend:**
- React 18
- React Router DOM
- Axios
- Tailwind CSS

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcryptjs
- CORS

## Next Steps

- Deploy backend to Railway/Render
- Deploy frontend to Vercel/Netlify
- Set up MongoDB Atlas
- Configure production environment variables
- Add comprehensive error handling
- Implement unit tests
