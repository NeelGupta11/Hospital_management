"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function PatientMedicinePage() {
  const { id: patientId } = useParams();
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({
    name: "",
    strength: "",
    dosageForm: "",
    dosage: "",
    times: [],
    notes: "",
  });
  const [message, setMessage] = useState("");

  const allTimes = ["morning", "afternoon", "evening", "night"];

  // Fetch patient’s medicines
  // const fetchMedicines = async () => {
  //   try {
  //     const res = await fetch(`/api/patient/${patientId}/prescription`);
  //     const data = await res.json();
  //     if (data.prescription) {
  //       setMedicines(data.prescription.medicines || []);
  //     } else {
  //       setMedicines([]);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // useEffect(() => {
  //   fetchMedicines();
  // }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleTime = (time) => {
    setForm((prev) => ({
      ...prev,
      times: prev.times.includes(time)
        ? prev.times.filter((t) => t !== time)
        : [...prev.times, time],
    }));
  };

  // Add or update medicine
  const handlePatch = async () => {
    try {
      const res = await fetch(`/api/patient/${patientId}/medicine`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchMedicines();
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Delete medicine or specific times
  const handleDelete = async (medicine) => {
    try {
      const res = await fetch(`/api/patient/${patientId}/medicineTiming`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicine), // medicine object: name, strength, dosageForm, optional times
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchMedicines();
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Load medicine into form for editing
  const loadMedicine = (med) => {
    setForm({
      name: med.medicine.name,
      strength: med.medicine.strength || "",
      dosageForm: med.medicine.dosageForm || "",
      dosage: med.dosage || "",
      times: med.times || [],
      notes: med.notes || "",
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Manage Medicines</h1>

      <div className="mb-4 border p-4 rounded bg-gray-50">
        <h2 className="font-semibold mb-2">Add / Update Medicine</h2>
        <input
          type="text"
          name="name"
          placeholder="Medicine Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 mb-2 w-full rounded"
        />
        <input
          type="text"
          name="strength"
          placeholder="Strength (e.g., 500mg)"
          value={form.strength}
          onChange={handleChange}
          className="border p-2 mb-2 w-full rounded"
        />
        <input
          type="text"
          name="dosageForm"
          placeholder="Dosage Form"
          value={form.dosageForm}
          onChange={handleChange}
          className="border p-2 mb-2 w-full rounded"
        />
        <input
          type="text"
          name="dosage"
          placeholder="Dosage"
          value={form.dosage}
          onChange={handleChange}
          className="border p-2 mb-2 w-full rounded"
        />

        <div className="mb-2">
          <span className="font-semibold">Times:</span>
          <div className="flex gap-2 mt-1">
            {allTimes.map((time) => (
              <label key={time} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.times.includes(time)}
                  onChange={() => toggleTime(time)}
                />
                {time}
              </label>
            ))}
          </div>
        </div>

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          className="border p-2 mb-2 w-full rounded"
        />

        <button
          onClick={handlePatch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add / Update
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-2">Current Medicines</h2>
      <div className="space-y-2">
        {medicines.map((med, index) => (
          <div
            key={index}
            className="border p-2 rounded flex justify-between items-center bg-white"
          >
            <div>
              <p className="font-semibold">{med.medicine.name}</p>
              <p>{med.strength} - {med.dosageForm}</p>
              <p>Dosage: {med.dosage}</p>
              <p>Times: {med.times.join(", ")}</p>
              {med.notes && <p>Notes: {med.notes}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => loadMedicine(med)}
                className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() =>
                  handleDelete({
                    name: med.medicine.name,
                    strength: med.medicine.strength,
                    dosageForm: med.medicine.dosageForm,
                  })
                }
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
