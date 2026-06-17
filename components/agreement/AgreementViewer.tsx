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
    const { t } = useTranslation();
    const router = useRouter();

    // References for both signature canvases
    const agentSigRef = useRef<SignatureCanvas | null>(null);
    const establishmentSigRef = useRef<SignatureCanvas | null>(null);

    // Track empty states individually
    const [isAgentEmpty, setIsAgentEmpty] = useState(true);
    const [isEstablishmentEmpty, setIsEstablishmentEmpty] = useState(true);

    // Track state for the signed document path
    const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(
        agreement?.signedPdfPath || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pdfUrl = signedPdfUrl || agreement?.signedPdfPath || agreement?.draftPdfPath || "";

    // Clear controls for both canvases
    const handleClearAgent = () => {
        agentSigRef.current?.clear();
        setIsAgentEmpty(true);
    };

    const handleClearEstablishment = () => {
        establishmentSigRef.current?.clear();
        setIsEstablishmentEmpty(true);
    };

    const handleAgentEnd = () => {
        setIsAgentEmpty(!!agentSigRef.current?.isEmpty());
    };

    const handleEstablishmentEnd = () => {
        setIsEstablishmentEmpty(!!establishmentSigRef.current?.isEmpty());
    };

    const handleSubmit = async () => {
        const toastId = toast.loading("Submitting your signatures...");
        setIsSubmitting(true);

        if (!agentSigRef.current || agentSigRef.current.isEmpty()) {
            toast.error("Please add the Agent signature first.", { id: toastId });
            return;
        }

        if (!establishmentSigRef.current || establishmentSigRef.current.isEmpty()) {
            toast.error("Please add the Establishment signature first.", { id: toastId });
            return;
        }

        const agentSignature = agentSigRef.current.getTrimmedCanvas().toDataURL("image/png");
        const establishmentSignature = establishmentSigRef.current.getTrimmedCanvas().toDataURL("image/png");


        try {
            // Pass both values into your request handler when ready
            const res = await signAgreementReq(agreement?._id, agentSignature, establishmentSignature);

            if (res?.success) {
                toast.success(res?.message || "Agreement signed successfully!", { id: toastId });
                setSignedPdfUrl(res?.data?.signedPdfPath);
            } else {
                toast.error(res?.error || "Failed to sign the agreement. Please try again.", { id: toastId });
            }
        } catch (error: any) {
            console.error("Sign Agreement Error:", error);
            toast.error(error?.message || "An error occurred while signing. Please try again.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContinue = () => {
        setTimeout(() => {
            router.push("/success");
        }, 2000);
    };

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
                        <li>Provide signatures for both parties</li>
                        <li>Click Submit Agreement below</li>
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
                            {/* Responsive 2-column signature layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Left Side: Agent Signature */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 block">
                                        Agent Signature <span className="text-[#DC3173]">*</span>
                                    </label>
                                    <div className="border rounded-md bg-gray-50 relative">
                                        <SignatureCanvas
                                            ref={agentSigRef}
                                            penColor="black"
                                            canvasProps={{
                                                className: "w-full h-32",
                                            }}
                                            onEnd={handleAgentEnd}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleClearAgent}
                                            className="text-xs text-gray-500 hover:text-red-500"
                                        >
                                            Clear Agent Signature
                                        </Button>
                                    </div>
                                </div>

                                {/* Right Side: Establishment Signature */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 block">
                                        Establishment Signature <span className="text-[#DC3173]">*</span>
                                    </label>
                                    <div className="border rounded-md bg-gray-50 relative">
                                        <SignatureCanvas
                                            ref={establishmentSigRef}
                                            penColor="black"
                                            canvasProps={{
                                                className: "w-full h-32",
                                            }}
                                            onEnd={handleEstablishmentEnd}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleClearEstablishment}
                                            className="text-xs text-gray-500 hover:text-red-500"
                                        >
                                            Clear Establishment Signature
                                        </Button>
                                    </div>
                                </div>

                            </div>

                            {/* Global Actions Layout */}
                            <div className="w-full border-t border-slate-100 mt-4 pt-4 flex flex-col items-center">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isAgentEmpty || isEstablishmentEmpty || isSubmitting}
                                    className="bg-[#DC3173] hover:bg-[#c22b65] text-white px-8 py-5 font-bold"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Submit Agreement
                                </Button>

                                <p className="text-[10px] text-slate-400 text-center max-w-md mx-auto leading-normal mt-4">
                                    By clicking {"Submit Agreement"}, you legally acknowledge and accept all terms
                                    and conditions outlined in this service provision contract for both signing parties.
                                </p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}