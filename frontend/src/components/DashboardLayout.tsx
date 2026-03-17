import { ReactNode, useState } from "react";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import Chatbot from "@/components/Chatbot";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <footer className="border-t bg-card px-4 py-3 text-center text-xs text-muted-foreground">
          © 2026 CampusComplaint — AI-Powered College Complaint Management
        </footer>
      </div>
      {user?.role === 'student' && <Chatbot />}
    </div>
  );
}
