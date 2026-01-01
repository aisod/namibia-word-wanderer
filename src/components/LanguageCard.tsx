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
  coverImage?: string;
  onClick: () => void;
  isAvailable?: boolean;
  className?: string;
}

export function LanguageCard({
  name,
  nativeName,
  speakers,
  regions,
  coverImage,
  onClick,
  isAvailable = true,
  className,
}: LanguageCardProps) {
  return (
    <Card
      onClick={isAvailable ? onClick : undefined}
      className={cn(
        "relative overflow-hidden p-6 md:p-8 transition-all duration-200 cursor-pointer",
        "border-2 border-transparent",
        "min-h-[180px] md:min-h-[200px]",
        "touch-card",
        !coverImage && "bg-gradient-to-br from-card to-secondary/30",
        isAvailable && "game-card-hover hover:border-primary/50 active:scale-[0.98]",
        !isAvailable && "opacity-60 cursor-not-allowed",
        className
      )}
      style={coverImage ? {
        backgroundImage: `url(${coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      } : undefined}
    >
      {/* Background overlay for readability */}
      {coverImage && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      )}
      
      {/* Decorative pattern (only if no cover image) */}
      {!coverImage && (
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pattern-tribal" />
      )}
      
      {/* Coming soon badge */}
      {!isAvailable && (
        <Badge variant="secondary" className="absolute top-4 right-4 bg-muted">
          Coming Soon
        </Badge>
      )}

      <div className={cn(
        "relative z-10 space-y-5",
        coverImage && "text-white"
      )}>
        {/* Language name */}
        <div>
          <h3 className={cn(
            "font-display text-2xl md:text-3xl mb-1",
            coverImage ? "text-white drop-shadow-lg" : "text-foreground"
          )}>
            {name}
          </h3>
          <p className={cn(
            "font-medium text-base md:text-lg",
            coverImage ? "text-white/90 drop-shadow-md" : "text-muted-foreground"
          )}>
            {nativeName}
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-3 text-sm md:text-base">
          <div className={cn(
            "flex items-center gap-3",
            coverImage ? "text-white/90" : "text-muted-foreground"
          )}>
            <Users className={cn(
              "w-5 h-5 flex-shrink-0",
              coverImage ? "text-white" : "text-primary"
            )} />
            <span className={coverImage ? "drop-shadow-md" : ""}>{speakers}</span>
          </div>
          <div className={cn(
            "flex items-center gap-3",
            coverImage ? "text-white/90" : "text-muted-foreground"
          )}>
            <MapPin className={cn(
              "w-5 h-5 flex-shrink-0",
              coverImage ? "text-white" : "text-accent"
            )} />
            <span className={coverImage ? "drop-shadow-md" : ""}>
              {regions.slice(0, 2).join(", ")}{regions.length > 2 && "..."}
            </span>
          </div>
        </div>

        {/* Action indicator */}
        {isAvailable && (
          <div className={cn(
            "flex items-center justify-between pt-3",
            coverImage ? "border-t border-white/30" : "border-t border-border/50"
          )}>
            <span className={cn(
              "text-base md:text-lg font-bold",
              coverImage ? "text-white drop-shadow-lg" : "text-primary"
            )}>
              Start Learning
            </span>
            <ChevronRight className={cn(
              "w-6 h-6",
              coverImage ? "text-white drop-shadow-lg" : "text-primary"
            )} />
          </div>
        )}
      </div>
    </Card>
  );
}
