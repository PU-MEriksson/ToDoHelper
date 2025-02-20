import express from "express";
import { breakdownTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/breakdown", breakdownTask);

export default router;
