import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
// import AuthProvider from "../_providers/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orbi Store",
  description: "Loja de produtos Apple em Salvador",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-full flex-col">
          {/* <AuthProvider> */}
          <div className="flex-1">{children}</div>
          {/* </AuthProvider> */}
        </div>
      </body>
    </html>
  );
}
