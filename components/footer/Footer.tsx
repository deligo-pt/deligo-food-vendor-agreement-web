import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
    return (
        <footer className="w-full bg-white border-t border-gray-200 py-6 px-8 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Copyright Section */}
                <div className="flex items-center text-[11px] text-gray-500 font-medium">
                    <span className="text-gray-900 font-bold mr-2">Vendor Agreement Portal</span>
                    <Separator orientation="vertical" className="h-3 mx-2 hidden md:block" />
                    <span>© 2026. All rights reserved.</span>
                </div>

                {/* Legal Links */}
                <div className="flex items-center gap-6">
                    <Button variant="link" className="text-gray-500 text-[11px] h-auto p-0 hover:text-[#DC3173]">
                        Privacy Policy
                    </Button>
                    <Button variant="link" className="text-gray-500 text-[11px] h-auto p-0 hover:text-[#DC3173]">
                        Terms of Service
                    </Button>
                    <Button variant="link" className="text-gray-500 text-[11px] h-auto p-0 hover:text-[#DC3173]">
                        Contact Support
                    </Button>
                </div>

            </div>
        </footer>
    );
}