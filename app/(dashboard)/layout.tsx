import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Server-side session verification guard
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex font-sans">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 pl-64 min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <Topbar />

        {/* Dynamic Panels */}
        <main className="flex-grow pt-16 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
