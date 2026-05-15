"use client";

import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    FileText,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";


export default function AgreementSuccess() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden w-full">
            {/* Decorative Background Elements from image_92a385.png */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#DC3173]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#DC3173]/5 rounded-full blur-3xl" />

            <div className="w-full text-center z-10">
                {/* Success Icon Stack */}
                <div className="relative inline-block mb-8">
                    <div className="bg-[#DC3173] p-8 rounded-full shadow-[0_0_40px_rgba(220,49,115,0.3)] animate-in fade-in zoom-in duration-500">
                        <ShieldCheck className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-lg shadow-md border border-slate-100">
                        <FileText className="h-6 w-6 text-[#DC3173]" />
                    </div>
                </div>

                {/* Messaging */}
                <h1 className="text-3xl font-bold text-slate-800 mb-4">
                    Agreement Successfully Submitted
                </h1>
                <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-10">
                    Thank you for completing the vendor onboarding process.
                    Your agreement has been recorded and a copy has been sent to your email.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/agreement-form" className="w-full sm:w-auto">
                        <Button
                            className="w-full px-8 py-6 bg-[#DC3173] hover:bg-[#c22b65] text-white font-bold transition-all shadow-lg rounded-xl"
                        >
                            <LayoutDashboard className="mr-2 h-5 w-5" />
                            Agreement Another Vendor
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}