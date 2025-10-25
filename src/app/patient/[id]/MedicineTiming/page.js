"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function MedicineList() {
  const { id: patientId } = useParams();
  const router = useRouter();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    const fetchMedicines = async () => {
      try {
        const res = await fetch(`/api/patient/${patientId}/medicine`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        setMedicines(data.medicines || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [patientId]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <p className="text-foreground">Loading medicines...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header */}
      <div className="relative w-full bg-gradient-dark py-16 px-6 text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-3xl mx-auto animate-scale-in">
          Medicine Timings
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto animate-scale-in">
          Check your prescribed medicines and their timings.
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

      {/* Medicine Cards */}
      <div className="w-full max-w-4xl px-6 flex flex-col gap-6">
        {medicines.length === 0 ? (
          <div className="bg-gradient-white shadow-card rounded-xl p-6 text-center animate-scale-in">
            No medicines found for this patient.
          </div>
        ) : (
          medicines.map((presc, i) => (
            <div
              key={i}
              className="bg-gradient-white shadow-card rounded-xl p-6 animate-scale-in"
            >
              {presc.medicines.map((med, j) => (
                <div
                  key={j}
                  className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200"
                >
                  <p className="font-semibold text-lg text-foreground">
                    {med.medicine?.name} ({med.medicine?.strength}{" "}
                    {med.medicine?.dosageForm})
                  </p>
                  <p className="text-foreground">💊 Dosage: {med.dosage}</p>
                  <p className="text-foreground">
                    🕒 Times: {med.times?.join(", ")}
                  </p>
                  {med.notes && <p className="text-foreground">📝 {med.notes}</p>}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mt-6 w-full max-w-md bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg font-semibold transition-all"
      >
        Back
      </button>
    </div>
  );
}
