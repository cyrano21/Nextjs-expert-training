"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LandingButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
  glow?: boolean;
}

export function LandingButton({
  href,
  children,
  variant = "default",
  size = "lg",
  className = "",
  glow = false,
}: LandingButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      asChild
      className={`${className} ${glow ? "shadow-glow" : ""}`}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
