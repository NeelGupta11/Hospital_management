"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PatientLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/patient/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/patient/${data.patientId}/home`);
      } else {
        setMessage(data.message || "Login failed ❌");
      }
    } catch (err) {
      setMessage("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header Section */}
      <div className="relative w-full bg-gradient-dark py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-scale-in">
          Patient Portal
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto animate-scale-in">
          Welcome back! Sign in to access your appointments and medical records.
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

      {/* Login Form Card */}
      <div className="bg-gradient-white shadow-card hover:shadow-card-hover rounded-xl p-8 md:p-12 mt-8 w-full max-w-md animate-scale-in">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Email */}
          <label className="text-foreground font-semibold mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="patient@example.com"
            required
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4 text-sm"
          />

          {/* Password */}
          <label className="text-foreground font-semibold mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-6 text-sm"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-dark text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity mb-4 text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Message */}
          {message && (
            <div
              className={`text-center font-medium ${
                message.includes("failed") ? "text-red-600" : "text-green-600"
              } text-sm`}
            >
              {message}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-muted-foreground text-sm">
          © 2024 Medical Portal. Secure & Professional.
        </div>
      </div>
    </div>
  );
}
