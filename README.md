# 🗳️ Voting System (MERN Stack)

A secure and user-friendly **online voting system** built using **MongoDB, Express.js, React.js, and Node.js**, where **voters** can cast their votes and **admins** can manage candidates.

---

## 🚀 Features

- 🔐 Authentication for both voters and admins  
- ✅ One vote per voter (strictly enforced)  
- 🧑‍💼 Admin dashboard to add or delete candidates  
- 🔍 Search candidates and voters using RegEx (fuzzy search)  
- 📊 View live election results (sorted by votes)  
- 🎨 Clean, responsive UI with role-based access  

---

## 🧱 Tech Stack

Frontend: React.js, React Router, Axios  
Backend: Node.js, Express.js, JWT  
Database: MongoDB, Mongoose

---

## 📂 Folder Structure

VotingSystem/  
├── backend/  
│   ├── models/  
│   ├── routes/  
│   ├── controllers/  
│   ├── middleware/  
│   └── server.js  
├── frontend/  
│   ├── src/  
│   │   ├── components/  
│   │   ├── pages/  
│   │   ├── api/  
│   │   └── App.js  
├── .env  
├── README.md  
└── package.json  

---

## ⚙️ Setup Instructions

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/voting
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔐 User Roles

**Voter**  
- Can register and login  
- Can view candidates and vote only once  
- Cannot add/delete candidates  

**Admin**  
- Can login with role `admin`  
- Can add/delete candidates  
- Cannot vote  

---

## 🔌 API Endpoints

**Auth**  
- POST `/api/user/register` – Register  
- POST `/api/user/login` – Login  

**Voting**  
- POST `/api/candidate/vote` – Submit vote  

**Candidate**  
- GET `/api/candidate/candidates` – View candidates  
- POST `/api/candidate/add` – Add candidate (admin only)  
- DELETE `/api/candidate/delete/:id` – Delete candidate (admin only)  
- GET `/api/candidate/results` – View results  
- GET `/api/candidate/search?q=xyz` – Search candidates  

---

## 🧠 Learnings

- Role-based login system with JWT  
- MongoDB + RegEx for powerful search  
- React Router navigation & state  
- Conditional rendering based on role  
- Full-stack integration with clean UI/UX  

---

## 📄 License

MIT © [Kishan M C]