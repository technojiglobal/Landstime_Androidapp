import express from "express";
import { adminLogin } from "../AdminControllers/AdminController.js";

const router = express.Router();

router.post("/login", adminLogin);

export default router;
