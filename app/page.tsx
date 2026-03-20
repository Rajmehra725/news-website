"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = () => {
    setError("");

    // 🔐 Dummy credentials
    if (email === "admin@starnews.com" && password === "123456") {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* 🔴 Breaking News Bar */}
      <div className="bg-red-600 flex items-center text-white text-sm overflow-hidden">
        <span className="bg-black px-3 py-2 font-bold">BREAKING</span>

        <div className="overflow-hidden flex-1">
          <div className="animate-ticker whitespace-nowrap px-4">
            🔴 Secure Admin Access Enabled | STAR NEWS CONTROL PANEL | Authorized Personnel Only
          </div>
        </div>
      </div>

      {/* Center */}
      <div className="flex flex-1 items-center justify-center px-4 bg-gradient-to-br from-black via-gray-900 to-red-900">

        <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          
          <h1 className="text-4xl font-extrabold text-center text-red-500 mb-2">
            STAR NEWS
          </h1>

          <p className="text-center text-gray-300 text-sm mb-4 uppercase">
            Editorial Control Panel
          </p>

          <h2 className="text-lg text-center mb-4 font-bold">
            🔐 Authorized Login Required
          </h2>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Official Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              type={show ? "text" : "password"}
              placeholder="Enter Secure Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
              onClick={() => setShow(!show)}
              className="absolute right-3 top-3 text-sm text-gray-300"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-bold uppercase hover:bg-red-700 transition"
          >
            Access Newsroom
          </button>

          <p className="text-center text-gray-400 text-xs mt-4">
            Demo Login: admin@starnews.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
}