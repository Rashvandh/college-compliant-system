import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { Search, Filter, Eye, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { complaintAPI } from "@/services/api";

interface AdminComplaint {
  id: string;
  originalId: string | number;
  title: string;
  student: string;
  category: string;
  priority: string;
  status: string;
  date: string;
}

const statuses = ["pending", "in_progress", "resolved", "rejected"];
const departments = ["IT Department", "Maintenance", "Administration", "Hostel Management", "Facilities"];

export default function ManageComplaints() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await complaintAPI.getAll();
      const mapped: AdminComplaint[] = res.data.map((c: any) => ({
        id: `CC-${c.id.toString().padStart(3, '0')}`,
        originalId: c.id,
        title: c.title,
        student: `User #${c.student_id}`, // In a real app, you'd fetch student names
        category: c.category,
        priority: c.priority.toLowerCase(),
        status: c.status.toLowerCase().replace(" ", "_"),
        date: new Date(c.created_at).toISOString().split('T')[0]
      }));
      setComplaints(mapped);
    } catch (error) {
      console.error("Failed to fetch complaints", error);
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.student.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const changeStatus = async (id: string, originalId: string | number, newStatus: string) => {
    try {
      // Map frontend status back to backend (e.g., in_progress -> In Progress)
      const backendStatus = newStatus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      await complaintAPI.updateStatus(originalId.toString(), backendStatus);
      
      setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
      setActiveDropdown(null);
      toast.success(`Complaint status updated to ${backendStatus}`);
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    }
  };

  const assignDepartment = (id: string, dept: string) => {
    setActiveDropdown(null);
    toast.success(`Complaint ${id} assigned to ${dept} (UI Only)`);
  };

  if (loading) return <DashboardLayout><div>Loading complaints management...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-container">
        <h1 className="mb-1 text-2xl font-bold">Manage Complaints</h1>
        <p className="mb-6 text-sm text-muted-foreground">Review, assign, and resolve student complaints</p>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title..." className="form-input pl-9" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-input pl-9 sm:w-48">
              <option value="">All Status</option>
              {statuses.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Student</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-3 font-medium">{c.title}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{c.student}</td>
                  <td className="px-4 py-3 hidden sm:table-cell capitalize">{c.category}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/complaint/${c.originalId}`} className="text-primary hover:underline text-xs font-medium inline-flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" /> View
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === c.id ? null : c.id)}
                          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted transition-colors"
                        >
                          Actions <ChevronDown className="h-3 w-3" />
                        </button>
                        {activeDropdown === c.id && (
                          <div className="absolute right-0 top-8 z-10 w-48 rounded-lg border bg-card p-1 shadow-lg">
                            <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">Change Status</p>
                            {statuses.map((s) => (
                              <button key={s} onClick={() => changeStatus(c.id, c.originalId, s)} className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted transition-colors capitalize">
                                {s.replace("_", " ")}
                              </button>
                            ))}
                            <hr className="my-1" />
                            <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">Assign Department</p>
                            {departments.map((d) => (
                              <button key={d} onClick={() => assignDepartment(c.id, d)} className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted transition-colors">
                                {d}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
