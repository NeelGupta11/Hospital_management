import { connectDB } from "../../../../../lib/mongodb";
import Report from "../../../../../models/reports";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    await connectDB();

    const { reportId } = await context.params; // ✅ await is required in app router

    const report = await Report.findById(reportId);

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return new NextResponse(report.file, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${report.title}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
