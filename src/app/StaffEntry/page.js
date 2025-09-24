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
      .then((res) => res.json())
      .then((data) => setStaff(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalForm = {
      ...form,
      role: form.role === "Other" ? form.customRole : form.role,
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
    setForm({
      staff_id: "",
      name: "",
      role: "Nurse",
      customRole: "",
      contact_number: "",
      shift: "Morning",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="formContainer bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-black">
          Hospital Staff Entry
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="text-black">Staff ID</label>
          <input
            type="text"
            value={form.staff_id}
            onChange={(e) => setForm({ ...form, staff_id: e.target.value })}
            required
            className="w-full border p-2 rounded-lg text-black"
          />

          <label className="text-black">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border p-2 rounded-lg text-black"
          />

          <label className="text-black">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full border p-2 rounded-lg text-black"
          >
            <option>Nurse</option>
            <option>Receptionist</option>
            <option>Technician</option>
            <option>Other</option>
          </select>

          {form.role === "Other" && (
            <>
              <label className="text-black">Specify Role</label>
              <input
                type="text"
                placeholder="Enter custom role"
                value={form.customRole}
                onChange={(e) =>
                  setForm({ ...form, customRole: e.target.value })
                }
                required
                className="w-full border p-2 rounded-lg text-black"
              />
            </>
          )}

          <label className="text-black">Contact Number</label>
          <input
            type="text"
            value={form.contact_number}
            onChange={(e) =>
              setForm({ ...form, contact_number: e.target.value })
            }
            required
            className="w-full border p-2 rounded-lg text-black"
          />

          <label className="text-black">Shift</label>
          <select
            value={form.shift}
            onChange={(e) => setForm({ ...form, shift: e.target.value })}
            className="w-full border p-2 rounded-lg text-black"
          >
            <option>Morning</option>
            <option>Evening</option>
            <option>Night</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg hover:bg-blue-700"
          >
            Add Staff
          </button>
          {message && (
            <p className="mt-4 text-center text-green-600">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
