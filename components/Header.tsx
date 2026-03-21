"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white border-b px-4 md:px-6 py-3 shadow-sm sticky top-0 z-40">

      {/* 🔴 LEFT: LOGO + TITLE */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm tracking-wide">
          STAR NEWS
        </div>

        {/* Desktop Title */}
        <h2 className="hidden md:block text-lg font-semibold text-gray-800">
          Admin Dashboard
        </h2>
      </div>

      {/* 🔍 CENTER SEARCH (Desktop) */}
      <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-md w-full max-w-md mx-6">
        <Search size={16} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search news, categories..."
          className="bg-transparent outline-none text-sm ml-2 w-full"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* 🔍 Mobile Search Icon */}
        <div className="md:hidden bg-gray-100 p-2 rounded-full cursor-pointer">
          <Search size={18} className="text-gray-700" />
        </div>

        {/* 🔔 Notifications */}
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-[1px] rounded-full">
            3
          </span>
        </div>

        {/* 👤 Profile */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg transition">
          <img
            src="https://i.pravatar.cc/40"
            alt="admin"
            className="w-8 h-8 rounded-full border"
          />

          {/* Desktop Info */}
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-800">
              Admin
            </span>
            <span className="text-xs text-gray-500">
              Editor Panel
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}