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

  // Helper: get patient's current room
  const getCurrentRoom = (patientId) =>
    rooms.find((r) => r.currentPatient === patientId);

  // Handle room allocation/change
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
        body: JSON.stringify({
          patient_id: patientId,
          roomNo: selectedRoom[patientId],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        refreshRooms();
      } else {
        setMessage(data.message || "Failed to change room");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle vacating a room
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

      if (res.ok) {
        setMessage(data.message || "Room vacated successfully");
        refreshRooms();
      } else {
        setMessage(data.message || "Failed to vacate room");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Refetch rooms
  const refreshRooms = async () => {
    const latestRooms = await fetch("/api/rooms/availableRoom").then((r) =>
      r.json()
    );
    setRooms(Array.isArray(latestRooms) ? latestRooms : []);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Room Allocation / Vacating</h1>

      {message && (
        <div className="mb-4 p-2 rounded bg-blue-100 text-blue-700">{message}</div>
      )}

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Patient Name</th>
            <th className="p-2 border">Current Room</th>
            <th className="p-2 border">Select New Room</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => {
            const currentRoom = getCurrentRoom(p._id);
            return (
              <tr key={p._id} className="border-t">
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">
                  {currentRoom ? (
                    <span>
                      {currentRoom.roomNo} ({currentRoom.type})
                    </span>
                  ) : (
                    <span className="text-gray-500">Not Allocated</span>
                  )}
                </td>
                <td className="p-2 border">
                  <select
                    className="border p-1 rounded"
                    value={selectedRoom[p._id] || ""}
                    onChange={(e) =>
                      setSelectedRoom({
                        ...selectedRoom,
                        [p._id]: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Select Room --</option>
                    {rooms.map((room) => (
                      <option
                        key={room._id}
                        value={room.roomNo}
                        disabled={room.occupy && room.currentPatient !== p._id}
                      >
                        {room.roomNo} - {room.type} (
                        {room.occupy ? "Occupied" : "Available"})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleChangeRoom(p._id)}
                    disabled={loading}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {loading ? "Processing..." : "Allocate/Change"}
                  </button>

                  {currentRoom && (
                    <button
                      onClick={() => handleVacateRoom(p._id)}
                      disabled={loading}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      {loading ? "Processing..." : "Vacate"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
