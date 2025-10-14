"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DoctorDetailPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`/api/Doctor/${id}/Detail`);
        if (!res.ok) throw new Error("Failed to fetch doctor details");
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading doctor details...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        Doctor not found.
      </div>
    );
  }

  const infoItems = [
    { icon: "💼", title: "Specialization", value: doctor.specialization || "N/A", variant: "accent" },
    { icon: "🏢", title: "Department", value: doctor.department || "N/A", variant: "secondary" },
    { icon: "📧", title: "Email", value: doctor.email || "N/A", variant: "primary" },
    { icon: "📞", title: "Contact Number", value: doctor.contact_number || "N/A", variant: "accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-dark">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 animate-scale-in">
            Dr. {doctor.name}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto animate-scale-in">
            Detailed profile and contact information
          </p>
        </div>

        {/* Floating Circles */}
        <div className="absolute top-10 left-10 w-24 h-24 border border-white/10 rounded-full animate-float" />
        <div
          className="absolute bottom-10 right-10 w-20 h-20 border border-white/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Info Cards */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoItems.map((item) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-xl cursor-pointer 
                p-6 min-h-[140px] flex flex-col items-center justify-center text-center
                transform transition-all duration-300 ease-smooth
                hover:scale-105 hover:-translate-y-2 active:scale-95
                shadow-card animate-scale-in ${
                  item.variant === "accent"
                    ? "bg-gradient-dark text-white border border-primary"
                    : item.variant === "secondary"
                    ? "bg-gradient-gray border border-border"
                    : "bg-gradient-white border border-border"
                }`}
            >
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="text-4xl transition-transform duration-300 group-hover:scale-110 filter drop-shadow-sm">
                  {item.icon}
                </div>
                <p className="font-semibold text-sm leading-tight transition-colors duration-300">
                  {item.title}
                </p>
                <p className="text-base">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
