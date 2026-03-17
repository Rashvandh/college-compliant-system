import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const [form, setForm] = useState({ name: "", rollNumber: "", department: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Business Administration", "Other"];

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v)) { toast.error("Please fill in all fields"); return; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, rollNumber: form.rollNumber, department: form.department });
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="auth-card max-w-lg animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join CampusComplaint today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="John Doe" className="form-input" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Roll Number</label>
              <input type="text" value={form.rollNumber} onChange={(e) => update("rollNumber", e.target.value)} placeholder="CS2021001" className="form-input" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Department</label>
            <select value={form.department} onChange={(e) => update("department", e.target.value)} className="form-input">
              <option value="">Select Department</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@college.edu" className="form-input" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Password</label>
              <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" className="form-input" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} placeholder="••••••••" className="form-input" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
