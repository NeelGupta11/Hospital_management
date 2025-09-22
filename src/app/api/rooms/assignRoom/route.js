import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Room from "../../../../../models/Room";
import Billing from "../../../../../models/Billing";

// Utility function to update billing (refactored from your PATCH API)
async function updateBilling(patient_id, items) {
  let bill = await Billing.findOne({ patient_id });

  if (!bill) {
    bill = new Billing({
      patient_id,
      items: [],
      total_amount: 0,
      overall_status: "Unpaid",
    });
  }

  bill.items.push(...items);

  // Recalculate total
  bill.total_amount = bill.items.reduce((sum, item) => sum + (item.amount || 0), 0);

  // Update overall_status
  const paidCount = bill.items.filter(i => i.status === "Paid").length;
  if (paidCount === 0) bill.overall_status = "Unpaid";
  else if (paidCount === bill.items.length) bill.overall_status = "Paid";
  else bill.overall_status = "Partially Paid";

  await bill.save();
  return bill;
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { patient_id, roomNo } = body;

    if (!patient_id || !roomNo) {
      return NextResponse.json(
        { message: "Patient ID and Room Number are required" },
        { status: 400 }
      );
    }

    // STEP 0: Find new room
    const newRoom = await Room.findOne({ roomNo });
    if (!newRoom) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    if (newRoom.occupy) {
      return NextResponse.json(
        { message: "Room is already occupied" },
        { status: 400 }
      );
    }

    // STEP 1: Check if patient already has a room
    const oldRoom = await Room.findOne({ currentPatient: patient_id });

    let bill;
    if (oldRoom) {
      // Calculate days patient stayed in old room
      const start = oldRoom.updatedAt;
      const end = new Date();
      const diffDays = Math.max(
        1,
        Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      );

      const roomChargeItem = {
        name: `Room Stay - ${oldRoom.type} (${oldRoom.roomNo}) for ${diffDays} days`,
        amount: oldRoom.pricePerDay * diffDays,
        status: "Unpaid",
      };

      // Update billing using utility function
      bill = await updateBilling(patient_id, [roomChargeItem]);

      // Free the old room
      oldRoom.occupy = false;
      oldRoom.currentPatient = null;
      await oldRoom.save();
    }

    // STEP 2: Assign patient to new room
    newRoom.occupy = true;
    newRoom.currentPatient = patient_id;
    await newRoom.save();

    return NextResponse.json(
      {
        message: oldRoom
          ? `Room changed from ${oldRoom.roomNo} to ${newRoom.roomNo}, old stay billed`
          : `Room allocated: ${newRoom.roomNo}, billing will start when changed/discharged`,
        newRoom,
        oldRoom,
        bill,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to allocate/change room", error: err.message },
      { status: 500 }
    );
  }
}
