import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Deligo | Vendor Agreement Portal",
  description: "Secure vendor partnership and agreement management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="grow flex flex-col items-center justify-center py-12 px-4">
          {children}
          <Toaster richColors position="top-center" />
        </main>
        <Footer />
      </body>
    </html>
  );
}