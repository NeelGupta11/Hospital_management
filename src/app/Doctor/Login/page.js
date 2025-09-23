// app/doctor-login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/Doctor/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/Doctor/${data.doctor._id}/DoctorHome`);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      setMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center p-5">
      {/* Form Card */}
      <div className="bg-white p-12 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-500 text-white rounded-full mb-5 shadow-lg shadow-sky-500/30">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Doctor Portal</h1>
          <p className="text-slate-600">Welcome back, please sign in</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="doctor@hospital.com"
            required
            className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-200 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-sky-500 focus:shadow-lg focus:shadow-sky-500/10 focus:bg-white placeholder-gray-400 mb-6"
          />

          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-200 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-sky-500 focus:shadow-lg focus:shadow-sky-500/10 focus:bg-white placeholder-gray-400 mb-8"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg font-semibold cursor-pointer transition-all duration-300 mb-6 hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="flex items-center justify-center gap-2 text-sm mb-4">
            <a href="#" className="text-sky-500 hover:text-sky-600 transition-colors">
              Forgot Password?
            </a>
            <span className="text-slate-300">•</span>
            <a href="#" className="text-sky-500 hover:text-sky-600 transition-colors">
              Need Help?
            </a>
          </div>

          {message && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {message}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>© 2024 Medical Portal. Secure & Professional.</p>
        </div>
      </div>
    </div>
  );
}
