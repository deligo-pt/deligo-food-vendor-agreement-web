import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Switched to Inter
import "./globals.css";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

// Configuring Inter with both Latin and Bengali support
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
        </main>
        <Footer />
      </body>
    </html>
  );
}