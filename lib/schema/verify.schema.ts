import { z } from "zod";

export const VerifyOtpSchema = z.object({
    otp: z.string().length(4, "Please enter all 4 digits"),
});

export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;