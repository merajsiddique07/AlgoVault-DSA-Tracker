# 🚀 AlgoVault — DSA Problem Tracker (MERN Stack)

A modern, responsive, full-stack MERN (MongoDB, Express, React, Node.js) web application to record, track, and master Data Structures & Algorithms problems.

---

## ✨ Features

- **Problem Tracking**:
  - **Problem Name** with platform badges (LeetCode, GFG, Codeforces, HackerRank, etc.) and direct links
  - **Approach Used** (Intuition, step-by-step logic, edge cases)
  - **Complexities**: Time Complexity (e.g. \(O(N \log N)\)) and Space Complexity (e.g. \(O(1)\))
  - **Solution Code Snippet** with copy-to-clipboard button and multi-language support (C++, Java, Python, JS, TS, Go)
  - **Last Access Time**: Formatted relative time (e.g., *"Accessed 2 hours ago"*) with 1-click **"Mark Reviewed Today"**
  - **When Stored**: Exact timestamp & relative date of when the problem was created
  - **Revision Counter**: Automatically tracks how many times you've reviewed each problem
  - **Difficulty**: Color-coded badges for Easy (Emerald), Medium (Amber), Hard (Rose)
  - **Status**: *Need Revision*, *In Progress*, *Mastered*
  - **Starred / Favorites**: Quick bookmarking for crucial interview problems
- **Theme Support**:
  - **Dark Theme**: Deep sleek slate (`#0B0F17`, cards `#111827`, borders `#334155`)
  - **Light Theme**: Crisp white and cool gray (`#F8FAFC`, cards `#FFFFFF`, borders `#E2E8F0`)
  - Smooth animated toggle & persistent preference saved in `localStorage`
- **Views**:
  - **Grid Cards View**: Rich visual problem cards with collapsible approaches and quick review triggers
  - **Table View**: Compact, spreadsheet-style list view for power users
- **Search, Filter & Sort**:
  - Full-text search across problem name, approach, notes, topic, and tags
  - Topic pill filters (Arrays, Two Pointers, Sliding Window, DP, Trees, Graphs, etc.)
  - Filter by Difficulty (Easy, Medium, Hard) and Status (Need Revision, Mastered, etc.)
  - Sort by *Recently Accessed*, *Oldest Accessed*, *When Stored (Newest/Oldest)*, *Difficulty*, *A-Z*
- **Analytics & Spaced Repetition**:
  - Total solved count
  - Difficulty distribution progress bars
  - **Needs Revision alert**: Highlights problems not reviewed in the last 7 days
  - Mastered percentage rate
- **Backup & Portability**:
  - 1-click JSON export to backup your DSA sheet

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Canvas Confetti, Axios
- **Backend**: Node.js, Express.js, Mongoose ODM, CORS, Morgan, Dotenv
- **Database**: MongoDB (Local or MongoDB Atlas)

---

## 🚀 Running the Project

### Option 1: Run Both Client & Server Concurrently
```bash
npm run dev
```
- Frontend runs on: `http://localhost:5173`
- Backend API runs on: `http://localhost:5000`

### Option 2: Run Separately
```bash
# Terminal 1 - Backend Server
npm run server

# Terminal 2 - Frontend Client
npm run client
```

---

## ⚙️ Environment Configuration

Backend configuration is located at `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/dsatracker
NODE_ENV=development
```
If using MongoDB Atlas in the cloud, simply replace `MONGODB_URI` with your connection string.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/problems` | List problems with search, filters & sort |
| `GET` | `/api/problems/:id` | Get single problem details |
| `POST` | `/api/problems` | Store a new problem |
| `PUT` | `/api/problems/:id` | Update an existing problem |
| `PATCH` | `/api/problems/:id/access` | Mark as accessed / reviewed today |
| `PATCH` | `/api/problems/:id/favorite` | Toggle favorite / star |
| `DELETE` | `/api/problems/:id` | Delete a problem record |
| `GET` | `/api/problems/stats` | Dashboard statistics |
| `POST` | `/api/problems/seed` | Pre-load popular sample problems |
