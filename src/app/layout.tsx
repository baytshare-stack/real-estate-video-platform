import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real Estate TV",
  description: "The premier video-first platform for real estate properties.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0f0f0f] text-[#f1f1f1]`}>
        <Providers>
          <Header />
          <div className="flex pt-16">
            <Sidebar />
            <main className="flex-1 min-h-[calc(100vh-64px)] xl:ml-64 bg-[#0f0f0f]">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
