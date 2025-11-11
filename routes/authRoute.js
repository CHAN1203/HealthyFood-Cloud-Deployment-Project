import express from "express";
import { login, loginPage } from "../controllers/authController.js";

const router = express.Router();

router.get("/", loginPage);  // Show login page
router.post("/login", login); // Handle login submission

export default router;
