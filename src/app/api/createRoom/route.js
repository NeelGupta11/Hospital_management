import { connectDB } from "../../../../lib/mongodb";
import Room from "../../../../models/Room";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { roomNo, type, beds, pricePerDay } = body;

    if (!roomNo) {
      return new Response(
        JSON.stringify({ error: "Room number is required" }),
        { status: 400 }
      );
    }

    const existing = await Room.findOne({ roomNo });
    if (existing) {
      return new Response(
        JSON.stringify({ error: "Room number already exists" }),
        { status: 400 }
      );
    }

    const room = await Room.create({
      roomNo,
      type: type || "General",
      beds: beds || 1,
      pricePerDay: pricePerDay || 0,
    });

    return new Response(JSON.stringify(room), { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message }),
      { status: 500 }
    );
  }
}
