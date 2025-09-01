import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ComponentProps } from "react";

interface GlowingCardProps extends ComponentProps<typeof Card> {
  className?: string;
}

export function GlowingCard({ className, ...props }: GlowingCardProps) {
  return (
    <div className="relative group w-full h-full">
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
