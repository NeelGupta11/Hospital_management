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
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header */}
      <div className="relative w-full bg-gradient-dark py-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-scale-in">
          Staff Entry
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto animate-scale-in">
          Manage hospital staff efficiently and elegantly
        </p>

        {/* Floating Circles */}
        <div className="absolute top-8 left-8 w-16 h-16 border border-white/10 rounded-full animate-float" />
        <div
          className="absolute bottom-8 right-8 w-16 h-16 border border-white/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Form Card */}
      <div className="bg-gradient-white shadow-card hover:shadow-card-hover rounded-xl p-6 md:p-8 mt-8 w-full max-w-2xl animate-scale-in">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Staff ID */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Staff ID</label>
            <input
              type="text"
              value={form.staff_id}
              onChange={(e) => setForm({ ...form, staff_id: e.target.value })}
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Name */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option>Nurse</option>
              <option>Receptionist</option>
              <option>Technician</option>
              <option>Other</option>
            </select>
          </div>

          {form.role === "Other" && (
            <div className="flex flex-col">
              <label className="text-foreground font-semibold mb-1">Specify Role</label>
              <input
                type="text"
                placeholder="Enter custom role"
                value={form.customRole}
                onChange={(e) =>
                  setForm({ ...form, customRole: e.target.value })
                }
                required
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          )}

          {/* Contact Number */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Contact Number</label>
            <input
              type="text"
              value={form.contact_number}
              onChange={(e) =>
                setForm({ ...form, contact_number: e.target.value })
              }
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Shift */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Shift</label>
            <select
              value={form.shift}
              onChange={(e) => setForm({ ...form, shift: e.target.value })}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option>Morning</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
          >
            Add Staff
          </button>

          {/* Message */}
          {message && (
            <div
              className={`text-center mt-2 font-medium ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              } text-sm`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
