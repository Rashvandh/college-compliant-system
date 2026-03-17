import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import SubmitComplaint from "@/pages/SubmitComplaint";
import ComplaintHistory from "@/pages/ComplaintHistory";
import ComplaintDetails from "@/pages/ComplaintDetails";
import ComplaintStatus from "@/pages/ComplaintStatus";
import Profile from "@/pages/Profile";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminAllComplaints from "@/pages/AdminAllComplaints";
import ManageComplaints from "@/pages/ManageComplaints";
import Analytics from "@/pages/Analytics";
import AdminUsers from "@/pages/AdminUsers";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/submit-complaint" element={<ProtectedRoute><SubmitComplaint /></ProtectedRoute>} />
              <Route path="/my-complaints" element={<ProtectedRoute><ComplaintHistory /></ProtectedRoute>} />
              <Route path="/complaint-status" element={<ProtectedRoute><ComplaintStatus /></ProtectedRoute>} />
              <Route path="/complaint/:id" element={<ProtectedRoute><ComplaintDetails /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* Admin routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/complaints" element={<ProtectedRoute adminOnly><AdminAllComplaints /></ProtectedRoute>} />
              <Route path="/admin/manage" element={<ProtectedRoute adminOnly><ManageComplaints /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><Analytics /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
