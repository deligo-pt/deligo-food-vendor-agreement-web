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

export default function AgreementForm() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AgreementSchemaInput>({
        resolver: zodResolver(AgreementSchema),
    });

    const onSubmit = async (data: AgreementSchemaInput) => {
        console.log("Form submitted with data:", data);
        // const result = await submitStep1Action(data);
        // if (result.success) {
        //     alert("Step 1 complete! Moving to Step 2...");
        // }
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
                                {...register("businessName")}
                                placeholder="Enter legal business name"
                                className="bg-slate-50 border-slate-200 h-12 focus-visible:ring-[#DC3173]"
                            />
                            {errors.businessName && <p className="text-red-500 text-xs italic">{errors.businessName.message}</p>}
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
                                    {...register("phoneNumber")}
                                    placeholder="+1 (555) 000-0000"
                                    className="bg-slate-50 border-slate-200 h-12 focus-visible:ring-[#DC3173]"
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-xs italic">{errors.phoneNumber.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[#DC3173] text-xs font-bold uppercase tracking-wider">Tax ID / NIF</Label>
                                <Input
                                    {...register("taxId")}
                                    placeholder="987654321"
                                    className="bg-slate-50 border-slate-200 h-12 focus-visible:ring-[#DC3173]"
                                />
                                {errors.taxId && <p className="text-red-500 text-xs italic">{errors.taxId.message}</p>}
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