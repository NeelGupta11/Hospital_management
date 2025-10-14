"use client";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      {/* Header Section */}
      <div className="relative w-full bg-gradient-dark py-16 px-6 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-scale-in">
          Welcome to HospiCare
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto animate-scale-in">
          Streamlined healthcare management for Admins, Doctors, and Patients
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

      {/* Login Buttons Card */}
      <div className="bg-gradient-white shadow-card hover:shadow-card-hover rounded-xl p-8 w-full max-w-md text-center animate-scale-in relative z-10">
        <h2 className="text-2xl font-bold text-foreground mb-6">Choose Login</h2>

        {/* All buttons use bg-gradient-dark */}
        <button
          onClick={() => router.push("/Home/HomeAdmin")}
          className="w-full bg-gradient-dark text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity mb-4 text-sm"
        >
          Admin Login
        </button>

        <button
          onClick={() => router.push("/Doctor/Login")}
          className="w-full bg-gradient-dark text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity mb-4 text-sm"
        >
          Doctor's Login
        </button>

        <button
          onClick={() => router.push("/patientlogin")}
          className="w-full bg-gradient-dark text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
        >
          Patient Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
