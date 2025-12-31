import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  difficulty: "Easy" | "Medium" | "Hard";
  onClick: () => void;
  color: "orange" | "pink" | "green" | "blue";
  className?: string;
}

const colorClasses = {
  orange: "from-sunset-orange/20 to-sunset-gold/10 hover:from-sunset-orange/30 hover:to-sunset-gold/20",
  pink: "from-sunset-pink/20 to-accent/10 hover:from-sunset-pink/30 hover:to-accent/20",
  green: "from-success/20 to-savanna-green/10 hover:from-success/30 hover:to-savanna-green/20",
  blue: "from-sky-blue/20 to-primary/10 hover:from-sky-blue/30 hover:to-primary/20",
};

const iconColorClasses = {
  orange: "bg-sunset-orange text-primary-foreground",
  pink: "bg-sunset-pink text-primary-foreground",
  green: "bg-success text-success-foreground",
  blue: "bg-sky-blue text-primary-foreground",
};

const difficultyColors = {
  Easy: "bg-success/20 text-success",
  Medium: "bg-warning/20 text-warning-foreground",
  Hard: "bg-destructive/20 text-destructive",
};

export function GameCard({
  title,
  description,
  icon: Icon,
  difficulty,
  onClick,
  color,
  className,
}: GameCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden p-6 cursor-pointer transition-all duration-300",
        "bg-gradient-to-br",
        colorClasses[color],
        "border-2 border-transparent hover:border-primary/30",
        "game-card-hover",
        className
      )}
    >
      <div className="space-y-4">
        {/* Icon and Badge */}
        <div className="flex items-start justify-between">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-soft",
            iconColorClasses[color]
          )}>
            <Icon className="w-7 h-7" />
          </div>
          <Badge className={cn("font-medium", difficultyColors[difficulty])}>
            {difficulty}
          </Badge>
        </div>

        {/* Content */}
        <div>
          <h3 className="font-display text-xl text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Play button hint */}
        <div className="pt-2">
          <span className="text-sm font-bold text-primary">
            Play Now →
          </span>
        </div>
      </div>
    </Card>
  );
}
