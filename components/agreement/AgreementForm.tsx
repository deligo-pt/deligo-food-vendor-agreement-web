/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "react-international-phone";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AgreementSchema, AgreementSchemaInput } from "@/lib/schema/agreement.schema";
import { toast } from "sonner";
import { IInputAgreementProps, initiateAgreementAction } from "@/services/agreement.service";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { Progress } from "../ui/progress";

export default function AgreementForm() {
    const { t } = useTranslation();

    const router = useRouter();
    const form = useForm<AgreementSchemaInput>({
        resolver: zodResolver(AgreementSchema),
        mode: "onChange",
        defaultValues: {
            establishmentName: "",
            email: "",
            prefixPhoneNumber: "+351",
            contactNumber: "",
            nif: "",
        },
    });

    const { handleSubmit, control, formState: { isSubmitting }, trigger } = form;

    const onSubmit = async (data: AgreementSchemaInput) => {
        const toastId = toast.loading("Initiating agreement...");
        const contactNumber = `${data.prefixPhoneNumber}${data.contactNumber}`;
        const payload = {
            establishmentName: data.establishmentName,
            email: data.email,
            contactNumber: contactNumber,
            nif: data.nif,
        };

        try {
            const res = await initiateAgreementAction(payload as IInputAgreementProps);

            if (res?.success) {
                toast.success(res?.message || "Agreement initiated successfully!", { id: toastId });
                router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
            };

            if (res?.error) {
                toast.error(res?.error, { id: toastId });
                return;
            };
        } catch (err: any) {
            console.log(err);
            toast.error(err?.message || "Agreement failed. Please try again.", { id: toastId });
        }
    };

    return (
        <div className='max-w-4xl mx-auto w-full'>
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="text-[#DC3173] text-sm font-bold">
                        {t("step")} 1 {t("of")} 3: <span className="font-medium">{t("basic_information")}</span>
                    </div>
                    <div className="text-gray-500 text-xs font-medium">33% Complete</div>
                </div>
                <Progress value={33} className="h-2 bg-gray-100" />
            </div>
            <div className="w-full max-w-4xl mx-auto space-y-8 my-10">
                <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                    <CardContent className="p-10 space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900">{t("agreement_form")}</h2>
                            <p className="text-slate-500 text-sm">{t("please_provide_legal_details")}</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 my-10">

                                {/* BUSINESS NAME */}
                                <FormField
                                    control={control}
                                    name="establishmentName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#DC3173] text-xs font-bold uppercase">
                                                {t("legal_name")} / {t("business_name")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder={t("enter_legal_business_name")}
                                                    className="bg-slate-50 border-slate-200 h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* EMAIL */}
                                <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#DC3173] text-xs font-bold uppercase">
                                                {t("email_address")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="contact@business.com"
                                                    className="bg-slate-50 border-slate-200 h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* PHONE + NIF */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* PHONE FIELD */}
                                    <FormField
                                        control={control}
                                        name="contactNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#DC3173] text-xs font-bold uppercase">
                                                    {t("phone_number")}
                                                </FormLabel>

                                                <FormControl>
                                                    <div className="relative flex">

                                                        {/* PREFIX */}
                                                        <Controller
                                                            control={control}
                                                            name="prefixPhoneNumber"
                                                            render={({ field: prefixField }) => (
                                                                <div className="absolute left-2 top-1 z-10">
                                                                    <PhoneInput
                                                                        value={prefixField.value || "+351"}
                                                                        defaultCountry="pt"
                                                                        forceDialCode
                                                                        disableDialCodePrefill={false}
                                                                        onChange={(value, meta) => {
                                                                            const dial = `+${meta.country.dialCode}`;

                                                                            prefixField.onChange(dial);

                                                                            // FIX: ensures first render sync
                                                                            trigger("contactNumber");
                                                                        }}
                                                                        countrySelectorStyleProps={{
                                                                            buttonStyle: {
                                                                                border: "none",
                                                                                height: "36px",
                                                                                backgroundColor: "transparent",
                                                                            },
                                                                        }}
                                                                        inputStyle={{
                                                                            marginTop: "1px",
                                                                            border: "none",
                                                                            height: "34px",
                                                                            width: "48px",
                                                                            backgroundColor: "#ccc",
                                                                        }}
                                                                        inputProps={{
                                                                            readOnly: true,
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        />

                                                        {/* NUMBER INPUT */}
                                                        <Input
                                                            value={field.value}
                                                            onChange={(e) => {
                                                                const onlyDigits = e.target.value.replace(/\D/g, "");
                                                                field.onChange(onlyDigits);
                                                                trigger("contactNumber");
                                                            }}
                                                            placeholder="912345678"
                                                            className="pl-28 bg-slate-50 border-slate-200 h-12"
                                                        />
                                                    </div>
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* NIF */}
                                    <FormField
                                        control={control}
                                        name="nif"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#DC3173] text-xs font-bold uppercase">
                                                    {t("tax_id_nif")}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="987654321"
                                                        className="bg-slate-50 border-slate-200 h-12"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>

                                {/* SUBMIT */}
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-[#DC3173] text-white px-10 py-6 font-bold"
                                    >
                                        {isSubmitting ? "Processing..." : t("continue")}
                                    </Button>
                                </div>

                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}