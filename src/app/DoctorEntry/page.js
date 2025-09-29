"use client";
import { useState } from "react";

const DoctorEntry = () => {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    contact_number: "",
    email: "",
    department: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(`✅ Doctor ${data.name} added successfully!`);
        setFormData({
          name: "",
          specialization: "",
          contact_number: "",
          email: "",
          department: "",
        });
      } else {
        const err = await res.json();
        setMessage(`❌ Error: ${err.error || "Something went wrong"}`);
      }
    } catch (error) {
      setMessage("❌ Network error, please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header */}
      <div className="relative w-full bg-gradient-dark py-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-scale-in">
          Doctor Entry
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto animate-scale-in">
          Streamlined healthcare management with elegant simplicity
        </p>

        {/* Floating Circles */}
        <div className="absolute top-8 left-8 w-16 h-16 border border-white/10 rounded-full animate-float" />
        <div
          className="absolute bottom-8 right-8 w-16 h-16 border border-white/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Doctor Form Card */}
      <div className="bg-gradient-white shadow-card hover:shadow-card-hover rounded-xl p-6 md:p-8 mt-8 w-full max-w-2xl animate-scale-in">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Doctor Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter doctor's full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Specialization */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Specialization</label>
            <input
              type="text"
              name="specialization"
              placeholder="e.g. Cardiologist"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Contact Number */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Contact Number</label>
            <input
              type="text"
              name="contact_number"
              placeholder="e.g. +1 (555) 123-4567"
              value={formData.contact_number}
              onChange={handleChange}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="doctor@hospital.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Department */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Department</label>
            <input
              type="text"
              name="department"
              placeholder="e.g. Cardiology"
              value={formData.department}
              onChange={handleChange}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
          >
            Add Doctor
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
};

export default DoctorEntry;
