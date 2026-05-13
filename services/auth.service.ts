/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

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