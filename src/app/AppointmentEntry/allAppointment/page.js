"use client";
import { useEffect, useState } from "react";

const Page = () => {
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
    <div className="appointments-container">
      <h2 className="appointments-title">All Appointments</h2>
      {appointments.length > 0 ? (
        <ul className="appointments-list">
          {appointments.map((a) => (
            <li key={a._id} className="appointments-item">
              <strong>{a.patient?.name}</strong> with{" "}
              <strong>{a.doctor?.name}</strong> <br />
              <span>
                📅 {new Date(a.date).toLocaleDateString()} — {a.reason}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="appointments-empty">No appointments found</p>
      )}
    </div>
  );
};

export default Page;
