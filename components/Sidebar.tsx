"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Folder,
  Settings,
  Menu,
  X,
  Image,
  Newspaper,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "News", path: "/dashboard/news", icon: FileText },
    { name: "Categories", path: "/dashboard/categories", icon: Folder },

    // ✅ NEW ADDED
    { name: "Ads", path: "/dashboard/AdsManager", icon: Image },
    { name: "Breaking", path: "/dashboard/BreakingManager", icon: Newspaper },

    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* 📱 Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b px-4 py-3 shadow-sm">
        <h1 className="text-lg font-bold text-red-500">Admin Panel</h1>
        <button onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>
      </div>

      {/* 📱 Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🚀 Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r p-5 z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-red-500">Admin</h1>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            let isActive = false;
            if (item.path === "/dashboard") {
              isActive = pathname === "/dashboard";
            } else {
              isActive = pathname.startsWith(item.path);
            }

            return (
              <Link href={item.path} key={item.name}>
                <div
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-red-500 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-5 left-5 right-5 text-xs text-gray-400">
          © 2026 Admin Panel
        </div>
      </aside>
    </>
  );
}