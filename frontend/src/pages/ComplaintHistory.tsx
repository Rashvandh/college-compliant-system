import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ComplaintTable, { Complaint } from "@/components/ComplaintTable";
import { Search, Filter } from "lucide-react";
import { complaintAPI } from "@/services/api";

export default function ComplaintHistory() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await complaintAPI.getMine();
        // Map backend response to frontend Complaint type
        const mappedData: Complaint[] = res.data.map((c: any) => ({
          id: `CC-${c.id.toString().padStart(3, '0')}`,
          title: c.title,
          category: c.category,
          priority: c.priority.toLowerCase(),
          status: c.status.toLowerCase().replace(" ", "_"),
          date: new Date(c.created_at).toISOString().split('T')[0]
        }));
        setComplaints(mappedData);
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filtered = complaints.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <DashboardLayout><div>Loading complaints...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-container">
        <h1 className="mb-1 text-2xl font-bold">My Complaints</h1>
        <p className="mb-6 text-sm text-muted-foreground">View and track all your submitted complaints</p>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaints..."
              className="form-input pl-9"
            />
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

        <ComplaintTable complaints={filtered} />
      </div>
    </DashboardLayout>
  );
}
