/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";


import { AgreementSchema, AgreementSchemaInput } from "@/lib/schema/agreement.schema";
import { serverFetch } from "@/lib/serverFetch";
import { revalidatePath, revalidateTag } from "next/cache";

export async function initiateAgreementAction(data: AgreementSchemaInput) {
    const validatedFields = AgreementSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: "Please check the form errors." };
    }

    try {
        const response = await serverFetch.post("/agreements/initiate", {
            body: JSON.stringify(validatedFields.data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                error: result.message || "Failed to initiate the agreement."
            };
        }

        return result;
    } catch (error) {
        console.error("Initiate Agreement Error:", error);
        return { error: "A network error occurred. Please try again." };
    }
};

export const getSingleAgreement = async (agreementId: string) => {
    try {
        const response = await serverFetch.get(`/agreements/${agreementId}`, {
            next: {
                tags: ["agreement", `agreement-${agreementId}`],
                revalidate: 10
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result?.message || "Failed to fetch agreement details");
        }

        return result?.data;
    } catch (error) {
        console.error("Get Single Agreement Error:", error);
        throw error;
    }
};

export const signAgreementReq = async (agreementId: string, signatureImage: string) => {
    try {
        const response = await serverFetch.post(`/agreements/sign/${agreementId}`, {
            body: JSON.stringify({
                signatureImage,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to sign agreement");
        };

        if (data?.success) {
            revalidateTag(`agreement-${agreementId}`, {});
            revalidateTag("agreement", {});
            revalidatePath("/agreement");
        }

        return data;
    } catch (error: any) {
        console.error("Signature API Error:", error.message);
        throw error;
    }
};