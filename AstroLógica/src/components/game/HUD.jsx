import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gem, Terminal, RotateCcw } from "lucide-react";

export default function HUD({
  level,
  collectedCrystals,
  commandCount,
  attempts,
  onBack,
}) {
  const totalCrystals = level.crystals.length;
  const collected = collectedCrystals.length;

  return (
    <div className="flex items-center justify-between flex-wrap gap-2 px-1">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg bg-muted/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-sm sm:text-base font-orbitron font-bold text-foreground tracking-wide">
            {level.title}
          </h1>
          <p className="text-[10px] font-space text-muted-foreground">
            {level.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Badge
          variant="outline"
          className="gap-1 px-2 py-1 border-primary/30 text-primary font-space text-[10px]"
        >
          <Gem className="w-3 h-3" />
          {collected}/{totalCrystals}
        </Badge>
        <Badge
          variant="outline"
          className="gap-1 px-2 py-1 border-accent/30 text-accent font-space text-[10px]"
        >
          <Terminal className="w-3 h-3" />
          {commandCount} cmd
        </Badge>
        <Badge
          variant="outline"
          className="gap-1 px-2 py-1 border-secondary/30 text-secondary font-space text-[10px]"
        >
          <RotateCcw className="w-3 h-3" />
          #{attempts}
        </Badge>
      </div>
    </div>
  );
}