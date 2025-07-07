"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "admin" || payload.role === "superadmin") {
          router.replace(`/dashboard/${payload.role}`);
        }
      } catch {
        // Invalid token, do nothing
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      // Redirect based on role
      if (data.user.role === "superadmin" || data.user.role === "admin") {
        router.replace(`/dashboard/${data.user.role}`);
      } else {
        setError("Unknown role");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-black transition-colors">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 dark:bg-neutral-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white dark:text-gray-100">Parlour Admin Login</h2>
        {error && (
          <div className="mb-4 text-red-400 text-center">{error}</div>
        )}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-200">Email</label>
          <input
            type="email"
            className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-200">Password</label>
          <input
            type="password"
            className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded transition font-semibold shadow"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
} 