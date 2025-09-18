import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dosageForm: {
      type: String, // e.g., tablet, syrup
    },
    strength: {
      type: String, // e.g., 500mg
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Medicine ||
  mongoose.model("Medicine", medicineSchema);
