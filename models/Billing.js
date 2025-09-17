import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
  payment_date: { type: Date }
});

const BillingSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  items: [ItemSchema],
  total_amount: { type: Number, default: 0 },
  overall_status: { type: String, enum: ["Paid", "Unpaid", "Partially Paid"], default: "Unpaid" }
});


export default mongoose.models.Billing || mongoose.model("Billing", BillingSchema);
