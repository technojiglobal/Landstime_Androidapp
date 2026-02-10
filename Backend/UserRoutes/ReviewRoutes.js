
//Backend//UserRoutes//ReviewRoutes.js
import express from "express";
import { createReview, getReviews } from "../UserControllers/ReviewController.js";

const router = express.Router();

router.post("/", createReview);
router.get("/:entityType/:entityId", getReviews);

export default router;
