import { connectDB } from "../../../../../lib/mongodb"; 
import Patient from "../../../../../models/Patient";

export async function POST(request) {
  try {
    await connectDB(); 
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return Response.json(
        { error: "Name and Email are required" },
        { status: 400 }
      );
    }

    // Create new patient
    const newPatient = await Patient.create({
      name: body.name,
      age: body.age,
      gender: body.gender,
      contactNumber: body.contactNumber,
      email: body.email,
      address: body.address,
      medicalHistory: body.medicalHistory || [],
    });

    return Response.json(
      { message: "Patient registered successfully", patient: newPatient },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    // Handle duplicate email error
    if (err.code === 11000) {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }
    return Response.json({ error: "Failed to register patient" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const patients = await Patient.find();
    return Response.json(patients, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Failed to fetch patients", error: error.message },
      { status: 500 }
    );
  }
}