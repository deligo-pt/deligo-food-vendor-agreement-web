import { z } from "zod";

export const AgreementSchema = z.object({
    establishmentName: z.string().min(2, "Business name is required"),
    email: z.email("Invalid business email"),
    contactNumber: z.string().min(9, "Contact number must be at least 9 digits"),
    nif: z.string().min(9, "NIF must be at least 9 digits"),
});

export type AgreementSchemaInput = z.infer<typeof AgreementSchema>;