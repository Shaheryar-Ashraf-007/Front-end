import { Router } from "express";
import { getSalaries, createSalaries, updateSalary } from '../controllers/salariesController.js';

const router = Router();

router.get("/", getSalaries);
router.post("/", createSalaries);
router.put("/:userId", updateSalary);


export default router;