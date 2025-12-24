"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useLoginMutation } from "@/state/api";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Redirect if already logged in
  useEffect(() => {
    const token = document.cookie.includes("token=");
    if (token) router.push("/dashboard");
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(formData).unwrap();

      // Optional: save token in localStorage (if needed)
      if (result.token) localStorage.setItem("token", result.token);

      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err?.data?.message || "Login failed. Please check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/80 text-sm mt-1">Login to continue</p>
        </div>

        {error && <p className="text-red-200 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-white text-sm mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-white/70" size={18} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-white text-sm mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-white/70" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-white/70 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-white text-indigo-600 font-semibold hover:bg-gray-100 transition disabled:opacity-70"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
