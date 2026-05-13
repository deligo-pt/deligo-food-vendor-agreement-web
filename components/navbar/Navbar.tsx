import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export function Navbar() {
    return (
        <nav className="py-6 px-8 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl flex items-center justify-between mx-auto">
                {/* Brand Title from image_5669ba.png */}
                <div className="flex items-center gap-2">
                    <h1 className="text-[#DC3173] font-bold text-xl tracking-tight">
                        Vendor Agreement
                    </h1>
                </div>

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