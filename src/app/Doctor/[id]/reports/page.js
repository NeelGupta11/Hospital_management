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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-dark">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 animate-scale-in">
            Patients
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto animate-scale-in">
            List of registered patients and their reports
          </p>
        </div>

        {/* Floating Circles */}
        <div className="absolute top-10 left-10 w-24 h-24 border border-white/10 rounded-full animate-float" />
        <div
          className="absolute bottom-10 right-10 w-20 h-20 border border-white/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Table */}
      <div className="container mx-auto px-6 py-16">
        {patients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-card">
              <thead className="bg-gradient-dark text-white">
                <tr>
                  <th className="py-3 px-6 text-left">#</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Contact</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p, index) => (
                  <tr
                    key={p._id}
                    className="border-b border-border hover:bg-primary/5 transition-colors"
                  >
                    <td className="py-3 px-6">{index + 1}</td>
                    <td className="py-3 px-6">{p.name}</td>
                    <td className="py-3 px-6">{p.email}</td>
                    <td className="py-3 px-6">{p.contactNumber || "N/A"}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() =>
                          router.push(`/patient/${p._id}/report-view`)
                        }
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        SEE REPORT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No patients found.</p>
        )}
      </div>
    </div>
  );
}
