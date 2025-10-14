"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // ✅ simple icons for toggle

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const sidebarItems = [
    { icon: "🏠", title: "Dashboard", path: "/admin" },
    { icon: "👨‍⚕️", title: "Doctors", path: "/DoctorEntry" },
    { icon: "🧑‍🤝‍🧑", title: "Patients", path: "/patientEntry" },
    { icon: "👩‍💼", title: "Staff", path: "/StaffEntry" },
    { icon: "📅", title: "Appointments", path: "/AppointmentEntry" },
    { icon: "📑", title: "Reports", path: "/report-add" },
    { icon: "💊", title: "Medicines", path: "/Patients/medicine" },
    { icon: "🛏️", title: "Rooms", path: "/RoomAllocation" },
    { icon: "🔔", title: "Notifications", path: "/notification-add" },
    { icon: "🤖", title: "HospiAI", path: "/prompt" },
  ];

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } min-h-screen bg-gradient-dark text-white shadow-card p-4 flex flex-col transition-all duration-300`}
    >
      {/* Header with toggle button */}
      <div className="flex items-center justify-between mb-6">
        {isOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-3">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg 
              hover:bg-white/10 transition-colors duration-300"
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="font-medium">{item.title}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
