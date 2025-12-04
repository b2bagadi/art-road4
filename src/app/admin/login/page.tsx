"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") === "true") {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Hardcoded credentials check
    if (formData.username === "artroad10" && formData.password === "S@ha1201200") {
      // Store login state
      localStorage.setItem("admin_logged_in", "true");

      // Redirect to dashboard
      router.push("/admin/dashboard");
    } else {
      setError("Invalid username or password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--charcoal)] via-gray-900 to-black">
      <div className="w-full max-w-md p-8">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] rounded-full flex items-center justify-center mx-auto">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400">
              Sign in to access the dashboard
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] focus:border-transparent"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="off"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] focus:border-transparent"
                placeholder=""
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-[var(--cyan)] hover:underline"
            >
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}