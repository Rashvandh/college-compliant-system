interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { className: string; label: string }> = {
  pending: { className: "bg-warning/15 text-warning border-warning/30", label: "Pending" },
  in_progress: { className: "bg-info/15 text-info border-info/30", label: "In Progress" },
  resolved: { className: "bg-success/15 text-success border-success/30", label: "Resolved" },
  rejected: { className: "bg-destructive/15 text-destructive border-destructive/30", label: "Rejected" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
