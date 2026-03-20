// app/(dashboard)/layout.tsx

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      
      {/* Sidebar */}
      <div className="w-64 hidden md:block border-r bg-white">
        <Sidebar />
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}