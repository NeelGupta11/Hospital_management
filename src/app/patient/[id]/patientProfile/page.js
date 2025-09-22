"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PatientProfile() {
  const { id } = useParams(); // get patient ID from URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/patient/${id}/profile`);
        const data = await res.json();
        if (res.ok) setProfile(data);
        else setError(data.message || "Failed to load profile");
      } catch (err) {
        setError("Something went wrong");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!profile) return <p>No profile found</p>;

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{profile.name}'s Profile</h1>
      <p><strong>Age:</strong> {profile.age}</p>
      <p><strong>Gender:</strong> {profile.gender}</p>
      <p><strong>Contact:</strong> {profile.contactNumber}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Address:</strong> {profile.address}</p>
      <p><strong>Medical History:</strong> {profile.medicalHistory.join(", ") || "None"}</p>
      <p>
        <strong>Room:</strong>{" "}
        {profile.roomNo ? `${profile.roomNo} (${profile.roomType})` : "Not Allocated"}
      </p>
    </div>
  );
}
