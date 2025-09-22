import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    roomNo: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    occupy: {
      type: Boolean,
      default: false,
    },
    currentPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },
    type: {
      type: String,
      enum: ["ICU", "General", "Deluxe", "Private"],
      default: "General",
    },
    beds: {
      type: Number,
      default: 1,
      min: 1,
    },
    pricePerDay: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Room ||
  mongoose.model("Room", RoomSchema);
