"use client";
import { useRouter } from "next/navigation";
// import "./login.css"; // import CSS file

const LoginPage = () => {
  const router = useRouter();

  return (
    <div className="container">
      <div className="card">
        <h1 className="text-black">Choose Login</h1>
        <button onClick={() => router.push("/Home/HomeAdmin")} className="btn admin">
          Admin Login
        </button>
        <button onClick={() => router.push("/Doctor/Login")} className="btn doctor">
          Doctor's Login
        </button>
        <button onClick={() => router.push("/patientlogin")} className="btn patient">
          Patient Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
