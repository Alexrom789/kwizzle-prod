"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MainNavLinks = () => {
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Kanji", href: "/kanji" },
    { label: "Users", href: "/users" },
  ];

  const currentPath = usePathname();
  return (
    <div className="flex items-center gap-4">
      <Link href="/" className="mr-4">
        KWIZZLE
      </Link>
      {links.map((link) => (
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
