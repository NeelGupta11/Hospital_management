import { NextResponse } from "next/server";
import {connectDB} from "../../../../lib/mongodb"; // adjust path if needed
import GeneralNotification from "../../../../models/GeneralNotification";

export async function GET() {
  try {
    await connectDB();
    const notifications = await GeneralNotification.find().sort({ createdAt: -1 });
    return NextResponse.json(notifications, { status: 200 });
  } catch (err) {
    console.error("GET /notifications error:", err);
    return NextResponse.json(
      { message: "Failed to fetch notifications", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, message, type, link } = body;

    if (!title || !message) {
      return NextResponse.json(
        { message: "Title and message are required" },
        { status: 400 }
      );
    }

    const notification = new GeneralNotification({
      title,
      message,
      type: type || "info",
      link: link || null,
    });

    await notification.save();

    return NextResponse.json(
      { message: "Notification created successfully", notification },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /notifications error:", err);
    return NextResponse.json(
      { message: "Failed to create notification", error: err.message },
      { status: 500 }
    );
  }
}
