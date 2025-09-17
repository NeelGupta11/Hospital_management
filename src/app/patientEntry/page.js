"use client"
import { useState } from 'react';

const PatientInfo = () => {
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', contactNumber: '', email: '', address: '', medicalHistory: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      medicalHistory: formData.medicalHistory ? formData.medicalHistory.split(',') : []
    };

    try {
      const res = await fetch('/api/patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (res.ok) {
        alert('Patient registered successfully!');
        setFormData({
          name: '', age: '', gender: '', contactNumber: '', email: '', address: '', medicalHistory: ''
        });
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || 'Failed to register patient'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error registering patient.');
    }
  };

  return (
    <div className="formContainer">
      <h2>Patient Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="age">Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />

        <label htmlFor="gender">Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="contactNumber">Contact Number:</label>
        <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />

        <label htmlFor="email">Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label htmlFor="address">Address:</label>
        <textarea name="address" value={formData.address} onChange={handleChange} />

        <label htmlFor="medicalHistory">Medical History (comma separated):</label>
        <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} />

        <button type="submit">Register Patient</button>
      </form>
    </div>
  );
};

export default PatientInfo;
