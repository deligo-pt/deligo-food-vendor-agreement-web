'use client';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logoutService } from "@/services/auth.service";
import { useStore } from "@/store/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { removeCookie } from "@/utils/cookies";

export function Navbar() {
    const router = useRouter();
    const { lang, setLang } = useStore();

    const logOut = async () => {
        const toastId = toast.loading("Logging out...");

        const result = await logoutService();

        if (result?.success) {
            toast.success(result?.message || "Logout successful!", {
                id: toastId,
            });

            removeCookie("accessToken");
            removeCookie("refreshToken");
            router.push("/login");
            return;
        }
        if (result?.message === "NEXT_REDIRECT") {
            toast.success("Logout successful!", {
                id: toastId,
            });

            removeCookie("accessToken");
            removeCookie("refreshToken");
            router.push("/login");
            return;
        }

        if (result?.success === false) {
            toast.success("Logout successful!", {
                id: toastId,
            });

            removeCookie("accessToken");
            removeCookie("refreshToken");
            router.push("/login");
            return;
        }

        toast.error(result?.message || "Logout failed", { id: toastId });

    };


    return (
        <nav className="py-6 px-8 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl flex items-center justify-between mx-auto">
                {/* Logo Section */}
                <Link
                    href="/agreement-form"
                    className="flex items-center gap-2 group transition-transform duration-300"
                >
                    {/* Animated Logo Image */}
                    <div className="w-9 h-9 overflow-hidden rounded-full transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                        <Image
                            src="/deligoLogo.png"
                            alt="DeliGo Logo"
                            width={50}
                            height={50}
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    {/* Brand Text */}
                    <span className="font-bold text-xl text-[#DC3173] group-hover:opacity-90 transition-opacity duration-300">
                        Vendor Agreement
                    </span>
                </Link>

                {/* Action Icons */}
                <div className="flex items-center gap-4">

                    {/* Language & Dark Mode */}
                    <Select
                        value={lang}
                        onValueChange={(value: "en" | "pt") => {
                            setLang(value);
                        }}
                    >
                        <SelectTrigger className="w-17.5 hover:border hover:border-[#DC3173]">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">EN</SelectItem>
                            <SelectItem value="pt">PT</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Logout Button */}
                    <Button
                        onClick={logOut}
                        variant="outline"
                        className="ml-4 px-5 border-[#DC3173] text-[#DC3173] font-semibold rounded-lg shadow-md hover:bg-[#DC3173] hover:text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    );
}