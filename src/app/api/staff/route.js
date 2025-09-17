import { connectDB } from "../../../../lib/mongodb";  // use one connection helper
import Staff from "../../../../models/Staff";
import { NextResponse } from "next/server";
export async function GET() {
    try{
        await connectDB();
        const users = await Staff.find();
        return Response.json(users,{ status: 200 });
    }
    catch(error){
        console.error("❌ Error getting staff:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try{
        await connectDB();
        const body = await request.json();
        const newUser = await Staff.create(body);
        return Response.json(newUser,{ status: 200 });
    }
    catch(error){
        console.error("❌ Error creating staff:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
