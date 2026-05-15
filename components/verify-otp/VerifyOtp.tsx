/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { resendOtpReq, verifyOtpReq } from "@/services/auth.service";

export default function VerifyOtp({ email }: { email: string }) {
    const [timeLeft, setTimeLeft] = useState(300);
    const [isResending, setIsResending] = useState(false);

    const { control, handleSubmit, formState: { isSubmitting } } = useForm<VerifyOtpInput>({
        resolver: zodResolver(VerifyOtpSchema),
        defaultValues: { otp: "" },
    });
    const router = useRouter();

    // Timer for OTP expiration
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format seconds to MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const onResend = async () => {
        if (timeLeft > 0 || isResending) return;

        setIsResending(true);
        const toastId = toast.loading("Resending code...");

        try {
            const res = await resendOtpReq(email);

            if (res.success) {
                toast.success(res.message, { id: toastId });
                setTimeLeft(300);
            } else {
                toast.error(res.error, { id: toastId });
            }
        } catch (err: any) {
            console.log(err);
            toast.error("Failed to resend code.", { id: toastId });
        } finally {
            setIsResending(false);
        }
    };

    const onSubmit = async (data: VerifyOtpInput) => {
        const toastId = toast.loading("Verifying OTP...");

        const payload = {
            otp: data.otp,
            email
        };

        try {
            const res = await verifyOtpReq(payload);

            if (res?.success) {
                toast.success(res?.message, { id: toastId });
                router.push(`/agreement?agreementId=${encodeURIComponent(res?.data?.agreementId)}`);
            } else {
                toast.error(res?.error || "Verification failed. Please try again.", { id: toastId });
            }
        } catch (err: any) {
            toast.error(err?.message || "Verification failed.", { id: toastId });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 my-10">
            <Card className="w-full max-w-125 shadow-lg border-t-4 border-t-[#DC3173] rounded-xl overflow-hidden">
                <CardContent className="pt-10 px-8 pb-10 flex flex-col items-center text-center">
                    <div className="bg-[#fcebef] p-4 rounded-full mb-6">
                        <ShieldCheck className="h-8 w-8 text-[#DC3173]" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800">Verify Your Identity</h2>
                    <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                        {"We've sent a 4-digit verification code to"}<br />
                        <span className="font-bold text-slate-700">{email || "your email"}</span>. Please enter it below to continue.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 w-full space-y-8">
                        <div className="flex justify-center">
                            <Controller
                                control={control}
                                name="otp"
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
                                <button
                                    type="button"
                                    onClick={onResend}
                                    disabled={timeLeft > 0 || isResending}
                                    className={`font-bold hover:underline transition-colors ${timeLeft > 0 || isResending ? "text-slate-300 cursor-not-allowed" : "text-[#DC3173]"
                                        }`}
                                >
                                    {isResending ? "Sending..." : "Resend Code"}
                                </button>
                            </p>
                            <p
                                className="text-[11px] mt-2 font-bold uppercase tracking-wider"
                                style={{ color: "#DC3173" }}
                            >
                                {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : "Code Expired"}
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}