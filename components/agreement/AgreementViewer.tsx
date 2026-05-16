/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SignatureCanvas from "react-signature-canvas";
import { signAgreementReq } from "@/services/agreement.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Calendar, FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Progress } from "../ui/progress";
import { useTranslation } from "@/hooks/use-translation";

interface AgreementViewerProps {
    agreement: any;
}

export default function AgreementViewer({ agreement }: AgreementViewerProps) {
    const {t} = useTranslation();
    const router = useRouter();
    const sigRef = useRef<SignatureCanvas | null>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(
        agreement?.signedPdfPath || null
    );

    const pdfUrl = signedPdfUrl || agreement?.signedPdfPath || agreement?.draftPdfPath || "";

    const handleClear = () => {
        sigRef.current?.clear();
        setIsEmpty(true);
    };

    const handleEnd = () => {
        if (sigRef.current?.isEmpty()) {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }
    };

    const handleSubmit = async () => {
        const toastId = toast.loading("Submitting your signature...");

        if (!sigRef.current || sigRef.current.isEmpty()) {
            toast.error("Please add your signature first.", { id: toastId });
            return;
        }

        const signatureImage = sigRef.current
            .getTrimmedCanvas()
            .toDataURL("image/png");

        try {
            const res = await signAgreementReq(agreement?._id, signatureImage);

            if (res?.success) {
                toast.success(res?.message || "Agreement signed successfully!", { id: toastId });
                setSignedPdfUrl(res?.data?.signedPdfPath);
            } else {
                toast.error(res?.error || "Failed to sign the agreement. Please try again.", { id: toastId });
            };
        } catch (error: any) {
            console.error("Sign Agreement Error:", error);
            toast.error(error?.message || "An error occurred while signing the agreement. Please try again.", { id: toastId });
        };
    };

    const handleContinue = () => {
        setTimeout(() => {
            router.push("/success");
        }, 2000);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto p-4">
            {/* Left Sidebar: Overview */}
            <div className="lg:col-span-3 space-y-6">
                <Card className="border-none shadow-sm bg-white p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Agreement Overview</h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                        Please review the commercial partnership agreement carefully before final submission.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                            <FileText className="w-4 h-4 text-[#DC3173]" />
                            v2.4 Final Draft
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                            <Calendar className="w-4 h-4 text-[#DC3173]" />
                            Due: May 15, 2026
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                            <ShieldCheck className="w-4 h-4 text-[#DC3173]" />
                            Legally Verified
                        </div>
                    </div>
                </Card>

                {/* Final Step Instructions */}
                <div className="bg-[#DC3173] rounded-xl p-6 text-white shadow-md">
                    <h4 className="font-bold text-sm mb-3">Final Step</h4>
                    <ul className="text-[11px] space-y-2 opacity-90 list-decimal pl-4">
                        <li>Review all contract terms</li>
                        <li>Click Submit Agreement below</li>
                        <li>A copy will be sent to your email</li>
                    </ul>
                </div>
            </div>

            {/* Right Content: PDF Viewer */}
            <div className="lg:col-span-9 space-y-4">
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="text-[#DC3173] text-sm font-bold">
                            {t("step")} 3 {t("of")} 3: <span className="font-medium">{t("final_round")}</span>
                        </div>
                        <div className="text-gray-500 text-xs font-medium">99% Complete</div>
                    </div>
                    <Progress value={99} className="h-2 bg-gray-100" />
                </div>

                {/* PDF Display Area */}
                <Card className="overflow-hidden border-none shadow-inner bg-slate-200 min-h-175 flex flex-col">

                    {/* Displaying PDF from Backend */}
                    <div className="grow relative">
                        <iframe
                            src={`${pdfUrl}`}
                            className="w-full h-full min-h-175 border-none"
                            title="Agreement PDF"
                        />
                    </div>

                    {/* Signature Area */}
                    {agreement?.signedPdfPath ? (
                        <div className="bg-slate-100 flex flex-col items-center gap-4 p-4">
                            <Button
                                onClick={handleContinue}
                                className="bg-[#DC3173] hover:bg-[#c22b65] text-white px-12 py-7 text-md font-bold rounded-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                Completed - Continue
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-white p-6 border-t border-slate-200">
                            <p className="text-sm font-semibold mb-2">
                                Please sign below:
                            </p>

                            <div className="border rounded-md bg-gray-50">
                                <SignatureCanvas
                                    ref={sigRef}
                                    penColor="black"
                                    canvasProps={{
                                        className: "w-full h-40",
                                    }}
                                    onEnd={handleEnd}
                                />
                            </div>

                            <div className="w-full">
                                <div className="flex gap-3 mt-4">
                                    <Button variant="outline" onClick={handleClear}>
                                        Clear
                                    </Button>

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isEmpty}
                                        className="bg-[#DC3173] hover:bg-[#c22b65] text-white"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Submit Agreement
                                    </Button>
                                </div>
                                <p className="text-[10px] text-slate-400 text-center max-w-md mx-auto leading-normal mt-5">
                                    By clicking {"Submit Agreement"}, you legally acknowledge and accept all terms
                                    and conditions outlined in this service provision contract.
                                </p>
                            </div>
                        </div>
                    )}

                </Card>
            </div>
        </div>
    );
}