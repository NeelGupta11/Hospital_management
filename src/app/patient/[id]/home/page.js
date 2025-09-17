"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PatientHome() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);

  // fetch patient info (optional)
   useEffect(() => {
    fetch(`/api/patient`)
      .then(res => res.json())
      .then(data => {
        const patient = data.find(p => p._id === id);
        setPatient(patient || null);
      });
  }, [id]);

  return (
    <div className="patient-home-container">
      <h1 className="patient-home-title">
        {patient ? `Welcome, ${patient.name}` : "Patient Dashboard"}
      </h1>

      <div className="patient-home-grid">
        {/* Bills */}
        <div
          className="patient-home-item"
          onClick={() => router.push(`/patient/${id}/bills`)}
        >
          <span className="patient-home-icon">💳</span>
          <p>Bills</p>
        </div>

        {/* Reports */}
        <div className="patient-home-item"
        onClick={() => router.push(`/patient/${id}/report-view`)}
        >
          <span className="patient-home-icon">📑</span>
          <p>Reports</p>
          
        </div>

        {/* Appointments */}
        <div className="patient-home-item"
        onClick={() => router.push(`/patient/${id}/appointment`)}
        >
          <span className="patient-home-icon">📅</span>
          <p>Appointments</p>
        </div>

        {/* Medicine Time */}
        <div className="patient-home-item">
          <span className="patient-home-icon">💊</span>
          <p>Medicine Time</p>
        </div>

        {/* Messages */}
        <div className="patient-home-item">
          <span className="patient-home-icon">💬</span>
          <p>Messages</p>
        </div>
      </div>
    </div>
  );
}
