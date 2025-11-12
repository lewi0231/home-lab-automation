import Footer from "@/components/footer";
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
      <body
        className="min-h-screen flex flex-col"
        // style={{
        //   paddingRight: "0px important!",
        //   paddingLeft: "0px important!",
        // }}
      >
        <Nav />
        <main className="flex-grow p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
