import { connectDB } from "../../../../../lib/mongodb";
import CanteenFood from "../../../../../models/CanteenFood";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const allFood = await CanteenFood.find({}); 

    return NextResponse.json({ message: "All food fetched successfully", data: allFood });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Something went wrong", error: err.message }, { status: 500 });
  }
}
