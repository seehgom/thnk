"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <Link href="/dashboard" className="text-lg font-bold text-white tracking-tight">
        thnk
      </Link>
      <div className="flex items-center gap-4">
        {pathname !== "/dashboard/new" && (
          <Link
            href="/dashboard/new"
            className="text-sm px-4 py-1.5 rounded-lg text-white font-medium"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            + New diagram
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}
