// import express from "express";
// import {
//   createReview,
//   getReviews,
// } from "../UserControllers/ReviewController.js";

// const router = express.Router();

// router.post("/reviews", createReview);
// router.get("/reviews/:entityType/:entityId", getReviews);

// export default router;
import express from "express";
import { createReview, getReviews } from "../UserControllers/ReviewController.js";

const router = express.Router();

router.post("/", createReview);
router.get("/:entityType/:entityId", getReviews);

export default router;
