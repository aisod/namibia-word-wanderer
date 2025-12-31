import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Users, MapPin } from "lucide-react";

interface LanguageCardProps {
  name: string;
  nativeName: string;
  speakers: string;
  regions: string[];
  flag?: string;
  onClick: () => void;
  isAvailable?: boolean;
  className?: string;
}

export function LanguageCard({
  name,
  nativeName,
  speakers,
  regions,
  onClick,
  isAvailable = true,
  className,
}: LanguageCardProps) {
  return (
    <Card
      onClick={isAvailable ? onClick : undefined}
      className={cn(
        "relative overflow-hidden p-6 transition-all duration-300 cursor-pointer",
        "border-2 border-transparent",
        "bg-gradient-to-br from-card to-secondary/30",
        isAvailable && "game-card-hover hover:border-primary/50",
        !isAvailable && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {/* Decorative pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pattern-tribal" />
      
      {/* Coming soon badge */}
      {!isAvailable && (
        <Badge variant="secondary" className="absolute top-4 right-4 bg-muted">
          Coming Soon
        </Badge>
      )}

      <div className="relative z-10 space-y-4">
        {/* Language name */}
        <div>
          <h3 className="font-display text-2xl text-foreground">{name}</h3>
          <p className="text-muted-foreground font-medium">{nativeName}</p>
        </div>

        {/* Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span>{speakers}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-accent" />
            <span>{regions.slice(0, 2).join(", ")}{regions.length > 2 && "..."}</span>
          </div>
        </div>

        {/* Action indicator */}
        {isAvailable && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-semibold text-primary">Start Learning</span>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
}
