"use client";

import { useState } from "react";
import { Search, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      // simulate API / cleanup
      await new Promise((res) => setTimeout(res, 1200));

      localStorage.removeItem("adminToken");

      router.push("/");
    } catch {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">
              STAR NEWS
            </h1>
            <span className="hidden md:block text-sm text-gray-500">
              Admin Panel
            </span>
          </div>

          {/* SEARCH */}
          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm ml-2 w-full"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            <div className="hidden md:flex items-center gap-2 text-sm text-gray-700">
              <img
                src="https://i.pravatar.cc/40"
                className="w-8 h-8 rounded-full border"
              />
              <span className="font-medium">Admin</span>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition"
            >
              <LogOut size={16} />
              <span className="hidden md:block">Logout</span>
            </button>

          </div>
        </div>
      </header>

      {/* 🔥 LOGOUT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95">

            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Logout
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to logout from admin panel?
            </p>

            <div className="flex justify-end gap-3">

              {/* Cancel */}
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-md border text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              {/* Confirm Logout */}
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Logging out..." : "Logout"}
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}