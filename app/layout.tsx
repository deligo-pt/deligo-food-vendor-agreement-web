import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import "react-international-phone/style.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
      className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}
    >
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}