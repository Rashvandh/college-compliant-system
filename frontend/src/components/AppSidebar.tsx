import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, PlusCircle, List, Search, User, LogOut,
  BarChart3, Users, Settings, X, ShieldCheck
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const studentLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/submit-complaint", label: "Submit Complaint", icon: PlusCircle },
  { to: "/my-complaints", label: "My Complaints", icon: List },
  { to: "/complaint-status", label: "Complaint Status", icon: Search },
  { to: "/profile", label: "Profile", icon: User },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/complaints", label: "All Complaints", icon: List },
  { to: "/admin/manage", label: "Manage Complaints", icon: Settings },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: Users },
];

export default function AppSidebar({ isOpen, onClose }: SidebarProps) {
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-sidebar-primary" />
            <span className="text-lg font-bold text-sidebar-primary-foreground">
              {isAdmin ? "Admin Panel" : "Student Portal"}
            </span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-sidebar-accent lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <RouterNavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <link.icon className="h-5 w-5 flex-shrink-0" />
                <span>{link.label}</span>
              </RouterNavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => { logout(); onClose(); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
