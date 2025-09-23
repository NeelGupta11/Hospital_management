"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DoctorHome() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);

  // Fetch doctor info
  useEffect(() => {
    fetch(`/api/Doctor/${id}/Detail`)
      .then((res) => res.json())
      .then((data) => {
        setDoctor(data || null);
      })
      .catch((err) => {
        console.error("Error fetching doctor data:", err);
        setDoctor(null);
      });
  }, [id]);

  return (
    <div className="patient-home-container">
      <h1 className="patient-home-title">
        {doctor ? `Welcome, Dr. ${doctor.name}` : "Doctor Dashboard"}
      </h1>

      <div className="patient-home-grid">
        {/* Profile */}
        <div
          className="patient-home-item"
          onClick={() => router.push(`/Doctor/${id}/Profile`)}
        >
          <span className="patient-home-icon">👤</span>
          <p>Profile</p>
        </div>

        {/* Appointments */}
        <div
          className="patient-home-item"
          onClick={() => router.push(`/Doctor/${id}/Appointment`)}
        >
          <span className="patient-home-icon">📅</span>
          <p>Appointments</p>
        </div>

        {/* Patients List */}


        {/* Reports */}
        <div
          className="patient-home-item"
          onClick={() => router.push(`/Doctor/${id}/reports`)}
        >
          <span className="patient-home-icon">📑</span>
          <p>Reports</p>
        </div>

        {/* Messages */}
        <div
          className="patient-home-item"
          onClick={() => router.push(`/Doctor/${id}/messages`)}
        >
          <span className="patient-home-icon">💬</span>
          <p>Messages</p>
        </div>

        {/* Notifications */}
        <div className="patient-home-item"
          onClick={() => router.push(`/see-notifications`)}>
          <span className="patient-home-icon">🔔</span>
          <p>Notifications</p>
        </div>
        <div className="admin-grid-item"
          onClick={() => router.push(`/Patients/medicine`)}
        >
          <span className="patient-home-icon">💊</span>
          <p>Add MedicineTiming</p>
          </div>
      </div>
    </div>
  );
}
