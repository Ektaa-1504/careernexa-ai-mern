# InterviewIQ.AI

An AI-powered mock interview preparation platform built with the MERN stack.

## 🚀 Features

- **AI Mock Interviews**: Interactive interview sessions powered by AI.
- **Job Analyzer**: Analyze job descriptions and match with your resume.
- **Progress Tracking**: Detailed history and reports of your performance.
- **Secure Authentication**: Google Auth via Firebase.
- **Premium Features**: Integrated payments for advanced features.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Redux Toolkit, Framer Motion, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Services**: Firebase Auth, Razorpay, OpenRouter (AI), RapidAPI

## 📂 Project Structure

```text
3.interviewIQ/
├── client/           # React frontend (Vite)
├── server/           # Node.js backend
├── .env.example      # Environment variable template
└── README.md         # Project documentation
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB account/URI
- Firebase Project (for Auth)
- Razorpay account (for payments)

### 1. Environment Configuration
Copy the `.env.example` file to both `client/` and `server/` directories and fill in your credentials.

**Backend Setup (`server/.env`):**
```env
PORT=8000
MONGODB_URL=...
JWT_SECRET=...
# ... other keys
```

**Frontend Setup (`client/.env`):**
```env
VITE_FIREBASE_APIKEY=...
VITE_RAZORPAY_KEY_ID=...
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

## 📜 License

ISC License
