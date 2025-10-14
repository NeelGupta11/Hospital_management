"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ✅ Reusable Dashboard Card with variant
const DashboardCard = ({ icon, title, path, variant = "primary", router }) => {
  const variants = {
    primary:
      "bg-gradient-white border border-border hover:border-primary/30 hover:shadow-card-hover",
    secondary:
      "bg-gradient-gray border border-border hover:border-primary/30 hover:shadow-card-hover",
    accent:
      "bg-gradient-dark text-white border border-primary hover:border-primary-light hover:shadow-card-hover",
  };

  return (
    <div
      onClick={() => router.push(path)}
      className={`group relative overflow-hidden rounded-xl cursor-pointer 
        p-6 min-h-[140px] flex flex-col items-center justify-center text-center
        transform transition-all duration-300 ease-smooth
        hover:scale-105 hover:-translate-y-2 active:scale-95
        shadow-card animate-scale-in ${variants[variant]}`}
    >
      <div className="absolute inset-0 opacity-3">
        <div
          className={`absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-10 translate-x-10 ${
            variant === "accent" ? "bg-white/10" : "bg-primary/5"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 w-16 h-16 rounded-full translate-y-8 -translate-x-8 ${
            variant === "accent" ? "bg-white/10" : "bg-primary/5"
          }`}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="text-4xl transition-transform duration-300 group-hover:scale-110 filter drop-shadow-sm">
          {icon}
        </div>
        <p
          className={`font-semibold text-sm leading-tight transition-colors duration-300 ${
            variant === "accent" ? "text-white" : "text-foreground"
          }`}
        >
          {title}
        </p>
      </div>

      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          variant === "accent" ? "bg-white/5" : "bg-primary/3"
        }`}
      />
    </div>
  );
};

export default function DoctorHome() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);

  // Fetch doctor info
  useEffect(() => {
    fetch(`/api/Doctor/${id}/Detail`)
      .then((res) => res.json())
      .then((data) => setDoctor(data || null))
      .catch((err) => {
        console.error("Error fetching doctor data:", err);
        setDoctor(null);
      });
  }, [id]);

  const dashboardItems = [
    { icon: "👤", title: "Profile", path: `/Doctor/${id}/Profile`, variant: "primary" },
    { icon: "📅", title: "Appointments", path: `/Doctor/${id}/Appointment`, variant: "secondary" },
    { icon: "📑", title: "Reports", path: `/Doctor/${id}/reports`, variant: "accent" },
    { icon: "💬", title: "Messages", path: `/Doctor/${id}/messages`, variant: "primary" },
    { icon: "🔔", title: "Notifications", path: `/see-notifications`, variant: "secondary" },
    { icon: "💊", title: "Add Medicine Timing", path: `/Patients/medicine`, variant: "accent" },
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
            {doctor ? `Welcome, Dr. ${doctor.name}` : "Doctor Dashboard"}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto animate-scale-in">
            Manage your patients, appointments, and reports efficiently
          </p>
        </div>

        {/* Floating Circles */}
        <div className="absolute top-10 left-10 w-24 h-24 border border-white/10 rounded-full animate-float" />
        <div
          className="absolute bottom-10 right-10 w-20 h-20 border border-white/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-16 h-16 border border-white/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Dashboard Cards */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardItems.map((item) => (
            <DashboardCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              path={item.path}
              variant={item.variant}
              router={router}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
