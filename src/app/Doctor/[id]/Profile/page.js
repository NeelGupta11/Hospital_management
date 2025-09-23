"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DoctorDetailPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`/api/Doctor/${id}/Detail`);
        if (!res.ok) throw new Error("Failed to fetch doctor details");
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading doctor details...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        Doctor not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white">
          <h1 className="text-2xl font-bold">{doctor.name}</h1>
          <p className="text-sm opacity-90">{doctor.specialization}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-gray-500 text-sm">Department</p>
            <p className="text-gray-800 font-medium">{doctor.department || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-gray-800 font-medium">{doctor.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Contact Number</p>
            <p className="text-gray-800 font-medium">{doctor.contact_number || "N/A"}</p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 text-center">
        </div>
      </div>
    </div>
  );
}
