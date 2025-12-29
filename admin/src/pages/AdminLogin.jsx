// Landstime_Androidapp/admin/src/pages/AdminLogin.jsx
import { useState } from "react";
import { Mail, Lock, Building2 } from "lucide-react";
import { adminLogin } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


// ✅ NEW CODE
const handleLogin = async (e) => {
  e.preventDefault(); // Prevent form submission if wrapped in form
  
  // Validate inputs
  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  try {
    setLoading(true);

    const res = await adminLogin(email, password);

    // Save token
    localStorage.setItem("token", res.token);
    localStorage.setItem("role", "Admin");

    // Navigate to admin dashboard
    navigate("/properties");
  } catch (err) {
    console.error("Admin login failed:", err);
    alert(err.response?.data?.message || "Invalid admin credentials");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex">

      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#0B1220] to-[#020617] text-white items-center justify-center px-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Building2 size={28} />
            </div>
            <h1 className="text-3xl font-bold">PropAdmin</h1>
          </div>

          <h2 className="text-2xl font-semibold mb-3">
            Real Estate Admin Portal
          </h2>

          <p className="text-gray-400 leading-relaxed">
            Manage properties, users, and content all in one powerful
            dashboard.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-6">
            Sign in to access your admin dashboard
          </p>

          {/* Email */}
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative mb-4">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="admin@realestate.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative mb-6">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Demo creds */}
          <p className="text-center text-sm text-gray-500 mt-5">
            Demo credentials:{" "}
            <span className="font-medium">
              admin@realestate.com / admin123
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
