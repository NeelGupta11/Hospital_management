import { NextResponse } from "next/server";
import {connectDB} from "../../../../../lib/mongodb";
import Billing from "../../../../../models/Billing";
export async function GET(req, context) {
  await connectDB();
  const { patientId } = await context.params;

  try {
    const bill = await Billing.findOne({ patient_id: patientId });
    if (!bill) {
      return Response.json({ message: "No bill found" }, { status: 404 });
    }
    return Response.json(bill);
  } catch (err) {
    console.error("GET /billing error:", err);
    return Response.json({ message: "Failed to fetch billing" }, { status: 500 });
  }
}
export async function PATCH(req, context) {
  await connectDB();
  const { patientId } = await context.params;

  try {
    const { items } = await req.json();
    if (!items || items.length === 0) {
      return Response.json({ message: "No items provided" }, { status: 400 });
    }

    // Find existing bill
    let bill = await Billing.findOne({ patient_id: patientId });

    if (!bill) {
      // If no bill yet, create one
      bill = new Billing({
        patient_id: patientId,
        items: [],
        total_amount: 0,
        overall_status: "Unpaid"
      });
    }
    console.log("kl");
    // Add new items
    bill.items.push(...items);

    // Recalculate total
    bill.total_amount = bill.items.reduce((sum, item) => sum + item.amount, 0);

    // Update overall_status
    const paid = bill.items.filter(i => i.status === "Paid").length;
    if (paid === 0) bill.overall_status = "Unpaid";
    else if (paid === bill.items.length) bill.overall_status = "Paid";
    else bill.overall_status = "Partially Paid";

    await bill.save();

    return Response.json({ message: "Bill updated successfully", bill }, { status: 200 });
  } catch (err) {
    console.error("PATCH /billing error:", err);
    return Response.json({ message: "Failed to process billing request" }, { status: 500 });
  }
}
