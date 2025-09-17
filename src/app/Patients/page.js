"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/patient")
      .then(res => res.json())
      .then(data => {
        setPatients(Array.isArray(data) ? data : data.patients || []);
      });
  }, []);

  return (
    <div className="patients-container">
      <h1 className="patients-title">Patients</h1>
      <ul className="patients-list">
        {patients.map((p) => (
          <li key={p._id} className="patients-item">
            <span className="patients-name">{p.name}</span>
            <button
              onClick={() => router.push(`/patient/${p._id}`)}
              className="patients-btn"
            >
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
