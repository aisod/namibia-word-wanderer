import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  className?: string;
  showText?: boolean;
  clickable?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-auto",
  md: "h-12 w-auto",
  lg: "h-16 w-auto",
  xl: "h-24 w-auto",
  "2xl": "h-32 w-auto md:h-40",
  "3xl": "h-40 w-auto md:h-48",
  "4xl": "h-48 w-auto md:h-56 lg:h-64",
};

const textSizeClasses = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

export function Logo({ size = "md", className, showText = false, clickable = true }: LogoProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (clickable) {
      navigate("/");
    }
  };

  return (
    <div 
      className={cn("flex items-center gap-3", clickable && "cursor-pointer transition-opacity hover:opacity-80", className)}
      onClick={handleClick}
    >
      <img 
        src="/logo.png" 
        alt="NAMQULA Logo" 
        className={cn(sizeClasses[size], "object-contain")}
      />
      {showText && (
        <span className={cn("font-display text-gradient-sunset", textSizeClasses[size])}>
          NAMQULA
        </span>
      )}
    </div>
  );
}
