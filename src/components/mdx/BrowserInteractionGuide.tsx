"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Monitor, MousePointer, Menu, Search, RefreshCw } from "lucide-react";

interface Step {
  text: string;
  icon?: "pointer" | "menu" | "search" | "refresh";
  position?: "top" | "right" | "bottom" | "left";
}

interface BrowserInteractionGuideProps {
  steps: Step[];
  title?: string;
  className?: string;
}

export function BrowserInteractionGuide({
  steps,
  title = "Guide d'interaction",
  className,
}: BrowserInteractionGuideProps) {
  const icons = {
    pointer: <MousePointer className="h-4 w-4" />,
    menu: <Menu className="h-4 w-4" />,
    search: <Search className="h-4 w-4" />,
    refresh: <RefreshCw className="h-4 w-4" />,
  };

  return (
    <div className={cn("my-6 border rounded-lg overflow-hidden", className)}>
      <div className="bg-muted p-3 border-b flex items-center gap-2">
        <Monitor className="h-5 w-5" />
        <h3 className="font-medium text-sm">{title}</h3>
      </div>

      <div className="p-4 bg-background">
        <ol className="list-decimal pl-5 space-y-2">
          {steps.map((step, index) => (
            <li key={index} className="text-sm">
              <div className="flex items-center gap-2">
                {step.icon && icons[step.icon]}
                <span>{step.text}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-zinc-800 p-3 border-t border-zinc-700">
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {["bg-red-500", "bg-yellow-500", "bg-green-500"].map((color, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${color}`} />
            ))}
          </div>
          <div className="h-6 w-48 bg-zinc-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
