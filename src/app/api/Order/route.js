// import { connectDB } from "../../../../lib/mongodb";
import { connectDB } from "../../../../lib/mongodb";
import Order from "../../../../models/orderFood";
import Room from "../../../../models/Room";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    // Parse request body
    const body = await req.json();
    const { patient_id, food,total_amount } = body;

    // Fetch Room number of the patient
    const room = await Room.findOne({ currentPatient: patient_id });
    if (!room) {
      return NextResponse.json({ error: "Patient is not assigned to any room" }, { status: 400 });
    }
    const RoomNo = room.roomNo;

    // Validate required fields
    if (!patient_id || !food || food.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate total_amount

    // Create new order
    const newOrder = await Order.create({
      patient_id,
      food,
      RoomNo,
      total_amount,
      payment_status: "Unpaid",  // default
      status: "Pending",         // default
    });
    console.log(newOrder)
    return NextResponse.json({ message: "Order created successfully", order: newOrder }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create order", details: err.message }, { status: 500 });
  }
}
