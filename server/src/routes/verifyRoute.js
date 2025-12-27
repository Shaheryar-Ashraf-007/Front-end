import { Router } from "express";
import { toggleProductVerification } from "../controllers/verifyController";

const router = Router();

router.put("/verify-imel",toggleProductVerification)

export default router;