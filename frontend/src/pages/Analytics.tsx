import DashboardLayout from "@/components/DashboardLayout";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const categoryData = {
  labels: ["Infrastructure", "Maintenance", "Faculty", "Hostel", "Canteen", "Transport", "Library", "Examination"],
  datasets: [{
    data: [28, 19, 12, 15, 8, 6, 10, 14],
    backgroundColor: [
      "hsl(217, 91%, 50%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)",
      "hsl(199, 89%, 48%)", "hsl(280, 65%, 60%)", "hsl(160, 60%, 45%)", "hsl(25, 95%, 53%)",
    ],
  }],
};

const monthlyData = {
  labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  datasets: [{
    label: "Complaints",
    data: [10, 18, 14, 22, 18, 25, 30, 20],
    borderColor: "hsl(217, 91%, 50%)",
    backgroundColor: "hsla(217, 91%, 50%, 0.1)",
    fill: true,
    tension: 0.4,
  }],
};

const resolutionData = {
  labels: ["< 1 Day", "1-3 Days", "3-7 Days", "1-2 Weeks", "> 2 Weeks"],
  datasets: [{
    label: "Complaints",
    data: [15, 28, 22, 18, 5],
    backgroundColor: "hsl(142, 71%, 45%)",
    borderRadius: 6,
  }],
};

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="page-container">
        <h1 className="mb-1 text-2xl font-bold">Analytics</h1>
        <p className="mb-6 text-sm text-muted-foreground">Detailed insights into complaint patterns and resolution</p>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Complaints by Category</h2>
            <Doughnut data={categoryData} options={{ responsive: true, plugins: { legend: { position: "right" } } }} />
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Monthly Trend</h2>
            <Line data={monthlyData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold">Resolution Time Distribution</h2>
            <Bar data={resolutionData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
