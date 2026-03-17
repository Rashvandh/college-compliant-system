import DashboardLayout from "@/components/DashboardLayout";
import ComplaintTable, { Complaint } from "@/components/ComplaintTable";
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { complaintAPI } from "@/services/api";

export default function AdminAllComplaints() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await complaintAPI.getAll();
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

  const filtered = complaints.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout>
      <div className="page-container">
        <h1 className="mb-1 text-2xl font-bold">All Complaints</h1>
        <p className="mb-6 text-sm text-muted-foreground">Browse all submitted complaints</p>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search complaints..." className="form-input pl-9" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-input pl-9 sm:w-48">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading complaints...</div>
        ) : (
          <ComplaintTable complaints={filtered} />
        )}
      </div>
    </DashboardLayout>
  );
}
