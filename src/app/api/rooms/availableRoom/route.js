import {connectDB} from "../../../../../lib/mongodb";
import Room from "../../../../../models/Room";

export async function GET() {
  try {
    await connectDB();

    const rooms = await Room.find();
    return new Response(JSON.stringify(rooms), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch available rooms" }),
      { status: 500 }
    );
  }
}