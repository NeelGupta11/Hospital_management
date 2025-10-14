"use client";
import React from "react";
import Link from "next/link";
import Sidebar from "@/app/AdminSidebar/page";// ✅ import sidebar

// ✅ Reusable AdminCard (kept inline in this file)
const AdminCard = ({ icon, title, path, variant = "primary", className = "" }) => {
  const variants = {
    primary:
      "bg-gradient-white border border-border hover:border-primary/30 hover:shadow-card-hover",
    secondary:
      "bg-gradient-gray border border-border hover:border-primary/30 hover:shadow-card-hover",
    accent:
      "bg-gradient-dark text-white border border-primary hover:border-primary-light hover:shadow-card-hover",
  };

  return (
    <Link href={path}>
      <div
        className={`group relative overflow-hidden rounded-xl cursor-pointer 
        p-6 min-h-[140px] flex flex-col items-center justify-center text-center
        transform transition-all duration-300 ease-smooth
        hover:scale-105 hover:-translate-y-2 active:scale-95
        shadow-card animate-scale-in 
        ${variants[variant]} ${className}`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-3">
          <div
            className={`absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-10 translate-x-10 
            ${variant === "accent" ? "bg-white/10" : "bg-primary/5"}`}
          />
          <div
            className={`absolute bottom-0 left-0 w-16 h-16 rounded-full translate-y-8 -translate-x-8 
            ${variant === "accent" ? "bg-white/10" : "bg-primary/5"}`}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="text-4xl transition-transform duration-300 group-hover:scale-110 filter drop-shadow-sm">
            {icon}
          </div>
          <p
            className={`font-semibold text-sm leading-tight transition-colors duration-300 
            ${variant === "accent" ? "text-white" : "text-foreground"}`}
          >
            {title}
          </p>
        </div>

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 
          ${variant === "accent" ? "bg-white/5" : "bg-primary/3"}`}
        />
      </div>
    </Link>
  );
};

// ✅ Admin Home Page
const AdminHomePage = () => {
  const adminItems = [
    { icon: "👨‍⚕️", title: "Add Doctor", path: "/DoctorEntry", variant: "accent" },
    { icon: "🧑‍🤝‍🧑", title: "Add Patient", path: "/patientEntry", variant: "secondary" },
    { icon: "👩‍💼", title: "Add Staff", path: "/StaffEntry", variant: "accent" },
    { icon: "📅", title: "Appointments", path: "/AppointmentEntry", variant: "primary" },
    { icon: "📋", title: "View Patients", path: "/Patients", variant: "secondary" },
    { icon: "📑", title: "Reports", path: "/report-add", variant: "accent" },
    { icon: "💊", title: "Medicine Timing", path: "/Patients/medicine", variant: "primary" },
    { icon: "🛏️", title: "Room Allocation", path: "/RoomAllocation", variant: "accent" },
    { icon: "🏢", title: "Add Rooms", path: "/createRoom", variant: "accent" },
    { icon: "🔔", title: "Notifications", path: "/notification-add", variant: "primary" },
    { icon: "🤖", title: "HospiAI", path: "/prompt", variant: "accent" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* ✅ Sidebar on left */}
      <Sidebar />

      {/* ✅ Main content */}
      <div className="flex-1 bg-background">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-dark">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent" />
          </div>
          <div className="relative z-10 container mx-auto px-6 py-20 text-center">
            <h1 className="text-5xl font-bold text-white mb-4 animate-scale-in">
              Admin Dashboard
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto animate-scale-in">
              Streamlined healthcare management with elegant simplicity
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
            {adminItems.map((item) => (
              <AdminCard
                key={item.path}
                icon={item.icon}
                title={item.title}
                path={item.path}
                variant={item.variant}
                className="animate-scale-in"
              />
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-muted-foreground">Healthcare Management</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-secondary">11</div>
                <div className="text-muted-foreground">Admin Tools</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-accent">∞</div>
                <div className="text-muted-foreground">Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
