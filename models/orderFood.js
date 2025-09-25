import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  food: [{ type: mongoose.Schema.Types.ObjectId, ref: "CanteenFood", required: true }],
  RoomNo: { type: String, required: true },
  total_amount: { type: Number, default: 0 },
  payment_status: { type: String, enum: ["Paid", "Unpaid", "Partially Paid"], default: "Unpaid" },
  status: {type:String,enum:["Delivered","Pending"]}
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
