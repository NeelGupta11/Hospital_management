"use client";
import { useState } from "react";

const PatientInfo = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    medicalHistory: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      medicalHistory: formData.medicalHistory
        ? formData.medicalHistory.split(",")
        : [],
    };

    try {
      const res = await fetch("/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        setMessage("✅ Patient registered successfully!");
        setFormData({
          name: "",
          age: "",
          gender: "",
          contactNumber: "",
          email: "",
          address: "",
          medicalHistory: "",
        });
      } else {
        const error = await res.json();
        setMessage(`❌ Error: ${error.error || "Failed to register patient"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error, please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header */}
      <div className="relative w-full bg-gradient-dark py-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-scale-in">
          Patient Registration
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto animate-scale-in">
          Streamlined patient information management
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
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Age */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Contact Number */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Medical History */}
          <div className="flex flex-col">
            <label className="text-foreground font-semibold mb-1">
              Medical History (comma separated)
            </label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
          >
            Register Patient
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

export default PatientInfo;
