import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Appointment from "../../../../models/Appointment";
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const appointment = await Appointment.create(body);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET() {
  try {
    await connectDB();
    const appointments = await Appointment.find({})
      .populate("patient")
      .populate("doctor");
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}