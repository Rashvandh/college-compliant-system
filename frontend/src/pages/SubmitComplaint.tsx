import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Upload, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { complaintAPI } from "@/services/api";

const categories = ["Infrastructure", "Maintenance", "Faculty", "Examination", "Hostel", "Library", "Canteen", "Transport", "Other"];

export default function SubmitComplaint() {
  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error("Title and description are required"); return; }

    setLoading(true);
    try {
      // Backend expects JSON for now as per schemas.py
      await complaintAPI.submit(form as any); 
      setSubmitted(true);
      toast.success("Complaint submitted successfully!");
    } catch (error) {
      console.error("Submission failed", error);
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="page-container flex min-h-[60vh] items-center justify-center">
          <div className="animate-fade-in text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-bold">Complaint Submitted!</h2>
            <p className="mt-2 text-muted-foreground">Your complaint has been received and will be reviewed shortly.</p>
            <button onClick={() => { setSubmitted(false); setForm({ title: "", description: "", category: "" }); setFile(null); }} className="btn-primary mt-6">
              Submit Another
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-container max-w-2xl">
        <h1 className="mb-1 text-2xl font-bold">Submit a Complaint</h1>
        <p className="mb-6 text-sm text-muted-foreground">Describe your issue and we'll route it to the right department</p>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-card p-6 shadow-sm">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Complaint Title *</label>
            <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Brief title of your complaint" className="form-input" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={6}
              className="form-input resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Category (Optional)</label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)} className="form-input">
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Attachment (Optional)</label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed p-4 hover:border-primary/50 hover:bg-muted/30 transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{file ? file.name : "Click to upload a file"}</span>
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2">
            <Send className="h-4 w-4" />
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
