"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PatientLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Here you can connect with your backend API
    // Example POST request:
    try {
      const res = await fetch("/api/patient/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful ✅");
        router.push(`/patient/${data.patientId}/home`); // redirect to patient dashboard/details
      } else {
        setMessage(data.message || "Invalid credentials ❌");
      }
    } catch (err) {
      setMessage("Something went wrong, try again later.");
    }
  };

  return (
    <div className="container">
      <div className="formContainer">
        <h2>Patient Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="text-black"
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            className="text-black"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>
        {message && <p style={{ marginTop: "10px", color: "red" }}>{message}</p>}
      </div>
    </div>
  );
}
