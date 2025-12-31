import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-7xl",
};

export function Logo({ size = "md", className }: LogoProps) {
  return (
    <div className={cn("font-display flex items-center gap-2", className)}>
      <span className={cn("text-gradient-sunset", sizeClasses[size])}>
        NAMQULA
      </span>
    </div>
  );
}
