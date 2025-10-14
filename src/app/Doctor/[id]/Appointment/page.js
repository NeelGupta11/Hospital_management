"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DoctorAppointments() {
  const { id } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`/api/Doctor/${id}/Appointment`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error || data.message) {
          setMessage(data.message || "Error loading appointments");
        } else {
          setAppointments(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to fetch appointments");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading appointments...
      </div>
    );
  }

  const now = new Date();
  const upcoming = appointments.filter((a) => new Date(a.date) >= now);
  const done = appointments.filter((a) => new Date(a.date) < now);

  const renderAppointments = (list, type) =>
    list.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((a) => (
          <div
            key={a._id}
            className={`group relative overflow-hidden rounded-xl cursor-pointer 
              p-6 min-h-[140px] flex flex-col items-center justify-center text-center
              transform transition-all duration-300 ease-smooth
              hover:scale-105 hover:-translate-y-2 active:scale-95
              shadow-card animate-scale-in ${
                type === "upcoming"
                  ? "bg-gradient-white border border-border"
                  : "bg-gradient-gray border border-border"
              }`}
          >
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="text-4xl">{a.patient?.name ? "🧑‍🤝‍🧑" : "❓"}</div>
              <p className="font-semibold text-sm">{a.patient?.name || "Unknown Patient"}</p>
              <p className="text-sm">{new Date(a.date).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{a.reason || "No reason provided"}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-muted-foreground">No {type} appointments</p>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-dark">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 animate-scale-in">
            My Appointments
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto animate-scale-in">
            Overview of upcoming and completed appointments
          </p>
        </div>

        {/* Floating Circles */}
        <div className="absolute top-10 left-10 w-24 h-24 border border-white/10 rounded-full animate-float" />
        <div
          className="absolute bottom-10 right-10 w-20 h-20 border border-white/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Appointments */}
      <div className="container mx-auto px-6 py-16 space-y-12">
        {/* Upcoming */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Upcoming Appointments</h2>
          {renderAppointments(upcoming, "upcoming")}
        </section>

        {/* Completed */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Completed Appointments</h2>
          {renderAppointments(done, "done")}
        </section>

        {message && (
          <p className="text-center text-red-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
