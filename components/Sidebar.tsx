"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Menu,
  X,
  Image,
  Newspaper,
  LucideSquareUser,
  IdCardIcon
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "News", path: "/dashboard/news", icon: FileText },
    { name: "Ads", path: "/dashboard/AdsManager", icon: Image },
    { name: "Breaking", path: "/dashboard/BreakingManager", icon: Newspaper },
     { name: "UserSubmit", path: "/dashboard/newsSubmit", icon: LucideSquareUser },
      { name: "ID Card", path: "/dashboard/idcard", icon: IdCardIcon },
  ];

  return (
    <>
      {/* 📱 Mobile Top Bar (ONLY MENU ICON) */}
      <div className="md:hidden flex items-center justify-end bg-red-600 text-white px-4 py-3 shadow-md sticky top-0 z-50">
        <button onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>
      </div>

      {/* 📱 Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🚀 Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white z-50 shadow-lg transform transition-all duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static
        ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-red-600 text-white">
          {/* ❌ Mobile me hide, Desktop me show */}
          {!collapsed && (
            <h1 className="text-lg font-bold hidden md:block">
              STAR NEWS
            </h1>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* Collapse Button (Desktop) */}
            <button
              className="hidden md:block"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu size={22} />
            </button>

            {/* Close Button (Mobile) */}
            <button
              className="md:hidden"
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-4 space-y-2 px-2">
          {menu.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.path === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.path);

            return (
              <Link href={item.path} key={item.name}>
                <div
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-red-500 text-white"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  <Icon size={20} />

                  {/* Collapse me text hide */}
                  {!collapsed && <span>{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="absolute bottom-5 left-5 right-5 text-xs text-gray-400">
            © 2026 STAR NEWS ADMIN
          </div>
        )}
      </aside>
    </>
  );
}