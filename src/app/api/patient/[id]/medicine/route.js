import { connectDB } from "../../../../../../lib/mongodb";
import Patient from "../../../../../../models/Patient";
import Prescription from "../../../../../../models/Prescription";
import Medicine from "../../../../../../models/Medicine";
import { NextResponse } from "next/server";
export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id: patientId } = params;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, strength, dosageForm, dosage, times, notes } = body;

    if (!name || !times) {
      return NextResponse.json({ error: "Medicine name and times are required" }, { status: 400 });
    }

    // Find medicine by name, strength, dosageForm
    let medicine = await Medicine.findOne({ name, strength, dosageForm });
    if (!medicine) {
      // Create new medicine if not exists
      medicine = new Medicine({ name, strength: strength || "", dosageForm: dosageForm || "", notes: notes || "" });
      await medicine.save();
    }

    // Find Prescription document for patient
    let prescription = await Prescription.findOne({ patient: patientId });

    if (!prescription) {
      // Create prescription document if it doesn't exist
      prescription = new Prescription({ patient: patientId, medicines: [] });
    }

    // Check if this medicine already exists in the array
    const existingIndex = prescription.medicines.findIndex(
      (m) => m.medicine.toString() === medicine._id.toString()
    );

    if (existingIndex > -1) {
      // Update existing medicine entry
      if (dosage) prescription.medicines[existingIndex].dosage = dosage;
      if (times) prescription.medicines[existingIndex].times = times;
      if (notes) prescription.medicines[existingIndex].notes = notes;
    } else {
      // Add new medicine to array
      prescription.medicines.push({
        medicine: medicine._id,
        dosage: dosage || "",
        times,
        notes: notes || "",
      });
    }

    await prescription.save();

    return NextResponse.json({ message: "Medicine updated successfully", prescription });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id: patientId } = params;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, strength, dosageForm, times } = body;

    if (!name) {
      return NextResponse.json({ error: "Medicine name is required" }, { status: 400 });
    }

    // Find medicine
    const medicine = await Medicine.findOne({ name, strength, dosageForm });
    if (!medicine) {
      return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
    }

    // Find prescription
    const prescription = await Prescription.findOne({
      patient: patientId,
      medicine: medicine._id,
    });

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    if (times && Array.isArray(times)) {
      // Remove specified times
      prescription.times = prescription.times.filter(t => !times.includes(t));
      await prescription.save();

      // If no times left, delete the prescription
      if (prescription.times.length === 0) {
        await Prescription.deleteOne({ _id: prescription._id });
        return NextResponse.json({ message: "All timings removed, prescription deleted" });
      }

      return NextResponse.json({ message: "Specified timings removed", prescription });
    } else {
      // If no times provided, delete the entire prescription
      await Prescription.deleteOne({ _id: prescription._id });
      return NextResponse.json({ message: "Prescription deleted entirely" });
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id: patientId } = params;

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate("medicines.medicine"); // 👈 populate medicine details

    return NextResponse.json(
      { medicines: prescriptions },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
