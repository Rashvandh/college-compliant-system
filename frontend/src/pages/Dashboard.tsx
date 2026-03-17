import DashboardLayout from "@/components/DashboardLayout";
import DashboardCard from "@/components/DashboardCard";
import ComplaintTable, { Complaint } from "@/components/ComplaintTable";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";

import { useState, useEffect } from "react";
import { complaintAPI } from "@/services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await complaintAPI.getMine();
        const formatted = res.data.map((c: any) => ({
          id: `CC-${c.id.toString().padStart(3, '0')}`,
          title: c.title,
          category: c.category,
          priority: c.priority,
          status: c.status,
          date: new Date(c.created_at).toISOString().split('T')[0]
        }));
        setComplaints(formatted);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "pending").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;
  const inProgress = complaints.filter(c => c.status === "in_progress").length;

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || "Student"}!</h1>
          <p className="text-sm text-muted-foreground">Here's an overview of your complaints</p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard title="Total Complaints" value={total} icon={FileText} variant="default" subtitle="All time" />
          <DashboardCard title="Pending" value={pending} icon={Clock} variant="warning" subtitle="Awaiting response" />
          <DashboardCard title="Resolved" value={resolved} icon={CheckCircle} variant="success" subtitle="Successfully resolved" />
          <DashboardCard title="In Progress" value={inProgress} icon={AlertTriangle} variant="info" subtitle="Being reviewed" />
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Recent Complaints</h2>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading your complaints...</div>
          ) : (
            <ComplaintTable complaints={complaints} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
