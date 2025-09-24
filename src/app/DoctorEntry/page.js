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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="formContainer bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-black">Add Doctor</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-black font-medium">Doctor Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter doctor's name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <div>
            <label htmlFor="specialization" className="block text-black font-medium">Specialization</label>
            <input
              type="text"
              name="specialization"
              placeholder="e.g. Cardiologist"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <div>
            <label htmlFor="contact_number" className="block text-black font-medium">Contact Number</label>
            <input
              type="text"
              name="contact_number"
              placeholder="e.g. 9876543210"
              value={formData.contact_number}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-black font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-black font-medium">Department</label>
            <input
              type="text"
              name="department"
              placeholder="e.g. Cardiology"
              value={formData.department}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Add Doctor
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default DoctorEntry;
