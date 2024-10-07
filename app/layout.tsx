import type { Metadata } from "next";
import "./globals.css";
import "@/components/";
import MainNav from "@/components/MainNav";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Kwizzle - Spaced Repetition Learning App",
  description: "Created by Alejandro Romero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <nav className="flex flex-col items-center border-b mb-5 px-5 py-3">
            <div className="max-w-6xl w-full">
              <MainNav />
            </div>
          </nav>
          <main className="flex flex-col items-center">
            <div className="max-w-6xl w-full">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
