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
        alert("Patient registered successfully!");
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
        alert(`Error: ${error.error || "Failed to register patient"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error registering patient.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="formContainer bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-black">
          Patient Registration Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-black font-medium">
              Full Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-black font-medium">
              Age:
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-black font-medium">
              Gender:
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-lg text-black"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="contactNumber"
              className="block text-black font-medium"
            >
              Contact Number:
            </label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-black font-medium">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-black font-medium">
              Address:
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <div>
            <label
              htmlFor="medicalHistory"
              className="block text-black font-medium"
            >
              Medical History (comma separated):
            </label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Register Patient
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientInfo;
