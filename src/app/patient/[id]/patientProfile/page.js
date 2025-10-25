"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PatientProfile() {
  const { id } = useParams();
  const router = useRouter();
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

  if (loading)
    return <p className="text-center text-foreground mt-12">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-12">{error}</p>;
  if (!profile)
    return <p className="text-center text-foreground mt-12">No profile found</p>;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header Section with Blue Gradient */}
      <div className="relative w-full bg-gradient-dark py-16 px-6 text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-3xl mx-auto animate-scale-in">
          {profile.name}'s Profile
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto animate-scale-in">
          View and manage your personal information and medical details.
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

      {/* Profile Card */}
      <div className="bg-gradient-white shadow-card rounded-xl p-8 w-full max-w-md animate-scale-in mb-12">
        <div className="space-y-3 text-foreground text-base">
          <p>
            <strong>Age:</strong> {profile.age}
          </p>
          <p>
            <strong>Gender:</strong> {profile.gender}
          </p>
          <p>
            <strong>Contact:</strong> {profile.contactNumber}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Address:</strong> {profile.address}
          </p>
          <p>
            <strong>Medical History:</strong>{" "}
            {profile.medicalHistory?.length
              ? profile.medicalHistory.join(", ")
              : "None"}
          </p>
          <p>
            <strong>Room:</strong>{" "}
            {profile.roomNo
              ? `${profile.roomNo} (${profile.roomType})`
              : "Not Allocated"}
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="mt-6 w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg font-semibold transition-all"
        >
          Back
        </button>
      </div>
    </div>
  );
}
