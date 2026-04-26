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
  IdCardIcon,
  PanelLeftRightDashedIcon,
  LucideYoutube,
  LocationEdit,
  PinIcon,
  HdIcon,
  BoxIcon,
  LucideAudioWaveform,
  BellElectricIcon,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "News", path: "/dashboard/news", icon: FileText },
    { name: "Satna News", path: "/dashboard/satna", icon: LocationEdit },
    { name: " Satna News Details", path: "/dashboard/satna/news", icon: PinIcon },
    { name: "Chhatarpu News", path: "/dashboard/chhatarpur", icon: HdIcon },
    { name: "Chhatarpur News Details", path: "/dashboard/chhatarpur/news", icon: BoxIcon},
    { name: "Ads", path: "/dashboard/AdsManager", icon: Image },
    { name: "Breaking", path: "/dashboard/BreakingManager", icon: Newspaper },
    { name: "UserSubmit", path: "/dashboard/newsSubmit", icon: LucideSquareUser },
    { name: "ID Card", path: "/dashboard/idcard", icon: IdCardIcon },
    { name: "Banner Ad", path: "/dashboard/bannerAd", icon: PanelLeftRightDashedIcon },
    { name: "YouTube Links", path: "/dashboard/YoutubeLinkManager", icon: LucideYoutube },
    { name: "Advertisement", path: "/dashboard/Advertisement", icon: LucideAudioWaveform },
    { name: "Notifications", path: "/dashboard/notification", icon: BellElectricIcon },
  ];

  return (
    <>
      {/* 📱 Mobile Top Bar */}
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
        className={`fixed top-0 left-0 h-screen bg-white z-50 shadow-lg transform transition-all duration-300 flex flex-col
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static
        ${collapsed ? "w-20" : "w-64"}`}
      >

        {/* 🔴 Header (Sticky) */}
        <div className="flex items-center justify-between px-4 py-4 bg-red-600 text-white sticky top-0 z-10">
          {!collapsed && (
            <h1 className="text-lg font-bold hidden md:block">
              STAR NEWS
            </h1>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              className="hidden md:block"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu size={22} />
            </button>

            <button
              className="md:hidden"
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* 📜 Scrollable Menu */}
        <nav className="flex-1 overflow-y-auto mt-2 px-2 space-y-2 scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-gray-100">
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
                      ? "bg-red-500 text-white shadow"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  <Icon size={20} />

                  {!collapsed && <span>{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* ⚫ Footer (Sticky Bottom) */}
        {!collapsed && (
          <div className="text-xs text-gray-400 px-4 py-3 border-t">
            © 2026 STAR NEWS ADMIN
          </div>
        )}
      </aside>
    </>
  );
}