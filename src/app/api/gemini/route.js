import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Patient from "../../../../models/Patient";
import Doctors from "../../../../models/Doctors";
import Staff from "../../../../models/Staff";
// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function seperate(text){
  let i
  for( i=0;i<text.length && text[i]!='{';i=i+1){}
  let text1=text.substring(i,text.length)
  for( i=text1.length;i>=0 && text1[i]!='}';i=i-1){}
  console.log()
  console.log(text1.substring(0,i+1))
  return text1.substring(0,i+1);
}
export async function POST(req) {
  try {
    // Extract the prompt from the request body
    const { prompt } = await req.json();

    // The model name is a constant here, but you could also pass it from the front end
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Give me only object for the given text in which the schema has name: { type: String, required: true },age: Number,gender: String,contactNumber: String,email: { type: String, unique: true },address: String,medicalHistory: [String] if the schema does not  have email give random email with name ${prompt} pass only json object nothing else written
    // Send the prompt to the model and get the response
    const result = await model.generateContent(`Given "${prompt}", return only one word: PatientSchema, DoctorSchema, StaffSchema, or noThing based on which schema it matches.`);
    const response = await result.response;
    const text = response.text();
    console.log(text.substring(0,13)=="PatientSchema");
    let text1
    if(text=="noThing"){
      return NextResponse.json({ output:"Function Yet to be created" });
    }
    else if(text.substring(0,13)=="PatientSchema"){
      const result1 = await model.generateContent(`From "${prompt}", return only a JSON object with {name,age,gender,contactNumber,email,address,medicalHistory}; if email is missing return only "emailRequired" with name; no extra text.`);
      const response1 = await result1.response;
      text1 = response1.text();
      if(text1=="emailRequired"){
        return NextResponse.json({ output:"Give me email id" });
      }
      console.log(text1)
      let obj1=JSON.parse(seperate(text1))
      connectDB()
      let x= await Patient.create(obj1)
      return NextResponse.json({ output:x })
    }
    else if(text.substring(0,12)=="DoctorSchema"){
      const result1 = await model.generateContent(`If email is not present send text "emailRequired" nothing else  and if present From the given text, return only a JSON object with {name,specialization,contact_number,email,department} as per schema,. Input: ${prompt}`);
      const response1 = await result1.response;
      text1 = response1.text();
      if(text1=="emailRequired"){
        return NextResponse.json({ output:"Give me email id" });
      }
      let obj1=JSON.parse(seperate(text1))
      connectDB()
      let x= await Doctors.insertOne(obj1)
      return NextResponse.json({ output:x })
    }
    else if(text.substring(0,11)=="StaffSchema"){
      const result1 = await model.generateContent(`Give me only object for the given text in which the schema has name: staff_id: { type: String, required: true, unique: true },name: { type: String, required: true },role: { type: String, required: true },contact_number: { type: String, required: true },shift: { type: String, enum: ["Morning", "Evening", "Night"], required: true } if the schema does not  have contactNumber give only one word numberRequired with name ${prompt} pass only json object nothing else written`);
      const response1 = await result1.response;
      text1 = response1.text();
      if(text1=="numberRequired"){
        return NextResponse.json({ output:"Give me Contact Number" });
      }
      let obj1=JSON.parse(seperate(text1))
      connectDB()
      let x= await Staff.insertOne(obj1)
      return NextResponse.json({ output: text1 })
    }
    return NextResponse.json({ output: text });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}