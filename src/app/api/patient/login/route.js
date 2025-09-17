import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Patient from "../../../../../models/Patient";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Search for patient by email
    const patient = await Patient.findOne({ email });

    if (!patient) {
      return NextResponse.json(
        { message: "Invalid email" },
        { status: 404 }
      );
    }

    // If found → return patient id
    return NextResponse.json(
      { message: "Login successful", patientId: patient._id },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/patient/login error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
