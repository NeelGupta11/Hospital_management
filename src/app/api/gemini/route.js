import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Patient from "../../../../models/Patient";
import Doctors from "../../../../models/Doctors";
import Staff from "../../../../models/Staff";

// Initialize Gemini with your API key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Extract JSON from Gemini response
function extractJSON(text) {
  try {
    const match = text.match(/{[\s\S]*}/);
    return match ? JSON.parse(match[0]) : null;
  } catch (err) {
    console.error("Failed to parse JSON:", err.message);
    return null;
  }
}

// Get plain text from Gemini result
function getGeminiText(result) {
  return result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
}

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    // STEP 1: Classify prompt
    const classify = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Given "${prompt}", return one word: PatientSchema, DoctorSchema, StaffSchema, or noThing.`,
    });
    console.log(classify.text);
    const schemaType = getGeminiText(classify);
    console.log("Schema Type:", schemaType);

    if (!schemaType || schemaType === "noThing") {
      return NextResponse.json({ output: "Function Yet to be created" });
    }

    await connectDB();

    // STEP 2: Depending on schema, generate and parse object
    if (schemaType === "PatientSchema") {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
          From "${prompt}", return only a JSON object with:
          {name, age, gender, contactNumber, email, address, medicalHistory};
          If email is missing, return exactly "emailRequired".
        `,
      });

      const text = getGeminiText(res);
      if (text === "emailRequired") {
        return NextResponse.json({ output: "Give me email id" });
      }

      const patient = extractJSON(text);
      if (!patient) {
        return NextResponse.json({ error: "Invalid patient data" }, { status: 400 });
      }

      const saved = await Patient.create(patient);
      console.log(saved)
      return NextResponse.json({ output: saved });
    }

    if (schemaType === "DoctorSchema") {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
          From the given text, return only a JSON object with:
          {name, specialization, contact_number, email, department}.
          If email is missing, return exactly "emailRequired".
          Input: ${prompt}
        `,
      });

      const text = getGeminiText(res);
      if (text === "emailRequired") {
        return NextResponse.json({ output: "Give me email id" });
      }

      const doctor = extractJSON(text);
      if (!doctor) {
        return NextResponse.json({ error: "Invalid doctor data" }, { status: 400 });
      }

      const saved = await Doctors.create(doctor);
      console.log(saved)
      return NextResponse.json({ output: saved });
    }

    if (schemaType === "StaffSchema") {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
          From the given text, return only a JSON object with:
          {staff_id, name, role, contact_number, shift};
          If contact_number is missing, return exactly "numberRequired".
          Input: ${prompt}
        `,
      });

      const text = getGeminiText(res);
      if (text === "numberRequired") {
        return NextResponse.json({ output: "Give me Contact Number" });
      }

      const staff = extractJSON(text);
      if (!staff) {
        return NextResponse.json({ error: "Invalid staff data" }, { status: 400 });
      }

      const saved = await Staff.create(staff);
      return NextResponse.json({ output: saved });
    }

    // Fallback
    return NextResponse.json({ error: "Unrecognized schema type" }, { status: 400 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
