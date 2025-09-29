"use client";
import { useEffect, useState } from "react";

export default function AppointmentsPage() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchPatient, setSearchPatient] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");
  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    date: "",
    reason: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await fetch("/api/patient");
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPatients();
  }, []);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchDoctors();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setMessage("✅ Appointment created successfully!");
      setForm({ patient: "", doctor: "", date: "", reason: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating appointment. Please try again.");
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchPatient.toLowerCase())
  );
  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(searchDoctor.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-scale-in bg-gradient-dark p-6 rounded-xl inline-block">
          Book Appointment
        </h1>
        <p className="text-white/80 max-w-xl mx-auto animate-scale-in mt-2">
          Schedule appointments between patients and doctors efficiently
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-gradient-white shadow-card hover:shadow-card-hover rounded-xl p-6 md:p-8 w-full max-w-2xl animate-scale-in">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Patient */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Patient</label>
            <input
              type="text"
              placeholder="Search patient..."
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm mb-2"
            />
            <select
              name="patient"
              value={form.patient}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">Select patient</option>
              {filteredPatients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.age}, {p.gender})
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Doctor</label>
            <input
              type="text"
              placeholder="Search doctor..."
              value={searchDoctor}
              onChange={(e) => setSearchDoctor(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm mb-2"
            />
            <select
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">Select doctor</option>
              {filteredDoctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} - {d.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Reason */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Reason</label>
            <input
              type="text"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Reason for visit"
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
          >
            Book Appointment
          </button>

          {/* Message */}
          {message && (
            <div
              className={`text-center mt-2 font-medium text-sm ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
