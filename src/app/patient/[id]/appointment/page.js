"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PatientAppointments() {
  const { id } = useParams();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`/api/appointments/${id}`)
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

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <p className="text-foreground">Loading appointments...</p>
      </div>
    );

  const now = new Date();
  const upcoming = appointments.filter((a) => new Date(a.date) >= now);
  const done = appointments.filter((a) => new Date(a.date) < now);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header */}
      <div className="relative w-full bg-gradient-dark py-16 px-6 text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-3xl mx-auto animate-scale-in">
          My Appointments
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto animate-scale-in">
          View all your upcoming and completed appointments.
        </p>

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
      </div>

      {/* Appointment Sections */}
      <div className="w-full max-w-4xl px-6 flex flex-col gap-8">
        {message && (
          <p className="bg-gradient-white shadow-card rounded-xl p-4 text-center text-red-600 animate-scale-in">
            {message}
          </p>
        )}

        {/* Upcoming */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Appointments</h2>
          {upcoming.length > 0 ? (
            <div className="grid gap-4">
              {upcoming.map((a) => (
                <div
                  key={a._id}
                  className="bg-gradient-white shadow-card rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center animate-scale-in"
                >
                  <div className="text-foreground">
                    <p>
                      <strong>Doctor:</strong> {a.doctor?.name} ({a.doctor?.specialization})
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(a.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>Reason:</strong> {a.reason || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="bg-gradient-white shadow-card rounded-xl p-4 text-center text-foreground animate-scale-in">
              No upcoming appointments
            </p>
          )}
        </section>

        {/* Completed */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Completed Appointments</h2>
          {done.length > 0 ? (
            <div className="grid gap-4">
              {done.map((a) => (
                <div
                  key={a._id}
                  className="bg-gradient-white shadow-card rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center animate-scale-in"
                >
                  <div className="text-foreground">
                    <p>
                      <strong>Doctor:</strong> {a.doctor?.name} ({a.doctor?.specialization})
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(a.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>Reason:</strong> {a.reason || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="bg-gradient-white shadow-card rounded-xl p-4 text-center text-foreground animate-scale-in">
              No past appointments
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
