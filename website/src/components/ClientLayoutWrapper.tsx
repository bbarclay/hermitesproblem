'use client'; // This component handles client-side logic

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Users2, Bug } from "lucide-react";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export default function ClientLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // usePathname hook is used here

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {/* ThemeToggle and Navigation Links require client-side interactivity */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Consider moving navigation to a more structured layout position */}
      <div className="absolute top-4 left-4 flex flex-col gap-4"> {/* Example positioning */}
        <Link
          href="/about"
          className={cn("flex items-center gap-2 text-sm font-medium hover:text-foreground/80 transition-colors",
            pathname === "/about" ? "text-foreground" : "text-foreground/60"
          )}
        >
          <Users2 className="h-4 w-4" />
          About
        </Link>
        <Link
          href="/debug"
          className={cn("flex items-center gap-2 text-sm font-medium hover:text-foreground/80 transition-colors",
            pathname === "/debug" || pathname.startsWith("/debug/") ? "text-foreground" : "text-foreground/60"
          )}
        >
          <Bug className="h-4 w-4" />
          Debug
        </Link>
      </div>
      {/* Render the actual page content */}
      {children}
    </ThemeProvider>
  );
}