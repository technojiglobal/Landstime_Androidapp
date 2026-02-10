//Backend//UserControllers//ReviewController.js
import Review from "../UserModels/Review.js";

/* ---------- SUBMIT REVIEW ---------- */
export const createReview = async (req, res) => {
  try {
    const { entityId, entityType, rating, title, comment, userName } = req.body;

    if (!entityId || !entityType || !rating || !title || !comment) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const review = await Review.create({
      entityId,
      entityType,
      rating,
      title,
      comment,
      userName,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------- GET REVIEWS ---------- */
export const getReviews = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const reviews = await Review.find({ entityType, entityId })
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.reduce((a, b) => a + b.rating, 0) / (reviews.length || 1);

    res.json({
      reviews,
      avgRating: Number(avgRating.toFixed(1)),
      count: reviews.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
