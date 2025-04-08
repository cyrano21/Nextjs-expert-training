"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

interface MainNavProps {
  items: {
    href: string;
    title: string;
  }[];
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="inline-block font-bold">Next.js Expert Academy</span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
