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
  const [appointments, setAppointments] = useState([]);

  // Fetch all patients
  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await fetch("/api/patient");
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error("❌ Error fetching patients:", err);
      }
    }
    fetchPatients();
  }, []);

  // Fetch all doctors
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("❌ Error fetching doctors:", err);
      }
    }
    fetchDoctors();
  }, []);

  // Fetch all appointments
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("/api/appointments");
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("❌ Error fetching appointments:", err);
      }
    }
    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("✅ Appointment created!");
      setForm({ patient: "", doctor: "", date: "", reason: "" });
    } catch (err) {
      console.error("❌ Error creating appointment:", err);
    }
  };

  // Filtered lists based on search
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchPatient.toLowerCase())
  );
  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(searchDoctor.toLowerCase())
  );

  return (
    <div className="formContainer">
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit}>
        {/* Patient Search */}
        <label>Patient</label>
        <input
          type="text"
          placeholder="Search patient..."
          value={searchPatient}
          onChange={(e) => setSearchPatient(e.target.value)}
        />
        <select
          name="patient"
          value={form.patient}
          onChange={handleChange}
          required
        >
          <option value="">Select patient</option>
          {filteredPatients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.age}, {p.gender})
            </option>
          ))}
        </select>

        {/* Doctor Search */}
        <label>Doctor</label>
        <input
          type="text"
          placeholder="Search doctor..."
          value={searchDoctor}
          onChange={(e) => setSearchDoctor(e.target.value)}
        />
        <select
          name="doctor"
          value={form.doctor}
          onChange={handleChange}
          required
        >
          <option value="">Select doctor</option>
          {filteredDoctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name} - {d.specialization}
            </option>
          ))}
        </select>

        {/* Date & Reason */}
        <label>Date</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />

        <label>Reason</label>
        <input
          type="text"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Reason for visit"
        />

        <button type="submit">Book Appointment</button>
      </form>

      
    </div>
  );
}