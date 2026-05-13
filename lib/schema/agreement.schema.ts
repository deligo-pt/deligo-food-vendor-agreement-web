import { z } from "zod";

export const AgreementSchema = z.object({
    businessName: z.string().min(2, "Legal business name is required"),
    email: z.email("Please enter a valid business email"),
    phoneNumber: z.string().min(10, "Valid phone number is required"),
    taxId: z.string().min(5, "Tax ID / NIF is required"),
});

export type AgreementSchemaInput = z.infer<typeof AgreementSchema>;