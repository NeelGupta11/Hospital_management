import { connectDB } from "../../../../../../lib/mongodb";
import Report from "../../../../../../models/reports";
import Patient from "../../../../../../models/Patient";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");

    if (!file || !title) {
      return NextResponse.json({ error: "Missing file or title" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const report = new Report({
      patient: id,
      title,
      file: buffer,
    });

    await report.save();

    return NextResponse.json({ message: "Report uploaded successfully", report });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// GET -> fetch all reports for a patient
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found", reports: [] }, { status: 404 });
    }

    const reports = await Report.find({ patient: id })
      .select("-file") // exclude large binary data
      .sort({ createdAt: -1 });

    return NextResponse.json({ reports });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

