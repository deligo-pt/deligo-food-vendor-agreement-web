"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface AgreementViewerProps {
    pdfUrl: string; // The URL provided by your backend
}

export default function AgreementViewer({ pdfUrl }: AgreementViewerProps) {
    console.log("PDF URL:", pdfUrl); // Debug log to check the URL being passed
    const handleSubmit = async () => {
        // Call your Server Action here to finalize the Deligo agreement
        console.log("Agreement Submitted");
    };

    return (
        <Card className="overflow-hidden border-none shadow-inner bg-slate-200 min-h-175 flex flex-col">
            <div className="grow relative">
                {/* Displaying PDF from Backend */}
                <iframe
                    src={`${pdfUrl}`}
                    className="w-full h-full min-h-175 border-none"
                    title="Agreement PDF"
                />
            </div>

            {/* Bottom Action Footer from image_485273.png */}
            <div className="bg-slate-50 p-8 border-t border-slate-200 flex flex-col items-center gap-4">
                <Button
                    onClick={handleSubmit}
                    className="bg-[#DC3173] hover:bg-[#c22b65] text-white px-12 py-7 text-md font-bold rounded-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                >
                    <CheckCircle2 className="w-5 h-5" />
                    Submit Agreement
                </Button>
                <p className="text-[10px] text-slate-400 text-center max-w-md leading-normal">
                    By clicking {"Submit Agreement"}, you legally acknowledge and accept all terms
                    and conditions outlined in this service provision contract.
                </p>
            </div>
        </Card>
    );
}