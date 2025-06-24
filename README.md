# 🗳️ Voting System Backend

This is a secure backend system that allows **registered voters** to cast a **single vote** for a candidate. **Admins** can manage candidates but **cannot vote**. The system uses **MongoDB** and **Mongoose** for data persistence.

---

## 📂 Features

- User authentication for **voters** and **admins**
- **One-vote-per-voter** enforcement
- **Admin-only** candidate management (add/delete)
- **Live results** sorted by vote count
- Secure password handling with hashing
- RESTful API structure

---

## 📚 Models

### 🔐 Voter Model
| Field     | Type     | Description                         |
|-----------|----------|-------------------------------------|
| username  | String   | Required for admin login            |
| password  | String   | Hashed password                     |
| role      | String   | 'voter' or 'admin'                  |
| voterid   | String   | Unique government-issued ID (voter only) |
| hasVoted  | Boolean  | Indicates whether voter has voted   |

### 🧑‍💼 Candidate Model
| Field       | Type     | Description                     |
|-------------|----------|---------------------------------|
| name        | String   | Candidate's name                |
| candidateId | String   | Unique identifier (auto or UUID)|
| votes       | Number   | Number of votes received        |

---

## 🔌 API Endpoints

### 🧾 Authentication
- `POST /api/voter/register`  
  Register as a voter or admin (`{ username, password, role, voterid }`)

- `POST /api/voter/login`  
  Login:
  - Voter → `{ voterid, password }`
  - Admin → `{ username, password }`

---

### ✅ Voting
- `GET /api/candidate/candidates`  
  Get the list of all candidates

- `POST /api/candidate/vote`  
  Vote for a candidate (only one vote per voter)  
  **Body**: `{ candidateId }`

---

### 📊 Vote Results
- `GET /api/candidate/results`  
  Get live results sorted by highest votes

---

### 🛠️ Admin - Candidate Management
- `POST /api/candidate/add`  
  Add a new candidate (`{ name }`)

- `DELETE /api/candidate/delete/:candidateId`  
  Delete a candidate by ID

---

## 💾 CRUD Operations

### CREATE
- Register user:  
  `Voter.create({ username, password, role, voterid })`

- Add candidate:  
  `Candidate.create({ name })`

### READ
- Get voter (by `voterid` or `username`)  
  `Voter.findOne({ voterid })` / `Voter.findOne({ username })`

- Get all candidates:  
  `Candidate.find()`

- Get results sorted:  
  `Candidate.find().sort({ votes: -1 })`

### UPDATE
- Cast a vote:
  ```js
  candidate.votes += 1;
  await candidate.save();
  voter.hasVoted = true;
  await voter.save();
  
### DELETE
- Delete candidate:

```js
Copy code
Candidate.findOne({ candidateId })
Candidate.deleteOne({ candidateId })

# 🗳️ Voting System Backend

This is a secure backend system that allows **registered voters** to cast a **single vote** for a candidate. **Admins** can manage candidates but **cannot vote**. The system uses **MongoDB** and **Mongoose** for data persistence.

---

## 📂 Features

- User authentication for **voters** and **admins**
- **One-vote-per-voter** enforcement
- **Admin-only** candidate management (add/delete)
- **Live results** sorted by vote count
- Secure password handling with hashing
- RESTful API structure

---

## 📚 Models

### 🔐 Voter Model
| Field     | Type     | Description                         |
|-----------|----------|-------------------------------------|
| username  | String   | Required for admin login            |
| password  | String   | Hashed password                     |
| role      | String   | 'voter' or 'admin'                  |
| voterid   | String   | Unique government-issued ID (voter only) |
| hasVoted  | Boolean  | Indicates whether voter has voted   |

### 🧑‍💼 Candidate Model
| Field       | Type     | Description                     |
|-------------|----------|---------------------------------|
| name        | String   | Candidate's name                |
| candidateId | String   | Unique identifier (auto or UUID)|
| votes       | Number   | Number of votes received        |

---

## 🔌 API Endpoints

### 🧾 Authentication
- `POST /api/voter/register`  
  Register as a voter or admin (`{ username, password, role, voterid }`)

- `POST /api/voter/login`  
  Login:
  - Voter → `{ voterid, password }`
  - Admin → `{ username, password }`

---

### ✅ Voting
- `GET /api/candidate/candidates`  
  Get the list of all candidates

- `POST /api/candidate/vote`  
  Vote for a candidate (only one vote per voter)  
  **Body**: `{ candidateId }`

---

### 📊 Vote Results
- `GET /api/candidate/results`  
  Get live results sorted by highest votes

---

### 🛠️ Admin - Candidate Management
- `POST /api/candidate/add`  
  Add a new candidate (`{ name }`)

- `DELETE /api/candidate/delete/:candidateId`  
  Delete a candidate by ID

---

## 💾 CRUD Operations

### CREATE
- Register user:  
  `Voter.create({ username, password, role, voterid })`

- Add candidate:  
  `Candidate.create({ name })`

### READ
- Get voter (by `voterid` or `username`)  
  `Voter.findOne({ voterid })` / `Voter.findOne({ username })`

- Get all candidates:  
  `Candidate.find()`

- Get results sorted:  
  `Candidate.find().sort({ votes: -1 })`

### UPDATE
- Cast a vote:
  ```js
  candidate.votes += 1;
  await candidate.save();
  voter.hasVoted = true;
  await voter.save();

### DELETE
- Delete candidate:

```js

Candidate.findOne({ candidateId })
Candidate.deleteOne({ candidateId })