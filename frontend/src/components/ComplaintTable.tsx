import { Link } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import { Eye } from "lucide-react";

export interface Complaint {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  date: string;
  description?: string;
  response?: string;
}

interface ComplaintTableProps {
  complaints: Complaint[];
  showActions?: boolean;
  basePath?: string;
}

export default function ComplaintTable({ complaints, showActions = true, basePath = "/complaint" }: ComplaintTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">ID</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Title</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Category</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Priority</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell">Date</th>
            {showActions && <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Action</th>}
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No complaints found.</td>
            </tr>
          ) : (
            complaints.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                <td className="px-4 py-3 font-medium">{c.title}</td>
                <td className="px-4 py-3 hidden sm:table-cell">{c.category}</td>
                <td className="px-4 py-3 hidden md:table-cell capitalize">{c.priority}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{c.date}</td>
                {showActions && (
                  <td className="px-4 py-3">
                    <Link to={`${basePath}/${c.id}`} className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium">
                      <Eye className="h-3.5 w-3.5" /> View
                    </Link>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
