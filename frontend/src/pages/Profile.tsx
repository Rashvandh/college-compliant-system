import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Hash, Building, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <DashboardLayout>
      <div className="page-container max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">My Profile</h1>

        <div className="animate-fade-in rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium"><User className="h-4 w-4" /> Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium"><Mail className="h-4 w-4" /> Email</label>
              <input type="email" value={user?.email || ""} disabled className="form-input opacity-60" />
            </div>
            {user?.rollNumber && (
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium"><Hash className="h-4 w-4" /> Roll Number</label>
                <input type="text" value={user.rollNumber} disabled className="form-input opacity-60" />
              </div>
            )}
            {user?.department && (
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium"><Building className="h-4 w-4" /> Department</label>
                <input type="text" value={user.department} disabled className="form-input opacity-60" />
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
