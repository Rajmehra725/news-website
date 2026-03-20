"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white border-b px-4 md:px-6 py-3 shadow-sm">
      
      {/* Left */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 hidden md:block">
          Dashboard
        </h2>

        {/* 🔍 Search */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-md w-full">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm ml-2 w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        
        {/* 🔔 Notifications */}
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
            3
          </span>
        </div>

        {/* 👤 Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40"
            alt="admin"
            className="w-8 h-8 rounded-full border"
          />

          {/* Desktop Only */}
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-800">
              Admin
            </span>
            <span className="text-xs text-gray-500">
              Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}