"use client";
import { useRouter } from "next/navigation";

const AdminHomePage = () => {
  const router = useRouter();

  return (
    <div className="admin-grid-container">
      <h1 className="admin-grid-title">Admin Dashboard</h1>
      
      <div className="admin-grid">
        <div className="admin-grid-item" onClick={() => router.push("/DoctorEntry")}>
          <span className="admin-grid-icon">👨‍⚕️</span>
          <p>Add Doctor</p>
        </div>

        <div className="admin-grid-item" onClick={() => router.push("/patientEntry")}>
          <span className="admin-grid-icon">🧑‍🤝‍🧑</span>
          <p>Add Patient</p>
        </div>

        <div className="admin-grid-item" onClick={() => router.push("/StaffEntry")}>
          <span className="admin-grid-icon">👩‍💼</span>
          <p>Add Staff</p>
        </div>

        <div className="admin-grid-item" onClick={() => router.push("/AppointmentEntry")}>
          <span className="admin-grid-icon">📅</span>
          <p>Add Appointment</p>
        </div>

        <div className="admin-grid-item" onClick={() => router.push("/Patients")}>
          <span className="admin-grid-icon">📋</span>
          <p>See Patients</p>
        </div>
        <div className="patient-home-item"
          onClick={() => router.push(`/report-add`)}
        >
          <span className="patient-home-icon">📑</span>
          <p>Add Reports</p>
          
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
