import { cn } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";

interface ProgressIndicatorProps {
  current: number;
  total: number;
  className?: string;
  showNumbers?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressIndicator({
  current,
  total,
  className,
  showNumbers = true,
  size = 'md'
}: ProgressIndicatorProps) {
  const percentage = (current / total) * 100;

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={cn(
              "rounded-full border-2 transition-all duration-300",
              sizeClasses[size],
              i < current
                ? "bg-primary border-primary animate-glow-pulse"
                : "border-muted-foreground/30 bg-transparent"
            )}
          >
            {i < current && (
              <CheckCircle className={cn("w-full h-full text-primary-foreground", sizeClasses[size])} />
            )}
          </div>
        ))}
      </div>
      {showNumbers && (
        <span className="text-sm font-medium text-muted-foreground">
          {current}/{total}
        </span>
      )}
    </div>
  );
}