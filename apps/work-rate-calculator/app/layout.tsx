import Nav from "@/components/nav";
import React from "react";
import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col max-w-[1200px] m-auto">
        <Nav />
        <main className="flex-grow p-4">{children}</main>
        <footer className="text-center py-8 text-gray-600 text-sm">
          <div className="">
            <p>&copy; {new Date().getFullYear()} flowerhead.dev</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
