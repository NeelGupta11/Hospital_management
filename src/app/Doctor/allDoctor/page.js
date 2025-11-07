"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AllDoctors() {
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();

  // ✅ Fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctors");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();

        // Handle response structure safely
        const list =
          Array.isArray(data) ? data : data.doctors || data.Doctor || [];
        setDoctors(list);
      } catch (err) {
        console.error("Fetch error:", err);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-scale-in bg-gradient-dark p-6 rounded-xl inline-block">
          Doctors
        </h1>
        <p className="text-white/80 max-w-xl mx-auto animate-scale-in mt-2">
          View and manage all registered doctors
        </p>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-gradient-white shadow-card hover:shadow-card-hover rounded-xl p-4 flex flex-col justify-between animate-scale-in"
            >
              <div>
                <p className="font-semibold text-lg text-foreground mb-1">
                  {doctor.name}
                </p>
                <p className="text-sm text-foreground/70 mb-1">
                  🩺 {doctor.specialization || "N/A"}
                </p>
                {doctor.department && (
                  <p className="text-sm text-foreground/70 mb-1">
                    🏥 Department: {doctor.department}
                  </p>
                )}
                {doctor.contact_number && (
                  <p className="text-sm text-foreground/70 mb-1">
                    📞 {doctor.contact_number}
                  </p>
                )}
                <p className="text-sm text-foreground/70">
                  ✉️ {doctor.email}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-foreground/70 col-span-full animate-scale-in">
            No doctors found
          </p>
        )}
      </div>
    </div>
  );
}
