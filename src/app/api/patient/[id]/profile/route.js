// /api/patient/[id]/profile/route.js
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import Patient from "../../../../../../models/Patient";
import Room from "../../../../../../models/Room";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Patient ID is required" }, { status: 400 });
    }

    // Find patient
    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    // Find the room the patient occupies
    const room = await Room.findOne({ currentPatient: id });

    const profile = {
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      contactNumber: patient.contactNumber,
      email: patient.email,
      address: patient.address,
      medicalHistory: patient.medicalHistory,
      roomNo: room ? room.roomNo : null,
      roomType: room ? room.type : null,
    };

    return NextResponse.json(profile, { status: 200 });
  } catch (err) {
    console.error("GET /patient/[id]/profile error:", err);
    return NextResponse.json(
      { message: "Failed to fetch profile", error: err.message },
      { status: 500 }
    );
  }
}
