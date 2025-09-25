import mongoose from "mongoose";

const canteenFoodSchema = new mongoose.Schema(
  {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      FoodType:{type: String, enum: ["Drink", "Starter","Main Course"], default: "Veg"},
      type: { type: String, enum: ["Veg", "Nonveg"], default: "Veg" },
  },
  { timestamps: true }
);

export default mongoose.models.CanteenFood || mongoose.model("CanteenFood", canteenFoodSchema);
