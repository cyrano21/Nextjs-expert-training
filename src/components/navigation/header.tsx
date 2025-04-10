"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNav } from "@/components/navigation/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

export function Header() {
  const pathname = usePathname();

  // Navigation items avec les liens corrects
  const navigationItems = [
    { name: "Tableau de bord", href: "/student/dashboard" },
    { name: "Cours", href: "/student/courses" },
    { name: "Apprentissage", href: "/student/learn" },
    { name: "Roadmap", href: "/student/roadmap" },
  ];

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between">
        <div className="hidden md:block">
          <Logo />
        </div>

        <nav className="hidden gap-6 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80",
                pathname?.startsWith(item.href)
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

// Assurez-vous que tous les liens utilisent moduleId au lieu de moduleId
