import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { Search } from "lucide-react";
import { complaintAPI } from "@/services/api";

export default function ComplaintStatus() {
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await complaintAPI.getMine();
        const formatted = res.data.map((c: any) => ({
          id: `CC-${c.id.toString().padStart(3, '0')}`,
          title: c.title,
          status: c.status,
          lastUpdate: new Date(c.updated_at).toISOString().split('T')[0]
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

  const filtered = complaints.filter((c) =>
    c.id.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="page-container max-w-2xl">
        <h1 className="mb-1 text-2xl font-bold">Complaint Status</h1>
        <p className="mb-6 text-sm text-muted-foreground">Track the progress of your complaints</p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by complaint ID or title..." className="form-input pl-9" />
        </div>

        <div className="space-y-4">
          {loading && <p className="py-8 text-center text-muted-foreground">Loading status...</p>}
          {!loading && filtered.map((c) => (
            <div key={c.id} className="animate-fade-in rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-mono text-muted-foreground">{c.id}</p>
                  <p className="mt-0.5 font-medium">{c.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Last updated: {c.lastUpdate}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">No complaints found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
