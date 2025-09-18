"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MedicineList() {
  const params = useParams();
  const patientId = params?.id;

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

  if (loading) return <p className="loading-text">Loading medicines...</p>;

  return (
    <div className="medicine-container">
      <h2 className="medicine-title">Medicine Timings</h2>
      {medicines.length === 0 ? (
        <p className="no-medicine">No medicines found for this patient.</p>
      ) : (
        medicines.map((presc, i) => (
          <div key={i} className="prescription-card">
            {presc.medicines.map((med, j) => (
              <div key={j} className="medicine-card">
                <p className="medicine-name">
                  <strong>{med.medicine?.name}</strong>{" "}
                  ({med.medicine?.strength} {med.medicine?.dosageForm})
                </p>
                <p className="medicine-detail">💊 Dosage: {med.dosage}</p>
                <p className="medicine-detail">🕒 Times: {med.times?.join(", ")}</p>
                {med.notes && <p className="medicine-notes">📝 {med.notes}</p>}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
