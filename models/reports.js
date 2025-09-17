import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  title: { type: String, required: true },  // e.g., "Blood Test"
  file: { type: Buffer, required: true },   // store PDF binary
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
