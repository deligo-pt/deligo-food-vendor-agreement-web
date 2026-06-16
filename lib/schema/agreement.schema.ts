import { z } from "zod";

export const AgreementSchema = z.object({
    establishmentName: z.string().min(2, "Business name is required"),
    email: z.email("Invalid email"),

    prefixPhoneNumber: z.string().min(1),
    contactNumber: z.string().min(6, "Contact number required"),

    nif: z.string().min(9, "NIF must be at least 9 digits"),
})
    .refine((data) => {

        const full = `${data.prefixPhoneNumber}${data.contactNumber}`;
        return full.length > 8;
    }, {
        message: "Invalid contact number",
        path: ["contactNumber"],
    });

export type AgreementSchemaInput = z.infer<typeof AgreementSchema>;