import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"
import mockTestRouter from "./routes/mockTest.route.js"
import jobRouter from "./routes/job.route.js"
import resumeRouter from "./routes/resume.route.js"

import rateLimit from "express-rate-limit"

const app = express()

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests from this IP, please try again after 15 minutes." }
})

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:") || origin === "https://careernexa-ai-mernclient.onrender.com") {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api", apiLimiter)
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/mock-test", mockTestRouter)
app.use("/api/job", jobRouter)
app.use("/api/resume", resumeRouter)

const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDb()
})
