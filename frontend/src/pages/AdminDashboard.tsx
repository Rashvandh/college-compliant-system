import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardCard from "@/components/DashboardCard";
import { FileText, Clock, CheckCircle, AlertOctagon } from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { analyticsAPI } from "@/services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsAPI.getStats();
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch statistics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const categoryData = {
    labels: stats ? Object.keys(stats.category_distribution) : [],
    datasets: [{
      label: "Complaints",
      data: stats ? Object.values(stats.category_distribution) : [],
      backgroundColor: [
        "hsl(217, 91%, 50%)",
        "hsl(142, 71%, 45%)",
        "hsl(38, 92%, 50%)",
        "hsl(0, 72%, 51%)",
        "hsl(199, 89%, 48%)",
        "hsl(280, 65%, 60%)",
      ],
      borderRadius: 6,
    }],
  };

  if (loading) return <DashboardLayout><div>Loading statistics...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-container">
        <h1 className="mb-1 text-2xl font-bold">Admin Dashboard</h1>
        <p className="mb-6 text-sm text-muted-foreground">Overview of all complaints and system analytics</p>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard title="Total Complaints" value={stats?.total || 0} icon={FileText} variant="default" subtitle="All time" />
          <DashboardCard title="Pending" value={stats?.pending || 0} icon={Clock} variant="warning" subtitle="Need attention" />
          <DashboardCard title="Resolved" value={stats?.resolved || 0} icon={CheckCircle} variant="success" subtitle="Successfully closed" />
          <DashboardCard title="Critical" value={0} icon={AlertOctagon} variant="destructive" subtitle="High priority" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Complaints by Category</h2>
            {categoryData.labels.length > 0 ? (
              <Doughnut data={categoryData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
            ) : (
              <p className="text-muted-foreground">No data available yet</p>
            )}
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Monthly Complaints</h2>
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              Feature coming soon (Live data)
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
