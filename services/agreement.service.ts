"use server";


import { AgreementSchema, AgreementSchemaInput } from "@/lib/schema/agreement.schema";
import { serverFetch } from "@/lib/serverFetch";

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
}