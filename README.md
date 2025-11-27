# COMP3123 Assignment 2 – MERN Employee Management Platform

**Author:** Mateus Sfeir  
**Student ID:** 101484904  
**Course:** COMP3123 – Full Stack Development  

This repository upgrades Assignment 1 into a full-stack Assignment 2 submission.  
It contains a secured Node/Express/MongoDB backend, a React (create-react-app) frontend that consumes the APIs with Axios + TanStack Query, file-upload support, and Docker Compose definitions for MongoDB + backend + frontend.

---

## 🧱 Project Structure

```
.
├── backend/                  # Node/Express API (Assignment 1 -> 2 upgrade)
│   ├── server.js
│   ├── controllers / models / routes / middleware
│   ├── uploads/              # Stored profile pictures (served via /uploads/*)
│   └── package.json
├── frontend/
│   └── 101484904_comp3123_assignment2_reactjs
│       └── src/pages,...     # React Router + MUI + TanStack Query UI
├── docker-compose.yml
└── README.md
```

---

## ✅ Backend Highlights

- Node.js, Express 5, MongoDB (Mongoose) with robust validation via `express-validator`.
- JWT authentication for `/api/v1/emp/*` routes, bcrypt-secured passwords, and session tokens returned on signup/login.
- Employee CRUD including `/employees/search` (filter by department/position) and multipart profile-picture uploads (Multer).
- Static serving of uploaded files via `/uploads/<filename>`.
- Centralized error handling and comprehensive status codes/messages.

### API Surface

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/user/signup` | Register user, hashes password, returns token |
| POST | `/api/v1/user/login` | Login via email or username, returns token |
| GET | `/api/v1/emp/employees` | List employees (protected) |
| GET | `/api/v1/emp/employees/search?department=...&position=...` | Filter employees |
| POST | `/api/v1/emp/employees` | Create employee + picture upload |
| GET | `/api/v1/emp/employees/:eid` | Get employee details |
| PUT | `/api/v1/emp/employees/:eid` | Update employee + picture upload |
| DELETE | `/api/v1/emp/employees/:eid` | Delete employee and stored picture |

---

## 💻 Frontend Highlights (`frontend/101484904_comp3123_assignment2_reactjs`)

- React 18 (Create React App) with React Router DOM for `Login`, `Signup`, `Employees`, `Add`, `Update`, and `View` screens.
- Material UI components for responsive tables/forms resembling the assignment mock-ups.
- TanStack Query for data fetching, caching, mutations, and DevTools.
- Axios API client with interceptor to attach bearer tokens from `localStorage`.
- Profile-picture upload + preview, filter/search form, and optimistic delete feedback.

---

## ⚙️ Environment Setup (Manual)

### Backend
```bash
cd backend
cp .env.example .env      # update MONGO_URI, JWT_SECRET, etc.
npm install
npm run dev               # or npm start for production
```
The API listens on `PORT` (default 8080). Uploaded images are stored under `backend/uploads/`.

### Frontend
```bash
cd frontend/101484904_comp3123_assignment2_reactjs
cp .env.example .env      # set REACT_APP_API_URL (default http://localhost:8080/api/v1)
npm install
npm start                 # runs CRA dev server on http://localhost:3000
```

---

## 🐳 Docker Compose (Backend + Frontend + MongoDB)

1. Copy the environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/101484904_comp3123_assignment2_reactjs/.env.example \
      frontend/101484904_comp3123_assignment2_reactjs/.env
   ```
2. Start the stack:
   ```bash
   docker-compose up --build
   ```
   - MongoDB → `mongodb://localhost:27017/comp3123`
   - Backend → http://localhost:8080
   - Frontend → http://localhost:3000 (uses `REACT_APP_API_URL=http://backend:8080/api/v1`)

The backend container mounts `./backend/uploads` so files persist between restarts.

---

## 📸 File Upload Notes
- Accepted files: image MIME types only, up to 2 MB (configurable in `backend/middleware/upload.js`).
- Uploaded files are stored with unique names in `/uploads` and exposed via `/uploads/<filename>`.
- Updating an employee with a new picture deletes the old file automatically.

---

## 🔐 Authentication & Session Handling
- Signup/Login responses contain `{ token, user }`.  
- Frontend stores the token + user in `localStorage` and attaches the token to every Axios call.
- Protected routes (Employees, Add, Edit, etc.) use a `ProtectedRoute` wrapper and redirect to `/login` when the session expires.

---

## 🧪 Next Steps
- Run `npm audit fix` (backend/frontend) if you need stricter dependency security.
- Extend the UI with charts or pagination if required for presentation.

This setup now satisfies both Assignment 1 (backend) and Assignment 2 (full stack) requirements in a single repository. 🎉
