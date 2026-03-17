import { Loader2 } from "lucide-react";

export default function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin-slow text-primary" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
