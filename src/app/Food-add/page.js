"use client";
import { useState } from "react";

export default function FoodForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [foodType, setFoodType] = useState("Main Course");
  const [type, setType] = useState("Veg");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/Canteen/addFood", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: Number(price), FoodType: foodType, type }),
      });
      const data = await res.json();
      setMessage(res.ok ? data.message : data.error || "Something went wrong");
    } catch {
      setMessage("Network error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: "url('header.png')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-gray-900 bg-opacity-75 w-full max-w-3xl p-16 rounded-3xl shadow-2xl">
        <h2 className="text-5xl font-extrabold text-white mb-10 text-center drop-shadow-lg">
          Canteen Food Manager
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Food Name */}
          <div>
            <label className="block text-blue-300 font-bold mb-2 text-lg">Food Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Veg Sandwich"
              className="shadow appearance-none border rounded w-full p-4 text-gray-200 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out bg-gray-800 placeholder-gray-400"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-blue-300 font-bold mb-2 text-lg">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 50"
              className="shadow appearance-none border rounded w-full p-4 text-gray-200 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out bg-gray-800 placeholder-gray-400"
              required
            />
          </div>

          {/* Food Type */}
          <div>
            <label className="block text-blue-300 font-bold mb-2 text-lg">Food Category</label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="shadow appearance-none border rounded w-full p-4 text-gray-200 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out bg-gray-800"
            >
              <option value="Drink">Drink</option>
              <option value="Starter">Starter</option>
              <option value="Main Course">Main Course</option>
            </select>
          </div>

          {/* Veg / Nonveg */}
          <div>
            <label className="block text-blue-300 font-bold mb-2 text-lg">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="shadow appearance-none border rounded w-full p-4 text-gray-200 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out bg-gray-800"
            >
              <option value="Veg">Veg</option>
              <option value="Nonveg">Nonveg</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-4 rounded-lg transform transition hover:scale-105 duration-300 ease-in-out shadow-lg"
          >
            Submit
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-green-400 font-semibold text-lg">{message}</p>
        )}
      </div>
    </div>
  );
}
