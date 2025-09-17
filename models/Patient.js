import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: String,
  contactNumber: String,
  email: { type: String, unique: true },
  address: String,
  medicalHistory: [String],
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
