"use client";
import { useState, useEffect } from "react";


export default function StaffEntry() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({
    staff_id: "",
    name: "",
    role: "Nurse",
    customRole: "", 
    contact_number: "",
    shift: "Morning",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/staff")
      .then(res => res.json())
      .then(data => setStaff(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalForm = { 
      ...form, 
      role: form.role === "Other" ? form.customRole : form.role 
    };

    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalForm),
    });

    const data = await res.json();
    setMessage(data.message || "Staff added successfully ✅");
    setStaff([...staff, data]);

    // Reset form
    setForm({ staff_id: "", name: "", role: "Nurse", customRole: "", contact_number: "", shift: "Morning" });
  };

  return (
    <div className="formContainer">
      <h2>Hospital Staff Entry</h2>

      <form onSubmit={handleSubmit}>
        <label>Staff ID</label>
        <input
          type="text"
          value={form.staff_id}
          onChange={(e) => setForm({ ...form, staff_id: e.target.value })}
          required
        />

        <label>Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <label>Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option>Nurse</option>
          <option>Receptionist</option>
          <option>Technician</option>
          <option>Other</option>
        </select>

        {/* ✅ Show custom role input when "Other" selected */}
        {form.role === "Other" && (
          <>
            <label>Specify Role</label>
            <input
              type="text"
              placeholder="Enter custom role"
              value={form.customRole}
              onChange={(e) => setForm({ ...form, customRole: e.target.value })}
              required
            />
          </>
        )}

        <label>Contact Number</label>
        <input
          type="text"
          value={form.contact_number}
          onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
          required
        />

        <label>Shift</label>
        <select
          value={form.shift}
          onChange={(e) => setForm({ ...form, shift: e.target.value })}
        >
          <option>Morning</option>
          <option>Evening</option>
          <option>Night</option>
        </select>

        <button type="submit">Add Staff</button>
        {message && <p style={{ marginTop: "15px", textAlign: "center", color: "green" }}>{message}</p>}
      </form>
    </div>
  );
}
