"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PatientAppointments() {
  const { id } = useParams();
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

  if (loading) return <p className="appointments-loading">Loading appointments...</p>;

  // Split into upcoming & done
  const now = new Date();
  const upcoming = appointments.filter((a) => new Date(a.date) >= now);
  const done = appointments.filter((a) => new Date(a.date) < now);

  return (
    <div className="appointments-container">
      <h1 className="appointments-title">My Appointments</h1>
      {message && <p className="appointments-message">{message}</p>}

      {/* ✅ Upcoming */}
      <section>
        <h2 className="appointments-section-title">Upcoming Appointments</h2>
        {upcoming.length > 0 ? (
          <ul className="appointments-list">
            {upcoming.map((a) => (
              <li key={a._id} className="appointments-item upcoming">
                <p><strong>Doctor:</strong> {a.doctor?.name} ({a.doctor?.specialization})</p>
                <p><strong>Date:</strong> {new Date(a.date).toLocaleString()}</p>
                <p><strong>Reason:</strong> {a.reason || "N/A"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="appointments-empty">No upcoming appointments</p>
        )}
      </section>

      {/* ✅ Completed */}
      <section>
        <h2 className="appointments-section-title">Completed Appointments</h2>
        {done.length > 0 ? (
          <ul className="appointments-list">
            {done.map((a) => (
              <li key={a._id} className="appointments-item done">
                <p><strong>Doctor:</strong> {a.doctor?.name} ({a.doctor?.specialization})</p>
                <p><strong>Date:</strong> {new Date(a.date).toLocaleString()}</p>
                <p><strong>Reason:</strong> {a.reason || "N/A"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="appointments-empty">No past appointments</p>
        )}
      </section>
    </div>
  );
}
