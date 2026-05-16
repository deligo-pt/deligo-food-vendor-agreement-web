/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { DEVICE_KEY } from "@/consts/device.const";
import { VerifyOtpInput, VerifyOtpSchema } from "@/lib/schema/verify.schema";
import { serverFetch } from "@/lib/serverFetch";
import { TLoginPayload } from "@/types/login.type";
import { cookies } from "next/headers";

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const loginService = async (credentials: TLoginPayload) => {
    try {
        const response = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Something went wrong during login");
        };

        const cookieStore = await cookies();
        cookieStore.set("accessToken", result?.data?.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });
        cookieStore.set("refreshToken", result?.data?.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 60 * 24 * 7,
            path: "/",
        });

        return result;
    } catch (error: any) {
        console.error("Login Service Error:", error.message);
        throw error;
    }
};

export const verifyOtpReq = async (payload: VerifyOtpInput & { email: string }) => {
    const validatedFields = VerifyOtpSchema.safeParse(payload);

    if (!validatedFields.success) {
        return { error: "Invalid OTP format." };
    }

    try {
        const response = await serverFetch.post("/agreements/verify-otp", {
            body: JSON.stringify({
                otp: validatedFields.data.otp,
                email: payload.email,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                error: result.message || "Verification failed. Please try again."
            };
        }

        return result;
    } catch (error) {
        console.error("OTP Verification Error:", error);
        return { error: "Connection error. Please check your internet." };
    }
};

export const resendOtpReq = async (email: string) => {
    try {

        const response = await serverFetch.post("/agreements/resend-otp", {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                error: result.message || "Failed to resend OTP. Please try again later."
            };
        }

        return { success: true, message: "A new code has been sent to your email." };
    } catch (error) {
        console.error("Resend OTP Error:", error);
        return { error: "Network error. Please check your connection." };
    }
};

// Assuming backendUrl and DEVICE_KEY are imported from your config constants
export const logoutService = async () => {
    try {
        const cookieStore = await cookies();
        const deviceId = cookieStore.get(DEVICE_KEY)?.value || "";

        if (!deviceId) {
            throw new Error("Device information is missing. Logout failed.");
        };

        const response = await serverFetch.post(`/auth/logout`, {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ deviceId }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Something went wrong during logout");
        }

        // Successfully logged out on the backend, now delete the tokens from cookies
        cookieStore.delete("accessToken");

        cookieStore.delete("refreshToken");

        return result;
    } catch (error: any) {
        console.error("Logout Service Error:", error.message);
        throw error;
    }
};