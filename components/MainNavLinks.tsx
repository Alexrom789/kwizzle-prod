"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MainNavLinks = ({ role }: { role?: string }) => {
  const links = [
    { label: "Dashboard", href: "/", adminOnly: false },
    { label: "Kanji", href: "/kanji", adminOnly: false },
    { label: "Users", href: "/users", adminOnly: true },
  ];

  const currentPath = usePathname();
  return (
    <div className="flex items-center gap-4">
      <Link href="/" className="mr-4">
        KWIZZLE
      </Link>
      {links
        .filter((link) => !link.adminOnly || role === "ADMIN")
        .map((link) => (
          <Link
            href={link.href}
            className={`navbar-link ${
              currentPath == link.href && "cursor-default text-primary"
            }`}
            key={link.label}
          >
            {link.label}
          </Link>
        ))}
    </div>
  );
};

export default MainNavLinks;
