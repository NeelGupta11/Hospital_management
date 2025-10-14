"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/patient")
      .then((res) => res.json())
      .then((data) => {
        setPatients(Array.isArray(data) ? data : data.patients || []);
      });
  }, []);

  return (
    <div className="patients-container min-h-screen px-6 py-12 bg-background">
      {/* 🔹 Styled heading with gradient background */}
      <div className="bg-gradient-dark text-white text-center py-4 rounded-xl shadow-lg mb-8">
        <h1 className="text-4xl font-bold tracking-wide">
          Change MedicineTime
        </h1>
      </div>

      <ul className="patients-list flex flex-col gap-4">
        {patients.map((p) => (
          <li
            key={p._id}
            className="patients-item flex justify-between items-center bg-gradient-white rounded-xl p-4 shadow-card hover:shadow-card-hover transition cursor-pointer"
            onClick={() => router.push(`/patient/${p._id}/medicinesTimingUpdate`)}
          >
            <span className="patients-name text-foreground font-semibold text-lg">
              {p.name}
            </span>
            <button
              className="patients-btn bg-gradient-dark text-white py-2 px-4 rounded-lg font-semibold shadow-lg hover:scale-105 transform transition"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/patient/${p._id}/medicinesTimingUpdate`);
              }}
            >
              Change MedicineTime
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
