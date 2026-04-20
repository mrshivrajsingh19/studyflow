# 🎓 StudyFlow - AI-Powered Study Companion

**End-Term Project — Building Web Applications with React**

---

## 🧠 Problem Statement

**Who is the user?** 
University/college students who self-study and struggle with tracking their progress over time.

**What problem are we solving?** 
Students lack a structured, data-driven system to manage their learning. They take notes in scattered apps, forget what they studied last week, and have no feedback loop on their progress. Without guidance, students resort to passively re-reading everything (inefficient) rather than engaging in spaced repetition (proven effective).

**Why does this matter?** 
Poor study habits and lack of structural planning are significant causes of exam stress. A smart study companion that tracks what you've mastered vs. what needs review—and curates an intelligent daily queue—directly improves learning outcomes and retention.

---

## ✨ Features

- **🛡️ Secure Authentication**: Full user signup and login flow powered by Firebase Authentication.
- **📈 Study Dashboard**: An organized hub displaying upcoming note reviews, a live streak counter, and aggregated study times.
- **🧠 Smart Spaced Repetition**: Notes are powered by an SM-2 spaced repetition algorithmic queue. Users grade their recall (1-5 scale) directly dictating their next review date.
- **📚 Rich Note Editing**: Integrated Markdown support allows for robust, beautifully formatted nested lists and code blocks.
- **⏱️ Live Study Room**: A Pomodoro-style interval timer allowing students to dive into deep focus, with sessions persisting directly to the database.
- **🎨 Dynamic Theming**: Global context manages an automatic Dark/Light UI toggle that persists to `localStorage`.

---

## 🛠️ Tech Stack

### Frontend & UI
- **React 18 (Vite)**: Functional Components, Core Hooks (`useState`, `useEffect`, `useMemo`, `useRef`).
- **React Router v6**: Dynamic Routing, Protected Routes (`<Outlet />` wrappers), Lazy Loading APIs.
- **Tailwind CSS v3**: Beautiful utility-first design without heavy bloated frameworks.
- **Lucide React**: Clean SVG iconography out of the box.

### Backend & Persistent Storage
- **Firebase Auth**: Identifies users securely via Email/Password authentication.
- **Firebase Firestore**: A NoSQL Real-Time database hooking snapshot-listeners directly into the React `AppReducer` for instant cloud-to-UI data updates.

---

## 🏃🏽‍♂️ Setup Instructions

1. **Clone the project**
   ```bash
   git clone <repository_url>
   cd studyflow
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase (Optional)**
   The project ships with an embedded configuration out-of-the-box. If you wish to bind it to your own database, simply update `src/services/firebase.js` with your specific Firebase SDK keys.

4. **Start the local development server**
   ```bash
   npm run dev
   ```

5. **View the Application**
   Open `http://localhost:5173` in your favorite web browser. 

---

*“This project is not just an assignment — it’s your portfolio piece.”*
