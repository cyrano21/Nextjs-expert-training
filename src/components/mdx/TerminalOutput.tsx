"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TerminalOutputProps {
  children: React.ReactNode;
  className?: string;
}

export function TerminalOutput({ children, className }: TerminalOutputProps) {
  return (
    <div
      className={cn(
        "my-4 rounded-lg border font-mono text-sm p-4 overflow-x-auto",
        "bg-black text-gray-200 border-gray-800",
        "dark:bg-zinc-900 dark:border-zinc-700",
        className
      )}
    >
      <pre className="whitespace-pre-wrap break-all">
        {typeof children === "string"
          ? children
          : React.Children.map(children, (child) =>
              typeof child === "string"
                ? child.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <br />}
                      {line.startsWith("✓") ? (
                        <span className="text-green-500">{line}</span>
                      ) : (
                        line
                      )}
                    </React.Fragment>
                  ))
                : child
            )}
      </pre>
    </div>
  );
}
