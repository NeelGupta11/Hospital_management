import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    staff_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    contact_number: { type: String, required: true },
    shift: { type: String, enum: ["Morning", "Evening", "Night"], required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
