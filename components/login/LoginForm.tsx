/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, LoginSchema } from "@/lib/schema/login.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock, EyeOff, ShieldCheck, ArrowRight, EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginService } from "@/services/auth.service";
import { toast } from "sonner";
import { getDeviceInfo } from "@/utils/getDeviceInfo";
import { TLoginPayload } from "@/types/login.type";
import { useState } from "react";


export default function LoginForm() {
    const router = useRouter();
    const deviceInfo = getDeviceInfo();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        const toastId = toast.loading("Authenticating...");

        const deviceDetails = await deviceInfo;
        const payload = {
            ...data,
            deviceDetails
        };

        try {
            const res = await loginService(payload as TLoginPayload);

            if (res?.success) {
                toast.success(res?.message, { id: toastId });
                router.push("/agreement-form");
            };
        } catch (err: any) {
            console.log(err);
            toast.error(err?.message || "Login failed. Please try again.", { id: toastId });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
            <main className="grow flex flex-col items-center justify-center p-6">
                <Card className="w-full max-w-105 shadow-2xl border-none overflow-hidden">
                    <CardHeader className="bg-[#DC3173] text-white text-center py-10 space-y-1">
                        <h2 className="text-2xl font-bold tracking-widest uppercase">Secure Access</h2>
                        <p className="text-xs opacity-80">Vendor Partnership Portal</p>
                    </CardHeader>

                    <CardContent className="pt-8 px-8 pb-8 space-y-6">
                        <div className="text-center space-y-2 mb-4">
                            <h3 className="text-xl font-semibold text-slate-800">Welcome Back</h3>
                            <p className="text-sm text-muted-foreground">Please enter your credentials to access your legal documents.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-600">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        {...register("email")}
                                        placeholder="name@company.com"
                                        className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#DC3173]"
                                    />
                                </div>
                                {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email.message}</p>}
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-semibold text-slate-600">Password</Label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        {...register("password")}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 bg-slate-50 border-slate-200 focus-visible:ring-[#DC3173]"
                                    />
                                    {showPassword ? (
                                        <EyeIcon
                                            className="absolute right-3 top-3 h-4 w-4 text-slate-400 cursor-pointer"
                                            onClick={() => setShowPassword(false)}
                                        />
                                    ) : (
                                        <EyeOff
                                            className="absolute right-3 top-3 h-4 w-4 text-slate-400 cursor-pointer"
                                            onClick={() => setShowPassword(true)}
                                        />
                                    )}
                                </div>
                                {errors.password && <p className="text-[10px] text-red-500 font-medium">{errors.password.message}</p>}
                            </div>

                            {/* Submit Action */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#DC3173] hover:bg-[#c22b65] text-white py-6 text-md font-semibold"
                            >
                                {isSubmitting ? "Authenticating..." : "Sign In to Portal"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>

                            <div className="flex items-center justify-center gap-2 pt-2">
                                <ShieldCheck className="h-4 w-4 text-slate-300" />
                                <span className="text-[10px] text-slate-400 uppercase tracking-tighter">End-to-end encrypted environment</span>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-8 text-sm text-slate-600">
                    Need assistance? <span className="text-[#DC3173] font-bold cursor-pointer hover:underline">Contact System Administrator</span>
                </p>
            </main>
        </div>
    );
}