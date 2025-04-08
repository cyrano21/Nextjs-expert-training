import Link from "next/link";
import { MainNav } from "./main-nav";
import { Button } from "../ui/button";

export function Header() {
  const navItems = [
    {
      title: "Dashboard",
      href: "/student/dashboard",
    },
    {
      title: "Roadmap",
      href: "/student/roadmap",
    },
    {
      title: "Learn",
      href: "/student/learn",
    },
    {
      title: "Projects",
      href: "/student/projects",
    },
    {
      title: "Lab",
      href: "/student/lab",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={navItems} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
