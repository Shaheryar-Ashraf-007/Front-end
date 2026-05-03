import { Router } from "express";
import { createUsers, deleteUsers, getUsers, updateCustomer } from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUsers);
router.delete("/", deleteUsers)
router.put("/:userId", updateCustomer);


export default router;