"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { VerifyOtpInput, VerifyOtpSchema } from "@/lib/schema/verify.schema";

export default function VerifyOtp() {
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<VerifyOtpInput>({
        resolver: zodResolver(VerifyOtpSchema),
        defaultValues: { pin: "" },
    });

    const onSubmit = async (data: VerifyOtpInput) => {
        // await verifyOtpAction(data);
        console.log("OTP submitted with data:", data);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 my-10">
            <Card className="w-full max-w-125 shadow-lg border-t-4 border-t-[#DC3173] rounded-xl overflow-hidden">
                <CardContent className="pt-10 px-8 pb-10 flex flex-col items-center text-center">
                    {/* Shield Icon from image_49467b.png */}
                    <div className="bg-[#fcebef] p-4 rounded-full mb-6">
                        <ShieldCheck className="h-8 w-8 text-[#DC3173]" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800">Verify Your Identity</h2>
                    <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                        {"We've sent a 4-digit verification code to"}<br />
                        <span className="font-bold text-slate-700">v****r@company.com</span>. Please enter it below to continue.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 w-full space-y-8">
                        <div className="flex justify-center">
                            <Controller
                                control={control}
                                name="pin"
                                render={({ field }) => (
                                    <InputOTP maxLength={4} {...field}>
                                        <InputOTPGroup className="gap-3">
                                            {[0, 1, 2, 3].map((index) => (
                                                <InputOTPSlot
                                                    key={index}
                                                    index={index}
                                                    className="w-14 h-14 text-xl border-[#DC3173] bg-white rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173]"
                                                />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#DC3173] hover:bg-[#c22b65] text-white py-6 text-md font-semibold rounded-lg shadow-md transition-all active:scale-[0.98]"
                        >
                            {isSubmitting ? "Verifying..." : "Verify & Continue"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="pt-4 border-t border-slate-100 w-full">
                            <p className="text-xs text-slate-500">
                                {"Didn't receive the code?"}{" "}
                                <button type="button" className="text-[#DC3173] font-bold hover:underline">
                                    Resend Code
                                </button>
                            </p>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                Expires in 04:59
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}