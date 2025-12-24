import express from "express";
import { loginController } from "../controllers/loginController.js";
import { middleware } from "../middleware/middleware.js";

const router = express.Router();

router.post("/login", middleware,loginController);

export default router;