"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import kwizzlelogo from "@/public/kwizzlelogo.svg";
import kwizzlelogodark from "@/public/kwizzlelogodark.svg";

const MainNavLinks = ({ role }: { role?: string }) => {
  const links = [
    { label: "Dashboard", href: "/", adminOnly: false },
    { label: "Kanji", href: "/kanji", adminOnly: false },
    { label: "Users", href: "/users", adminOnly: true },
  ];

  const currentPath = usePathname();
  // Use next-themes to detect the current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="flex items-center gap-4">
      <Link href="/" className="mr-4">
        <Image
          src={currentTheme === "light" ? kwizzlelogodark : kwizzlelogo}
          alt="KwizzleLogo"
          width={100}
          height={100}
          className="transform translate-y-[-8px]"
        />
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
