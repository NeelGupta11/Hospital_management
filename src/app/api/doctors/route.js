import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Doctor from "../../../../models/Doctors";

// GET all doctors
export async function GET() {
  try {
    await connectDB();
    const doctors = await Doctor.find({});
    return NextResponse.json(doctors, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching doctors:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new doctor
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const doctor = await Doctor.create(body);
    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating doctor:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
