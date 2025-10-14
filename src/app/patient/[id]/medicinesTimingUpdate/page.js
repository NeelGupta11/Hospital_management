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

  // Fetch patient medicines
  const fetchMedicines = async () => {
    try {
      const res = await fetch(`/api/patient/${patientId}/medicine`);
      const data = await res.json();
      if (data.medicines) {
        setMedicines(data.medicines || []);
      } else {
        setMedicines([]);
      }
      console.log(data.medicines)
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Form handlers
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
      setForm({
        name: "",
        strength: "",
        dosageForm: "",
        dosage: "",
        times: [],
        notes: "",
      });
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async (medicine) => {
    try {
      const res = await fetch(`/api/patient/${patientId}/medicineTiming`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicine),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchMedicines();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const loadMedicine = (med) => {
    setForm({
      name: med.medicine?.name || "",
      strength: med.medicine?.strength || "",
      dosageForm: med.medicine?.dosageForm || "",
      dosage: med.dosage || "",
      times: med.times || [],
      notes: med.notes || "",
    });
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <h1 className="text-4xl font-bold text-white mb-6">Manage Medicines</h1>

      {/* Add / Update Form */}
      <div className="bg-gradient-white p-6 rounded-xl shadow-card mb-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Add / Update Medicine</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Medicine Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="strength"
            placeholder="Strength (e.g., 500mg)"
            value={form.strength}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="dosageForm"
            placeholder="Dosage Form"
            value={form.dosageForm}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="dosage"
            placeholder="Dosage"
            value={form.dosage}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <span className="font-semibold">Times:</span>
          <div className="flex gap-2 mt-2">
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
          className="border p-2 rounded w-full mb-4"
        />

        <button
          onClick={handlePatch}
          className="bg-gradient-dark text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          Add / Update
        </button>

        {message && <p className="mt-4 text-sm text-white">{message}</p>}
      </div>

      {/* Current Medicines Table */}
      <div className="overflow-x-auto bg-gradient-white p-4 rounded-xl shadow-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Current Medicines</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Strength</th>
              <th className="px-4 py-2 text-left">Dosage Form</th>
              <th className="px-4 py-2 text-left">Dosage</th>
              <th className="px-4 py-2 text-left">Times</th>
              <th className="px-4 py-2 text-left">Notes</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {medicines.map((med, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50">
                <td className="px-4 py-2">{med.medicine?.name || "N/A"}</td>
                <td className="px-4 py-2">{med.medicine?.strength || "-"}</td>
                <td className="px-4 py-2">{med.medicine?.dosageForm || "-"}</td>
                <td className="px-4 py-2">{med.dosage || "-"}</td>
                <td className="px-4 py-2">{med.times?.join(", ") || "-"}</td>
                <td className="px-4 py-2">{med.notes || "-"}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => med.medicine && loadMedicine(med)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      med.medicine &&
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
