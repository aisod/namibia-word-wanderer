import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Zap } from "lucide-react";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon?: 'trophy' | 'star' | 'target' | 'zap';
  earned?: boolean;
  className?: string;
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  target: Target,
  zap: Zap,
};

export function AchievementBadge({
  title,
  description,
  icon = 'star',
  earned = false,
  className
}: AchievementBadgeProps) {
  const Icon = iconMap[icon];

  return (
    <Badge
      variant="secondary"
      className={cn(
        "relative flex items-center gap-3 p-4 transition-all duration-300 cursor-pointer",
        "bg-gradient-to-r from-secondary to-secondary/80",
        "border border-primary/20",
        "hover:border-primary/40 hover:shadow-neon",
        earned
          ? "from-primary/20 to-primary/10 border-primary/50"
          : "opacity-60 hover:opacity-80",
        className
      )}
    >
      <div className={cn(
        "flex-shrink-0 p-2 rounded-full transition-all duration-300",
        earned
          ? "bg-primary text-primary-foreground animate-glow-pulse"
          : "bg-muted text-muted-foreground"
      )}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 text-left">
        <h4 className={cn(
          "font-display font-semibold text-sm",
          earned ? "text-primary" : "text-muted-foreground"
        )}>
          {title}
        </h4>
        <p className="text-xs text-muted-foreground/80">
          {description}
        </p>
      </div>

      {earned && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-bounce-in" />
      )}
    </Badge>
  );
}