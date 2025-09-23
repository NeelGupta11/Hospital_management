// app/api/doctor/login/route.js (or similar path)
import { connectDB } from "../../../../../lib/mongodb";
import Doctor from "../../../../../models/Doctors";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    const { _id } = doctor;

    return NextResponse.json({
      message: "Doctor found",
      doctor: { _id },
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error logging in doctor:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
