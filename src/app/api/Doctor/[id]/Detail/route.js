import { connectDB } from "../../../../../../lib/mongodb";
import Doctor from "../../../../../../models/Doctors";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const id = params.id; // ✅ use params.id directly
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor with this ID not found" },
        { status: 404 }
      );
    }

    // console.log(doctor);
    return NextResponse.json(doctor, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching doctor:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
