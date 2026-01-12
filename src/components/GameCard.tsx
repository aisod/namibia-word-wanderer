import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, ChevronRight } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconImage?: string; // Path to icon image
  difficulty: "Easy" | "Medium" | "Hard";
  onClick: () => void;
  color: "orange" | "pink" | "green" | "blue";
  className?: string;
}

const colorClasses = {
  orange: "from-neon-orange/10 to-neon-yellow/10 hover:from-neon-orange/20 hover:to-neon-yellow/20",
  pink: "from-neon-pink/10 to-accent/10 hover:from-neon-pink/20 hover:to-accent/20",
  green: "from-neon-green/10 to-success/10 hover:from-neon-green/20 hover:to-success/20",
  blue: "from-neon-cyan/10 to-primary/10 hover:from-neon-cyan/20 hover:to-primary/20",
};

const iconColorClasses = {
  orange: "bg-gradient-to-br from-neon-orange to-neon-yellow text-primary-foreground",
  pink: "bg-gradient-to-br from-neon-pink to-accent text-primary-foreground",
  green: "bg-gradient-to-br from-neon-green to-success text-primary-foreground",
  blue: "bg-gradient-to-br from-neon-cyan to-primary text-primary-foreground",
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
  iconImage,
  difficulty,
  onClick,
  color,
  className,
}: GameCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden p-6 md:p-8 cursor-pointer",
        "bg-gradient-to-br",
        colorClasses[color],
        "border-2 border-transparent hover:border-primary/50 active:border-primary/80",
        "app-card min-h-[200px] md:min-h-[220px]",
        "animate-bounce-in",
        className
      )}
    >
      <div className="space-y-5 h-full flex flex-col">
        {/* Icon and Badge */}
        <div className="flex items-start justify-between">
          <div className={cn(
            "w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center shadow-soft overflow-hidden",
            iconColorClasses[color]
          )}>
            {iconImage ? (
              <img 
                src={iconImage} 
                alt={title}
                className="w-full h-full object-contain p-1"
              />
            ) : Icon ? (
              <Icon className="w-8 h-8 md:w-10 md:h-10" />
            ) : null}
          </div>
          <Badge className={cn("font-semibold text-sm px-3 py-1", difficultyColors[difficulty])}>
            {difficulty}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">{title}</h3>
          <p className="text-muted-foreground text-base md:text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Play button hint */}
        <div className="pt-3 border-t border-border/30">
          <span className="text-base md:text-lg font-bold text-primary flex items-center gap-2">
            Play Now
            <ChevronRight className="w-5 h-5" />
          </span>
        </div>
      </div>
    </Card>
  );
}
