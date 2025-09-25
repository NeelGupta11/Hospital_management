"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function OrderFoodForm() {
  const { id } = useParams(); // patient ID from URL
  const [foods, setFoods] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [gmail,setgmail] =useState("")

  // Fetch foods from API
useEffect(() => {
  async function fetchFoods() {
    const res = await fetch("/api/Canteen/getFood");
    const result = await res.json();
    const pa=await fetch(`/api/patient/${id}/profile`);
    const patien= await pa.json();
    setgmail(patien     .email)
    setFoods(result.data || []); // <-- use the `data` array from API
  }
  fetchFoods();
}, []);


  // Update total amount whenever selectedFoods changes
  useEffect(() => {
    const total = selectedFoods.reduce((sum, foodId) => {
      const food = foods.find(f => f._id === foodId);
      return food ? sum + food.price : sum;
    }, 0);
    setTotalAmount(total);
  }, [selectedFoods, foods]);

  const handleCheckboxChange = (foodId) => {
    setSelectedFoods(prev => 
      prev.includes(foodId) 
        ? prev.filter(id => id !== foodId) 
        : [...prev, foodId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFoods.length) {
      setMessage("Please select at least one food item");
      return;
    }

    try {
      const res = await fetch("/api/Order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: id,
          food: selectedFoods,
          total_amount:totalAmount
        }),
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
          Place Food Order
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" method="POST" action={`https://formsubmit.co/nguptaneelg@gmail.com`} >
          {/* Foods List with Checkboxes */}
          <div>
            <label className="block text-blue-300 font-bold mb-4 text-lg">
              Select Foods
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
              {foods.length ? (
                foods.map(f => (
                  <label 
                    key={f._id} 
                    className="flex items-center bg-gray-800 p-3 rounded hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="mr-3 h-5 w-5 text-green-500 focus:ring-green-400"
                      checked={selectedFoods.includes(f._id)}
                      onChange={() => handleCheckboxChange(f._id)}
                    />
                    <span className="text-gray-200">
                      {f.name} - ₹{f.price} ({f.FoodType}, {f.type})
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-gray-400 col-span-2">No foods available.</p>
              )}
            </div>
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-blue-300 font-bold mb-2 text-lg">
              Total Amount
            </label>
            <input
              type="text"
              value={`₹${totalAmount}`}
              readOnly
              className="shadow appearance-none border rounded w-full p-4 text-gray-200 bg-gray-700 focus:ring transform transition duration-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-4 rounded-lg transform transition hover:scale-105 duration-300 ease-in-out shadow-lg"
          >
            Place Order
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-green-400 font-semibold text-lg">{message}</p>
        )}
      </div>
    </div>
  );
}
