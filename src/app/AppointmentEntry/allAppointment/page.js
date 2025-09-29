"use client";
import { useEffect, useState } from "react";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("/api/appointments");
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("❌ Error fetching appointments:", err);
      }
    }
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-scale-in bg-gradient-dark p-6 rounded-xl inline-block">
          Appointments
        </h1>
        <p className="text-white/80 max-w-xl mx-auto animate-scale-in mt-2">
          Overview of all patient appointments
        </p>
      </div>

      {/* Appointments List */}
      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((a) => (
            <div
              key={a._id}
              className="bg-gradient-white shadow-card hover:shadow-card-hover rounded-xl p-4 animate-scale-in"
            >
              <p className="font-semibold text-foreground text-lg mb-2">
                {a.patient?.name} ➜ {a.doctor?.name}
              </p>
              <p className="text-sm text-foreground/70 mb-2">
                📅 {new Date(a.date).toLocaleDateString()} at{" "}
                {new Date(a.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-foreground/70">Reason: {a.reason}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-foreground/70 mt-8 text-lg animate-scale-in">
          No appointments found
        </p>
      )}
    </div>
  );
};

export default AppointmentsPage;
