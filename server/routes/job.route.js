import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { analyzeJobDescription } from "../controllers/job.controller.js";

const jobRouter = express.Router();

jobRouter.post("/analyze", isAuth, analyzeJobDescription);

export default jobRouter;
