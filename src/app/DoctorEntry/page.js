"use client";
import { useState } from "react";
// import "./globals.css"; // make sure your CSS is imported

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
    <div className="formContainer">
      <h2>Add Doctor</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Doctor Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter doctor's name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="specialization">Specialization</label>
        <input
          type="text"
          name="specialization"
          placeholder="e.g. Cardiologist"
          value={formData.specialization}
          onChange={handleChange}
          required
        />

        <label htmlFor="contact_number">Contact Number</label>
        <input
          type="text"
          name="contact_number"
          placeholder="e.g. 9876543210"
          value={formData.contact_number}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="department">Department</label>
        <input
          type="text"
          name="department"
          placeholder="e.g. Cardiology"
          value={formData.department}
          onChange={handleChange}
        />
        <button type="submit">Add Doctor</button>
      </form>
      {message && <p style={{ marginTop: "15px", textAlign: "center" }}>{message}</p>}
    </div>
  );
};

export default DoctorEntry;
