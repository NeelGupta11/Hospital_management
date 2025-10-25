import Medicine from "../../../../models/Medicine";
import connectDB from "../../../../../lib/mongodb";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const updates = await req.json();

    const updatedMedicine = await Medicine.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedMedicine) {
      return new Response(JSON.stringify({ message: "Medicine not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedMedicine), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedMedicine = await Medicine.findByIdAndDelete(id);

    if (!deletedMedicine) {
      return new Response(JSON.stringify({ message: "Medicine not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Medicine deleted successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
