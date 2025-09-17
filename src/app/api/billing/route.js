import { connectDB } from "../../../../lib/mongodb"; 
import Billing from "../../../../models/Billing";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { bill_id, patient_id, items } = body;

    if (!bill_id || !patient_id || !items?.length) {
      return Response.json(
        { message: "Bill ID, Patient ID, and at least one item are required" },
        { status: 400 }
      );
    }

    // calculate total amount
    const total_amount = items.reduce((sum, item) => sum + (item.amount || 0), 0);

    // determine overall status
    const allPaid = items.every(item => item.status === "Paid");
    const nonePaid = items.every(item => item.status === "Unpaid");

    let overall_status = "Partially Paid";
    if (allPaid) overall_status = "Paid";
    else if (nonePaid) overall_status = "Unpaid";

    const newBill = await Billing.create({
      bill_id,
      patient_id,
      items,
      total_amount,
      overall_status,
    });

    return Response.json(
      { message: "Bill created successfully", bill: newBill },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return Response.json({ message: "Bill ID already exists" }, { status: 400 });
    }

    return Response.json({ message: "Failed to create bill" }, { status: 500 });
  }
}
