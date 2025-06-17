import { Mail } from "lucide-react";
import Image from "next/image";
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
        <nav className="flex items-center justify-between px-10 py-4  border-b-2 border-gray-50">
          <div className="flex items-center space-x-2">
            <Image
              src="/flowerhead.png"
              alt="Work Rate Calculator Logo"
              width={80}
              height={80}
            />
            <h1 className="text-xl font-semibold">flowerHead.dev</h1>
          </div>
          <div>
            <a
              href="mailto:flowerhead.dev@gmail.com?subject=I%20have%20a%20project%20I'd%20like%20help%20with"
              className=" hover:text-gray-400"
            >
              <Mail />
            </a>
          </div>
        </nav>
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
