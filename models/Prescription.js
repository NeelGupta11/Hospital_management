import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    medicines: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        dosage: {
          type: String, // e.g., "1 tablet"
          required: true,
        },
        times: {
          type: [String], // ["morning", "evening"]
          enum: ["morning", "afternoon", "evening", "night"],
          required: true,
        },
        notes: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Prescription ||
  mongoose.model("Prescription", prescriptionSchema);
