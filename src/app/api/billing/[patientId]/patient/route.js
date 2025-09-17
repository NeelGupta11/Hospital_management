
import { connectDB } from "../../../../../../lib/mongodb";
import Billing from "../../../../../../models/Billing";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { patientId } = params;

    const bills = await Billing.find({ patient_id: patientId });
    if (!bills || bills.length === 0) {
      return Response.json({ message: "No bills found" }, { status: 404 });
    }

    return Response.json(bills, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Failed to fetch bills", error: error.message }, { status: 500 });
  }
}
