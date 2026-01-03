// import mongoose from "mongoose";

// const reviewSchema = new mongoose.Schema(
//   {
//     entityId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
//     entityType: {
//       type: String,
//       enum: ["interior", "property"],
//       required: true,
//     },
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5,
//       required: true,
//     },
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     comment: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     userName: {
//       type: String,
//       default: "Anonymous",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Review", reviewSchema);
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    entityType: {
      type: String,
      enum: ["interior", "property"],
      required: true,
    },
    userName: {
      type: String,
      default: "Anonymous",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
