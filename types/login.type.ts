import { LoginInput } from "@/lib/schema/login.schema";


export type TDeviceInfo = {
    deviceId: string;
    deviceType: "browser";
    deviceName: string;
    fcmToken: string;
    isLoggedIn: true;
    userAgent: string;
}

export type TLoginPayload = LoginInput & TDeviceInfo;