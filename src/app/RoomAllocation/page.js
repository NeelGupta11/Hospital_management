"use client";

import { useEffect, useState } from "react";

export default function RoomAllocation() {
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch patients and rooms
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, roomsRes] = await Promise.all([
          fetch("/api/patient"),
          fetch("/api/rooms/availableRoom"),
        ]);

        const patientsData = await patientsRes.json();
        const roomsData = await roomsRes.json();

        setPatients(patientsData || []);
        setRooms(Array.isArray(roomsData) ? roomsData : []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const getCurrentRoom = (patientId) =>
    rooms.find((r) => r.currentPatient === patientId);

  const handleChangeRoom = async (patientId) => {
    if (!selectedRoom[patientId]) {
      setMessage("Please select a room first.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/rooms/assignRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId, roomNo: selectedRoom[patientId] }),
      });
      const data = await res.json();
      setMessage(data.message);
      refreshRooms();
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVacateRoom = async (patientId) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/rooms/vacateRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId }),
      });
      const data = await res.json();
      setMessage(data.message || "Room vacated successfully");
      refreshRooms();
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const refreshRooms = async () => {
    const latestRooms = await fetch("/api/rooms/availableRoom").then((r) => r.json());
    setRooms(Array.isArray(latestRooms) ? latestRooms : []);
  };

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-400 p-4 rounded-xl shadow-lg">
        Room Allocation / Vacating
      </h1>

      {message && (
        <div className="p-3 bg-blue-100 text-blue-800 rounded shadow">{message}</div>
      )}

      <div className="grid gap-6">
        {patients.map((p) => {
          const currentRoom = getCurrentRoom(p._id);
          return (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-6"
            >
              <div className="flex-1">
                <p className="font-semibold text-lg">{p.name}</p>
                <p className="text-gray-500">
                  Current Room:{" "}
                  {currentRoom ? `${currentRoom.roomNo} (${currentRoom.type})` : "Not Allocated"}
                </p>
              </div>

              <div className="flex-1">
                <select
                  className="w-full border p-2 rounded-lg"
                  value={selectedRoom[p._id] || ""}
                  onChange={(e) =>
                    setSelectedRoom({ ...selectedRoom, [p._id]: e.target.value })
                  }
                >
                  <option value="">-- Select Room --</option>
                  {rooms.map((room) => (
                    <option
                      key={room._id}
                      value={room.roomNo}
                      disabled={room.occupy && room.currentPatient !== p._id}
                    >
                      {room.roomNo} - {room.type} ({room.occupy ? "Occupied" : "Available"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 flex-col md:flex-row">
                <button
                  onClick={() => handleChangeRoom(p._id)}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  {loading ? "Processing..." : "Allocate/Change"}
                </button>

                {currentRoom && (
                  <button
                    onClick={() => handleVacateRoom(p._id)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                  >
                    {loading ? "Processing..." : "Vacate"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
