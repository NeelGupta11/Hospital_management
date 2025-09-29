"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("/api/patient")
      .then(res => res.json())
      .then(data => {
        setPatients(Array.isArray(data) ? data : data.patients || []);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      {/* Heading */}
      <div className="relative overflow-hidden bg-gradient-dark rounded-xl p-6 mb-8 animate-scale-in">
        <h1 className="text-5xl font-bold text-white mb-2">Patients</h1>
        <p className="text-xl text-white/80">
          Manage patient records and add medical reports
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
        {patients.length === 0 ? (
          <p className="text-center text-white">No patients found.</p>
        ) : (
          patients.map((p) => (
            <Link
              key={p._id}
              href={`/patient/${p._id}/report-upload`}
              className="group relative overflow-hidden rounded-xl p-6 flex justify-between items-center bg-gradient-white shadow-card hover:shadow-card-hover transition-all animate-scale-in hover:scale-105"
            >
              <span className="text-foreground font-semibold text-lg">
                {p.name}
              </span>

              <span className="bg-gradient-dark text-white py-2 px-4 rounded-lg font-semibold shadow-lg">
                ADD REPORT
              </span>

              {/* Hover overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-primary/5 rounded-xl transition-opacity" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
