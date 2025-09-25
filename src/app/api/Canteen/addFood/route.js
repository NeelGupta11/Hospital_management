import { connectDB } from "../../../../../lib/mongodb";
import CanteenFood from "../../../../../models/CanteenFood";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, price,FoodType, type } = body;


    let food = await CanteenFood.findOne({ name });

    if (food) {

      food.price = price !== undefined ? price : food.price;
      await food.save();
      return NextResponse.json({ message: "Food updated successfully", data: food });
    } else {

      const newFood = await CanteenFood.create({ name, price, FoodType ,type });
      return NextResponse.json({ message: "Food added successfully", data: newFood });
    }

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Something went wrong", error: err.message }, { status: 500 });
  }
}
