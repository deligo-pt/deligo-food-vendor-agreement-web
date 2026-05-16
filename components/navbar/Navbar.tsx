import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
    return (
        <nav className="py-6 px-8 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl flex items-center justify-between mx-auto">
                {/* Logo Section */}
                <Link
                    href="/agreement-form"
                    className="flex items-center gap-2 group transition-transform duration-300"
                >
                    {/* Animated Logo Image */}
                    <div className="w-9 h-9 overflow-hidden rounded-full transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                        <Image
                            src="/deligoLogo.png"
                            alt="DeliGo Logo"
                            width={50}
                            height={50}
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    {/* Brand Text */}
                    <span className="font-bold text-xl text-[#DC3173] group-hover:opacity-90 transition-opacity duration-300">
                        Vendor Agreement
                    </span>
                </Link>

                {/* Action Icons */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#DC3173]">
                        <HelpCircle className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </nav>
    );
}