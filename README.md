# 🚀 CareerNexa.AI

> An AI-powered career accelerator built with the MERN stack — helping job seekers prep smarter through mock interviews, targeted tests, and real-time AI feedback.

---

## 🤖 What CareerNexa.AI Offers

### 🎙️ AI-Powered Mock Interviews
Engage in dynamic, role-specific mock interview sessions driven by a large language model (via OpenRouter). The AI acts as your interviewer — asking relevant, context-aware questions, evaluating your responses, and adapting the conversation flow just like a real interview panel would. No scripts. No repetition. Just smart, evolving conversations that push your limits.

### 📝 Core Subject Mock Tests
Not just interviews — CareerNexa.AI offers structured mock tests across fundamental Computer Science subjects: **Data Structures & Algorithms (DSA)**, **Object-Oriented Programming (OOPs)**, **Database Management Systems (DBMS)**, and **Operating Systems (OS)**. These are the exact topics that top tech companies test in their hiring rounds. Timed, scored, and AI-evaluated — so you know exactly where you stand before the real thing.

### 📄 Intelligent Job Analyzer
Paste any job description and let CareerNexa.AI's Job Analyzer do the heavy lifting. It cross-references the JD against your profile, highlights skill gaps, identifies keywords, and tells you exactly where you stand — so you walk into every application with clarity and confidence.

### 📊 Progress Tracking & Performance Reports
Every session is logged. Every answer is evaluated. CareerNexa.AI maintains a detailed history of your mock interviews and tests, surfacing trends in your performance — what's improving, what needs work, and how you stack up over time. Your growth is measurable, and your dashboard makes it visible.

### 🔐 Secure Google Authentication
Authentication is handled through Firebase's Google OAuth — fast, secure, and frictionless. No passwords to manage, no email verification loops. Sign in with Google and get straight to what matters.

### 💳 Premium Features via Razorpay
CareerNexa.AI includes a fully integrated Razorpay payment gateway, enabling access to advanced features through a seamless in-app payment experience. Premium access unlocks deeper analytics, expanded question banks, and more.

---

## 💡 Why CareerNexa.AI?

- **Real AI, not templates** — interview sessions and core subject tests (DSA, OOPs, DBMS, OS) are powered by a live language model, not pulled from a static question bank.
- **End-to-end career tooling** — from job description analysis to mock tests, interview prep, and performance tracking, all in one platform.
- **Production-grade architecture** — built with scalability, clean separation of concerns, and modern full-stack best practices.
- **Integrated payment system** — a complete monetization layer with Razorpay, ready for real-world deployment.
- **Smooth UX** — Framer Motion animations and a Tailwind-powered interface make every interaction feel polished and intentional.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Redux Toolkit, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| AI Engine | OpenRouter (LLM Integration) |
| Auth | Firebase (Google OAuth) |
| Payments | Razorpay |
| External APIs | RapidAPI |

---

## 📂 Project Structure

```
careernexa-ai-mern/
├── client/           # React frontend (Vite)
├── server/           # Node.js backend
├── .env.example      # Environment variable template
└── README.md         # Project documentation
```

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB account / URI
- Firebase Project (for Auth)
- Razorpay account (for payments)
- OpenRouter API key (for AI features)

### 1. Environment Configuration

Copy the `.env.example` file to both `client/` and `server/` directories and fill in your credentials.

**Backend (`server/.env`):**

```env
PORT=8000
MONGODB_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

**Frontend (`client/.env`):**

```env
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 2. Backend Installation

```bash
cd server
npm install
npm run dev
```

### 3. Frontend Installation

```bash
cd client
npm install
npm run dev
```

---

## 📜 License

ISC License

---

*CareerNexa.AI — Where AI meets ambition.*
