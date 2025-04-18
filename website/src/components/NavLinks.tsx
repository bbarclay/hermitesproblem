'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users2, Bug } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NavLinks() {
  const pathname = usePathname();
  
  return (
    <div className="flex flex-col gap-4">
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
  );
}
