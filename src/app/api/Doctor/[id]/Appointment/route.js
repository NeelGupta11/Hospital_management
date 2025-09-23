import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import Appointment from "../../../../../../models/Appointment";
import Patient from "../../../../../../models/Patient";   // 👈 import ensures schema is registered
import Doctor from "../../../../../../models/Doctors"; 
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params; 

    const appointments = await Appointment.find({ doctor: id })
      .populate("patient", "name email")
      .populate("doctor", "name specialization");

    if (!appointments.length) {
      return NextResponse.json(
        { message: "No appointments found for this patient." },
        { status: 404 }
      );
    }
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching patient appointments:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
