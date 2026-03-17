import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { ArrowLeft, Calendar, Tag, AlertTriangle, MessageSquare } from "lucide-react";
import { complaintAPI } from "@/services/api";

export default function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const backendId = id.replace('CC-', '').replace(/^0+/, '');
        const res = await complaintAPI.getById(backendId);
        const c = res.data;
        setComplaint({
          id: id,
          title: c.title,
          description: c.description,
          category: c.category,
          priority: c.priority,
          status: c.status,
          date: new Date(c.created_at).toISOString().split('T')[0],
          response: c.response || null,
        });
      } catch (error) {
        console.error("Error fetching complaint details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <DashboardLayout><div className="p-8 text-center text-muted-foreground">Loading details...</div></DashboardLayout>;
  if (!complaint) return <DashboardLayout><div className="p-8 text-center text-muted-foreground">Complaint not found</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-container max-w-3xl">
        <Link to="/my-complaints" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to complaints
        </Link>

        <div className="animate-fade-in space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-muted-foreground">{complaint.id}</p>
              <h1 className="mt-1 text-xl font-bold">{complaint.title}</h1>
            </div>
            <StatusBadge status={complaint.status} />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{complaint.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Priority:</span>
              <span className="font-medium capitalize">{complaint.priority}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{complaint.date}</span>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold">Description</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{complaint.description}</p>
          </div>

          {complaint.response && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold">Admin Response</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{complaint.response}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
