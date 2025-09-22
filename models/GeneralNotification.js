import mongoose from "mongoose";

const GeneralNotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "alert", "announcement"],
      default: "info",
    },
    link: {
      type: String, // optional URL to navigate when clicking notification
      default: null,
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

export default mongoose.models.GeneralNotification ||
  mongoose.model("GeneralNotification", GeneralNotificationSchema);
