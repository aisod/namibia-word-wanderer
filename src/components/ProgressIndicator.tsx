import { cn } from "@/lib/utils";
interface ProgressIndicatorProps { current: number; total: number; className?: string; showNumbers?: boolean; size?: "sm" | "md" | "lg"; }
export function ProgressIndicator({ current, total, className, showNumbers = true, size = "md" }: ProgressIndicatorProps) {
  const safeTotal = Math.max(0, total);
  const value = Math.max(0, Math.min(current, safeTotal));
  const percentage = safeTotal ? value / safeTotal * 100 : 0;
  return <div className={cn("flex items-center gap-2", className)}>
    <div role="progressbar" aria-label="Progress" aria-valuenow={value} aria-valuemin={0} aria-valuemax={safeTotal || 1}
      className={cn("w-24 rounded-full bg-secondary overflow-hidden", size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2")}>
      <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
    </div>
    {showNumbers && <span className="text-sm font-medium text-muted-foreground">{value}/{safeTotal}</span>}
  </div>;
}
