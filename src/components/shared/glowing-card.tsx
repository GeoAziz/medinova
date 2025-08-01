import { cn } from "@/lib/utils";
import { Card, type CardProps } from "@/components/ui/card";

export function GlowingCard({ className, ...props }: CardProps) {
  return (
    <div className="relative group">
      <div className={cn(
          "absolute -inset-px bg-gradient-to-r from-primary to-accent rounded-lg blur-sm opacity-20",
          "group-hover:opacity-50 group-hover:blur transition duration-300 animate-tilt"
        )}
      />
      <Card
        className={cn("relative bg-card/95", className)}
        {...props}
      />
    </div>
  );
}
