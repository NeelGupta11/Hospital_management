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
    <div className="min-h-screen bg-background px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-scale-in bg-gradient-dark p-6 rounded-xl inline-block">
          Patients
        </h1>
        <p className="text-white/80 max-w-xl mx-auto animate-scale-in mt-2">
          Manage and view all registered patients
        </p>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {patients.length > 0 ? (
          patients.map((p) => (
            <div
              key={p._id}
              className="bg-gradient-white shadow-card hover:shadow-card-hover rounded-xl p-4 flex flex-col justify-between animate-scale-in"
            >
              <div>
                <p className="font-semibold text-lg text-foreground mb-1">
                  {p.name}
                </p>
                <p className="text-sm text-foreground/70 mb-1">
                  Age: {p.age} | Gender: {p.gender}
                </p>
                {p.contactNumber && (
                  <p className="text-sm text-foreground/70 mb-1">
                    📞 {p.contactNumber}
                  </p>
                )}
              </div>
              <button
                onClick={() => router.push(`/patient/${p._id}/add-item`)}
                className="mt-3 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-foreground/70 col-span-full animate-scale-in">
            No patients found
          </p>
        )}
      </div>
    </div>
  );
}
