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

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id: patientId } = await params;

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate("medicines.medicine"); 

    return NextResponse.json({ medicines: prescriptions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(req, context) {
  try {
    await connectDB();

    const patientId = context.params.id;
    const body = await req.json();
    const { name, strength, dosageForm, times } = body;

    // Find prescription for this patient
    const prescription = await Prescription.findOne({ patient: patientId }).populate("medicines.medicine");

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    // Filter medicines
    prescription.medicines = prescription.medicines.filter((med) => {
      if (med.medicine.name !== name) return true;
      if (strength && med.medicine.strength !== strength) return true;
      if (dosageForm && med.medicine.dosageForm !== dosageForm) return true;

      // If times array provided, remove only those times
      if (times && times.length > 0) {
        med.times = med.times.filter((t) => !times.includes(t));
        return med.times.length > 0; // keep medicine if any times remain
      }

      return false; // remove this medicine completely
    });

    await prescription.save();

    return NextResponse.json({ message: "Medicine deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
