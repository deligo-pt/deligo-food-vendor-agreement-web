/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { AgreementSchema, AgreementSchemaInput } from "@/lib/schema/agreement.schema";
import { toast } from "sonner";
import { initiateAgreementAction } from "@/services/agreement.service";
import { useRouter } from "next/navigation";

export default function AgreementForm() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AgreementSchemaInput>({
        resolver: zodResolver(AgreementSchema),
    });

    const onSubmit = async (data: AgreementSchemaInput) => {
        const toastId = toast.loading("Initiating agreement...");

        try {
            const res = await initiateAgreementAction(data);
            if (res?.success) {
                toast.success(res?.message || "Agreement initiated successfully!", { id: toastId });
                router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
            };

            if (res?.error) {
                toast.error(res?.error, { id: toastId });
                return;
            };
        } catch (err: any) {
            console.log(err);
            toast.error(err?.message || "Agreement failed. Please try again.", { id: toastId });
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 my-10">
            <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-10 space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-slate-900">Agreement Form</h2>
                        <p className="text-slate-500 text-sm">Please provide the legal details for the vendor agreement setup.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Legal Name */}
                        <div className="space-y-2">
                            <Label className="text-[#DC3173] text-xs font-bold uppercase tracking-wider">Legal Name / Business Name</Label>
                            <Input
                                {...register("establishmentName")}
                                placeholder="Enter legal business name"
                                className="bg-slate-50 border-slate-200 h-12 focus-visible:ring-[#DC3173]"
                            />
                            {errors.establishmentName && <p className="text-red-500 text-xs italic">{errors.establishmentName.message}</p>}
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <Label className="text-[#DC3173] text-xs font-bold uppercase tracking-wider">Email Address</Label>
                            <Input
                                {...register("email")}
                                placeholder="contact@business.com"
                                className="bg-slate-50 border-slate-200 h-12 focus-visible:ring-[#DC3173]"
                            />
                            {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
                        </div>

                        {/* Phone and Tax ID Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[#DC3173] text-xs font-bold uppercase tracking-wider">Phone Number</Label>
                                <Input
                                    {...register("contactNumber")}
                                    placeholder="+1 (555) 000-0000"
                                    className="bg-slate-50 border-slate-200 h-12 focus-visible:ring-[#DC3173]"
                                />
                                {errors.contactNumber && <p className="text-red-500 text-xs italic">{errors.contactNumber.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[#DC3173] text-xs font-bold uppercase tracking-wider">Tax ID / NIF</Label>
                                <Input
                                    {...register("nif")}
                                    placeholder="987654321"
                                    className="bg-slate-50 border-slate-200 h-12 focus-visible:ring-[#DC3173]"
                                />
                                {errors.nif && <p className="text-red-500 text-xs italic">{errors.nif.message}</p>}
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end items-center pt-4 gap-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#DC3173] hover:bg-[#c22b65] text-white px-10 py-6 text-md font-bold rounded-lg transition-all"
                            >
                                {isSubmitting ? "Processing..." : "Continue"}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}