"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, LoginSchema } from "@/lib/schema/login.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock, EyeOff, ShieldCheck, ArrowRight, EyeIcon, HelpCircle, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginService } from "@/services/auth.service";
import { toast } from "sonner";
import { getDeviceInfo } from "@/utils/getDeviceInfo";
import { TLoginPayload } from "@/types/login.type";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClearSessionModal from "./ClearSessionModal";
import { setCookie } from "@/utils/cookies";
import { jwtDecode } from "jwt-decode";


export default function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [removeSubmitting, setRemoveSubmitting] = useState(false);

    const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
    });

    const login = async (payload: {
        email: string;
        password: string;
        forceLogin?: boolean;
    }) => {
        const toastId = toast.loading("Logging in...");

        const deviceDetails = await getDeviceInfo();

        const result = await loginService({ ...payload, deviceDetails } as TLoginPayload);

        if (result?.success) {
            const decoded = jwtDecode(result.data.accessToken) as { role: string };

            if (decoded.role === "SUPER_ADMIN" || decoded.role === "ADMIN") {
                setCookie("accessToken", result.data.accessToken, 7);
                setCookie("refreshToken", result.data.refreshToken, 365);
                toast.success("Login successful!", { id: toastId });

                router.push("/agreement-form");
                return;
            }

            toast.error("You are not an admin", { id: toastId });
            return;
        }

        toast.error(result.message, { id: toastId });

        if (result.message === "LIMIT_EXCEEDED") {
            setShowModal(true);
        }
    };

    const onSubmit = async (data: LoginInput) => {
        await login(data);
    };

    const clearSession = async () => {
        setRemoveSubmitting(true);

        try {
            await login({
                email: getValues("email"),
                password: getValues("password"),
                forceLogin: true,
            });
        } finally {
            setRemoveSubmitting(false);
            setShowModal(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-[#DC3173]/10 to-[#DC3173]/30">
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
                    Need assistance?
                    <span
                        onClick={() => setIsHelpModalOpen(true)}
                        className="text-[#DC3173] font-bold cursor-pointer hover:underline pl-2">Contact System Administrator</span>
                </p>
            </main>

            {/* Deligo System Administration Support Modal */}
            <Dialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen}>
                <DialogContent className="sm:max-w-md border-none shadow-xl">
                    <DialogHeader className="space-y-2 flex flex-col items-center text-center">
                        <div className="p-3 bg-[#DC3173]/10 rounded-full text-[#DC3173] mb-1">
                            <HelpCircle className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-800">System Support</DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">
                            Get in touch with Deligo support to resolve your credential or platform access issues.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Support Email */}
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/70 transition-colors">
                            <div className="p-2.5 bg-white rounded-lg shadow-xs text-slate-600 border border-slate-100">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</span>
                                <a href="mailto:contact@deligo.pt" className="text-sm font-bold text-slate-700 hover:text-[#DC3173] transition-colors">
                                    contact@deligo.pt
                                </a>
                            </div>
                        </div>

                        {/* Support Hotline */}
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/70 transition-colors">
                            <div className="p-2.5 bg-white rounded-lg shadow-xs text-slate-600 border border-slate-100">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Hotline</span>
                                <a href="tel:+351920136680" className="text-sm font-bold text-slate-700 hover:text-[#DC3173] transition-colors">
                                    +351 920 136 680
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={() => setIsHelpModalOpen(false)}
                            className="bg-[#DC3173] hover:bg-[#DC3173]/80 text-white px-6"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <ClearSessionModal
                open={showModal}
                onOpenChange={(open) => setShowModal(open)}
                onRemove={clearSession}
                isSubmitting={removeSubmitting}
            />
        </div>
    );
}