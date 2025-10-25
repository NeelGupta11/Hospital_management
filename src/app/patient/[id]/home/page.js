"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PatientHome() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetch(`/api/patient`)
      .then((res) => res.json())
      .then((data) => {
        const patient = data.find((p) => p._id === id);
        setPatient(patient || null);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full bg-gradient-dark py-12 px-6 text-center relative">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-3xl mx-auto animate-scale-in">
          {patient ? `Welcome, ${patient.name}` : "Patient Dashboard"}
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto animate-scale-in mb-6">
          Manage your profile, appointments, bills, reports, and notifications efficiently.
        </p>

        {/* Action Button */}
        

        {/* Floating Circles */}
        <div className="absolute top-8 left-8 w-16 h-16 border border-white/10 rounded-full animate-float" />
        <div
          className="absolute bottom-8 right-8 w-16 h-16 border border-white/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-16 h-16 border border-white/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
      </header>

      {/* Dashboard Cards */}
      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { name: "Profile", icon: "👤", path: `/patient/${id}/patientProfile` },
            { name: "Bills", icon: "💳", path: `/patient/${id}/bills` },
            { name: "Reports", icon: "📑", path: `/patient/${id}/report-view` },
            { name: "Appointments", icon: "📅", path: `/patient/${id}/appointment` },
            { name: "Medicine Time", icon: "💊", path: `/patient/${id}/MedicineTiming` },
            { name: "Messages", icon: "💬", path: "#" },
            { name: "Notifications", icon: "🔔", path: `/see-notifications` },
          ].map((item) => (
            <div
              key={item.name}
              className="bg-gradient-white shadow-card hover:shadow-card-hover rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all animate-scale-in hover:scale-105"
              onClick={() => item.path !== "#" && router.push(item.path)}
            >
              <span className="text-4xl mb-2">{item.icon}</span>
              <p className="text-lg font-semibold text-foreground">{item.name}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-muted-foreground text-sm">
        © 2024 Medical Portal. Secure & Professional.
      </footer>
    </div>
  );
}
