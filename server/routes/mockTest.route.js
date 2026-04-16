import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  startMockTest,
  submitMockTest,
  getMockTestHistory,
} from "../controllers/mockTest.controller.js";

const mockTestRouter = express.Router();

mockTestRouter.post("/start", isAuth, startMockTest);
mockTestRouter.post("/submit", isAuth, submitMockTest);
mockTestRouter.get("/history", isAuth, getMockTestHistory);

export default mockTestRouter;
